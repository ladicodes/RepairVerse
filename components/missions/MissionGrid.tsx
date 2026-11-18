"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { missionList, type Mission } from "@/data/missions";
import { computeScore } from "@/lib/scoring";
import { sanitizeProgress } from "@/lib/mission-engine";
import { useMissionStore } from "@/store/mission-store";

type Filter = "All" | Mission["category"];
const LEVELS: Mission["difficulty"][] = ["Beginner", "Intermediate", "Advanced"];

function useStatus(mission: Mission) {
  const hydrated = useMissionStore((s) => s.hydrated);
  const raw = useMissionStore((s) => s.runs[mission.id]);
  return useMemo(() => {
    if (!hydrated || !raw) return { label: "New", tone: "dim" as const };
    const run = sanitizeProgress(raw, mission);
    if (run.stage === "COMPLETED") {
      const s = computeScore(run, mission);
      return { label: `Done · ${s.total}/${s.max}`, tone: "ok" as const };
    }
    if (run.stage === "NOT_STARTED" || run.stage === "INTRODUCTION") return { label: "New", tone: "dim" as const };
    return { label: "In progress", tone: "accent" as const };
  }, [hydrated, raw, mission]);
}

function MissionCard({ mission }: { mission: Mission }) {
  const status = useStatus(mission);
  return (
    <li>
      <Link
        href={`/mission/${mission.id}`}
        className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-line bg-surface p-6 transition-colors duration-150 hover:border-fg"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-sm text-dim">{mission.code}</p>
            <p
              className={clsx(
                "text-sm",
                status.tone === "ok" && "font-medium text-ok",
                status.tone === "accent" && "font-medium text-accent-ink",
                status.tone === "dim" && "text-dim",
              )}
            >
              {status.label}
            </p>
          </div>
          <h3 className="text-xl font-semibold leading-snug tracking-tight">{mission.title}</h3>
          <p className="leading-relaxed text-muted">{mission.short}</p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
          <span>
            {mission.category} · {mission.difficulty} · {mission.durationMin} min
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-dim transition-colors duration-150 group-hover:text-fg" aria-hidden />
        </div>
      </Link>
    </li>
  );
}

/** Every mission as a card, with category and difficulty filters. */
export function MissionGrid({ filters = true, limit }: { filters?: boolean; limit?: number }) {
  const [category, setCategory] = useState<Filter>("All");
  const [level, setLevel] = useState<Mission["difficulty"] | "Any">("Any");
  const categories = useMemo(() => ["All", ...new Set(missionList.map((m) => m.category))] as Filter[], []);
  const shown = missionList
    .filter((m) => category === "All" || m.category === category)
    .filter((m) => level === "Any" || m.difficulty === level)
    .slice(0, limit);

  return (
    <div className="space-y-8">
      {filters && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Filter by category">
            {categories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2" aria-label="Filter by difficulty">
            {(["Any", ...LEVELS] as const).map((l) => (
              <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
      )}
      {shown.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl border border-dashed border-line-strong p-8 text-muted">No missions match these filters.</p>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
        active ? "border-fg bg-fg text-surface" : "border-line text-muted hover:bg-sunken hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
