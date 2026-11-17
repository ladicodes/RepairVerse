import clsx from "clsx";
import { Check, Play, Plug, Thermometer, X } from "lucide-react";

/* Small product snippets and service-manual diagrams for the landing page.
   All drawn with tokens: no gradients, no glows. */

export function TutorialMock() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-video bg-gray-700">
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface/90">
            <Play className="ml-1 size-6 fill-fg text-fg" />
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
          <div className="h-1 flex-1 rounded-full bg-gray-500">
            <div className="h-1 w-2/5 rounded-full bg-surface" />
          </div>
          <span className="font-mono text-xs tabular-nums text-gray-200">7:42 / 18:10</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-medium text-fg">How to fix an overheating laptop</p>
        <p className="text-sm leading-relaxed text-muted">
          You watch someone else open the laptop, decide what&apos;s wrong, and clean it. If you misunderstand a step,
          nothing tells you.
        </p>
      </div>
    </div>
  );
}

export function DecisionMock() {
  const choices = [
    { t: "Blocked vents or dust buildup", picked: true, ok: true },
    { t: "A damaged keyboard", picked: false, ok: false },
    { t: "Incorrect screen brightness", picked: false, ok: false },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-fg bg-surface shadow-overlay">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-xs text-dim">Step 3 of 4 · Diagnose</span>
        <span className="font-mono text-xs tabular-nums text-muted">60 / 100</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-medium text-fg">What is the most likely cause of the overheating?</p>
        <ul className="space-y-2">
          {choices.map((c) => (
            <li
              key={c.t}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                c.picked ? "border-ok bg-ok-soft text-fg" : "border-line text-muted",
              )}
            >
              <span
                className={clsx(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  c.picked ? "border-ok bg-ok text-surface" : "border-line-strong",
                )}
              >
                {c.picked && <Check className="size-3" strokeWidth={3} />}
              </span>
              {c.t}
            </li>
          ))}
        </ul>
        <p className="rounded-xl bg-sunken px-3 py-2.5 text-sm leading-relaxed text-fg">
          <span className="font-medium text-ok">Correct, +30.</span> Dust on the fan, a clogged intake, and packed fins
          all restrict airflow.
        </p>
      </div>
    </div>
  );
}

/* Step art: one small drawing per step of the mission. */
export function StepArt({ step }: { step: 0 | 1 | 2 | 3 }) {
  return (
    <div className="relative grid h-40 place-items-center overflow-hidden rounded-xl border border-line bg-sunken">
      <div className="absolute inset-0 bg-grid-paper opacity-50" />
      <div className="relative">{[<SafeArt key={0} />, <InspectArt key={1} />, <DiagnoseArt key={2} />, <RepairArt key={3} />][step]}</div>
    </div>
  );
}

function SafeArt() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 place-items-center rounded-xl border border-line-strong bg-surface">
        <Plug className="size-6 text-fg" />
      </span>
      <svg width="56" height="12" viewBox="0 0 56 12" aria-hidden>
        <path d="M0 6h20M36 6h20" className="stroke-fg" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M24 1l8 10M32 1l-8 10" className="stroke-danger" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="rounded-full border border-line-strong bg-surface px-3 py-1.5 font-mono text-xs text-fg">Power off</span>
    </div>
  );
}

function InspectArt() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" aria-hidden>
      <rect x="10" y="20" width="160" height="80" rx="8" className="fill-surface stroke-fg" strokeWidth="2" />
      <circle cx="120" cy="55" r="20" className="fill-sunken stroke-gray-400" strokeWidth="2" />
      <circle cx="120" cy="55" r="6" className="fill-gray-400" />
      <rect x="40" y="40" width="26" height="26" rx="3" className="fill-sunken stroke-gray-400" strokeWidth="2" />
      <path d="M53 53 C80 30, 100 30, 120 35" className="stroke-heat" strokeWidth="3" fill="none" />
      {[
        [120, 55, "1"],
        [53, 53, "5"],
        [166, 70, "2"],
      ].map(([x, y, n]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={(y as number) - 30} r="10" className="fill-accent stroke-fg" strokeWidth="2" />
          <line x1={x as number} y1={(y as number) - 20} x2={x as number} y2={y as number} className="stroke-fg" strokeWidth="1.5" />
          <text x={x as number} y={(y as number) - 26} textAnchor="middle" className="fill-fg font-mono text-xs font-semibold">
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DiagnoseArt() {
  const clues = [
    { t: "Dust on fan blades", ok: true },
    { t: "Lint in intake vent", ok: true },
    { t: "Battery looks normal", ok: false },
  ];
  return (
    <ul className="w-56 space-y-1.5">
      {clues.map((c) => (
        <li key={c.t} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-fg">
          {c.ok ? <Check className="size-3.5 text-ok" aria-label="Relevant" /> : <X className="size-3.5 text-dim" aria-label="Not relevant" />}
          {c.t}
        </li>
      ))}
    </ul>
  );
}

function RepairArt() {
  return (
    <div className="flex items-center gap-4">
      <TempChip value="96" tone="heat" label="Before" />
      <svg width="40" height="12" viewBox="0 0 40 12" aria-hidden>
        <path d="M0 6h34M30 1l6 5-6 5" className="stroke-fg" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <TempChip value="61" tone="ok" label="After" />
    </div>
  );
}

function TempChip({ value, tone, label }: { value: string; tone: "heat" | "ok"; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2">
      <p className="text-xs text-dim">{label}</p>
      <p className={clsx("flex items-baseline gap-0.5 font-mono text-2xl font-semibold tabular-nums", tone === "heat" ? "text-heat" : "text-ok")}>
        {value}
        <span className="text-sm font-normal">°C</span>
      </p>
    </div>
  );
}

/* The ticket's story as a chart: temperature climbs until the shutdown limit at 15 min.
   Illustrative curve for the scenario, labeled as such. */
export function ThermalChart() {
  const W = 480;
  const H = 220;
  const pad = { l: 40, r: 16, t: 20, b: 32 };
  const x = (min: number) => pad.l + (min / 16) * (W - pad.l - pad.r);
  const y = (c: number) => pad.t + (1 - (c - 40) / 65) * (H - pad.t - pad.b);
  const pts: [number, number][] = [
    [0, 45], [1, 58], [2, 68], [3, 75], [4, 80], [5, 84], [6, 87], [7, 89], [8, 91], [9, 92], [10, 93], [11, 94], [12, 95], [13, 96], [14, 98], [15, 100],
  ];
  const d = pts.map(([m, c], i) => `${i ? "L" : "M"}${x(m).toFixed(1)} ${y(c).toFixed(1)}`).join(" ");
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm text-dim">
            <Thermometer className="size-4" /> CPU temperature during use
          </p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-heat">
            100<span className="text-lg font-normal">°C</span>
            <span className="ml-2 font-sans text-sm font-normal text-muted">at 15 min, then shutdown</span>
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Temperature rises from 45°C to 100°C over 15 minutes, reaching the shutdown limit.">
        {[50, 75, 100].map((c) => (
          <g key={c}>
            <line x1={pad.l} x2={W - pad.r} y1={y(c)} y2={y(c)} className={c === 100 ? "stroke-danger" : "stroke-line"} strokeWidth="1" strokeDasharray={c === 100 ? "4 4" : undefined} />
            <text x={pad.l - 8} y={y(c) + 4} textAnchor="end" className="fill-dim font-mono text-xs">
              {c}°
            </text>
          </g>
        ))}
        <text x={pad.l + 4} y={y(100) - 6} textAnchor="start" className="fill-danger text-xs">
          Shutdown limit
        </text>
        {[0, 5, 10, 15].map((m) => (
          <text key={m} x={x(m)} y={H - 8} textAnchor="middle" className="fill-dim font-mono text-xs">
            {m} min
          </text>
        ))}
        <path d={d} className="stroke-heat" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <circle cx={x(15)} cy={y(100)} r="5" className="fill-surface stroke-heat" strokeWidth="3" />
      </svg>
      <figcaption className="mt-2 text-xs text-dim">Illustrative curve for this scenario, not a measurement.</figcaption>
    </figure>
  );
}
