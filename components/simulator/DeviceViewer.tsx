"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ComponentRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, ContactShadows, useProgress } from "@react-three/drei";
import { Studio } from "@/components/three/Studio";
import { Gauge, Layers, Minus, Plus, RotateCcw, Route, ScanSearch, Square, ThermometerSun, Wrench } from "lucide-react";
import clsx from "clsx";
import type { Hotspot, ModelAsset } from "@/data/missions";
import type { DeviceLook } from "@/data/devices";
import { LaptopModel, type LaptopState } from "@/components/three/LaptopModel";
import { useAssetStatus, type AssetStatus } from "@/components/three/asset";
import { AssetBadge } from "@/components/ui/AssetBadge";
import { HotspotOverlay, HotspotProjector } from "./Hotspots";
import { TOOLS, type ToolId } from "@/lib/tools";

type Controls = ComponentRef<typeof CameraControls>;

const HOME = { pos: [0.4, 3.0, 4.7] as const, target: [0, 0.45, -0.25] as const };

export interface DeviceViewerProps {
  asset: ModelAsset;
  look?: DeviceLook;
  laptop: LaptopState;
  hotspots: Hotspot[];
  hotspotsEnabled: boolean;
  inspected: string[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleXray?: () => void;
  xrayLocked?: boolean;
  hud?: React.ReactNode;
  /** Active bench tool. The tray only shows when `onTool` is set. */
  tool?: ToolId;
  onTool?: (tool: ToolId) => void;
  /** Take-apart step with the cover off: 0 cover off, 1 battery out, 2 fan out. */
  onTeardown?: () => void;
}

const TEARDOWN_NEXT = ["Remove battery", "Remove fan", "Reassemble"];
const TOOL_ICONS = { inspect: ScanSearch, thermal: ThermometerSun, meter: Gauge } as const;

export default function DeviceViewer(props: DeviceViewerProps) {
  const { asset, look, laptop, hotspots, hotspotsEnabled, inspected, activeId, onSelect, onToggleXray, xrayLocked, hud } = props;
  const { tool = "inspect", onTool, onTeardown } = props;
  const [tour, setTour] = useState<number | null>(null);
  const controls = useRef<Controls>(null);
  const anchors = useRef<Record<string, HTMLElement | null>>({});
  const probed = useAssetStatus(asset.url);
  const [loadFailed, setLoadFailed] = useState(false);
  // A new device means a new file; forget the previous load failure.
  useEffect(() => setLoadFailed(false), [asset.url]);
  const status: AssetStatus = loadFailed ? "error" : probed;

  const reset = useCallback(() => {
    controls.current?.setLookAt(...HOME.pos, ...HOME.target, true);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const h = hotspots.find((x) => x.id === activeId);
    if (h) controls.current?.setLookAt(...h.camera, ...h.position, true);
  }, [activeId, hotspots]);

  // Guided tour: fly to each part in turn and explain what it does. Doesn't count as inspecting.
  const touring = tour !== null && hotspotsEnabled;
  useEffect(() => {
    if (!touring) return;
    const h = hotspots[tour!];
    if (!h) return;
    controls.current?.setLookAt(...h.camera, ...h.position, true);
    const t = window.setTimeout(() => setTour((i) => (i === null ? null : i + 1 < hotspots.length ? i + 1 : null)), 5000);
    return () => window.clearTimeout(t);
  }, [touring, tour, hotspots]);


  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-grid-paper opacity-60" />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [...HOME.pos], fov: 38, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="absolute! inset-0 touch-none"
        style={{ filter: tool === "thermal" && hotspotsEnabled ? "url(#rv-thermal)" : undefined }}
        aria-label="Interactive 3D laptop. Drag to rotate, scroll or pinch to zoom."
      >
        <Studio />
        <Suspense fallback={null}>
          <LaptopModel key={asset.url} asset={asset} look={look} status={status} onLoadError={() => setLoadFailed(true)} state={laptop} />
          <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={9} blur={2.4} far={3} color="#1b2333" />
        </Suspense>
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={1.2}
          maxDistance={16}
          dollySpeed={0.8}
          touches={{
            one: CameraControlsImpl.ACTION.TOUCH_ROTATE,
            two: CameraControlsImpl.ACTION.TOUCH_DOLLY_ROTATE,
            three: CameraControlsImpl.ACTION.TOUCH_TRUCK,
          }}
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

      {/* Thermal camera: map brightness to an iron palette (black, purple, red, yellow, white). */}
      <svg aria-hidden className="absolute size-0">
        <filter id="rv-thermal" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.02 0.25 0.55 0.86 0.98 1 1" />
            <feFuncG type="table" tableValues="0.02 0.03 0.06 0.15 0.45 0.86 1" />
            <feFuncB type="table" tableValues="0.1 0.4 0.55 0.18 0.05 0.25 0.95" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Tool tray */}
      {onTool && hotspotsEnabled && (
        <div
          className="absolute left-3 top-1/2 flex -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface p-1 shadow-overlay sm:left-4"
          role="toolbar"
          aria-label="Bench tools"
        >
          {TOOLS.map((t) => {
            const Icon = TOOL_ICONS[t.id];
            const on = tool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTool(t.id)}
                aria-pressed={on}
                title={`${t.label}: ${t.hint}`}
                className={clsx(
                  "grid size-11 place-items-center rounded-xl transition-colors duration-150",
                  on ? "bg-accent text-fg" : "text-fg hover:bg-sunken",
                )}
              >
                <Icon className="size-5" />
                <span className="sr-only">{t.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Guided tour caption */}
      {touring && hotspots[tour!] && (
        <div className="absolute inset-x-3 bottom-20 z-20 mx-auto max-w-md rounded-2xl border border-line-strong bg-surface p-4 shadow-overlay sm:bottom-24" aria-live="polite">
          <p className="mb-1 font-mono text-xs text-dim">
            Tour {tour! + 1}/{hotspots.length}
          </p>
          <p className="font-semibold">{hotspots[tour!].label}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{hotspots[tour!].role}</p>
        </div>
      )}

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
                "flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium sm:px-4 transition-colors duration-150",
                laptop.xray ? "bg-fg text-surface" : "text-fg hover:bg-sunken",
                xrayLocked && "cursor-not-allowed opacity-40",
              )}
            >
              <Wrench className="size-4" />
              {laptop.xray ? "Refit cover" : "Remove cover"}
            </button>
          </>
        )}
        {onTeardown && laptop.xray && (
          <button
            type="button"
            onClick={onTeardown}
            className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium sm:px-4 text-fg transition-colors duration-150 hover:bg-sunken"
          >
            <Layers className="size-4" />
            <span className="hidden sm:inline">{TEARDOWN_NEXT[laptop.teardown ?? 0]}</span>
            <span className="sr-only sm:hidden">{TEARDOWN_NEXT[laptop.teardown ?? 0]}</span>
          </button>
        )}
        {hotspotsEnabled && hotspots.length > 0 && (
          <button
            type="button"
            onClick={() => setTour((t) => (t === null ? 0 : null))}
            aria-pressed={touring}
            className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium sm:px-4 text-fg transition-colors duration-150 hover:bg-sunken"
          >
            {touring ? <Square className="size-4" /> : <Route className="size-4" />}
            <span className="hidden sm:inline">{touring ? "Stop tour" : "Guided tour"}</span>
            <span className="sr-only sm:hidden">{touring ? "Stop tour" : "Guided tour"}</span>
          </button>
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

