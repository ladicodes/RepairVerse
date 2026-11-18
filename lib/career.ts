import { missionList } from "@/data/missions";
import { sanitizeProgress, type MissionProgress } from "./mission-engine";
import { computeScore } from "./scoring";

export interface Career {
  completed: number;
  total: number;
  points: number;
  maxPoints: number;
  average: number | null;
  rank: string;
  next: { rank: string; points: number } | null;
}

const RANKS = [
  { rank: "Trainee", points: 0 },
  { rank: "Bench assistant", points: 150 },
  { rank: "Junior technician", points: 400 },
  { rank: "Technician", points: 700 },
  { rank: "Senior technician", points: 950 },
  { rank: "Master technician", points: 1150 },
];

/** Career standing across every mission, from the runs saved in this browser. */
export function career(runs: Record<string, MissionProgress | undefined>): Career {
  let completed = 0;
  let points = 0;
  for (const m of missionList) {
    const raw = runs[m.id];
    if (!raw) continue;
    const run = sanitizeProgress(raw, m);
    if (run.stage !== "COMPLETED") continue;
    completed += 1;
    points += computeScore(run, m).total;
  }
  const idx = RANKS.reduce((best, r, i) => (points >= r.points ? i : best), 0);
  return {
    completed,
    total: missionList.length,
    points,
    maxPoints: missionList.length * 100,
    average: completed ? Math.round(points / completed) : null,
    rank: RANKS[idx].rank,
    next: RANKS[idx + 1] ?? null,
  };
}

/** A random mission for a shift, preferring ones not yet completed. */
export function pickShiftMission(runs: Record<string, MissionProgress | undefined>, random = Math.random) {
  const open = missionList.filter((m) => runs[m.id]?.stage !== "COMPLETED");
  const pool = open.length ? open : missionList;
  return pool[Math.floor(random() * pool.length)];
}
