import { missions } from "@/data/missions";

const s = missions["001"].scoring;

export const STEPS = [
  {
    title: "Make it safe",
    body: "Pick the right first step before you touch anything inside the device.",
    points: s.safety,
    scoring: "20 points for the safe first step. A wrong pick scores 0 and shows you why.",
  },
  {
    title: "Inspect in 3D",
    body: "Open the bottom panel, rotate the laptop, and click parts to collect clues.",
    points: s.inspection,
    scoring: "4 points for each of the 5 parts you inspect. Inspect at least 3 to move on.",
  },
  {
    title: "Diagnose",
    body: "Use your clues to name the most likely cause of the fault.",
    points: s.diagnosis,
    scoring: "30 points for the right cause. Your first answer locks in.",
  },
  {
    title: "Choose the repair",
    body: "Pick the safest correct action and watch the post-repair test.",
    points: s.repair,
    scoring: "30 points for the safe, correct action. Your first answer locks in.",
  },
] as const;
