"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryLow,
  Droplets,
  Fan,
  HardDrive,
  Keyboard,
  Laptop,
  MemoryStick,
  Monitor,
  PlugZap,
  RotateCcw,
  Thermometer,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { getMission, type Mission, type Reading, type ReadoutIcon } from "@/data/missions";
import { canAdvance, isCorrect, type MissionProgress, type QuestionKind } from "@/lib/mission-engine";
import { answerPenalty, computeScore } from "@/lib/scoring";
import { useDevice, useMissionRun, useMissionStore } from "@/store/mission-store";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import type { LaptopState } from "@/components/three/LaptopModel";
import { QuestionCard } from "./QuestionCard";
import { ClueList, InspectionPanel } from "./InspectionPanel";
import { Stepper } from "./Stepper";
import { DevicePicker } from "./DevicePicker";
import type { ToolId } from "@/lib/tools";

const DeviceViewer = dynamic(() => import("./DeviceViewer"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center rounded-3xl border border-line bg-surface">
      <div className="size-10 animate-spin rounded-full border-2 border-line-strong border-t-fg" />
    </div>
  ),
});

export function MissionRunner({ id }: { id: string }) {
  const mission = getMission(id)!;
  const run = useMissionRun(id);
  const load = useMissionStore((s) => s.load);

  useEffect(() => {
    load(id);
  }, [id, load]);

  if (!run || run.stage === "NOT_STARTED") {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="size-10 animate-spin rounded-full border-2 border-line-strong border-t-fg" aria-label="Loading mission" />
      </div>
    );
  }

  if (run.stage === "INTRODUCTION") return <Briefing mission={mission} />;
  return <Simulator mission={mission} run={run} />;
}

/* ---------- Top bar ---------- */

function TopBar({ mission, run }: { mission: Mission; run?: MissionProgress }) {
  const score = run ? computeScore(run, mission) : null;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="RepairVerse home" className="shrink-0">
            <LogoMark />
          </Link>
          <span className="hidden h-6 w-px bg-line-strong sm:block" />
          <p className="hidden truncate text-sm sm:block">
            <span className="font-mono text-dim">{mission.code}</span> <span className="font-medium">{mission.title}</span>
          </p>
        </div>
        {run && <Stepper stage={run.stage} />}
        <div className="flex items-center gap-4">
          {score && (
            <p className="text-sm text-muted">
              Score <span className="font-mono text-base font-semibold tabular-nums text-fg">{score.total}</span>
            </p>
          )}
          <Link
            href="/"
            className="grid size-10 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg"
            aria-label="Leave mission"
            title="Leave mission. Progress is saved."
          >
            <X className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Briefing (INTRODUCTION) ---------- */

function Briefing({ mission }: { mission: Mission }) {
  const advance = useMissionStore((s) => s.advance);
  const setDevice = useMissionStore((s) => s.setDevice);
  const device = useDevice();
  const laptop: LaptopState = {
    xray: false,
    dusty: mission.visual.dusty,
    powered: true,
    cooled: !mission.visual.hot,
    screen: mission.screen.fault,
  };
  return (
    <div className="min-h-dvh">
      <TopBar mission={mission} />
      <main className="grid w-full gap-8 px-4 py-8 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-12">
        <div className="min-w-0 space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <p className="text-sm font-medium text-accent-ink">New repair request</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{mission.title}</h1>
            <p className="text-lg leading-relaxed text-fg">{mission.ticket.symptom}</p>
          </div>

          <article className="overflow-hidden rounded-3xl border border-line-strong bg-surface" aria-label="Work order">
            <header className="flex items-center justify-between border-b border-line bg-sunken px-5 py-3">
              <p className="font-mono text-sm">Work order {mission.code}</p>
              <p className="text-sm text-muted">{device.name}</p>
            </header>
            <div className="px-5 py-4">
              <p className="mb-2 text-sm text-dim">Intake notes</p>
              <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {mission.ticket.notes.map((n) => (
                  <li key={n} className="flex gap-2.5">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gray-400" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <DevicePicker value={device.id} onChange={setDevice} showCooling={mission.category === "Cooling"} />

          <div>
            <p className="mb-3 font-medium">By the end you will be able to</p>
            <ol className="space-y-2">
              {mission.objectives.map((o, i) => (
                <li key={o} className="flex gap-3 leading-relaxed text-muted">
                  <span className="font-mono text-sm text-dim">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={() => advance(mission.id)} autoFocus>
              Begin diagnosis <ArrowRight className="size-4" />
            </Button>
            <p className="text-sm text-dim">About {mission.durationMin} minutes. Progress saves in this browser.</p>
          </div>
        </div>

        <div className="h-96 sm:h-120 lg:col-span-7 lg:h-auto lg:min-h-152">
          <DeviceViewer
            asset={device.model}
            look={device.look}
            laptop={laptop}
            hotspots={mission.hotspots}
            hotspotsEnabled={false}
            inspected={[]}
            activeId={null}
            onSelect={() => undefined}
            hud={<Readout laptop={laptop} mission={mission} fixed={false} />}
          />
        </div>
      </main>
    </div>
  );
}

/* ---------- Simulator (SAFETY_CHECK .. COMPLETED) ---------- */

const STAGE_COPY = {
  SAFETY_CHECK: { n: 1, title: "Make it safe", body: "" },
  DEVICE_INSPECTION: {
    n: 2,
    title: "Inspect the device",
    body: "The bottom panel is off. Click the numbered parts to see what each does and what you find. Missing a part that explains the fault costs evidence points.",
  },
  DIAGNOSIS: { n: 3, title: "Diagnose the fault", body: "Use your clues. Your first answer locks in." },
  REPAIR_DECISION: { n: 4, title: "Choose the repair", body: "Pick the safest correct next step. Your first answer locks in." },
  COMPLETED: { n: 4, title: "Mission complete", body: "" },
} as const;

function Simulator({ mission, run }: { mission: Mission; run: MissionProgress }) {
  const router = useRouter();
  const { advance, inspect, answer, takeHint, reset } = useMissionStore.getState();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [xray, setXray] = useState(run.stage !== "SAFETY_CHECK");
  const [tool, setTool] = useState<ToolId>("inspect");
  const [teardown, setTeardown] = useState(0);
  const device = useDevice();

  const repaired = run.answers.repair !== undefined && isCorrect(mission, "repair", run.answers.repair);
  const laptop: LaptopState = {
    xray,
    dusty: mission.visual.dusty && !repaired,
    cooled: !mission.visual.hot || repaired,
    powered: (run.stage === "SAFETY_CHECK" && run.answers.safety === undefined) || repaired,
    screen: repaired ? mission.screen.fixed : mission.screen.fault,
    teardown,
  };

  // Stage side effects: open the panel for inspection, close it to show the post-repair test.
  useEffect(() => {
    if (run.stage === "DEVICE_INSPECTION") setXray(true);
  }, [run.stage]);
  useEffect(() => {
    if (repaired) {
      setXray(false);
      setActiveId(null);
    }
  }, [repaired]);

  const select = useCallback(
    (hid: string) => {
      setActiveId(hid);
      if (!xray) setXray(true);
      inspect(mission.id, hid);
    },
    [inspect, mission.id, xray],
  );

  const base = STAGE_COPY[run.stage as keyof typeof STAGE_COPY];
  // Markers follow parts that are lifted out during the take-apart.
  const hotspots = useMemo(() => {
    const lift = (id: string): [number, number, number] =>
      !xray ? [0, 0, 0] : id === "battery" && teardown >= 1 ? [0, 0.45, 0.9] : id === "fan" && teardown >= 2 ? [0, 0.55, 0] : [0, 0, 0];
    return mission.hotspots.map((h) => {
      const [dx, dy, dz] = lift(h.id);
      if (!dx && !dy && !dz) return h;
      const shift = (v: [number, number, number]): [number, number, number] => [v[0] + dx, v[1] + dy, v[2] + dz];
      return { ...h, position: shift(h.position), camera: shift(h.camera) };
    });
  }, [mission.hotspots, xray, teardown]);
  const copy = run.stage === "SAFETY_CHECK" ? { ...base, body: mission.safetyIntro } : base;
  const ready = canAdvance(run, mission);
  const score = computeScore(run, mission);
  const hotspotsVisible = xray && run.stage !== "SAFETY_CHECK";
  const questionProps = (kind: QuestionKind) => {
    const picked = run.answers[kind];
    return {
      lost: picked === undefined ? 0 : answerPenalty(mission, kind, picked),
      hintUsed: run.hints.includes(kind),
      hintCost: mission.scoring.hintCost,
      onHint: () => takeHint(mission.id, kind),
    };
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar mission={mission} run={run} />
      <main className="grid w-full flex-1 gap-4 p-4 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-6">
        <div className="h-[55dvh] min-h-80 lg:sticky lg:top-22 lg:col-span-8 lg:h-[calc(100dvh-7rem)]">
          <DeviceViewer
            asset={device.model}
            look={device.look}
            laptop={laptop}
            hotspots={hotspots}
            hotspotsEnabled={hotspotsVisible}
            inspected={run.inspected}
            activeId={activeId}
            onSelect={select}
            onToggleXray={() => {
              setXray((v) => !v);
              setTeardown(0);
            }}
            xrayLocked={run.stage === "SAFETY_CHECK"}
            tool={tool}
            onTool={setTool}
            onTeardown={() => setTeardown((t) => (t + 1) % 3)}
            hud={<Readout laptop={laptop} mission={mission} fixed={repaired} />}
          />
        </div>

        <aside className="flex flex-col rounded-3xl border border-line bg-surface lg:col-span-4" aria-label="Mission panel">
          <div className="border-b border-line p-5 sm:p-6">
            <p className="mb-1 font-mono text-sm text-dim">
              {run.stage === "COMPLETED" ? "Done" : `Stage ${copy.n} of 4`}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
            {copy.body && <p className="mt-2 leading-relaxed text-muted">{copy.body}</p>}
          </div>

          <div className="flex-1 space-y-6 p-5 sm:p-6">
            {run.stage === "SAFETY_CHECK" && (
              <QuestionCard
                question={mission.safety}
                answered={run.answers.safety}
                {...questionProps("safety")}
                onAnswer={(c) => answer(mission.id, "safety", c)}
              />
            )}

            {run.stage === "DEVICE_INSPECTION" && (
              <InspectionPanel
                mission={mission}
                inspected={run.inspected}
                activeId={activeId}
                canScore
                panelOpen={xray}
                tool={tool}
                onSelect={select}
              />
            )}

            {run.stage === "DIAGNOSIS" && (
              <>
                <ClueList mission={mission} inspected={run.inspected} />
                <QuestionCard
                  question={mission.diagnosis}
                  answered={run.answers.diagnosis}
                  {...questionProps("diagnosis")}
                  onAnswer={(c) => answer(mission.id, "diagnosis", c)}
                />
              </>
            )}

            {run.stage === "REPAIR_DECISION" && (
              <>
                <QuestionCard
                  question={mission.repair}
                  answered={run.answers.repair}
                  {...questionProps("repair")}
                  onAnswer={(c) => answer(mission.id, "repair", c)}
                />
                {run.answers.repair !== undefined && (
                  <p className="rounded-2xl bg-sunken p-4 text-sm leading-relaxed">
                    {repaired ? mission.postRepair.fixed : mission.postRepair.unresolved}
                  </p>
                )}
              </>
            )}

            {run.stage === "COMPLETED" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted">Final score</p>
                  <p className="font-mono text-6xl font-semibold tabular-nums">
                    {score.total}
                    <span className="text-2xl font-normal text-dim">/{score.max}</span>
                  </p>
                </div>
                <dl className="divide-y divide-line border-y border-line">
                  {score.categories.map((c) => (
                    <div key={c.key} className="flex justify-between py-2.5 text-sm">
                      <dt className="text-muted">{c.label}</dt>
                      <dd className="font-mono tabular-nums">
                        {c.earned}/{c.max}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-b-3xl border-t border-line bg-surface p-5 sm:p-6">
            {run.stage === "COMPLETED" ? (
              <>
                <Button size="lg" onClick={() => router.push(`/results?mission=${mission.id}`)}>
                  See full results <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    reset(mission.id);
                    setXray(false);
                    setActiveId(null);
                  }}
                >
                  <RotateCcw className="size-4" /> Retry
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" disabled={!ready} onClick={() => advance(mission.id)} className="flex-1 sm:flex-none">
                  {run.stage === "REPAIR_DECISION" ? "Finish mission" : "Continue"} <ArrowRight className="size-4" />
                </Button>
                {!ready && <p className="text-sm text-dim">{waitingCopy(run, mission)}</p>}
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function waitingCopy(run: MissionProgress, mission: Mission) {
  if (run.stage === "DEVICE_INSPECTION") {
    const left = Math.min(mission.minInspections, mission.hotspots.length) - run.inspected.length;
    return `Inspect ${left} more part${left === 1 ? "" : "s"}`;
  }
  return "Pick an answer";
}

/* ---------- Live readout in the viewer ---------- */

const ICONS: Record<ReadoutIcon, LucideIcon> = {
  temp: Thermometer,
  fan: Fan,
  battery: BatteryLow,
  power: PlugZap,
  wifi: Wifi,
  drive: HardDrive,
  display: Monitor,
  keyboard: Keyboard,
  memory: MemoryStick,
  liquid: Droplets,
  hinge: Laptop,
};

function Readout({ laptop, mission, fixed }: { laptop: LaptopState; mission: Mission; fixed: boolean }) {
  const items: Reading[] = !laptop.powered
    ? [{ icon: "power", label: "Power", value: "Off and unplugged", tone: "neutral" }]
    : fixed
      ? mission.readout.fixed
      : mission.readout.fault;
  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row">
      {items.map((it) => {
        const Icon = ICONS[it.icon];
        return (
          <div key={it.label} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-raised">
            <Icon className={clsx("size-4", it.tone === "bad" ? "text-heat" : it.tone === "ok" ? "text-ok" : "text-muted")} />
            <span className="text-xs text-muted">{it.label}</span>
            <span
              className={clsx(
                "font-mono text-sm font-semibold tabular-nums",
                it.tone === "bad" ? "text-heat" : it.tone === "ok" ? "text-ok" : "text-fg",
              )}
            >
              {it.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
