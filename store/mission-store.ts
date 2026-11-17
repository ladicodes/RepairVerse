"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getMission } from "@/data/missions";
import * as engine from "@/lib/mission-engine";
import type { MissionProgress, QuestionKind } from "@/lib/mission-engine";

interface MissionStore {
  runs: Record<string, MissionProgress>;
  hydrated: boolean;
  /** Ensures a run exists and moves NOT_STARTED to INTRODUCTION. */
  load: (missionId: string) => void;
  advance: (missionId: string) => void;
  inspect: (missionId: string, hotspotId: string) => void;
  answer: (missionId: string, kind: QuestionKind, choiceId: string) => void;
  reset: (missionId: string) => void;
}

function safeStorage() {
  return createJSONStorage(() => {
    try {
      const k = "__rv_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return window.localStorage;
    } catch {
      const mem = new Map<string, string>();
      return {
        getItem: (n: string) => mem.get(n) ?? null,
        setItem: (n: string, v: string) => void mem.set(n, v),
        removeItem: (n: string) => void mem.delete(n),
      };
    }
  });
}

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => {
      const update = (missionId: string, fn: (p: MissionProgress) => MissionProgress) => {
        const mission = getMission(missionId);
        if (!mission) return;
        const current = engine.sanitizeProgress(get().runs[missionId], mission);
        const next = fn(current);
        if (next !== get().runs[missionId]) set({ runs: { ...get().runs, [missionId]: next } });
      };

      return {
        runs: {},
        hydrated: false,
        load: (id) => update(id, engine.openBriefing),
        advance: (id) => {
          const m = getMission(id);
          if (m) update(id, (p) => engine.advance(p, m));
        },
        inspect: (id, hotspotId) => {
          const m = getMission(id);
          if (m) update(id, (p) => engine.inspect(p, m, hotspotId));
        },
        answer: (id, kind, choiceId) => {
          const m = getMission(id);
          if (m) update(id, (p) => engine.answer(p, m, kind, choiceId));
        },
        reset: (id) => {
          if (!getMission(id)) return;
          set({ runs: { ...get().runs, [id]: engine.openBriefing(engine.createProgress(id)) } });
        },
      };
    },
    {
      name: "repairverse-progress",
      version: 1,
      storage: safeStorage(),
      partialize: (s) => ({ runs: s.runs }),
      // Deferred: with sync storage this runs while the store is still being created.
      onRehydrateStorage: () => () => {
        queueMicrotask(() => useMissionStore.setState({ hydrated: true }));
      },
    },
  ),
);

/** Returns a sanitized run for rendering, or null before hydration. */
export function useMissionRun(missionId: string): MissionProgress | null {
  const hydrated = useMissionStore((s) => s.hydrated);
  const raw = useMissionStore((s) => s.runs[missionId]);
  return useMemo(() => {
    const mission = getMission(missionId);
    if (!hydrated || !mission) return null;
    return engine.sanitizeProgress(raw, mission);
  }, [hydrated, raw, missionId]);
}
