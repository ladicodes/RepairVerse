"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import clsx from "clsx";
import { missions } from "@/data/missions";

const DeviceViewer = dynamic(() => import("@/components/simulator/DeviceViewer"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center rounded-3xl border border-line bg-surface">
      <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-fg" />
    </div>
  ),
});

const mission = missions["001"];

/** The real simulator view with the panel open. Rows and callouts select the same part. */
export function PartsExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [xray, setXray] = useState(true);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="h-96 sm:h-120 lg:col-span-7 lg:h-152">
        <DeviceViewer
          asset={mission.model}
          laptop={{ xray, dusty: true, powered: false, cooled: false }}
          hotspots={mission.hotspots}
          hotspotsEnabled={xray}
          inspected={[]}
          activeId={activeId}
          onSelect={setActiveId}
          onToggleXray={() => setXray((v) => !v)}
        />
      </div>
      <ol className="divide-y divide-line border-y border-line lg:col-span-5">
        {mission.hotspots.map((h, i) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => {
                  setXray(true);
                  setActiveId(h.id);
                }}
                aria-pressed={active}
                className={clsx(
                  "flex w-full gap-4 px-2 py-5 text-left transition-colors duration-150",
                  active ? "bg-sunken" : "hover:bg-surface",
                )}
              >
                <span
                  className={clsx(
                    "grid size-8 shrink-0 place-items-center rounded-full border-2 font-mono text-xs font-semibold",
                    active ? "border-fg bg-fg text-surface" : "border-fg bg-accent text-fg",
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{h.label}</span>
                  <span className="mt-1 block leading-relaxed text-muted">{h.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
