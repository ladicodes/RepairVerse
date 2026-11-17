import { missions } from "@/data/missions";

const s = missions["001"].scoring;

export const STEPS = [
  {
    title: "Make it safe",
    body: "Pick the right first step before you touch anything inside the device.",
    points: s.safety,
    scoring: "Starts at 20. An unsafe first step loses all 20 and shows you why.",
  },
  {
    title: "Inspect in 3D",
    body: "Open the bottom panel, rotate the laptop, and click parts to collect clues.",
    points: s.inspection,
    scoring: "Starts at 20. Each part that explains the fault and goes unchecked before you diagnose costs about 7. Inspect at least 3 to move on.",
  },
  {
    title: "Diagnose",
    body: "Use your clues to name the most likely cause of the fault.",
    points: s.diagnosis,
    scoring: "Starts at 30. A wrong cause loses all 30. Your first answer locks in.",
  },
  {
    title: "Choose the repair",
    body: "Pick the safest correct action and watch the post-repair test.",
    points: s.repair,
    scoring: "Starts at 30. A fix that does nothing loses 20. One that makes things worse loses all 30.",
  },
] as const;
