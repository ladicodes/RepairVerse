<div align="center">

# 🛠️ RepairVerse

### Learn Real-World Repair Skills in 3D

An interactive 3D learning platform where students and aspiring technicians practice diagnosing and repairing everyday devices, without needing the device, the tools, or a workshop.

[![Aholo Global 3D AI Hackathon](https://img.shields.io/badge/Aholo-Global%203D%20AI%20Hackathon-2F7BFF?style=for-the-badge)](#-hackathon)
[![Built with Aholo Lux3D](https://img.shields.io/badge/Built%20with-Aholo%20Lux3D-8B5CF6?style=for-the-badge)](#-powered-by-aholo-lux3d)
[![Status: Pre-development](https://img.shields.io/badge/Status-Pre--development-F59E0B?style=for-the-badge)](#-roadmap)

</div>

---

## 📌 At a Glance

| | |
|---|---|
| **What** | A browser-based simulator for practicing device repair in 3D |
| **Who** | Students, aspiring technicians, and self-taught learners |
| **How** | Explore a 3D device, diagnose the fault, choose repair actions, get feedback |
| **3D assets** | Generated with **Aholo Lux3D** |
| **First mission** | Fix the Overheating Laptop |
| **Status** | Documentation and planning. The application has not been built yet. |

---

## ❗ The Problem

Repair skills are learned by doing. Knowing how to troubleshoot a laptop, phone, or appliance comes from opening it up, looking at the parts, and working out what is wrong.

That kind of practice is hard to get:

- **Devices cost money.** Learners rarely have spare hardware they can take apart, and mistakes on a working device are expensive.
- **Tools and workshops are not always available.** Many students don't have a lab, a mentor, or a training center nearby.
- **Videos only go so far.** A tutorial shows someone else doing the repair. You can't inspect the device yourself, try a step, or learn from a wrong choice.

The result is a gap between *watching* a repair and *doing* one. Learners without access to equipment have no safe place in between to practice.

## 💡 Our Solution

RepairVerse fills that gap with interactive 3D repair challenges.

Learners open a 3D model of a real-world device, rotate and inspect it, and work through a fault the way a technician would: observe the symptom, investigate the likely components, decide what is wrong, and choose how to fix it. Every decision gets immediate feedback, so learners understand *why* an action is right or wrong.

Nothing breaks, nothing costs money, and the same challenge can be repeated until the reasoning sticks.

---

## 🧭 How It Works

```text
Choose a device → Explore in 3D → Inspect components → Diagnose the fault → Select repair actions → Get feedback & score
```

| Step | What the learner does |
|:---:|---|
| **1. Choose a device** | Pick a device and a repair mission. |
| **2. Explore its 3D model** | Rotate, zoom, and look at the device from every angle. |
| **3. Inspect components** | Click hotspots to learn what each part does and what condition it is in. |
| **4. Diagnose the fault** | Use the symptoms and what they found to decide what is most likely wrong. |
| **5. Select repair actions** | Choose from possible fixes, some correct and some not. |
| **6. Receive feedback and scores** | See why each choice was right or wrong, and get a score for the mission. |

## 💻 First Mission: Fix the Overheating Laptop

The first planned simulation starts with a common complaint: **a laptop that keeps overheating and slowing down under load.**

**Scenario**

1. The learner gets the symptom: the laptop runs hot, the fan is loud, and performance drops.
2. They explore the 3D laptop and open up its cooling system.
3. They inspect the fan, heatsink, vents, and processor area through hotspots.
4. They choose the most likely cause from several options (for example, dust blocking the fan and vents).
5. They pick a repair action and see whether it solves the problem.

**Learning objectives**

By the end of the mission, a learner should be able to:

- Name the main parts of a laptop cooling system and explain what each one does.
- Connect a symptom (overheating) to its likely causes.
- Rule out unlikely causes instead of guessing.
- Choose a sensible first repair action and explain why.

> [!NOTE]
> Fault scenarios and repair guidance in RepairVerse are written by the project team for learning purposes. They are simplified and are not a substitute for manufacturer service documentation.

## ✨ Features

Planned for the MVP:

| Feature | Description |
|---|---|
| 🧊 **Interactive 3D exploration** | Rotate, zoom, and pan around a device model in the browser. |
| 📍 **Component hotspots** | Clickable markers on key parts with short explanations. |
| 🔍 **Diagnostic challenges** | Symptom-driven missions where learners work out the fault. |
| 🧩 **Guided repair decisions** | Multiple-choice repair actions with hints when needed. |
| ⚡ **Immediate feedback** | Every choice is explained right away. |
| 🏆 **Gamified scoring** | Points for correct reasoning, fewer for wrong turns and hints. |
| 🌐 **Browser-based learning** | No install. Runs on any modern browser. |

---

## 🔮 Powered by Aholo Lux3D

Every device in RepairVerse starts as an **Aholo Lux3D** asset. Lux3D gives us the 3D models; RepairVerse turns them into learning experiences.

```text
 Prompt or reference image
            │
            ▼
   ┌─────────────────┐
   │   Aholo Lux3D   │   generates the 3D device model
   └────────┬────────┘
            ▼
   ┌─────────────────┐
   │  3D web viewer  │   React Three Fiber scene in the browser
   └────────┬────────┘
            ▼
   ┌─────────────────┐
   │ Learning layer  │   hotspots · fault scenarios · feedback · scoring
   └────────┬────────┘
            ▼
   Reused across new missions and devices
```

### 1. Generating device models

We use Lux3D to generate a 3D model of each device from a **text prompt** or a **reference image** (for example, "a modern 15-inch laptop"). This replaces hand-modeling each device, which is what lets a small team build missions for many different devices.

### 2. Importing models into the 3D viewer

The generated model is exported, converted to a web-friendly format such as glTF/GLB if needed, and added to the project's model assets. The viewer loads it into a React Three Fiber scene with lighting and camera controls so learners can rotate and zoom around the device.

### 3. Adding interactive hotspots

Lux3D produces the visual model. **The RepairVerse team adds the interactivity on top:** we place hotspot markers at chosen positions on the model and attach information to each one, such as the component's name, its role, and its condition in the current scenario. Where a mission needs internal parts to be visible, those are designed or arranged by the team for teaching purposes.

### 4. Guided repair challenges and scoring

Each mission is defined as data written by the team: the symptom, the hotspots involved, the possible causes, the repair options, and the feedback for each choice. A mission engine reads that definition, tracks the learner's progress, and calculates a score based on correct diagnoses, wrong attempts, and hints used.

### What Lux3D does and doesn't do

| Aholo Lux3D provides | RepairVerse adds |
|---|---|
| 3D device models generated from prompts or reference images | Hotspot placement and component information |
| The visual base for every mission | Fault scenarios, repair options, and explanations |
| Assets that can be reused across missions | Mission logic, feedback, and scoring |

> [!IMPORTANT]
> Lux3D generates the visual 3D asset. It does not create repair instructions, fault logic, or mechanically accurate internal components. All teaching content in RepairVerse is authored by the project team.

---

## 🧰 Tech Stack

> [!NOTE]
> This is the **planned** stack. The application has not been initialized, so **no dependencies are installed yet** and there is no `package.json` in the repository.

| Layer | Technology | Purpose | Status |
|---|---|---|---|
| Framework | [Next.js](https://nextjs.org/) | App routing and pages | Planned |
| Language | [TypeScript](https://www.typescriptlang.org/) | Type-safe application code | Planned |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | UI styling | Planned |
| 3D rendering | [Three.js](https://threejs.org/) | WebGL rendering | Planned |
| React 3D | [React Three Fiber](https://r3f.docs.pmnd.rs/) | Three.js scenes as React components | Planned |
| 3D helpers | [Drei](https://github.com/pmndrs/drei) | Camera controls, model loading, HTML overlays | Planned |
| 3D assets | Aholo Lux3D | Device model generation | Planned |
| Hosting | [Vercel](https://vercel.com/) | Deployment | Planned |

## 🗂️ Project Structure

Proposed layout once the app is initialized (subject to change):

```text
RepairVerse/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   └── missions/
│       └── [missionId]/
│           └── page.tsx            # Mission player
├── components/
│   ├── viewer/                     # 3D canvas, camera controls, model loader
│   ├── hotspots/                   # Hotspot markers and info panels
│   └── mission/                    # Steps, choices, feedback, score UI
├── lib/
│   ├── mission-engine/             # Mission state, rules, and scoring
│   └── types.ts                    # Shared types (Mission, Hotspot, Action)
├── data/
│   └── missions/
│       └── overheating-laptop.json # First mission definition
├── public/
│   └── models/                     # Lux3D-generated device models (.glb)
└── README.md
```

Currently, the repository contains only this `README.md`.

## 🚀 Getting Started

> [!WARNING]
> The application has not been set up yet. There is nothing to install or run at this stage. Setup steps, scripts, and any required environment variables will be documented here once the Next.js project is initialized.

To get a copy of the repository:

```bash
git clone https://github.com/ladicodes/RepairVerse.git
cd RepairVerse
```

**Planned prerequisites:** a current LTS version of [Node.js](https://nodejs.org/) and a package manager such as npm.

## 📍 Roadmap

- [x] Project documentation
- [ ] Application foundation (Next.js, TypeScript, Tailwind CSS)
- [ ] Lux3D model generation for the first device
- [ ] 3D viewer
- [ ] Interactive hotspots
- [ ] Mission engine
- [ ] Feedback and scoring
- [ ] Testing
- [ ] Deployment

**After the MVP:** more laptop faults, phones, household appliances, and additional repair scenarios.
