"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type { Mission } from "@/data/missions";
import { TOOLS, toolReading, type ToolId } from "@/lib/tools";

export function InspectionPanel({
  mission,
  inspected,
  activeId,
  canScore,
  panelOpen,
  tool = "inspect",
  onSelect,
}: {
  mission: Mission;
  inspected: string[];
  activeId: string | null;
  canScore: boolean;
  panelOpen: boolean;
  tool?: ToolId;
  onSelect: (id: string) => void;
}) {
  const active = mission.hotspots.find((h) => h.id === activeId);
  const need = Math.min(mission.minInspections, mission.hotspots.length);

  return (
    <div className="space-y-6">
      {canScore && (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">
              Inspected <span className="font-mono tabular-nums text-fg">{inspected.length}</span> of {mission.hotspots.length}
            </span>
            <span className={inspected.length >= need ? "text-ok" : "text-dim"}>
              {inspected.length >= need ? "Diagnosis unlocked" : `Inspect ${need - inspected.length} more to continue`}
            </span>
          </div>
          <div className="flex gap-1" aria-hidden>
            {mission.hotspots.map((h) => (
              <span key={h.id} className={clsx("h-1.5 flex-1 rounded-full", inspected.includes(h.id) ? "bg-done" : "bg-line")} />
            ))}
          </div>
        </div>
      )}

      {!panelOpen && (
        <p className="rounded-2xl border border-line bg-sunken p-4 text-sm leading-relaxed text-fg">
          Open the bottom panel with the button under the laptop to see the parts.
        </p>
      )}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {mission.hotspots.map((h, i) => {
          const done = inspected.includes(h.id);
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => onSelect(h.id)}
                aria-pressed={isActive}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors duration-150",
                  isActive ? "border-fg bg-sunken" : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span
                  className={clsx(
                    "grid size-6 shrink-0 place-items-center rounded-full border-2 font-mono text-xs font-semibold",
                    done ? "border-done bg-done text-surface" : "border-fg bg-accent text-fg",
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} aria-label="Inspected" /> : i + 1}
                </span>
                <span className="font-medium">{h.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {active ? (
        <article className="space-y-4 rounded-2xl border border-line-strong bg-surface p-5" aria-live="polite">
          <h3 className="text-lg font-semibold">{active.label}</h3>
          <div>
            <p className="mb-1 text-sm text-dim">What it does</p>
            <p className="leading-relaxed text-muted">{active.role}</p>
          </div>
          <div className="rounded-xl bg-sunken p-4">
            <p className="mb-1 text-sm font-medium text-fg">What you found</p>
            <p className="leading-relaxed text-fg">{active.clue}</p>
          </div>
          {tool !== "inspect" ? (
            <Reading mission={mission} hotspotId={active.id} tool={tool} />
          ) : (
            <p className="text-sm text-dim">Pick the thermal camera or multimeter in the tool tray to measure this part.</p>
          )}
        </article>
      ) : (
        <p className="text-sm text-muted">Pick a numbered part on the laptop or in the list.</p>
      )}
    </div>
  );
}

export function ClueList({ mission, inspected }: { mission: Mission; inspected: string[] }) {
  const found = mission.hotspots.filter((h) => inspected.includes(h.id));
  if (found.length === 0) return null;
  return (
    <details className="group rounded-2xl border border-line bg-sunken p-4" open>
      <summary className="cursor-pointer list-none text-sm font-medium text-fg">
        Your clues ({found.length})
        <span className="float-right text-dim group-open:hidden">Show</span>
        <span className="float-right hidden text-dim group-open:inline">Hide</span>
      </summary>
      <ul className="mt-3 space-y-3">
        {found.map((h) => (
          <li key={h.id} className="text-sm leading-relaxed">
            <span className="font-medium">{h.label}.</span> <span className="text-muted">{h.clue}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Reading({ mission, hotspotId, tool }: { mission: Mission; hotspotId: string; tool: Exclude<ToolId, "inspect"> }) {
  const hotspot = mission.hotspots.find((h) => h.id === hotspotId);
  if (!hotspot) return null;
  const r = toolReading(mission, hotspot, tool);
  const label = TOOLS.find((t) => t.id === tool)?.label;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line-strong bg-bg p-4">
      <div
        className={clsx(
          "min-w-28 rounded-lg px-3 py-2 text-center font-mono text-xl font-semibold tabular-nums",
          tool === "meter" ? "bg-[#c9d6a3] text-[#1b2410]" : "bg-gradient-to-r from-[#3b0764] via-[#dc2626] to-[#fde047] text-white",
          r.tone === "bad" && tool === "meter" && "ring-2 ring-heat",
        )}
      >
        {r.value}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-dim">{label}</p>
        <p className={clsx("leading-snug", r.tone === "bad" ? "text-heat" : r.tone === "ok" ? "text-ok" : "text-fg")}>{r.note}</p>
      </div>
    </div>
  );
}
