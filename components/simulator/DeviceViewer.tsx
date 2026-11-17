"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ComponentRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, useProgress } from "@react-three/drei";
import { Studio } from "@/components/three/Studio";
import { Eye, EyeOff, Minus, Plus, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { Hotspot, ModelAsset } from "@/data/missions";
import { LaptopModel, type LaptopState } from "@/components/three/LaptopModel";
import { useAssetStatus, type AssetStatus } from "@/components/three/asset";
import { AssetBadge } from "@/components/ui/AssetBadge";
import { HotspotOverlay, HotspotProjector } from "./Hotspots";

type Controls = ComponentRef<typeof CameraControls>;

const HOME = { pos: [0.4, 3.0, 4.7] as const, target: [0, 0.45, -0.25] as const };

export interface DeviceViewerProps {
  asset: ModelAsset;
  laptop: LaptopState;
  hotspots: Hotspot[];
  hotspotsEnabled: boolean;
  inspected: string[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleXray?: () => void;
  xrayLocked?: boolean;
  hud?: React.ReactNode;
}

export default function DeviceViewer(props: DeviceViewerProps) {
  const { asset, laptop, hotspots, hotspotsEnabled, inspected, activeId, onSelect, onToggleXray, xrayLocked, hud } = props;
  const controls = useRef<Controls>(null);
  const anchors = useRef<Record<string, HTMLElement | null>>({});
  const probed = useAssetStatus(asset.url);
  const [loadFailed, setLoadFailed] = useState(false);
  const status: AssetStatus = loadFailed ? "error" : probed;

  const reset = useCallback(() => {
    controls.current?.setLookAt(...HOME.pos, ...HOME.target, true);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const h = hotspots.find((x) => x.id === activeId);
    if (h) controls.current?.setLookAt(...h.camera, ...h.position, true);
  }, [activeId, hotspots]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-grid-paper opacity-60" />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [...HOME.pos], fov: 38, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="absolute! inset-0 touch-none"
        aria-label="Interactive 3D laptop. Drag to rotate, scroll or pinch to zoom."
      >
        <Studio />
        <Suspense fallback={null}>
          <LaptopModel asset={asset} status={status} onLoadError={() => setLoadFailed(true)} state={laptop} />
          <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={9} blur={2.4} far={3} color="#1b2333" />
        </Suspense>
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={1.6}
          maxDistance={9}
          maxPolarAngle={Math.PI * 0.49}
          smoothTime={0.45}
        />
        <InitialTarget controls={controls} />
        {hotspotsEnabled && <HotspotProjector hotspots={hotspots} anchors={anchors} />}
      </Canvas>

      <HotspotOverlay
        hotspots={hotspots}
        enabled={hotspotsEnabled}
        inspected={inspected}
        activeId={activeId}
        onSelect={onSelect}
        anchors={anchors}
      />

      <LoadingOverlay status={status} />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <AssetBadge status={status} />
        <div className="pointer-events-auto">{hud}</div>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-overlay">
        <ToolButton label="Zoom in" onClick={() => controls.current?.dolly(0.8, true)}>
          <Plus className="size-4" />
        </ToolButton>
        <ToolButton label="Zoom out" onClick={() => controls.current?.dolly(-0.8, true)}>
          <Minus className="size-4" />
        </ToolButton>
        <ToolButton label="Reset camera" onClick={reset}>
          <RotateCcw className="size-4" />
        </ToolButton>
        {onToggleXray && (
          <>
            <span className="mx-1 h-5 w-px bg-line-strong" />
            <button
              type="button"
              onClick={onToggleXray}
              disabled={xrayLocked}
              className={clsx(
                "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                laptop.xray ? "bg-fg text-surface" : "text-fg hover:bg-sunken",
                xrayLocked && "cursor-not-allowed opacity-40",
              )}
            >
              {laptop.xray ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {laptop.xray ? "Close panel" : "Open panel"}
            </button>
          </>
        )}
      </div>

      <p className="pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 text-xs text-dim sm:block">
        Drag to rotate. Scroll or pinch to zoom.
      </p>
    </div>
  );
}

function InitialTarget({ controls }: { controls: React.RefObject<Controls | null> }) {
  useEffect(() => {
    controls.current?.setLookAt(...HOME.pos, ...HOME.target, false);
  }, [controls]);
  return null;
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-full text-fg transition-colors duration-150 hover:bg-sunken"
    >
      {children}
    </button>
  );
}

function LoadingOverlay({ status }: { status: AssetStatus }) {
  const { active, progress } = useProgress();
  const show = status === "checking" || active;
  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-200",
        show ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!show}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 animate-spin rounded-full border-2 border-line-strong border-t-fg" />
        <p className="text-sm text-muted">
          {status === "checking" ? "Locating model" : `Loading model ${Math.round(progress)}%`}
        </p>
      </div>
    </div>
  );
}

