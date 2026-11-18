import type { Mission } from "../missions";
import { at } from "../parts";
import { DEVICE, LAPTOP_MODEL, SCORING } from "./common";

export const failingSsd: Mission = {
  id: "004",
  code: "M-004",
  title: "Save the data on a failing drive",
  short: "Slow, freezing, file errors",
  category: "Storage",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 7,
  ticket: {
    customer: "Freelance photographer",
    received: "Bench 05 · Data priority",
    symptom:
      "A photographer's laptop freezes for seconds at a time, takes minutes to start, and some photos won't open. They have no recent backup. Find the cause and protect their data.",
    notes: [
      "Freezes when opening large files",
      "Startup takes about 3 minutes",
      "Some photos show as corrupted",
      "Last backup was eight months ago",
    ],
  },
  problem: "System freezes and files are corrupted. No recent backup.",
  objectives: [
    "Put the customer's data first",
    "Read drive health (SMART) warnings",
    "Rule out memory and heat with evidence",
    "Replace a failing drive without losing data",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "ssd",
      label: "SSD",
      ...at("ssd"),
      role: "The solid-state drive stores the operating system and every file. Its controller tracks its own health (SMART data).",
      clue: "SMART shows a critical warning: media errors are rising and spare blocks are almost used up.",
      relevant: true,
    },
    {
      id: "board",
      label: "System log",
      ...at("board"),
      role: "The operating system logs hardware errors. Storage errors appear when reads and writes fail.",
      clue: "The log shows repeated disk read errors and retries at the times the laptop froze.",
      relevant: true,
    },
    {
      id: "ram",
      label: "Memory (RAM)",
      ...at("ram"),
      role: "Holds running programs. Faulty memory can also cause freezes and crashes.",
      clue: "A full memory test passes with zero errors. Memory is not the cause.",
      relevant: false,
    },
    {
      id: "fan",
      label: "Cooling fan",
      ...at("fan"),
      role: "Keeps parts cool. Overheating can cause slowdowns.",
      clue: "Temperatures are normal and the fan is clean.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "The drive may be failing and there is no recent backup. What do you do first?",
    hint: "On a failing drive, every hour of use is a risk to the files.",
    choices: [
      {
        id: "a",
        text: "Back up the customer's important files right away, then shut down and unplug before opening",
        correct: true,
        feedback: "Correct. The data is the most valuable part. Copy it while the drive still reads, then make the laptop safe.",
      },
      {
        id: "b",
        text: "Run a full disk repair scan first",
        correct: false,
        feedback: "Long scans stress a failing drive and can cost you the data. Back up first.",
      },
      {
        id: "c",
        text: "Reinstall the operating system to speed it up",
        correct: false,
        feedback: "Reinstalling wipes data and writes heavily to a dying drive. Never do this before a backup.",
      },
      {
        id: "d",
        text: "Open the laptop while it runs to check the drive",
        correct: false,
        feedback: "Working inside a running laptop risks shorts. And the data still isn't safe.",
      },
    ],
    explanation:
      "Data first: copy the most important files to another drive while the failing one still reads. Then shut down, unplug, and disconnect the battery before you open the case.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of the freezes and corrupted files?",
    hint: "Two of your clues come from the same part.",
    choices: [
      {
        id: "a",
        text: "The SSD is failing",
        correct: true,
        feedback: "Correct. SMART warnings plus disk read errors at the time of each freeze point at the drive.",
      },
      {
        id: "b",
        text: "Faulty memory",
        correct: false,
        feedback: "The memory test passed with zero errors. Your evidence rules it out.",
      },
      {
        id: "c",
        text: "Overheating",
        correct: false,
        feedback: "Temperatures were normal. Overheating doesn't corrupt photos either.",
      },
      {
        id: "d",
        text: "A virus",
        correct: false,
        feedback: "Malware can slow a computer, but it doesn't raise SMART media error counts.",
      },
    ],
    explanation:
      "When a drive struggles to read worn-out blocks, it retries, and the system freezes while it waits. Files stored on bad blocks become corrupted. SMART data confirms the drive is wearing out.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "Protect the data, then replace the failing part.",
    choices: [
      {
        id: "a",
        text: "Copy or clone the data, install a new SSD of the correct type, then restore and verify the files",
        correct: true,
        feedback: "Correct. The customer keeps their files and gets a healthy drive. Check the new drive's SMART status too.",
      },
      {
        id: "b",
        text: "Format the drive and reinstall everything on it",
        correct: false,
        harmful: true,
        feedback: "That erases the files and keeps using a drive that is failing. The customer loses everything.",
      },
      {
        id: "c",
        text: "Run defragmentation several times",
        correct: false,
        harmful: true,
        feedback: "Defragmenting writes heavily to the drive. It doesn't help an SSD and speeds up the failure.",
      },
      {
        id: "d",
        text: "Add more memory",
        correct: false,
        feedback: "Memory was fine. The drive would keep failing and corrupting files.",
      },
    ],
    explanation:
      "Recover the data, replace the drive with a compatible one (check M.2 size and interface), restore, and verify. Recommend a regular backup so a future failure isn't a crisis.",
  },
  scoring: SCORING,
  summary: [
    "On a failing drive, back up before doing anything else.",
    "SMART warnings and disk errors in the log point at the drive.",
    "Rule out memory and heat with tests, not guesses.",
    "Replace the drive, restore the data, and set up regular backups.",
  ],
  visual: { dusty: false, hot: false },
  screen: {
    fault: {
      window: "Drive health",
      heading: "SMART status",
      value: "Caution",
      pill: "Media errors rising",
      tone: "bad",
      trend: "unstable",
      clock: "10:21",
    },
    fixed: {
      window: "Drive health",
      heading: "SMART status",
      value: "Good",
      pill: "Healthy",
      tone: "ok",
      trend: "flat",
      clock: "17:40",
    },
  },
  readout: {
    fault: [
      { icon: "drive", label: "Drive", value: "SMART warning", tone: "bad" },
      { icon: "power", label: "Startup", value: "3 min", tone: "neutral" },
    ],
    fixed: [
      { icon: "drive", label: "Drive", value: "Healthy", tone: "ok" },
      { icon: "power", label: "Startup", value: "15 s", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on and the drive might fail at any time. Decide what to do first.",
  postRepair: {
    fixed: "Post-repair test: the new SSD reports healthy, startup takes 15 seconds, and the restored photos open.",
    unresolved: "The failing drive is still in use and the files are at risk. Review the explanation above.",
  },
};

export const ramUpgrade: Mission = {
  id: "008",
  code: "M-008",
  title: "Fix the laptop that won't start after a RAM upgrade",
  short: "Black screen after upgrade",
  category: "Memory",
  device: DEVICE,
  difficulty: "Beginner",
  durationMin: 5,
  ticket: {
    customer: "Home user",
    received: "Bench 03 · Intake",
    symptom:
      "A customer added more memory to their laptop at home. Now the power light comes on and the fan spins, but the screen stays black. Find out why.",
    notes: [
      "Worked fine before the upgrade",
      "Power light and fan come on",
      "Screen stays black",
      "Caps Lock light blinks a pattern",
    ],
  },
  problem: "Laptop powers on but shows nothing after a memory upgrade.",
  objectives: [
    "Use what changed last as your first lead",
    "Protect components from static electricity",
    "Recognize a memory module that isn't seated",
    "Install a SO-DIMM correctly",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "ram",
      label: "Memory (RAM)",
      ...at("ram"),
      role: "A SO-DIMM module plugs into a slot at an angle and is held flat by two metal clips. The laptop can't start without working memory.",
      clue: "The module sits at an angle. One clip isn't locked and some gold contacts are still visible outside the slot.",
      relevant: true,
    },
    {
      id: "board",
      label: "Motherboard",
      ...at("board"),
      role: "Runs a power-on self test. When memory fails the test, many laptops blink a light or beep a pattern instead of showing a picture.",
      clue: "The Caps Lock light blinks the manufacturer's memory error pattern. The board itself looks undamaged.",
      relevant: true,
    },
    {
      id: "ssd",
      label: "SSD",
      ...at("ssd"),
      role: "Stores the operating system. A missing drive shows an error message, not a black screen.",
      clue: "Drive is seated and secured. Not related.",
      relevant: false,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Powers the laptop when unplugged.",
      clue: "Battery charges and powers the laptop. Not related.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "You are about to touch the memory slot. What do you do first?",
    hint: "Memory chips are sensitive to static electricity.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug, disconnect the battery, and ground yourself before touching the module",
        correct: true,
        feedback: "Correct. No power, and no static. An anti-static wrist strap or touching bare grounded metal helps.",
      },
      {
        id: "b",
        text: "Leave it on so you can see when it starts working",
        correct: false,
        feedback: "Never add or move memory with power applied. It can destroy the module and the board.",
      },
      {
        id: "c",
        text: "Work on a carpet in wool socks",
        correct: false,
        feedback: "Carpets and wool build up static charge, which can damage memory chips.",
      },
      {
        id: "d",
        text: "Touch the gold contacts to clean them with your fingers",
        correct: false,
        feedback: "Skin oil and static can harm the contacts. Hold modules by their edges.",
      },
    ],
    explanation:
      "Power off, unplug, disconnect the battery, and discharge static before handling memory. Hold modules by the edges.",
  },
  diagnosis: {
    prompt: "What is the most likely cause?",
    hint: "What changed right before the problem started?",
    choices: [
      {
        id: "a",
        text: "The new memory module isn't fully seated",
        correct: true,
        feedback: "Correct. A tilted module with an open clip can't make full contact, so the memory test fails.",
      },
      {
        id: "b",
        text: "The screen is broken",
        correct: false,
        feedback: "The blink pattern means the laptop stopped before it tried to show a picture. The screen isn't the issue.",
      },
      {
        id: "c",
        text: "The SSD has failed",
        correct: false,
        feedback: "A missing drive gives an error message, not a black screen with a memory blink code.",
      },
      {
        id: "d",
        text: "The battery is worn",
        correct: false,
        feedback: "The laptop powers on, so it is getting power. The battery isn't the cause.",
      },
    ],
    explanation:
      "When a fault appears right after a change, check the change first. A memory module that isn't fully inserted is the most common cause of a black screen after an upgrade. Incompatible modules are the next thing to check.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "SO-DIMMs go in at an angle, then press down.",
    choices: [
      {
        id: "a",
        text: "Remove the module, check it matches the laptop's spec, insert it at an angle until fully seated, and press down until both clips lock",
        correct: true,
        feedback: "Correct. Then reconnect the battery and confirm the full memory amount shows up.",
      },
      {
        id: "b",
        text: "Push the module flat without lining up the notch",
        correct: false,
        harmful: true,
        feedback: "Forcing a module the wrong way can crack it or break the slot.",
      },
      {
        id: "c",
        text: "Replace the screen",
        correct: false,
        feedback: "The screen is fine. The laptop would still stop at the memory test.",
      },
      {
        id: "d",
        text: "Reinstall the operating system",
        correct: false,
        feedback: "The laptop never reaches the operating system. Software can't fix this.",
      },
    ],
    explanation:
      "Line up the notch, insert at about 30 degrees until the gold contacts disappear, then press down until the clips click. Check the module type (DDR generation, speed) matches what the laptop supports.",
  },
  scoring: SCORING,
  summary: [
    "When something breaks right after a change, check that change first.",
    "Blink or beep codes point to which part failed the start-up test.",
    "Handle memory with no power and no static.",
    "SO-DIMMs go in at an angle and click down under two clips.",
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
      window: "System information",
      heading: "Installed memory",
      value: "16",
      unit: "GB",
      pill: "All memory detected",
      tone: "ok",
      trend: "none",
      clock: "12:10",
    },
  },
  readout: {
    fault: [
      { icon: "display", label: "Screen", value: "Black", tone: "bad" },
      { icon: "keyboard", label: "Caps Lock", value: "Blinking", tone: "neutral" },
    ],
    fixed: [
      { icon: "display", label: "Screen", value: "Starts normally", tone: "ok" },
      { icon: "memory", label: "Memory", value: "16 GB", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is powered on with a black screen. Make it safe before you reach for the memory.",
  postRepair: {
    fixed: "Post-repair test: the laptop starts normally and reports all 16 GB of memory.",
    unresolved: "The screen is still black. The memory still isn't making contact. Review the explanation above.",
  },
};

export const noBootDevice: Mission = {
  id: "012",
  code: "M-012",
  title: "Fix \"No bootable device\"",
  short: "No bootable device found",
  category: "Storage",
  device: DEVICE,
  difficulty: "Intermediate",
  durationMin: 6,
  ticket: {
    customer: "Travelling sales rep",
    received: "Bench 01 · Intake",
    symptom:
      "After a bumpy flight, a laptop shows \"No bootable device\" when it starts. The customer says it was fine before the trip. Find out what happened.",
    notes: [
      "Shows a black screen with \"No bootable device\"",
      "Checked luggage, rough handling",
      "A small rattle when tilted",
      "No changes to settings",
    ],
  },
  problem: "Laptop can't find its drive after being knocked around in transit.",
  objectives: [
    "Read what a boot error message tells you",
    "Check the firmware to see which drives are detected",
    "Find a physical cause for a missing drive",
    "Secure the drive correctly",
  ],
  model: LAPTOP_MODEL,
  hotspots: [
    {
      id: "ssd",
      label: "SSD",
      ...at("ssd"),
      role: "The M.2 SSD plugs into a slot at an angle and is held flat by a single small screw.",
      clue: "The SSD has lifted out of its slot. Its retaining screw is missing.",
      relevant: true,
    },
    {
      id: "board",
      label: "Firmware (BIOS/UEFI)",
      ...at("board"),
      role: "The firmware lists the drives it can see and picks one to start from.",
      clue: "The firmware storage page shows no drive at all. Boot order settings are unchanged.",
      relevant: true,
    },
    {
      id: "ram",
      label: "Memory (RAM)",
      ...at("ram"),
      role: "Holds running programs. Faulty memory usually stops the laptop before any message appears.",
      clue: "Memory is seated and both clips are locked.",
      relevant: false,
    },
    {
      id: "battery",
      label: "Battery",
      ...at("battery"),
      role: "Powers the laptop when unplugged.",
      clue: "Battery is fine. The laptop powers on and reaches the firmware.",
      relevant: false,
    },
  ],
  minInspections: 3,
  safety: {
    prompt: "Before you open the case, what do you do?",
    hint: "Remove every power source.",
    choices: [
      {
        id: "a",
        text: "Shut down, unplug the charger, disconnect the battery, and ground yourself",
        correct: true,
        feedback: "Correct. Now you can safely reseat parts on the board.",
      },
      {
        id: "b",
        text: "Shake the laptop to find the rattle while it's on",
        correct: false,
        feedback: "Shaking a powered laptop can short a loose screw across the board.",
      },
      {
        id: "c",
        text: "Open it while it's on so the drive spins",
        correct: false,
        feedback: "SSDs don't spin, and working on a powered board is unsafe.",
      },
      {
        id: "d",
        text: "Skip the battery. It's only a drive",
        correct: false,
        feedback: "The board is live while the battery is connected. Disconnect it before touching any part.",
      },
    ],
    explanation:
      "Power down, unplug, disconnect the battery, and discharge static before reseating parts. A loose screw inside a powered laptop can short the board.",
  },
  diagnosis: {
    prompt: "What is the most likely cause of \"No bootable device\"?",
    hint: "The firmware can't see a drive. Why might that be after rough handling?",
    choices: [
      {
        id: "a",
        text: "The SSD has come loose from its slot",
        correct: true,
        feedback: "Correct. With the screw gone, the drive lifted out of the slot and the firmware can't see it. The rattle was the screw.",
      },
      {
        id: "b",
        text: "The boot order was changed",
        correct: false,
        feedback: "Boot order was unchanged, and the firmware doesn't list any drive to choose from.",
      },
      {
        id: "c",
        text: "The memory has failed",
        correct: false,
        feedback: "The laptop reached the firmware and printed a message. Memory was seated correctly.",
      },
      {
        id: "d",
        text: "The operating system is corrupted",
        correct: false,
        feedback: "A corrupted system still shows up as a drive in the firmware. Here no drive appears at all.",
      },
    ],
    explanation:
      "\"No bootable device\" means the firmware found nothing to start from. If the firmware doesn't list the drive at all, check the physical connection before suspecting software.",
  },
  repair: {
    prompt: "What is the right repair?",
    hint: "Find the loose screw first, then reseat the drive.",
    choices: [
      {
        id: "a",
        text: "Remove the loose screw from the case, reseat the SSD fully, secure it with the correct screw, and check the firmware sees it",
        correct: true,
        feedback: "Correct. A stray screw inside can short the board, so find it first. Then the drive is detected again.",
      },
      {
        id: "b",
        text: "Reinstall the operating system on a new drive",
        correct: false,
        feedback: "The original drive is probably fine. You'd waste a part and the customer's data.",
      },
      {
        id: "c",
        text: "Hold the drive down with tape instead of a screw",
        correct: false,
        harmful: true,
        feedback: "Tape doesn't hold firmly and can insulate heat. The drive will come loose again.",
      },
      {
        id: "d",
        text: "Change the boot order",
        correct: false,
        feedback: "There is no drive to select until it's reconnected.",
      },
    ],
    explanation:
      "Remove the loose screw, insert the M.2 drive at an angle until fully seated, press it flat, and secure it with the correct standoff screw. Then confirm the firmware lists the drive.",
  },
  scoring: SCORING,
  summary: [
    "\"No bootable device\" means the firmware found nothing to start from.",
    "Check the firmware's drive list before blaming software.",
    "A rattle after a knock can be a loose screw: remove it before powering on.",
    "M.2 drives need their retaining screw to stay connected.",
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
      lines: ["No bootable device -- insert boot disk and press any key"],
    },
    fixed: {
      window: "Firmware setup",
      heading: "Boot drive",
      value: "Detected",
      pill: "NVMe SSD",
      tone: "ok",
      trend: "none",
      clock: "08:55",
    },
  },
  readout: {
    fault: [
      { icon: "drive", label: "Drive", value: "Not detected", tone: "bad" },
      { icon: "display", label: "Screen", value: "Boot error", tone: "neutral" },
    ],
    fixed: [
      { icon: "drive", label: "Drive", value: "Detected", tone: "ok" },
      { icon: "display", label: "Screen", value: "Starts normally", tone: "neutral" },
    ],
  },
  safetyIntro: "The laptop is on, showing a boot error. Make it safe before you open it.",
  postRepair: {
    fixed: "Post-repair test: the firmware lists the SSD and the laptop starts normally.",
    unresolved: "The drive still isn't detected. The laptop shows the same error. Review the explanation above.",
  },
};
