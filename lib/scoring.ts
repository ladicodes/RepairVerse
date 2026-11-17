import type { Mission } from "@/data/missions";
import { stageIndex, type MissionProgress, type QuestionKind } from "@/lib/mission-engine";

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

/**
 * Points an answer loses, before hints. A correct answer loses nothing.
 * A wrong repair that is harmless loses `ineffectiveRepair`; a harmful one, or any
 * other wrong answer, loses the whole stage.
 */
export function answerPenalty(mission: Mission, kind: QuestionKind, choiceId: string): number {
  const choice = mission[kind].choices.find((c) => c.id === choiceId);
  if (!choice || choice.correct) return 0;
  if (kind === "repair" && !choice.harmful) return Math.min(mission.scoring.ineffectiveRepair, mission.scoring.repair);
  return mission.scoring[kind];
}

function questionScore(p: MissionProgress, mission: Mission, kind: QuestionKind): number {
  let earned = mission.scoring[kind];
  const picked = p.answers[kind];
  if (picked !== undefined) earned -= answerPenalty(mission, kind, picked);
  if (p.hints.includes(kind)) earned -= mission.scoring.hintCost;
  return Math.max(0, earned);
}

/**
 * Evidence score. Stays full until the learner leaves inspection, then keeps the share
 * of fault-relevant parts they inspected before diagnosing.
 */
function evidenceScore(p: MissionProgress, mission: Mission): number {
  const max = mission.scoring.inspection;
  if (stageIndex(p.stage) <= stageIndex("DEVICE_INSPECTION")) return max;
  const relevant = mission.hotspots.filter((h) => h.relevant);
  if (relevant.length === 0) return max;
  const found = relevant.filter((h) => p.inspected.includes(h.id)).length;
  return Math.round((max * found) / relevant.length);
}

/** Deterministic: every run starts at full marks and loses points only for recorded choices. */
export function computeScore(p: MissionProgress, mission: Mission): ScoreBreakdown {
  const { scoring } = mission;
  const categories: CategoryScore[] = [
    { key: "safety", label: "Safety procedure", earned: questionScore(p, mission, "safety"), max: scoring.safety },
    { key: "inspection", label: "Evidence gathered", earned: evidenceScore(p, mission), max: scoring.inspection },
    { key: "diagnosis", label: "Fault diagnosis", earned: questionScore(p, mission, "diagnosis"), max: scoring.diagnosis },
    { key: "repair", label: "Repair decision", earned: questionScore(p, mission, "repair"), max: scoring.repair },
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
