import { describe, expect, it } from "vitest";
import { getMission } from "@/data/missions";
import {
  advance,
  answer,
  beginDiagnosis,
  canAdvance,
  createProgress,
  inspect,
  openBriefing,
  sanitizeProgress,
  takeHint,
  type MissionProgress,
} from "./mission-engine";
import { computeScore } from "./scoring";

const mission = getMission("001")!;

function toInspection(): MissionProgress {
  let p = beginDiagnosis(openBriefing(createProgress("001")), 0);
  p = answer(p, mission, "safety", "a");
  return advance(p, mission);
}

function perfectRun(): MissionProgress {
  let p = toInspection();
  for (const h of mission.hotspots) p = inspect(p, mission, h.id);
  p = advance(p, mission);
  p = answer(p, mission, "diagnosis", "a");
  p = advance(p, mission);
  p = answer(p, mission, "repair", "a");
  return advance(p, mission, 1000);
}

describe("mission data", () => {
  it("returns undefined for unknown or prototype ids", () => {
    expect(getMission("999")).toBeUndefined();
    expect(getMission("toString")).toBeUndefined();
  });
  it("has exactly one correct choice per question", () => {
    for (const k of ["safety", "diagnosis", "repair"] as const) {
      expect(mission[k].choices.filter((c) => c.correct)).toHaveLength(1);
    }
  });
  it("scoring adds up to 100", () => {
    const s = mission.scoring;
    expect(s.safety + s.inspection + s.diagnosis + s.repair).toBe(100);
  });
});

describe("stage transitions", () => {
  it("follows the defined order", () => {
    let p = createProgress("001");
    expect(p.stage).toBe("NOT_STARTED");
    p = openBriefing(p);
    expect(p.stage).toBe("INTRODUCTION");
    p = beginDiagnosis(p);
    expect(p.stage).toBe("SAFETY_CHECK");
  });

  it("blocks advancing without an answer", () => {
    const p = beginDiagnosis(openBriefing(createProgress("001")));
    expect(canAdvance(p, mission)).toBe(false);
    expect(advance(p, mission)).toBe(p);
  });

  it("blocks diagnosis until enough parts are inspected", () => {
    let p = toInspection();
    p = inspect(p, mission, "fan");
    p = inspect(p, mission, "vents");
    expect(advance(p, mission).stage).toBe("DEVICE_INSPECTION");
    p = inspect(p, mission, "battery");
    expect(advance(p, mission).stage).toBe("DIAGNOSIS");
  });

  it("ignores inspections outside the inspection stage", () => {
    const p = beginDiagnosis(openBriefing(createProgress("001")));
    expect(inspect(p, mission, "fan").inspected).toEqual([]);
  });

  it("ignores answers for the wrong stage and unknown choices", () => {
    const p = beginDiagnosis(openBriefing(createProgress("001")));
    expect(answer(p, mission, "diagnosis", "a").answers.diagnosis).toBeUndefined();
    expect(answer(p, mission, "safety", "zzz").answers.safety).toBeUndefined();
  });

  it("does not advance past COMPLETED", () => {
    const p = perfectRun();
    expect(p.stage).toBe("COMPLETED");
    expect(advance(p, mission)).toBe(p);
  });
});

describe("scoring", () => {
  it("gives 100 for a perfect run", () => {
    expect(computeScore(perfectRun(), mission).total).toBe(100);
  });

  it("locks the first answer: a later correct pick does not score", () => {
    let p = beginDiagnosis(openBriefing(createProgress("001")));
    p = answer(p, mission, "safety", "b");
    p = answer(p, mission, "safety", "a");
    expect(p.answers.safety).toBe("b");
    expect(computeScore(p, mission).categories[0].earned).toBe(0);
  });

  it("starts at full marks before any choice", () => {
    expect(computeScore(beginDiagnosis(openBriefing(createProgress("001"))), mission).total).toBe(100);
  });

  it("never counts the same part twice", () => {
    let p = toInspection();
    for (let i = 0; i < 5; i++) p = inspect(p, mission, "fan");
    expect(p.inspected).toEqual(["fan"]);
  });

  it("costs evidence points for fault clues skipped before diagnosis", () => {
    let p = toInspection();
    for (const id of ["fan", "battery", "board"]) p = inspect(p, mission, id);
    expect(computeScore(p, mission).categories[1].earned).toBe(20);
    p = advance(p, mission);
    expect(p.stage).toBe("DIAGNOSIS");
    expect(computeScore(p, mission).categories[1].earned).toBe(7);
  });

  it("charges 20 for a repair that does nothing and 30 for one that makes things worse", () => {
    const upToRepair = () => {
      let p = toInspection();
      for (const h of mission.hotspots) p = inspect(p, mission, h.id);
      p = advance(p, mission);
      p = answer(p, mission, "diagnosis", "a");
      return advance(p, mission);
    };
    expect(computeScore(answer(upToRepair(), mission, "repair", "d"), mission).total).toBe(80);
    expect(computeScore(answer(upToRepair(), mission, "repair", "c"), mission).total).toBe(70);
  });

  it("charges for a hint once, and only while the question is open", () => {
    let p = beginDiagnosis(openBriefing(createProgress("001")));
    expect(takeHint(p, mission, "diagnosis")).toBe(p);
    p = takeHint(p, mission, "safety");
    p = takeHint(p, mission, "safety");
    expect(p.hints).toEqual(["safety"]);
    expect(computeScore(p, mission).total).toBe(95);
    p = answer(p, mission, "safety", "a");
    expect(takeHint(p, mission, "safety")).toBe(p);
  });

  it("is deterministic", () => {
    expect(computeScore(perfectRun(), mission)).toEqual(computeScore(perfectRun(), mission));
  });
});

describe("restoring saved progress", () => {
  it("resets garbage to a fresh run", () => {
    expect(sanitizeProgress("nope", mission).stage).toBe("NOT_STARTED");
    expect(sanitizeProgress({ missionId: "001", stage: "HACKED" }, mission).stage).toBe("NOT_STARTED");
  });

  it("rejects a stage that skipped its gates", () => {
    const forged = { ...createProgress("001"), stage: "COMPLETED" };
    expect(sanitizeProgress(forged, mission).stage).toBe("NOT_STARTED");
  });

  it("drops unknown hotspots and duplicates", () => {
    const raw = { ...toInspection(), inspected: ["fan", "fan", "ghost"] };
    expect(sanitizeProgress(raw, mission).inspected).toEqual(["fan"]);
  });

  it("drops unknown hint entries and defaults missing hints", () => {
    const raw = { ...toInspection(), hints: ["safety", "bogus"] };
    expect(sanitizeProgress(raw, mission).hints).toEqual(["safety"]);
    const old = { ...toInspection(), hints: undefined };
    expect(sanitizeProgress(old, mission).hints).toEqual([]);
  });

  it("keeps a valid completed run", () => {
    const p = perfectRun();
    expect(sanitizeProgress(JSON.parse(JSON.stringify(p)), mission)).toEqual(p);
  });
});
