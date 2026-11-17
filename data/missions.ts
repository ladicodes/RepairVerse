export type StageId =
  | "NOT_STARTED"
  | "INTRODUCTION"
  | "SAFETY_CHECK"
  | "DEVICE_INSPECTION"
  | "DIAGNOSIS"
  | "REPAIR_DECISION"
  | "COMPLETED";

export type Vec3 = [number, number, number];

export interface Hotspot {
  id: string;
  label: string;
  /** Position in the viewer's normalized laptop frame (base is ~3.2 units wide). */
  position: Vec3;
  /** Where the camera moves to when this hotspot is focused. */
  camera: Vec3;
  role: string;
  clue: string;
  /** Whether this clue points at the actual fault. */
  relevant: boolean;
}

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface Question {
  prompt: string;
  hint?: string;
  choices: Choice[];
  explanation: string;
}

export interface ModelAsset {
  url: string;
  /**
   * "lux3d" only when the file at `url` was generated with Aholo Lux3D.
   * If the file is missing, the viewer falls back to a labeled placeholder.
   */
  source: "lux3d";
  prompt: string;
  /** Optional correction applied after auto-fit, in radians. */
  rotation?: Vec3;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  device: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  ticket: {
    customer: string;
    received: string;
    symptom: string;
    notes: string[];
  };
  problem: string;
  objectives: string[];
  model: ModelAsset;
  hotspots: Hotspot[];
  /** Number of inspected hotspots needed before diagnosis unlocks. */
  minInspections: number;
  safety: Question;
  diagnosis: Question;
  repair: Question;
  scoring: {
    safety: number;
    inspection: number;
    diagnosis: number;
    repair: number;
  };
  summary: string[];
}

export const missions: Record<string, Mission> = {
  "001": {
    id: "001",
    code: "M-001",
    title: "Fix the overheating laptop",
    device: "HP 15-inch laptop",
    difficulty: "Beginner",
    durationMin: 6,
    ticket: {
      customer: "Walk-in customer",
      received: "Bench 03 · Intake",
      symptom:
        "A customer brings in an HP laptop that becomes unusually hot and shuts down after 15 minutes of use. Your task is to investigate the problem and determine the appropriate repair action.",
      notes: [
        "Fan gets loud a few minutes after boot",
        "Underside too hot to rest on a lap",
        "Usually used on a bed or sofa",
        "Shutdowns happen without warning",
      ],
    },
    problem:
      "Laptop overheats and shuts down after about 15 minutes of use.",
    objectives: [
      "Apply basic safety steps before touching internal components",
      "Identify how a laptop's cooling system moves heat out of the chassis",
      "Separate clues that explain the fault from ones that don't",
      "Choose a safe, diagnosis-first repair action",
    ],
    model: {
      url: "/models/laptop.glb",
      source: "lux3d",
      prompt:
        "An HP 15-inch laptop, lid open, natural silver chassis, black keyboard with numeric keypad, visible side air vents, studio lighting",
    },
    hotspots: [
      {
        id: "fan",
        label: "Cooling fan",
        position: [0.92, 0.2, -0.42],
        camera: [2.2, 2.5, 1.0],
        role:
          "A centrifugal blower pulls cool air in through intake vents and pushes it across the heatsink fins and out the exhaust.",
        clue:
          "Fan spins but sounds strained. A gray layer of dust coats the blades and the intake ring.",
        relevant: true,
      },
      {
        id: "vents",
        label: "Air vents",
        position: [1.63, 0.08, -0.22],
        camera: [3.5, 1.2, 0.9],
        role:
          "Intake and exhaust grilles let air flow through the chassis. If they are covered, the fan cannot move enough air.",
        clue:
          "Intake grille is matted with lint and fibers, consistent with use on soft surfaces like a bed or sofa.",
        relevant: true,
      },
      {
        id: "heatsink",
        label: "Heatsink & heat pipe",
        position: [0.92, 0.2, -0.94],
        camera: [1.9, 2.8, 0.4],
        role:
          "A copper heat pipe carries heat from the CPU to a block of thin metal fins. Air from the fan carries the heat away from the fins.",
        clue:
          "Dust is packed between the fins on the exhaust side, so hot air has nowhere to go.",
        relevant: true,
      },
      {
        id: "battery",
        label: "Battery",
        position: [0, 0.16, 0.55],
        camera: [0.4, 2.4, 2.6],
        role:
          "A lithium-ion pack powers the laptop when unplugged. A swollen or damaged pack is a fire risk.",
        clue:
          "No swelling or damage visible. Not the likely cause here, but always check: a swollen battery means stop and hand it to a professional.",
        relevant: false,
      },
      {
        id: "board",
        label: "Motherboard & CPU",
        position: [-0.25, 0.2, -0.5],
        camera: [-1.4, 2.4, 1.2],
        role:
          "The main board connects every component. The CPU is the biggest heat source and slows itself down (throttles) when it gets too hot.",
        clue:
          "No burn marks or damaged parts. The CPU throttling is a symptom of poor cooling, not its cause.",
        relevant: false,
      },
    ],
    minInspections: 3,
    safety: {
      prompt: "Before you open the laptop, what should you do first?",
      hint: "Think about stored energy and static electricity.",
      choices: [
        {
          id: "a",
          text: "Shut it down, unplug the charger, and let it cool before opening",
          correct: true,
          feedback:
            "Correct. Removing power and letting the device cool protects you from heat and electrical hazards and protects the components.",
        },
        {
          id: "b",
          text: "Open it while it's running so you can see the fan spin",
          correct: false,
          feedback:
            "Unsafe. Working inside a powered device risks short circuits, burns, and damage to the board.",
        },
        {
          id: "c",
          text: "Keep the charger plugged in so the battery doesn't drain",
          correct: false,
          feedback:
            "Unsafe. Connected power means live circuits. Always disconnect the charger before opening a device.",
        },
        {
          id: "d",
          text: "Skip safety steps. It's only a laptop",
          correct: false,
          feedback:
            "Laptops store energy in their batteries and run hot. Basic safety steps apply to every repair.",
        },
      ],
      explanation:
        "Power down, disconnect the charger, and let the device cool. On a real bench, also ground yourself (for example with an anti-static wrist strap) and disconnect the internal battery if the manufacturer's guide says to.",
    },
    diagnosis: {
      prompt: "Based on your clues, what is the most likely cause of the overheating?",
      choices: [
        {
          id: "a",
          text: "Blocked cooling vents or dust buildup",
          correct: true,
          feedback:
            "Correct. Dust on the fan, a clogged intake, and packed heatsink fins all point to restricted airflow. The CPU can't shed heat, gets too hot, and the laptop shuts down to protect itself.",
        },
        {
          id: "b",
          text: "A damaged keyboard",
          correct: false,
          feedback:
            "The keyboard doesn't produce meaningful heat or control cooling. None of your clues involved it.",
        },
        {
          id: "c",
          text: "Incorrect screen brightness",
          correct: false,
          feedback:
            "High brightness uses more power, but it doesn't cause shutdowns after 15 minutes. Your clues point at the cooling path.",
        },
        {
          id: "d",
          text: "A disconnected speaker",
          correct: false,
          feedback:
            "A disconnected speaker affects sound, not temperature. It wouldn't explain the heat or the shutdowns.",
        },
      ],
      explanation:
        "Overheating shutdowns usually come from restricted airflow. Dust and lint build up over time, especially when a laptop sits on soft surfaces that block the intake. Dried-out thermal paste is another common cause and is worth checking after cleaning.",
    },
    repair: {
      prompt: "What is the safest appropriate next step?",
      choices: [
        {
          id: "a",
          text: "Power down the laptop and inspect and clean the cooling system safely",
          correct: true,
          feedback:
            "Correct. With power removed, clear dust from the vents, fan, and heatsink (short bursts of compressed air with the fan held still). Then test temperatures under load.",
        },
        {
          id: "b",
          text: "Continue operating the laptop while it overheats",
          correct: false,
          feedback:
            "Running a laptop that keeps overheating stresses the CPU and battery and can shorten their life. Fix the cause first.",
        },
        {
          id: "c",
          text: "Pour water into the cooling vents",
          correct: false,
          feedback:
            "Never. Liquid inside electronics causes short circuits, corrosion, and can be dangerous with a lithium-ion battery.",
        },
        {
          id: "d",
          text: "Replace unrelated components without diagnosis",
          correct: false,
          feedback:
            "Swapping parts without evidence wastes money and time and leaves the real fault in place. Diagnose first.",
        },
      ],
      explanation:
        "Safe, diagnosis-first repair: remove power, clean the airflow path, then verify. If temperatures stay high after cleaning, replacing thermal paste is the usual next step, ideally under supervision the first time.",
    },
    scoring: { safety: 20, inspection: 20, diagnosis: 30, repair: 30 },
    summary: [
      "Laptops cool themselves by moving air: intake vent, fan, heatsink fins, exhaust.",
      "Dust and lint restrict airflow. Soft surfaces like beds block the intake.",
      "A hot CPU throttles, then the system shuts down to prevent damage.",
      "Safe repair starts with removing power and ends with verifying temperatures.",
    ],
  },
};

export function getMission(id: string): Mission | undefined {
  return Object.prototype.hasOwnProperty.call(missions, id) ? missions[id] : undefined;
}

export const STAGE_ORDER: StageId[] = [
  "NOT_STARTED",
  "INTRODUCTION",
  "SAFETY_CHECK",
  "DEVICE_INSPECTION",
  "DIAGNOSIS",
  "REPAIR_DECISION",
  "COMPLETED",
];

export const STAGE_LABELS: Record<StageId, string> = {
  NOT_STARTED: "Not started",
  INTRODUCTION: "Briefing",
  SAFETY_CHECK: "Safety",
  DEVICE_INSPECTION: "Inspect",
  DIAGNOSIS: "Diagnose",
  REPAIR_DECISION: "Repair",
  COMPLETED: "Complete",
};
