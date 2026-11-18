import type { Mission } from "../missions";
import { at } from "../parts";
import { DEVICE, LAPTOP_MODEL, SCORING } from "./common";

export const liquidSpill: Mission = {
  id: "005",
  code: "M-005",
  title: "Rescue a laptop after a coffee spill",
  short: "Coffee spill, keys failing",
  category: "Liquid damage",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 7,
  ticket: {
    customer: "Café owner",
    received: "Bench 02 · Urgent",
    symptom:
      "A customer spilled sweet coffee on their keyboard two hours ago. The laptop is still on. Some keys don't work and others type the wrong letters. Act fast and choose the right recovery steps.",
    notes: [
      "Sweet coffee with milk, about half a cup",
      "Laptop is still on",
      "Several keys dead, some repeat",
      "Customer wiped the top with a towel",
    ],
  },
  problem: "Liquid inside the laptop is causing keyboard faults and risks corrosion.",
  objectives: [
    "Act quickly and safely after a spill",
    "Find where the liquid went",
    "Recognize corrosion and residue",
    "Clean and dry correctly, then test",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "board",
      label: "Keyboard connector area",
      ...at("board"),
      role: "The keyboard's ribbon cable plugs into the board here. Liquid that bridges its contacts causes dead or ghost keys.",
      clue: "Sticky brown residue and a green-white crust around the keyboard connector. That is the start of corrosion.",
      relevant: true,
    },
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "Pulls air through the case. Liquid can reach it from the keyboard.",
      clue: "Dried sugary droplets on the fan blades and housing. The liquid spread under the keyboard deck.",
      relevant: true,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "A lithium-ion pack. Liquid near it plus power is a serious hazard.",
      clue: "The battery surface is dry. It must still be disconnected before cleaning.",
      relevant: false,
    },
    {
      id: "ssd",
      label: "SSD",
      ...at("ssd"),
      role: "Stores the files. Usually survives spills if power is removed quickly.",
      clue: "Dry and clean. The data is likely safe.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "The laptop is still on with liquid inside. What do you do first?",
    hint: "Power plus liquid is what causes the damage.",
    choices: [
      {
        id: "a",
        text: "Shut it off immediately, unplug it, and disconnect the battery as soon as you can open it",
        correct: true,
        feedback: "Correct. Removing power stops electrical damage. Every minute with power on makes corrosion worse.",
      },
      {
        id: "b",
        text: "Keep it on to check which keys still work",
        correct: false,
        feedback: "Power running through liquid drives corrosion and can short the board. Turn it off now.",
      },
      {
        id: "c",
        text: "Dry it with a hair dryer on hot while it runs",
        correct: false,
        feedback: "Heat can warp parts and push liquid deeper. And it's still powered.",
      },
      {
        id: "d",
        text: "Put it in a bag of rice",
        correct: false,
        feedback: "Rice doesn't remove sugar residue or stop corrosion. It also leaves dust and starch inside.",
      },
    ],
    explanation:
      "After a spill: power off immediately, unplug, and disconnect the battery. Don't power it on again until it has been opened, cleaned, and fully dried.",
  },
  diagnosis: {
    prompt: "What is causing the keyboard faults?",
    hint: "Look at where the keyboard connects to the board.",
    choices: [
      {
        id: "a",
        text: "Sugary liquid residue and corrosion around the keyboard connection",
        correct: true,
        feedback: "Correct. Residue bridges contacts and corrosion eats the traces, giving dead and ghost keys.",
      },
      {
        id: "b",
        text: "A keyboard driver problem",
        correct: false,
        feedback: "The faults started with the spill and you found residue. This is physical, not software.",
      },
      {
        id: "c",
        text: "A worn-out battery",
        correct: false,
        feedback: "The battery was dry and doesn't affect which keys work.",
      },
      {
        id: "d",
        text: "A failing SSD",
        correct: false,
        feedback: "The drive was dry. It doesn't control the keyboard.",
      },
    ],
    explanation:
      "Sweet drinks leave sticky, conductive residue. With power applied, it causes shorts and fast corrosion. The keyboard connector and its traces are usually hit first.",
  },
  repair: {
    prompt: "What is the right recovery?",
    hint: "Remove the residue, dry completely, then test.",
    choices: [
      {
        id: "a",
        text: "Clean the residue and corrosion with high-purity isopropyl alcohol and a soft brush, let it dry fully, then test. Replace the keyboard if keys still fail",
        correct: true,
        feedback: "Correct. Alcohol dissolves the residue and evaporates. Testing afterwards shows whether the keyboard itself needs replacing.",
      },
      {
        id: "b",
        text: "Rinse the board under the tap with the battery connected",
        correct: false,
        harmful: true,
        feedback: "Tap water with power connected guarantees shorts. Never wash a powered board.",
      },
      {
        id: "c",
        text: "Power it on every hour to see if it has dried",
        correct: false,
        harmful: true,
        feedback: "Each power-on with residue inside can short components and speed corrosion.",
      },
      {
        id: "d",
        text: "Wipe the keyboard surface and return it",
        correct: false,
        feedback: "The damage is inside. Corrosion will keep spreading under the keyboard.",
      },
    ],
    explanation:
      "Open the laptop, disconnect the battery, clean residue and corrosion with high-purity isopropyl alcohol and a soft brush, dry completely, then test. Heavy corrosion on the board needs professional board repair.",
  },
  scoring: SCORING,
  summary: [
    "After a spill, power off, unplug, and disconnect the battery right away.",
    "Sweet drinks leave conductive residue that corrodes with power applied.",
    "Rice and hair dryers don't fix liquid damage.",
    "Clean with high-purity isopropyl alcohol, dry fully, then test.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Keyboard test",
      heading: "Keys failing",
      value: "11",
      unit: "keys",
      pill: "Input errors",
      tone: "bad",
      trend: "none",
      clock: "15:02",
    },
    fixed: {
      window: "Keyboard test",
      heading: "Keys failing",
      value: "0",
      unit: "keys",
      pill: "All keys OK",
      tone: "ok",
      trend: "none",
      clock: "11:30",
    },
  },
  readout: {
    fault: [
      { icon: "liquid", label: "Spill", value: "2 h ago", tone: "bad" },
      { icon: "keyboard", label: "Keyboard", value: "11 keys failing", tone: "neutral" },
    ],
    fixed: [
      { icon: "liquid", label: "Residue", value: "Cleaned", tone: "ok" },
      { icon: "keyboard", label: "Keyboard", value: "All keys OK", tone: "neutral" },
    ],
  },
  safetyIntro: "Coffee went into the keyboard and the laptop is still on. Act now.",
  postRepair: {
    fixed: "Post-repair test after a full day of drying: every key registers once, and the connector area is clean.",
    unresolved: "Residue is still inside and corrosion will spread. Review the explanation above.",
  },
};

export const noDisplay: Mission = {
  id: "006",
  code: "M-006",
  title: "Fix the laptop with a black screen",
  short: "Runs, but no picture",
  category: "Display",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 6,
  ticket: {
    customer: "Graphic design student",
    received: "Bench 04 · Intake",
    symptom:
      "A laptop starts up (you can hear the startup sound) but the screen stays black. Sometimes the picture flickers back when the lid is moved. Find the fault.",
    notes: [
      "Startup sound plays, keyboard lights up",
      "Screen black, flickers when the lid moves",
      "Lid was recently opened past its limit",
      "An external monitor works",
    ],
  },
  problem: "Laptop runs but its built-in screen shows nothing.",
  objectives: [
    "Use an external monitor to split the problem in half",
    "Follow the display signal from board to panel",
    "Find a cable fault near the hinge",
    "Reseat or replace a display cable safely",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "hinge",
      label: "Display cable at the hinge",
      ...at("hinge"),
      role: "A thin display cable runs from the board, through the hinge, to the screen. Opening and closing the lid flexes it.",
      clue: "The display cable connector on the board is half out of its socket, and the cable is creased where it enters the hinge.",
      relevant: true,
    },
    {
      id: "ports",
      label: "HDMI port",
      ...at("ports"),
      role: "Sends video to an external monitor. If it works, the graphics chip is producing a picture.",
      clue: "An external monitor on HDMI shows a normal desktop. The graphics side is working.",
      relevant: true,
    },
    {
      id: "ram",
      label: "Memory (RAM)",
      ...at("ram"),
      role: "Holds running programs. Memory faults stop the laptop before it can start.",
      clue: "Memory is seated. The laptop starts fine, so memory isn't the issue.",
      relevant: false,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Powers the laptop when unplugged.",
      clue: "Battery charges normally. Not related.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you open the laptop to check the display cable, what do you do?",
    hint: "Connectors should never be moved with power applied.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug, disconnect the battery, and ground yourself",
        correct: true,
        feedback: "Correct. Reseating a display connector with power on can damage the screen or the board.",
      },
      {
        id: "b",
        text: "Leave it on and wiggle the cable to make the picture come back",
        correct: false,
        feedback: "Moving a live display connector can short pins and kill the screen or board.",
      },
      {
        id: "c",
        text: "Press hard on the screen to see if it lights up",
        correct: false,
        feedback: "Pressing on the panel can crack it. The problem is the signal, not the glass.",
      },
      {
        id: "d",
        text: "Skip the battery, the screen is separate",
        correct: false,
        feedback: "The display cable connects to the live board. Disconnect the battery first.",
      },
    ],
    explanation:
      "Power down, unplug, disconnect the battery, and discharge static before touching any connector. Display connectors are small and easy to damage.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of the black screen?",
    hint: "The external monitor works. So where is the signal getting lost?",
    choices: [
      {
        id: "a",
        text: "A loose or damaged display cable",
        correct: true,
        feedback: "Correct. The graphics work on HDMI, the picture flickers with lid movement, and the connector was half out.",
      },
      {
        id: "b",
        text: "A failed graphics chip",
        correct: false,
        feedback: "The external monitor showed a normal picture, so the graphics chip works.",
      },
      {
        id: "c",
        text: "The operating system is corrupted",
        correct: false,
        feedback: "The startup sound plays and the external monitor shows the desktop. The system is running.",
      },
      {
        id: "d",
        text: "Faulty memory",
        correct: false,
        feedback: "The laptop starts fine. Memory faults would stop it from starting at all.",
      },
    ],
    explanation:
      "If an external monitor works, the board and graphics are fine. The fault is between the board and the panel: the display cable, its connector, or the panel itself. Flicker with lid movement points at the cable.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "Start with the cheapest fix that matches your evidence.",
    choices: [
      {
        id: "a",
        text: "Reseat the display connector fully, then test. If it still flickers, replace the creased cable with the correct part",
        correct: true,
        feedback: "Correct. Reseating is free and often enough. A creased cable will fail again, so replace it if the flicker remains.",
      },
      {
        id: "b",
        text: "Replace the motherboard",
        correct: false,
        feedback: "The board works, as the external monitor showed. That's an expensive part that wouldn't fix this.",
      },
      {
        id: "c",
        text: "Reinstall the operating system",
        correct: false,
        feedback: "Software isn't the problem. The screen would stay black.",
      },
      {
        id: "d",
        text: "Glue the connector in place while the laptop runs",
        correct: false,
        harmful: true,
        feedback: "Glue on a live connector can short pins and makes a later repair much harder.",
      },
    ],
    explanation:
      "With power removed, reseat the display connector and lock its latch. Check the cable for creases at the hinge and replace it if damaged. Test by opening and closing the lid through its full range.",
  },
  scoring: SCORING,
  summary: [
    "An external monitor test splits the fault: board side or screen side.",
    "Flicker with lid movement points at the display cable.",
    "Never move display connectors with power applied.",
    "Reseat first, then replace a damaged cable.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "",
      heading: "",
      value: "",
      pill: "",
      tone: "bad",
      trend: "none",
      dark: true,
    },
    fixed: {
      window: "Display test",
      heading: "Built-in display",
      value: "OK",
      pill: "No flicker",
      tone: "ok",
      trend: "flat",
      clock: "14:05",
    },
  },
  readout: {
    fault: [
      { icon: "display", label: "Built-in screen", value: "Black", tone: "bad" },
      { icon: "display", label: "External monitor", value: "Works", tone: "neutral" },
    ],
    fixed: [
      { icon: "display", label: "Built-in screen", value: "Picture OK", tone: "ok" },
      { icon: "hinge", label: "Lid test", value: "No flicker", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is running with a black screen. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: the screen shows a stable picture at every lid angle.",
    unresolved: "The screen is still black. The signal still isn't reaching the panel. Review the explanation above.",
  },
};

export const wifiDrops: Mission = {
  id: "007",
  code: "M-007",
  title: "Fix the Wi-Fi that keeps dropping",
  short: "Weak, dropping Wi-Fi",
  category: "Connectivity",
  device: DEVICE,
  difficulty: "Beginner",
  durationMin: 5,
  ticket: {
    customer: "Remote worker",
    received: "Bench 03 · Intake",
    symptom:
      "Since a screen repair at another shop, this laptop gets one bar of Wi-Fi next to the router and drops video calls. Phones in the same room work fine. Find the cause.",
    notes: [
      "Started after a screen repair elsewhere",
      "One bar even next to the router",
      "Other devices work fine",
      "Drivers are up to date",
    ],
  },
  problem: "Very weak, unstable Wi-Fi signal after a recent repair.",
  objectives: [
    "Rule out the network using other devices",
    "Link a new fault to recent work on the laptop",
    "Find the Wi-Fi card and its antenna leads",
    "Reconnect antenna leads correctly",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "wifi",
      label: "Wi-Fi card",
      ...at("wifi"),
      role: "The Wi-Fi card handles wireless networking. Two thin antenna leads clip onto it and run up to antennas in the lid.",
      clue: "One antenna lead is unclipped and lying beside the card. The other is attached.",
      relevant: true,
    },
    {
      id: "hinge",
      label: "Antenna route at the hinge",
      ...at("hinge"),
      role: "The antenna leads run through the hinge into the lid, next to the display cable.",
      clue: "The leads were moved during the screen repair. Their routing clips are open.",
      relevant: true,
    },
    {
      id: "board",
      label: "Motherboard",
      ...at("board"),
      role: "Connects the Wi-Fi card to the rest of the system.",
      clue: "The card is detected and the driver loads. The system side is fine.",
      relevant: false,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Powers the laptop when unplugged.",
      clue: "Battery is fine. Not related.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you open the laptop, what do you do?",
    hint: "Same rule as every repair.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug, disconnect the battery, and ground yourself",
        correct: true,
        feedback: "Correct. Antenna connectors are tiny. Working without power and static protects the card.",
      },
      {
        id: "b",
        text: "Leave it on to watch the signal bars while you work",
        correct: false,
        feedback: "Working inside a powered laptop risks shorts. Test the signal after reassembly.",
      },
      {
        id: "c",
        text: "Reset the router first",
        correct: false,
        feedback: "Other devices work fine, so the router isn't the problem. And it isn't a safety step.",
      },
      {
        id: "d",
        text: "Use a metal screwdriver to pry the card connector",
        correct: false,
        feedback: "Metal tools can short the board and crush the connector. Use a plastic tool.",
      },
    ],
    explanation:
      "Power down, unplug, disconnect the battery, ground yourself, and use plastic tools on antenna connectors.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of the weak Wi-Fi?",
    hint: "What changed, and what did you find near the card?",
    choices: [
      {
        id: "a",
        text: "An antenna lead was left unclipped during the previous repair",
        correct: true,
        feedback: "Correct. Without its antenna the card has almost no range. The previous repair disturbed the leads.",
      },
      {
        id: "b",
        text: "The router is faulty",
        correct: false,
        feedback: "Other devices in the same room work fine. The router is OK.",
      },
      {
        id: "c",
        text: "The Wi-Fi driver is outdated",
        correct: false,
        feedback: "Drivers were up to date and the card is detected. A driver doesn't explain one bar next to the router.",
      },
      {
        id: "d",
        text: "The battery is low",
        correct: false,
        feedback: "Battery level doesn't change Wi-Fi range.",
      },
    ],
    explanation:
      "A Wi-Fi card without its antennas can still connect very close to a router, but the signal is weak and unstable. Fault that starts right after a repair? Check what that repair touched.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "Put back what was disturbed, the right way.",
    choices: [
      {
        id: "a",
        text: "Clip the antenna lead back onto the correct terminal (main or aux), re-route the leads into their clips, and test the signal",
        correct: true,
        feedback: "Correct. Press straight down until it snaps. Routing the leads properly stops them being pinched by the hinge.",
      },
      {
        id: "b",
        text: "Replace the Wi-Fi card",
        correct: false,
        feedback: "The card works. A new card would have the same problem without its antenna.",
      },
      {
        id: "c",
        text: "Buy a new router",
        correct: false,
        feedback: "Other devices are fine. The fault is inside the laptop.",
      },
      {
        id: "d",
        text: "Leave the lead loose and tape it near the card",
        correct: false,
        feedback: "A loose lead doesn't make contact. The signal would stay weak.",
      },
    ],
    explanation:
      "Snap each antenna lead onto its labelled terminal (often marked MAIN and AUX), route the leads through their clips away from the hinge, and test signal strength near and far from the router.",
  },
  scoring: SCORING,
  summary: [
    "If other devices work, the fault is in the laptop, not the network.",
    "A fault that starts after a repair usually comes from that repair.",
    "Wi-Fi cards need both antenna leads attached.",
    "Route leads through their clips so the hinge doesn't pinch them.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Network",
      heading: "Wi-Fi signal",
      value: "-82",
      unit: "dBm",
      pill: "Unstable",
      tone: "bad",
      trend: "unstable",
      clock: "10:40",
    },
    fixed: {
      window: "Network",
      heading: "Wi-Fi signal",
      value: "-48",
      unit: "dBm",
      pill: "Strong",
      tone: "ok",
      trend: "flat",
      clock: "11:15",
    },
  },
  readout: {
    fault: [
      { icon: "wifi", label: "Wi-Fi", value: "1 bar, dropping", tone: "bad" },
      { icon: "wifi", label: "Other devices", value: "Fine", tone: "neutral" },
    ],
    fixed: [
      { icon: "wifi", label: "Wi-Fi", value: "Full signal", tone: "ok" },
      { icon: "wifi", label: "Video call", value: "Stable", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and connected. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: full signal near the router and a stable video call from the next room.",
    unresolved: "The antenna is still disconnected. Wi-Fi stays weak. Review the explanation above.",
  },
};

export const grindingFan: Mission = {
  id: "009",
  code: "M-009",
  title: "Stop the grinding fan noise",
  short: "Fan grinds and rattles",
  category: "Cooling",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 6,
  ticket: {
    customer: "Office worker",
    received: "Bench 05 · Intake",
    symptom:
      "A laptop makes a grinding, rattling noise from the left of the keyboard area that gets louder under load. The customer had it cleaned last month. Find out what is wrong now.",
    notes: [
      "Grinding noise, worse when busy",
      "Professionally cleaned a month ago",
      "Temperatures a bit higher than before",
      "Noise changes when the laptop is tilted",
    ],
  },
  problem: "Fan is grinding even though the cooling system is clean.",
  objectives: [
    "Tell a mechanical fan fault apart from dust",
    "Use evidence to rule out the obvious answer",
    "Check a fan bearing safely",
    "Replace a fan with the correct part",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "A small blower spinning on a tiny bearing. When the bearing wears out, the blades wobble and scrape.",
      clue: "Spun by hand with the power off, the blades wobble and grind. The hub has play when gently pushed sideways.",
      relevant: true,
    },
    {
      id: "heatsink",
      label: "Heatsink fins",
      ...at("heatsink"),
      role: "Thin metal fins that the fan blows air through.",
      clue: "The fins are clean. No dust is blocking them.",
      relevant: false,
    },
    {
      id: "vents",
      label: "Air vents",
      ...at("vents"),
      role: "Let air in and out of the case.",
      clue: "Vents are clear and clean.",
      relevant: false,
    },
    {
      id: "board",
      label: "Motherboard & CPU",
      ...at("board"),
      role: "The CPU's heat moves through heat pipes to the fins.",
      clue: "CPU runs a few degrees warmer than normal because the slowed fan moves less air.",
      relevant: true,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you open it to check the fan, what do you do?",
    hint: "Fans can start without warning while power is connected.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug, and disconnect the battery before touching the fan",
        correct: true,
        feedback: "Correct. With power removed the fan can't spin up and catch your finger or tool.",
      },
      {
        id: "b",
        text: "Leave it running and touch the fan to stop the noise",
        correct: false,
        feedback: "Stopping a spinning fan with a finger can hurt you and break blades.",
      },
      {
        id: "c",
        text: "Spray oil into the vents while it runs",
        correct: false,
        feedback: "Oil attracts dust and can reach the board. And it's still powered.",
      },
      {
        id: "d",
        text: "Spin the fan fast with compressed air",
        correct: false,
        feedback: "Overspinning a fan with air can damage its motor and bearing. Hold the fan still if you use air.",
      },
    ],
    explanation:
      "Power down, unplug, and disconnect the battery. When using compressed air near a fan, hold the blades still so it doesn't overspin.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of the grinding?",
    hint: "The cooling path is clean. What else on a fan can make noise?",
    choices: [
      {
        id: "a",
        text: "A worn fan bearing",
        correct: true,
        feedback: "Correct. Wobbling blades, play in the hub, and noise that changes with tilt all point to the bearing.",
      },
      {
        id: "b",
        text: "Dust buildup",
        correct: false,
        feedback: "The fins and vents were clean. Dust is the usual answer for noise, but your evidence rules it out here.",
      },
      {
        id: "c",
        text: "A failing SSD",
        correct: false,
        feedback: "SSDs have no moving parts, so they can't grind.",
      },
      {
        id: "d",
        text: "Loose keyboard keys",
        correct: false,
        feedback: "Keys don't make noise under load. The sound comes from the fan.",
      },
    ],
    explanation:
      "Fans use small sleeve or fluid bearings that wear over time. A worn bearing lets the blades wobble and scrape, which makes a grinding noise that often changes with the laptop's angle.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "A worn bearing can't be cleaned away.",
    choices: [
      {
        id: "a",
        text: "Replace the fan with the correct part for this model, then check temperatures and noise under load",
        correct: true,
        feedback: "Correct. A new fan restores airflow and stops the noise. Check thermal paste while the cooler is open.",
      },
      {
        id: "b",
        text: "Clean the fan again",
        correct: false,
        feedback: "The fan is already clean. Cleaning won't fix a worn bearing.",
      },
      {
        id: "c",
        text: "Unplug the fan so it stays quiet",
        correct: false,
        harmful: true,
        feedback: "Without a fan the CPU overheats and the laptop shuts down or gets damaged.",
      },
      {
        id: "d",
        text: "Put household oil on the bearing",
        correct: false,
        feedback: "Household oil gums up and attracts dust. The noise usually comes back quickly.",
      },
    ],
    explanation:
      "Replace the fan with the model's correct part (check connector and size), reassemble, and test noise and temperatures under load.",
  },
  scoring: SCORING,
  summary: [
    "Not every noisy fan is dusty. Check the evidence.",
    "Wobble and play in the hub mean a worn bearing.",
    "Never stop or overspin a fan by hand or with air.",
    "Replace a worn fan with the correct part, then test under load.",
  ],
  visual: { dusty: false, hot: true },
  screen: {
    fault: {
      window: "System monitor",
      heading: "Fan speed",
      value: "4800",
      unit: "RPM",
      pill: "Noisy",
      tone: "bad",
      trend: "unstable",
      clock: "13:20",
    },
    fixed: {
      window: "System monitor",
      heading: "Fan speed",
      value: "3200",
      unit: "RPM",
      pill: "Quiet",
      tone: "ok",
      trend: "flat",
      clock: "15:45",
    },
  },
  readout: {
    fault: [
      { icon: "fan", label: "Fan", value: "Grinding", tone: "bad" },
      { icon: "temp", label: "CPU", value: "78°C", tone: "neutral" },
    ],
    fixed: [
      { icon: "fan", label: "New fan", value: "Quiet", tone: "ok" },
      { icon: "temp", label: "CPU", value: "64°C", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and the fan is grinding. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: the new fan runs quietly and the CPU holds 64°C under load.",
    unresolved: "The worn fan is still installed and grinding. Review the explanation above.",
  },
};

export const crackedHinge: Mission = {
  id: "011",
  code: "M-011",
  title: "Repair a wobbly, cracking hinge",
  short: "Lid wobbles, case cracking",
  category: "Chassis",
  device: DEVICE,
  difficulty: "Advanced",
  durationMin: 8,
  ticket: {
    customer: "Teacher",
    received: "Bench 02 · Intake",
    symptom:
      "The lid of this laptop wobbles, makes a cracking sound when opened, and the case near the hinge is splitting. The screen sometimes flickers. Find what is breaking and choose a lasting fix.",
    notes: [
      "Usually opened from one corner",
      "Cracking sound when opening",
      "Gap opening up near the left hinge",
      "Screen flickers now and then",
    ],
  },
  problem: "Hinge mount is breaking out of the case and stressing the display cable.",
  objectives: [
    "Understand how hinges mount to the case",
    "Find mechanical damage before it spreads",
    "Spot secondary damage to cables",
    "Choose a repair that lasts",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "hinge",
      label: "Left hinge mount",
      ...at("hinge"),
      role: "Each hinge bolts into threaded posts in the case. If the hinge gets stiff, opening the lid pulls on those posts.",
      clue: "Two threaded posts have broken out of the plastic. The hinge itself feels very stiff.",
      relevant: true,
    },
    {
      id: "cable",
      label: "Display cable",
      ...at("ports"),
      role: "The display cable passes the hinge on its way to the screen.",
      clue: "The cable has been pinched by the loose hinge. Its outer layer is worn through at one spot.",
      relevant: true,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Powers the laptop when unplugged.",
      clue: "Battery is not swollen and isn't pushing on the case.",
      relevant: false,
    },
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "Removes heat from the CPU.",
      clue: "Fan is fine. Not related.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you take the case apart, what do you do?",
    hint: "Remove power, and think about the broken plastic.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug, disconnect the battery, and stop opening and closing the lid",
        correct: true,
        feedback: "Correct. No power, and no more stress on the broken mount or the damaged cable.",
      },
      {
        id: "b",
        text: "Open and close the lid several times to hear where it cracks",
        correct: false,
        feedback: "Every cycle tears the mount further and wears the display cable.",
      },
      {
        id: "c",
        text: "Leave it powered so you can watch the flicker",
        correct: false,
        feedback: "A worn display cable with power on can short. Power down first.",
      },
      {
        id: "d",
        text: "Squeeze the gap shut by hand",
        correct: false,
        feedback: "Forcing the case can crack it further and pinch the cable.",
      },
    ],
    explanation:
      "Power down, unplug, disconnect the battery, and avoid moving the lid more than needed. Moving a broken hinge spreads the damage.",
  },
  diagnosis: {
    prompt: "What is causing the wobble and cracking?",
    hint: "A stiff hinge pulls on whatever holds it.",
    choices: [
      {
        id: "a",
        text: "A stiff hinge has broken its mounting posts out of the case",
        correct: true,
        feedback: "Correct. The stiff hinge pulls on the posts every time the lid opens, and the plastic gave way. The loose hinge then pinched the cable.",
      },
      {
        id: "b",
        text: "A swollen battery",
        correct: false,
        feedback: "The battery was flat and not pushing on the case.",
      },
      {
        id: "c",
        text: "A failing graphics chip",
        correct: false,
        feedback: "The flicker comes from the pinched cable, a side effect of the hinge damage.",
      },
      {
        id: "d",
        text: "Loose screws on the bottom cover",
        correct: false,
        feedback: "The screws are fine. The posts they thread into have broken.",
      },
    ],
    explanation:
      "Hinges stiffen over time. When the lid is opened from one corner, the stiff hinge levers against its mounting posts until they break out. The loose hinge can then crush the display and antenna cables.",
  },
  repair: {
    prompt: "What is the lasting repair?",
    hint: "Fix the mount, the hinge, and the cable it damaged.",
    choices: [
      {
        id: "a",
        text: "Replace the broken case part (or rebuild the posts properly), replace the stiff hinge, and replace the damaged display cable",
        correct: true,
        feedback: "Correct. All three parts of the failure are fixed, so it won't come back next week.",
      },
      {
        id: "b",
        text: "Superglue the hinge to the case",
        correct: false,
        feedback: "Glue fails under hinge forces, can drip onto the board, and blocks future repairs.",
      },
      {
        id: "c",
        text: "Tighten the hinge screws harder",
        correct: false,
        harmful: true,
        feedback: "The posts are already broken. Overtightening strips what's left and can crack the case further.",
      },
      {
        id: "d",
        text: "Only replace the display cable",
        correct: false,
        feedback: "The broken mount would pinch the new cable again.",
      },
    ],
    explanation:
      "Fix the root cause and the damage: new hinge (or freed-up hinge), a sound mount (case part or properly rebuilt posts), and a new cable if it was damaged. Advise opening the lid from the middle.",
  },
  scoring: SCORING,
  summary: [
    "Stiff hinges break their mounts when the lid is opened from a corner.",
    "Stop moving a broken hinge: each cycle spreads the damage.",
    "Check cables near the hinge for pinching.",
    "Fix the hinge, the mount, and any damaged cable together.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Display test",
      heading: "Flicker events",
      value: "14",
      unit: "per hour",
      pill: "When the lid moves",
      tone: "bad",
      trend: "unstable",
      clock: "09:30",
    },
    fixed: {
      window: "Display test",
      heading: "Flicker events",
      value: "0",
      unit: "per hour",
      pill: "Stable",
      tone: "ok",
      trend: "flat",
      clock: "17:10",
    },
  },
  readout: {
    fault: [
      { icon: "hinge", label: "Lid", value: "Wobbles", tone: "bad" },
      { icon: "display", label: "Screen", value: "Flickers", tone: "neutral" },
    ],
    fixed: [
      { icon: "hinge", label: "Lid", value: "Firm", tone: "ok" },
      { icon: "display", label: "Screen", value: "Stable", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and the hinge is breaking. Make it safe before you take it apart.",
  postRepair: {
    fixed: "Post-repair test: the lid opens smoothly and holds its angle, and the screen stays stable at every position.",
    unresolved: "The hinge mount is still broken and the cable will keep wearing. Review the explanation above.",
  },
};
