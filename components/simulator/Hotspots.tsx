"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Check } from "lucide-react";
import clsx from "clsx";
import type { Hotspot } from "@/data/missions";

export type AnchorMap = RefObject<Record<string, HTMLElement | null>>;

/**
 * Lives inside the Canvas. Projects each hotspot's 3D position to screen
 * space every frame and moves its DOM button. No React re-render per frame.
 */
export function HotspotProjector({ hotspots, anchors }: { hotspots: Hotspot[]; anchors: AnchorMap }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const v = useRef(new THREE.Vector3());

  useFrame(() => {
    // Camera controls moved the camera this frame; refresh its view matrix before projecting.
    camera.updateMatrixWorld();
    for (const h of hotspots) {
      const el = anchors.current?.[h.id];
      if (!el) continue;
      v.current.set(...h.position).project(camera);
      const visible = v.current.z < 1 && Math.abs(v.current.x) < 1.05 && Math.abs(v.current.y) < 1.05;
      const x = (v.current.x * 0.5 + 0.5) * size.width;
      const y = (-v.current.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-16px, -50%)`;
      el.style.visibility = visible ? "visible" : "hidden";
    }
  });
  return null;
}

/** Numbered service-manual callouts drawn as DOM over the canvas. */
export function HotspotOverlay({
  hotspots,
  enabled,
  inspected,
  activeId,
  onSelect,
  anchors,
}: {
  hotspots: Hotspot[];
  enabled: boolean;
  inspected: string[];
  activeId: string | null;
  onSelect: (id: string) => void;
  anchors: AnchorMap;
}) {
  if (!enabled) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hotspots.map((h, i) => {
        const done = inspected.includes(h.id);
        const active = activeId === h.id;
        return (
          <div
            key={h.id}
            ref={(el) => {
              if (anchors.current) anchors.current[h.id] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ visibility: "hidden", zIndex: active ? 2 : 1 }}
          >
            <button
              type="button"
              onClick={() => onSelect(h.id)}
              aria-label={`Inspect part ${i + 1}: ${h.label}${done ? " (inspected)" : ""}`}
              className="group pointer-events-auto relative flex items-center"
            >
              <span className="relative grid size-8 place-items-center">
                {!done && !active && <span className="absolute inset-0 animate-ping-slow rounded-full bg-accent" />}
                <span
                  className={clsx(
                    "relative grid size-8 place-items-center rounded-full border-2 font-mono text-xs font-semibold shadow-raised transition-transform duration-150",
                    active
                      ? "scale-110 border-fg bg-fg text-surface"
                      : done
                        ? "border-done bg-done text-surface"
                        : "border-fg bg-accent text-fg group-hover:scale-110",
                  )}
                >
                  {done && !active ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </span>
              </span>
              <span
                className={clsx(
                  "pointer-events-none ml-2 whitespace-nowrap rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium text-fg shadow-raised transition-opacity duration-150",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                )}
              >
                {h.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
