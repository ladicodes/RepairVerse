import type { Mission } from "../missions";
import { at } from "../parts";
import { DEVICE, LAPTOP_MODEL, SCORING } from "./common";

export const wontCharge: Mission = {
  id: "002",
  code: "M-002",
  title: "Fix the laptop that won't charge",
  short: "Plugged in, not charging",
  category: "Power",
  device: DEVICE,
  difficulty: "Beginner",
  durationMin: 6,
  ticket: {
    customer: "Walk-in customer",
    received: "Bench 01 · Intake",
    symptom:
      "A customer says their laptop shows \"plugged in, not charging\" and the battery keeps draining. Sometimes it charges if they hold the cable at an angle. Find out why and choose the right repair.",
    notes: [
      "Charge light flickers when the cable moves",
      "Charger is the original one",
      "Laptop was dropped while plugged in last month",
      "Battery is down to 3%",
    ],
  },
  problem: "Laptop only charges when the power cable is held at an angle.",
  objectives: [
    "Make a laptop safe before working near its power circuit",
    "Follow the charging path from the charger to the battery",
    "Tell a port fault apart from a battery fault",
    "Choose a repair that fixes the cause and uses the correct part",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "dcjack",
      label: "Charging port (DC-in)",
      ...at("dcjack"),
      role: "The DC-in jack is where the charger plugs in. It passes power to the board, which charges the battery and runs the laptop.",
      clue: "The jack moves when you push the plug. One solder joint on the jack's cable connector is cracked.",
      relevant: true,
    },
    {
      id: "board",
      label: "Charging circuit",
      ...at("board"),
      role: "The charging circuit on the motherboard controls how much current goes to the battery and when to stop charging.",
      clue: "No burn marks or swollen components near the charging circuit. The board looks healthy.",
      relevant: false,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "A lithium-ion pack stores energy so the laptop runs unplugged. A worn pack holds less charge but still charges.",
      clue: "Battery is flat but not swollen. The battery report shows normal health. It is empty because it isn't receiving power.",
      relevant: false,
    },
    {
      id: "ports",
      label: "USB ports",
      ...at("ports"),
      role: "USB-A and HDMI ports carry data and video. On this laptop they don't charge it.",
      clue: "Ports are clean and tight. Not related to charging on this model.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "You are about to work near the power circuit. What do you do first?",
    hint: "Two sources can power a laptop. Remove both.",
    choices: [
      {
        id: "a",
        text: "Shut it down, unplug the charger, and disconnect the internal battery before touching the board",
        correct: true,
        feedback: "Correct. With the charger and battery disconnected, nothing on the board is live.",
      },
      {
        id: "b",
        text: "Leave the charger plugged in so you can watch the charge light while you work",
        correct: false,
        feedback: "Unsafe. Live power while you probe the board can short components and hurt you.",
      },
      {
        id: "c",
        text: "Only unplug the charger. The battery is almost empty anyway",
        correct: false,
        feedback: "An almost empty battery still holds enough energy to short the board. Disconnect it too.",
      },
      {
        id: "d",
        text: "Wiggle the cable hard to see if it charges",
        correct: false,
        feedback: "Forcing the plug can tear the jack further and cause sparks inside the case.",
      },
    ],
    explanation:
      "Remove every power source before working near the charging path: shut down, unplug the charger, then disconnect the internal battery as the service manual describes.",
  },
  diagnosis: {
    prompt: "Based on your clues, what is the most likely cause?",
    hint: "The laptop charges only when the cable is held at an angle. Which part does the cable touch?",
    choices: [
      {
        id: "a",
        text: "A loose or damaged charging port connection",
        correct: true,
        feedback:
          "Correct. A port that moves, a cracked solder joint, and charging that depends on cable angle all point to the DC-in connection. The drop likely loosened it.",
      },
      {
        id: "b",
        text: "A worn-out battery",
        correct: false,
        feedback: "A worn battery still charges, just to less capacity. Your battery report showed normal health.",
      },
      {
        id: "c",
        text: "A failing Wi-Fi card",
        correct: false,
        feedback: "Wi-Fi has nothing to do with charging. None of your clues involved it.",
      },
      {
        id: "d",
        text: "The screen brightness is too high",
        correct: false,
        feedback: "Brightness affects battery life, not whether the laptop charges at all.",
      },
    ],
    explanation:
      "Intermittent charging that depends on cable position almost always means a mechanical fault in the charging port or its cable. Always rule out the charger itself first by testing a known-good one.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "Confirm the charger first, then fix the part you found.",
    choices: [
      {
        id: "a",
        text: "Test with a known-good charger, then replace the DC-in jack or its cable with the correct part for this model",
        correct: true,
        feedback:
          "Correct. Ruling out the charger avoids replacing the wrong part. Many laptops use a DC-in cable that swaps without soldering.",
      },
      {
        id: "b",
        text: "Tape the cable at the angle where it charges",
        correct: false,
        harmful: true,
        feedback: "A loose contact can arc and overheat. Taping it hides a fire risk instead of fixing it.",
      },
      {
        id: "c",
        text: "Use any charger whose plug fits",
        correct: false,
        harmful: true,
        feedback: "A charger with the wrong voltage or polarity can destroy the board. Use the correct rating.",
      },
      {
        id: "d",
        text: "Replace the battery",
        correct: false,
        feedback: "The battery is healthy. A new one would stay flat because the port still can't deliver power.",
      },
    ],
    explanation:
      "Fix the connection, not the symptom: confirm the charger, replace the damaged DC-in part with the model's correct part, then test charging with the cable at different angles.",
  },
  scoring: SCORING,
  summary: [
    "Power goes charger, DC-in jack, charging circuit, battery.",
    "Charging that depends on cable angle points to the port or its cable.",
    "Test with a known-good charger before replacing parts.",
    "Never tape over a loose power contact or use a charger with the wrong rating.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Battery",
      heading: "Battery level",
      value: "3",
      unit: "%",
      pill: "Plugged in, not charging",
      tone: "bad",
      trend: "fall",
      clock: "09:12",
    },
    fixed: {
      window: "Battery",
      heading: "Battery level",
      value: "34",
      unit: "%",
      pill: "Charging",
      tone: "ok",
      trend: "rise",
      clock: "09:48",
    },
  },
  readout: {
    fault: [
      { icon: "battery", label: "Battery", value: "3%", tone: "bad" },
      { icon: "power", label: "Charger", value: "Not detected", tone: "neutral" },
    ],
    fixed: [
      { icon: "battery", label: "Battery", value: "34%", tone: "ok" },
      { icon: "power", label: "Charger", value: "Charging", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and the charger is plugged in. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: the laptop charges steadily at every cable angle and the light stays on.",
    unresolved: "The fault is still there. The laptop still only charges at one cable angle. Review the explanation above.",
  },
};

export const swollenBattery: Mission = {
  id: "003",
  code: "M-003",
  title: "Handle a swollen battery",
  short: "Trackpad lifting, case bulging",
  category: "Battery",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 7,
  ticket: {
    customer: "Office manager",
    received: "Bench 02 · Priority",
    symptom:
      "The trackpad has stopped clicking properly and the laptop rocks on a flat desk. The bottom cover looks pushed out. Work out what is happening and handle it safely.",
    notes: [
      "Trackpad feels stiff and raised",
      "Laptop wobbles on the desk",
      "About four years old, always plugged in",
      "Customer pressed the bulge to flatten it",
    ],
  },
  problem: "Case and trackpad are being pushed out from inside.",
  objectives: [
    "Recognize the signs of a swollen lithium-ion battery",
    "Know why a swollen battery is a safety hazard",
    "Choose safe handling steps",
    "Arrange the correct replacement and disposal",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "A lithium-ion pack. When its cells age or get damaged, gas can build up and the pack swells.",
      clue: "The pack is puffed up like a pillow. It presses up against the trackpad and down against the bottom cover.",
      relevant: true,
    },
    {
      id: "chassis",
      label: "Bottom cover",
      ...at("ssd"),
      role: "The bottom cover protects the internals and keeps the laptop flat on the desk.",
      clue: "The cover bows outward over the battery area. Screws around it are under strain.",
      relevant: true,
    },
    {
      id: "board",
      label: "Motherboard",
      ...at("board"),
      role: "The main board controls charging and every other part.",
      clue: "No visible damage on the board. The problem is the pack itself.",
      relevant: false,
    },
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "Moves air across the heatsink to remove heat.",
      clue: "Fan is clean and spins freely. Not related to the bulge.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "You suspect a swollen battery. What do you do first?",
    hint: "A damaged lithium-ion cell should not be squeezed or heated.",
    choices: [
      {
        id: "a",
        text: "Power it down, unplug it, and don't press on the bulge. Work on a non-flammable surface",
        correct: true,
        feedback: "Correct. No charging, no pressure, nothing flammable nearby. That keeps the risk of fire low.",
      },
      {
        id: "b",
        text: "Keep it charging so the battery doesn't go flat during the repair",
        correct: false,
        feedback: "Charging a swollen pack adds stress to damaged cells. Unplug it right away.",
      },
      {
        id: "c",
        text: "Press the cover flat so you can open it more easily",
        correct: false,
        feedback: "Pressing a swollen pack can damage the cells inside and start a fire.",
      },
      {
        id: "d",
        text: "Warm the case with a hair dryer to loosen the glue",
        correct: false,
        feedback: "Heat makes a damaged lithium-ion pack more dangerous. Keep it cool.",
      },
    ],
    explanation:
      "Treat a swollen battery as a fire risk: power off, unplug, avoid pressure and heat, and work on a non-flammable surface. If you are not trained, stop here and hand it to a professional.",
  },
  diagnosis: {
    prompt: "What is causing the bulge?",
    hint: "Which part is pushing up and down at the same time?",
    choices: [
      {
        id: "a",
        text: "A swollen lithium-ion battery",
        correct: true,
        feedback: "Correct. A puffed pack pushing on the trackpad and the bottom cover is the classic sign.",
      },
      {
        id: "b",
        text: "A broken trackpad",
        correct: false,
        feedback: "The trackpad is being pushed up from below. It's a symptom, not the cause.",
      },
      {
        id: "c",
        text: "A dusty fan",
        correct: false,
        feedback: "Dust causes heat, not swelling. The fan in this laptop was clean.",
      },
      {
        id: "d",
        text: "Loose bottom cover screws",
        correct: false,
        feedback: "Loose screws don't push the cover outward. Something inside is expanding.",
      },
    ],
    explanation:
      "Lithium-ion cells can release gas as they age or after damage, especially when kept at full charge and warm for long periods. The pack swells and pushes on whatever is above or below it.",
  },
  repair: {
    prompt: "What is the right next step?",
    hint: "The pack can't be fixed. Think about replacement and disposal.",
    choices: [
      {
        id: "a",
        text: "Have the battery replaced with the correct part and take the old one to a battery recycling point",
        correct: true,
        feedback:
          "Correct. A swollen pack must be replaced, not reused. Store it away from flammables until it goes to recycling.",
      },
      {
        id: "b",
        text: "Puncture the pack to let the gas out, then reuse it",
        correct: false,
        harmful: true,
        feedback: "Never. Puncturing a lithium-ion cell can cause fire or a violent reaction.",
      },
      {
        id: "c",
        text: "Keep using it and screw the cover back down tightly",
        correct: false,
        harmful: true,
        feedback: "Squeezing a swollen pack back in adds pressure to damaged cells. That is a fire risk.",
      },
      {
        id: "d",
        text: "Update the trackpad driver",
        correct: false,
        feedback: "Software can't fix a physical bulge. The trackpad will stay stiff.",
      },
    ],
    explanation:
      "Replace the pack with the model's correct part, then recycle the old one at a battery drop-off point. Never puncture, crush, or throw it in household waste.",
  },
  scoring: SCORING,
  summary: [
    "A lifted trackpad and bulging case are signs of a swollen battery.",
    "Swollen lithium-ion packs are a fire risk: no pressure, heat, or charging.",
    "The only fix is replacement with the correct part.",
    "Old packs go to a battery recycling point, never household waste.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Battery report",
      heading: "Battery health",
      value: "61",
      unit: "%",
      pill: "Service recommended",
      tone: "bad",
      trend: "fall",
      clock: "11:03",
    },
    fixed: {
      window: "Battery report",
      heading: "New battery health",
      value: "100",
      unit: "%",
      pill: "Normal",
      tone: "ok",
      trend: "flat",
      clock: "16:20",
    },
  },
  readout: {
    fault: [
      { icon: "battery", label: "Battery", value: "Swollen", tone: "bad" },
      { icon: "hinge", label: "Case", value: "Bulging", tone: "neutral" },
    ],
    fixed: [
      { icon: "battery", label: "New battery", value: "100%", tone: "ok" },
      { icon: "hinge", label: "Case", value: "Flat", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and charging. The case is bulging. Decide what to do before you touch it.",
  postRepair: {
    fixed: "Post-repair check: the new pack sits flat, the trackpad clicks normally, and the old pack is sealed for recycling.",
    unresolved: "The swollen pack is still in use. That is a fire risk. Review the explanation above.",
  },
};

export const wornBattery: Mission = {
  id: "010",
  code: "M-010",
  title: "Find out why the battery dies so fast",
  short: "Battery lasts under an hour",
  category: "Battery",
  device: DEVICE,
  difficulty: "Beginner",
  durationMin: 5,
  ticket: {
    customer: "University student",
    received: "Bench 04 · Intake",
    symptom:
      "A student says their laptop used to last a full day on battery. Now it dies in under an hour, and the percentage jumps around. Find the cause and recommend a fix.",
    notes: [
      "Laptop is about five years old",
      "Battery percentage drops suddenly",
      "Works fine when plugged in",
      "No drops or spills",
    ],
  },
  problem: "Battery runtime has dropped from a full day to under an hour.",
  objectives: [
    "Read battery health and cycle count",
    "Tell normal battery wear apart from other faults",
    "Rule out unrelated parts with evidence",
    "Recommend a safe battery replacement",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Lithium-ion cells lose capacity with every charge cycle. After a few hundred cycles a pack holds noticeably less.",
      clue: "Label date is five years ago. The battery report shows over 900 cycles and only 38% of its original capacity.",
      relevant: true,
    },
    {
      id: "board",
      label: "Motherboard & CPU",
      ...at("board"),
      role: "The CPU draws the most power. A runaway background task can drain a battery fast.",
      clue: "CPU load is normal at idle. No background task is using unusual power.",
      relevant: false,
    },
    {
      id: "ssd",
      label: "SSD",
      ...at("ssd"),
      role: "Stores the operating system and files. Uses little power.",
      clue: "Drive health is good. Not related to battery life.",
      relevant: false,
    },
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "Removes heat. A laptop that runs hot uses more power.",
      clue: "Fan is clean and quiet. Temperatures are normal.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you open the laptop to inspect the battery, what should you do?",
    hint: "The battery is the part you want to check, and it holds energy.",
    choices: [
      {
        id: "a",
        text: "Shut it down, unplug the charger, and handle the battery without bending or puncturing it",
        correct: true,
        feedback: "Correct. Lithium-ion packs must not be bent, punctured, or shorted, even when worn.",
      },
      {
        id: "b",
        text: "Keep it running so you can watch the percentage while you work",
        correct: false,
        feedback: "Working inside a running laptop risks shorts and damage. Power it down first.",
      },
      {
        id: "c",
        text: "Pry the battery out with a metal screwdriver",
        correct: false,
        feedback: "Metal tools can puncture or short a cell. Use plastic tools and follow the service manual.",
      },
      {
        id: "d",
        text: "Skip safety. A worn battery is harmless",
        correct: false,
        feedback: "A worn battery still stores enough energy to cause a fire if damaged.",
      },
    ],
    explanation:
      "Power down, unplug, and treat every lithium-ion pack with care: plastic tools only, no bending, no puncturing, no shorting the contacts.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of the short battery life?",
    hint: "Compare the battery's current capacity with what it had when new.",
    choices: [
      {
        id: "a",
        text: "The battery has worn out after many charge cycles",
        correct: true,
        feedback: "Correct. 900+ cycles and 38% of the original capacity explain the short runtime and the jumping percentage.",
      },
      {
        id: "b",
        text: "Too many browser tabs are open",
        correct: false,
        feedback: "Heavy use shortens runtime a little, but your clues showed normal CPU load.",
      },
      {
        id: "c",
        text: "A failing SSD",
        correct: false,
        feedback: "The drive was healthy and uses little power. It doesn't explain losing most of the battery life.",
      },
      {
        id: "d",
        text: "A dusty fan",
        correct: false,
        feedback: "The fan was clean and temperatures normal. Not the cause here.",
      },
    ],
    explanation:
      "Every lithium-ion battery wears with use. Many laptop packs are rated for a few hundred to around a thousand cycles before capacity drops noticeably. Low capacity also makes the percentage reading jump.",
  },
  repair: {
    prompt: "What do you recommend?",
    hint: "Worn cells can't be restored.",
    choices: [
      {
        id: "a",
        text: "Replace the battery with the correct part for this model and recycle the old one",
        correct: true,
        feedback: "Correct. A new pack restores runtime. The old one goes to a battery recycling point.",
      },
      {
        id: "b",
        text: "Put the battery in the freezer to restore it",
        correct: false,
        harmful: true,
        feedback: "Freezing doesn't restore lithium-ion cells and condensation can damage them. Don't do it.",
      },
      {
        id: "c",
        text: "Buy the cheapest unbranded pack that fits",
        correct: false,
        harmful: true,
        feedback: "Unknown packs may lack proper protection circuits. Use a correct, reputable part.",
      },
      {
        id: "d",
        text: "Reinstall the operating system",
        correct: false,
        feedback: "Software can't restore lost battery capacity. Runtime would stay short.",
      },
    ],
    explanation:
      "Replace the pack with the model's correct part from a reputable source, calibrate by charging fully, and recycle the old pack.",
  },
  scoring: SCORING,
  summary: [
    "Battery capacity drops with every charge cycle.",
    "Check the battery report: cycle count and full-charge capacity.",
    "Rule out software and heat before blaming the battery.",
    "Replace with a correct, reputable pack and recycle the old one.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Battery report",
      heading: "Full charge capacity",
      value: "38",
      unit: "%",
      pill: "Worn",
      tone: "bad",
      trend: "fall",
      clock: "13:30",
    },
    fixed: {
      window: "Battery report",
      heading: "Full charge capacity",
      value: "100",
      unit: "%",
      pill: "New battery",
      tone: "ok",
      trend: "flat",
      clock: "15:05",
    },
  },
  readout: {
    fault: [
      { icon: "battery", label: "Health", value: "38%", tone: "bad" },
      { icon: "power", label: "Runtime", value: "55 min", tone: "neutral" },
    ],
    fixed: [
      { icon: "battery", label: "Health", value: "100%", tone: "ok" },
      { icon: "power", label: "Runtime", value: "About 7 h", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is running on battery. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: the new pack reports 100% capacity and the percentage drops smoothly.",
    unresolved: "The worn pack is still installed. Runtime stays under an hour. Review the explanation above.",
  },
};
