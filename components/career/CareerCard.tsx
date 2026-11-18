"use client";

import { useMemo } from "react";
import { career } from "@/lib/career";
import { useMissionStore } from "@/store/mission-store";

/** Rank, points and progress across all missions. */
export function CareerCard() {
  const hydrated = useMissionStore((s) => s.hydrated);
  const runs = useMissionStore((s) => s.runs);
  const c = useMemo(() => career(runs), [runs]);
  if (!hydrated) return <div className="h-40 rounded-3xl border border-line bg-surface" aria-busy="true" />;
  const toNext = c.next ? Math.max(0, c.next.points - c.points) : 0;
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
      <div className="bg-surface p-6 sm:col-span-2">
        <p className="text-sm text-muted">Your rank</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{c.rank}</p>
        <p className="mt-2 text-sm text-dim">
          {c.next ? `${toNext} points to ${c.next.rank}` : "Top rank reached"}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden>
          <div className="h-full rounded-full bg-accent" style={{ width: `${(c.points / c.maxPoints) * 100}%` }} />
        </div>
      </div>
      <div className="bg-surface p-6">
        <p className="text-sm text-muted">Career points</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
          {c.points}
          <span className="text-base font-normal text-dim">/{c.maxPoints}</span>
        </p>
      </div>
      <div className="bg-surface p-6">
        <p className="text-sm text-muted">Tickets closed</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
          {c.completed}
          <span className="text-base font-normal text-dim">/{c.total}</span>
        </p>
        {c.average !== null && <p className="mt-2 text-sm text-dim">Average {c.average}/100</p>}
      </div>
    </div>
  );
}
