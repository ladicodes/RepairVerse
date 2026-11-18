import { describe, expect, it } from "vitest";
import { missionList } from "@/data/missions";
import { advance, answer, beginDiagnosis, createProgress, inspect, openBriefing, type MissionProgress } from "./mission-engine";
import { career, pickShiftMission } from "./career";
import { toolReading } from "./tools";

function perfect(id: string): MissionProgress {
  const m = missionList.find((x) => x.id === id)!;
  const pick = (q: typeof m.safety) => q.choices.find((c) => c.correct)!.id;
  let p = beginDiagnosis(openBriefing(createProgress(m.id)), 0);
  p = advance(answer(p, m, "safety", pick(m.safety)), m);
  for (const h of m.hotspots) p = inspect(p, m, h.id);
  p = advance(answer(advance(p, m), m, "diagnosis", pick(m.diagnosis)), m);
  return advance(answer(p, m, "repair", pick(m.repair)), m);
}

describe("career", () => {
  it("starts as a trainee with no points", () => {
    const c = career({});
    expect(c).toMatchObject({ completed: 0, points: 0, rank: "Trainee", average: null });
  });

  it("counts only completed missions and ranks up", () => {
    const runs: Record<string, MissionProgress> = {};
    for (const m of missionList.slice(0, 4)) runs[m.id] = perfect(m.id);
    runs[missionList[4].id] = openBriefing(createProgress(missionList[4].id));
    const c = career(runs);
    expect(c.completed).toBe(4);
    expect(c.points).toBe(400);
    expect(c.rank).toBe("Junior technician");
    expect(c.average).toBe(100);
  });

  it("shift picks an open mission while any remain", () => {
    const runs: Record<string, MissionProgress> = {};
    for (const m of missionList.slice(1)) runs[m.id] = perfect(m.id);
    expect(pickShiftMission(runs, () => 0.99).id).toBe(missionList[0].id);
  });
});

describe("tool readings", () => {
  it("every hotspot in every mission has a thermal and a meter reading", () => {
    for (const m of missionList)
      for (const h of m.hotspots)
        for (const t of ["thermal", "meter"] as const) expect(toolReading(m, h, t).value, `${m.id} ${h.id} ${t}`).not.toBe("");
  });
});
