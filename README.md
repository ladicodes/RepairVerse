# RepairVerse

Learn real-world repair skills in 3D. Built for the Aholo Global 3D AI Hackathon.

RepairVerse is an interactive repair simulator. In Mission 001 you take a ticket for an overheating HP-style laptop, make it safe, inspect it in 3D, diagnose the fault, and choose a repair. Every decision is scored and explained. No account needed.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks:

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest: mission engine and scoring
npm run build      # production build
```

## Pages

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/how-it-works` | Stages, scoring rules, safety |
| `/missions` | Mission 001 brief, with the live 3D parts explorer |
| `/technology` | The Aholo Lux3D pipeline and who does what |
| `/educators` | Classroom use, sample lesson, FAQ |
| `/mission/001` | The simulator: briefing, safety, inspection, diagnosis, repair |
| `/results?mission=001` | Score, answer review, clues, learning summary, retry |

Unknown mission ids (for example `/mission/999`) render the 404 page.

## Aholo Lux3D integration

Lux3D generates the laptop's exterior model. RepairVerse adds everything interactive: hotspots, internal cooling illustrations, mission steps, feedback, and scoring.

**Status: the Lux3D export is not in the repo yet.** Until it is, the viewer shows a procedural placeholder laptop, and every badge and attribution on the site says so. Nothing is labeled as Lux3D output until the file below is added.

To add the generated model:

1. Generate the laptop in Lux3D with the prompt in `data/missions.ts` (`model.prompt`).
2. Export it as GLB. Keep textures at 2K or below so it loads fast.
3. Save it as `public/models/laptop.glb`.
4. List it in `public/models/manifest.json`:
   ```json
   { "lux3d": ["laptop.glb"] }
   ```
5. Reload. The viewer auto-centers and scales the model to the hotspot layout. If it's rotated wrong, set `model.rotation` (radians) in `data/missions.ts`. If hotspots don't line up with the new shell, adjust each hotspot's `position` there.

Only list files in the manifest that actually came from Lux3D. If the file fails to load, the viewer falls back to the placeholder and shows "Model failed to load".

## How it's built

- Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- three.js, React Three Fiber, Drei for the 3D viewer
- Zustand with `localStorage` persistence (progress survives a refresh)
- No backend, database, or auth

```
app/                 routes
components/
  landing/           marketing pages, hero, illustrations, parts explorer
  simulator/         DeviceViewer, Hotspots, QuestionCard, InspectionPanel, MissionRunner
  three/             laptop shells (Lux3D GLB or placeholder), internals, textures
  results/           results report
data/missions.ts     mission content: ticket, hotspots, questions, scoring
lib/mission-engine.ts  stage machine: transitions, gates, answer locking, saved-state validation
lib/scoring.ts       100-point deterministic scoring
store/mission-store.ts persisted run state
public/models/       Lux3D exports + manifest.json
```

### Mission rules

Stages: `NOT_STARTED → INTRODUCTION → SAFETY_CHECK → DEVICE_INSPECTION → DIAGNOSIS → REPAIR_DECISION → COMPLETED`.

- A stage advances only when its requirement is met (an answer, or at least 3 inspected parts).
- The first answer to each question is locked. Repeating an action never adds points.
- Scoring: safety 20, inspection 4 per unique part (max 20), diagnosis 30, repair 30.
- Saved progress is validated on load. Malformed or forged state resets to a fresh run.
- Retry resets the stage and the score.

## Design

Light theme, cool grays, one accent (cyan) for interactive callouts, no gradients or glows. The visual idea is a technician's service manual: numbered callouts, work orders, part tables. Tokens live in `app/globals.css`.

## Safety note

RepairVerse is a simulator for practicing decisions. It does not replace hands-on training or professional supervision. Scores are learning feedback, not a certification.
