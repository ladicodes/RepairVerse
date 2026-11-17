import { STAGE_ORDER, type Mission, type StageId } from "@/data/missions";

export type QuestionKind = "safety" | "diagnosis" | "repair";

export interface MissionProgress {
  missionId: string;
  stage: StageId;
  /** Unique hotspot ids inspected during DEVICE_INSPECTION. */
  inspected: string[];
  answers: Partial<Record<QuestionKind, string>>;
  startedAt: number | null;
  completedAt: number | null;
}

const QUESTION_STAGE: Record<QuestionKind, StageId> = {
  safety: "SAFETY_CHECK",
  diagnosis: "DIAGNOSIS",
  repair: "REPAIR_DECISION",
};

export function createProgress(missionId: string): MissionProgress {
  return {
    missionId,
    stage: "NOT_STARTED",
    inspected: [],
    answers: {},
    startedAt: null,
    completedAt: null,
  };
}

export function stageIndex(stage: StageId): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isValidStage(value: unknown): value is StageId {
  return typeof value === "string" && STAGE_ORDER.includes(value as StageId);
}

/** NOT_STARTED -> INTRODUCTION. No-op from any other stage. */
export function openBriefing(p: MissionProgress): MissionProgress {
  if (p.stage !== "NOT_STARTED") return p;
  return { ...p, stage: "INTRODUCTION" };
}

/** INTRODUCTION -> SAFETY_CHECK. */
export function beginDiagnosis(p: MissionProgress, now = Date.now()): MissionProgress {
  if (p.stage !== "INTRODUCTION") return p;
  return { ...p, stage: "SAFETY_CHECK", startedAt: p.startedAt ?? now };
}

/** Records a hotspot inspection once. Only allowed during DEVICE_INSPECTION. */
export function inspect(p: MissionProgress, mission: Mission, hotspotId: string): MissionProgress {
  if (p.stage !== "DEVICE_INSPECTION") return p;
  if (!mission.hotspots.some((h) => h.id === hotspotId)) return p;
  if (p.inspected.includes(hotspotId)) return p;
  return { ...p, inspected: [...p.inspected, hotspotId] };
}

/** Locks in the first answer for a question. Repeat submissions are ignored. */
export function answer(
  p: MissionProgress,
  mission: Mission,
  kind: QuestionKind,
  choiceId: string,
): MissionProgress {
  if (p.stage !== QUESTION_STAGE[kind]) return p;
  if (p.answers[kind] !== undefined) return p;
  if (!mission[kind].choices.some((c) => c.id === choiceId)) return p;
  return { ...p, answers: { ...p.answers, [kind]: choiceId } };
}

export function canAdvance(p: MissionProgress, mission: Mission): boolean {
  switch (p.stage) {
    case "NOT_STARTED":
    case "INTRODUCTION":
      return true;
    case "SAFETY_CHECK":
      return p.answers.safety !== undefined;
    case "DEVICE_INSPECTION":
      return p.inspected.length >= Math.min(mission.minInspections, mission.hotspots.length);
    case "DIAGNOSIS":
      return p.answers.diagnosis !== undefined;
    case "REPAIR_DECISION":
      return p.answers.repair !== undefined;
    case "COMPLETED":
      return false;
  }
}

/** Moves to the next stage only when the current stage's requirement is met. */
export function advance(p: MissionProgress, mission: Mission, now = Date.now()): MissionProgress {
  if (!canAdvance(p, mission)) return p;
  if (p.stage === "INTRODUCTION") return beginDiagnosis(p, now);
  const next = STAGE_ORDER[stageIndex(p.stage) + 1];
  if (!next) return p;
  return {
    ...p,
    stage: next,
    completedAt: next === "COMPLETED" ? now : p.completedAt,
  };
}

export function isCorrect(mission: Mission, kind: QuestionKind, choiceId: string | undefined) {
  if (!choiceId) return false;
  return mission[kind].choices.find((c) => c.id === choiceId)?.correct ?? false;
}

/**
 * Restores persisted progress. Anything malformed or inconsistent
 * resets to a fresh run instead of crashing the page.
 */
export function sanitizeProgress(raw: unknown, mission: Mission): MissionProgress {
  const fresh = createProgress(mission.id);
  if (!raw || typeof raw !== "object") return fresh;
  const r = raw as Partial<MissionProgress>;
  if (r.missionId !== mission.id || !isValidStage(r.stage)) return fresh;

  const hotspotIds = new Set(mission.hotspots.map((h) => h.id));
  const inspected = Array.isArray(r.inspected)
    ? [...new Set(r.inspected.filter((id): id is string => typeof id === "string" && hotspotIds.has(id)))]
    : [];

  const answers: MissionProgress["answers"] = {};
  const rawAnswers = (r.answers ?? {}) as Record<string, unknown>;
  for (const kind of ["safety", "diagnosis", "repair"] as const) {
    const v = rawAnswers[kind];
    if (typeof v === "string" && mission[kind].choices.some((c) => c.id === v)) answers[kind] = v;
  }

  const p: MissionProgress = {
    missionId: mission.id,
    stage: r.stage,
    inspected,
    answers,
    startedAt: typeof r.startedAt === "number" ? r.startedAt : null,
    completedAt: typeof r.completedAt === "number" ? r.completedAt : null,
  };

  // Every stage past a gate must have satisfied that gate.
  const idx = stageIndex(p.stage);
  const gates: [StageId, boolean][] = [
    ["DEVICE_INSPECTION", answers.safety !== undefined],
    ["DIAGNOSIS", inspected.length >= Math.min(mission.minInspections, mission.hotspots.length)],
    ["REPAIR_DECISION", answers.diagnosis !== undefined],
    ["COMPLETED", answers.repair !== undefined],
  ];
  for (const [stage, ok] of gates) {
    if (idx >= stageIndex(stage) && !ok) return fresh;
  }
  return p;
}
