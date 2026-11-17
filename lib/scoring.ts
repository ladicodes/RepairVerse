import type { Mission } from "@/data/missions";
import { isCorrect, type MissionProgress } from "@/lib/mission-engine";

export interface CategoryScore {
  key: "safety" | "inspection" | "diagnosis" | "repair";
  label: string;
  earned: number;
  max: number;
}

export interface ScoreBreakdown {
  total: number;
  max: number;
  categories: CategoryScore[];
}

/** Deterministic: depends only on locked answers and the unique inspected set. */
export function computeScore(p: MissionProgress, mission: Mission): ScoreBreakdown {
  const { scoring } = mission;
  const uniqueInspected = new Set(p.inspected.filter((id) => mission.hotspots.some((h) => h.id === id)));
  const inspection =
    mission.hotspots.length === 0
      ? 0
      : Math.round((scoring.inspection * uniqueInspected.size) / mission.hotspots.length);

  const categories: CategoryScore[] = [
    {
      key: "safety",
      label: "Safety procedure",
      earned: isCorrect(mission, "safety", p.answers.safety) ? scoring.safety : 0,
      max: scoring.safety,
    },
    { key: "inspection", label: "Component inspection", earned: inspection, max: scoring.inspection },
    {
      key: "diagnosis",
      label: "Fault diagnosis",
      earned: isCorrect(mission, "diagnosis", p.answers.diagnosis) ? scoring.diagnosis : 0,
      max: scoring.diagnosis,
    },
    {
      key: "repair",
      label: "Repair decision",
      earned: isCorrect(mission, "repair", p.answers.repair) ? scoring.repair : 0,
      max: scoring.repair,
    },
  ];

  return {
    total: categories.reduce((s, c) => s + c.earned, 0),
    max: categories.reduce((s, c) => s + c.max, 0),
    categories,
  };
}

export function rating(total: number): { title: string; blurb: string } {
  if (total >= 90) return { title: "Bench ready", blurb: "Safe, methodical, and evidence-led. That's how good technicians work." };
  if (total >= 70) return { title: "Solid technician", blurb: "Good instincts. Review the feedback below to tighten up the weak spots." };
  if (total >= 40) return { title: "Apprentice", blurb: "You're getting there. Retry and follow the clues more closely." };
  return { title: "Needs practice", blurb: "Every technician starts here. Read the explanations and run it again." };
}
