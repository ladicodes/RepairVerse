"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import clsx from "clsx";
import { ScanLine } from "lucide-react";
import { missions } from "@/data/missions";
import { useDevice } from "@/store/mission-store";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-fg" />
    </div>
  ),
});

const mission = missions["001"];

export function HeroVisual() {
  const [xray, setXray] = useState(false);
  const device = useDevice();

  return (
    <figure className="relative h-96 w-full overflow-hidden rounded-3xl border border-line bg-surface sm:h-120 lg:h-152">
      <div className="absolute inset-0 bg-grid-paper opacity-60" />
      <div className="absolute inset-0">
        <HeroScene xray={xray} />
      </div>

      <figcaption className="absolute left-4 top-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-raised sm:left-6 sm:top-6">
        <p className="font-mono text-xs text-dim">Ticket {mission.code}</p>
        <p className="text-sm font-medium text-fg">Shuts down after 15 minutes</p>
        <p className="mt-1 text-xs text-muted">On the bench: {device.name}</p>
      </figcaption>

      <button
        type="button"
        onClick={() => setXray((v) => !v)}
        aria-pressed={xray}
        className={clsx(
          "absolute bottom-4 right-4 flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-raised transition-colors duration-150 sm:bottom-6 sm:right-6",
          xray ? "border-fg bg-fg text-surface" : "border-line-strong bg-surface text-fg hover:border-gray-400",
        )}
      >
        <ScanLine className="size-4" />
        {xray ? "Close the panel" : "Look inside"}
      </button>
    </figure>
  );
}
