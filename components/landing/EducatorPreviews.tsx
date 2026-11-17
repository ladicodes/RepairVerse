"use client";

import clsx from "clsx";
import { missions } from "@/data/missions";
import { QuestionCard } from "@/components/simulator/QuestionCard";
import { computeScore } from "@/lib/scoring";
import type { MissionProgress } from "@/lib/mission-engine";

const mission = missions["001"];

/** A sample run, used only to render real components with example data. */
const sample: MissionProgress = {
  missionId: "001",
  stage: "COMPLETED",
  inspected: ["fan", "vents", "heatsink", "battery"],
  answers: { safety: "a", diagnosis: "a", repair: "d" },
  startedAt: null,
  completedAt: null,
};

export function StudentAnswerPreview() {
  return (
    <div className="pointer-events-none rounded-3xl border border-line bg-surface p-5 shadow-overlay" aria-hidden>
      <p className="mb-4 font-mono text-sm text-dim">Stage 4 of 4</p>
      <QuestionCard question={mission.repair} answered="d" points={mission.scoring.repair} onAnswer={() => undefined} />
    </div>
  );
}

export function ScoreCardPreview() {
  const score = computeScore(sample, mission);
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-overlay" aria-label={`Example results card: ${score.total} of ${score.max}`}>
      <p className="text-sm text-muted">Example result</p>
      <p className="mb-6 font-mono text-6xl font-semibold tabular-nums">
        {score.total}
        <span className="text-2xl font-normal text-dim">/{score.max}</span>
      </p>
      <dl className="space-y-4">
        {score.categories.map((c) => (
          <div key={c.key}>
            <div className="mb-1.5 flex justify-between text-sm">
              <dt className="text-muted">{c.label}</dt>
              <dd className="font-mono tabular-nums">
                {c.earned}/{c.max}
              </dd>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sunken" aria-hidden>
              <div
                className={clsx("h-full rounded-full", c.earned === c.max ? "bg-ok" : c.earned === 0 ? "bg-danger" : "bg-fg")}
                style={{ width: `${(c.earned / c.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
