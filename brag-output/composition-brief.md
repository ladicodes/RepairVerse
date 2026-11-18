# Hyperframes Composition Brief: RepairVerse

## Objective
Create a short launch-style brag video for RepairVerse.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape, 1920x1080, 30 fps
- Duration: 23.6 seconds

## Source Material
- Project root: /home/kingvic/Documents/RepairVerse
- Primary files read:
  - `app/page.tsx`
  - `components/landing/HeroCopy.tsx`
  - `components/simulator/*`
  - `data/missions.ts`
  - `app/globals.css`
  - `components/ui/Logo.tsx`
  - `README.md`
- Product footage: `assets/walkthrough.mp4`. This is a real screencast of the running production build, a full Mission 001 run with a visible cursor.
- Product name: RepairVerse
- Tagline: "Learn real-world repair skills in 3D"
- Key UI to show: the opened 3D laptop with numbered hotspots, the clue panel, the repair answer card turning green, the 61°C readout, and the 100/100 score
- Copy that must appear verbatim:
  - "Learn real-world repair skills in 3D"
  - "Start repair mission"
  - "Free, no account, about 6 minutes."

## Creative Direction
- Tone preset: polished
- Creative direction: a technician's bench film, service-manual calm
- Angle: watch a learner fix a real fault in the real app, from 96°C to 61°C to 100/100
- Hook: the real laptop screen reading 96 °C, beside "Shuts down after 15 minutes."
- Outro: the mark is drawn, then the CTA "Start repair mission"
- Avoid:
  - Generic SaaS language
  - Abstract filler
  - Dark void, glow, gradients
  - Claiming the 3D model is Lux3D output (the export is pending)

## Visual Identity
- Background #f6f7f9, Text #080d1b, Accent #22d3ee (interactive only), accent-ink #0e7490, heat #c2410c, ok #047857
- Display and body: Geist (the app's own woff2 is copied in). Numbers: Geist Mono.

## Storyboard
1. Ticket — 3.70s — 96 °C laptop screen in a window, plus "Shuts down after 15 minutes."
2. Reveal — 2.64s — mark, "RepairVerse", "Learn real-world repair skills in 3D"
3. Inspect — 6.31s — real hotspot click, then the clue panel
4. Decide — 5.26s — real answer click, then the 61°C readout
5. Score — 2.69s — 100/100
6. End card — 3.00s — mark, CTA, note

## Audio
- Role: warm bed with sparse accents
- Music: assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3, volume about 0.5, fade-out 1.2s
- Music cue guidance: bundled preset. Beat-lock the scene cuts at 3.70, 6.34, 12.65 and 17.91.
- Audio-reactive treatment: subtle. RMS drives the depth of the window and button shadows.
- SFX: clicks on the real cursor clicks (source 85.4s fan hotspot, 146.6s repair answer), a soft impact on the reveal and score, and a bell on the logo dot
- Exact SFX choice: picked from sfx-analysis.md, low HF risk
