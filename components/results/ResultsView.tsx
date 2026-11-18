"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { getMission, type Mission, type Question } from "@/data/missions";
import { isCorrect, type MissionProgress, type QuestionKind } from "@/lib/mission-engine";
import { computeScore, rating, type CategoryScore } from "@/lib/scoring";
import { useDevice, useMissionRun, useMissionStore } from "@/store/mission-store";
import { CareerCard } from "@/components/career/CareerCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function ResultsView() {
  const params = useSearchParams();
  const id = params.get("mission") ?? "001";
  const mission = getMission(id);
  const run = useMissionRun(id);

  if (!mission) {
    return (
      <Empty title="That mission doesn't exist" body="The results link points to a mission we don't have. Pick one from the missions list." />
    );
  }
  if (!run) return <div className="min-h-96" aria-busy="true" />;
  if (run.stage !== "COMPLETED") {
    const started = run.stage !== "NOT_STARTED" && run.stage !== "INTRODUCTION";
    return (
      <Empty
        title={started ? "Finish the mission to see results" : "No results yet"}
        body={
          started
            ? `You're partway through ${mission.code}. Your progress is saved, so you can pick up where you left off.`
            : `Complete ${mission.code} and your score, answers, and explanations will show up here.`
        }
        cta={started ? "Continue mission" : `Start ${mission.code}`}
        href={`/mission/${mission.id}`}
      />
    );
  }
  return <Report mission={mission} run={run} />;
}

function Report({ mission, run }: { mission: Mission; run: MissionProgress }) {
  const router = useRouter();
  const reset = useMissionStore((s) => s.reset);
  const score = computeScore(run, mission);
  const r = rating(score.total);
  const minutes =
    run.startedAt && run.completedAt ? Math.max(1, Math.round((run.completedAt - run.startedAt) / 60000)) : null;
  const safeOk = isCorrect(mission, "safety", run.answers.safety);
  const device = useDevice();

  const retry = () => {
    reset(mission.id);
    router.push(`/mission/${mission.id}`);
  };

  return (
    <>
      <Container className="grid gap-12 pb-16 pt-12 lg:grid-cols-12 lg:pt-20">
        <div className="space-y-6 lg:col-span-7">
          <p className="text-sm font-medium text-accent-ink">
            Technician report · {mission.code} closed on the {device.name}
            {minutes ? ` · ${minutes} min` : ""}
          </p>
          <h1 className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl">{r.title}</h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">{r.blurb}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={retry}>
              <RotateCcw className="size-4" /> Retry mission
            </Button>
            <ButtonLink href="/shift" size="lg" variant="secondary">
              Next ticket
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:col-span-5">
          <p className="text-sm text-muted">Total score</p>
          <p className="mb-6 font-mono text-7xl font-semibold tabular-nums">
            {score.total}
            <span className="text-3xl font-normal text-dim">/{score.max}</span>
          </p>
          <dl className="space-y-4">
            {score.categories.map((c) => (
              <div key={c.key}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <dt className="text-muted">{c.label}</dt>
                  <dd className="font-mono tabular-nums">
                    {c.earned}/{c.max}
                  </dd>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sunken" aria-hidden>
                  <div
                    className={clsx("h-full rounded-full", c.earned === c.max ? "bg-ok" : c.earned === 0 ? "bg-danger" : "bg-fg")}
                    style={{ width: `${(c.earned / c.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <section className="border-t border-line bg-surface py-16">
        <Container className="grid gap-6 md:grid-cols-3">
          <Verdict title="Safety" ok={safeOk} text={safeOk ? "You made the device safe before opening it." : "You skipped a safe first step. On a real bench, power down and unplug first."} />
          <Verdict
            title="Diagnosis"
            ok={isCorrect(mission, "diagnosis", run.answers.diagnosis)}
            text={
              isCorrect(mission, "diagnosis", run.answers.diagnosis)
                ? `You found the cause: ${mission.diagnosis.choices.find((c) => c.correct)?.text.toLowerCase()}.`
                : `The clues pointed at ${mission.diagnosis.choices.find((c) => c.correct)?.text.toLowerCase()}, not this answer.`
            }
          />
          <Verdict
            title="Repair decision"
            ok={isCorrect(mission, "repair", run.answers.repair)}
            text={
              isCorrect(mission, "repair", run.answers.repair)
                ? "You chose a safe, diagnosis-first repair."
                : mission.repair.choices.find((c) => c.id === run.answers.repair)?.harmful
                  ? "That action would make the fault worse."
                  : "That action wouldn't fix the fault."
            }
          />
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">Career</h2>
          <CareerCard />
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Your answers</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {(["safety", "diagnosis", "repair"] as QuestionKind[]).map((k) => (
              <AnswerReview
                key={k}
                question={mission[k]}
                picked={run.answers[k]}
                category={score.categories.find((c) => c.key === k)!}
                hintUsed={run.hints.includes(k)}
                hintCost={mission.scoring.hintCost}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-2 text-3xl font-semibold tracking-tight">Parts you inspected</h2>
            <p className="mb-6 text-muted">
              {run.inspected.length} of {mission.hotspots.length}. The ones marked as clues pointed at the fault.
            </p>
            <ul className="divide-y divide-line border-y border-line">
              {mission.hotspots.map((h) => {
                const seen = run.inspected.includes(h.id);
                return (
                  <li key={h.id} className="flex items-start gap-3 py-3">
                    <span className={clsx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", seen ? "bg-done text-surface" : "border border-line-strong")}>
                      {seen && <Check className="size-3" strokeWidth={3} aria-label="Inspected" />}
                    </span>
                    <div className="flex-1">
                      <p className={clsx("font-medium", !seen && "text-dim")}>
                        {h.label}
                        {!seen && <span className="ml-2 text-sm font-normal">Not inspected</span>}
                      </p>
                      {seen && <p className="text-sm leading-relaxed text-muted">{h.clue}</p>}
                    </div>
                    <span className={clsx("shrink-0 text-sm", h.relevant ? "font-medium text-heat" : "text-dim")}>
                      {h.relevant ? "Clue" : "Not the cause"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight">What to remember</h2>
            <ol className="space-y-4">
              {mission.summary.map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-line pb-4 text-lg leading-relaxed">
                  <span className="font-mono text-sm text-dim">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-dim">
              This is a simulation. Practice real repairs under supervision, and never work on powered equipment. Scores are
              learning feedback, not a certification.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function Verdict({ title, ok, text }: { title: string; ok: boolean; text: string }) {
  return (
    <div className={clsx("rounded-3xl border p-6", ok ? "border-ok bg-ok-soft" : "border-danger bg-danger-soft")}>
      <p className="mb-2 flex items-center gap-2 font-semibold">
        {ok ? <Check className="size-5 text-ok" aria-hidden /> : <X className="size-5 text-danger" aria-hidden />}
        {title}: {ok ? "correct" : "missed"}
      </p>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

function AnswerReview({
  question,
  picked,
  category,
  hintUsed,
  hintCost,
}: {
  question: Question;
  picked?: string;
  category: CategoryScore;
  hintUsed: boolean;
  hintCost: number;
}) {
  const choice = question.choices.find((c) => c.id === picked);
  const right = question.choices.find((c) => c.correct);
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold leading-snug">{question.prompt}</h3>
        <span className="shrink-0 font-mono text-sm tabular-nums text-muted">
          {category.earned}/{category.max}
        </span>
      </div>
      {hintUsed && <p className="-mt-2 text-sm text-dim">Hint used: −{hintCost} points</p>}
      <div className={clsx("rounded-xl p-3", choice?.correct ? "bg-ok-soft" : "bg-danger-soft")}>
        <p className="text-sm text-muted">Your answer</p>
        <p className="font-medium">{choice?.text ?? "No answer"}</p>
      </div>
      {!choice?.correct && right && (
        <div className="rounded-xl bg-sunken p-3">
          <p className="text-sm text-muted">Correct answer</p>
          <p className="font-medium">{right.text}</p>
        </div>
      )}
      <p className="text-sm leading-relaxed text-muted">{question.explanation}</p>
    </article>
  );
}

function Empty({
  title,
  body,
  cta = "Browse missions",
  href = "/missions",
}: {
  title: string;
  body: string;
  cta?: string;
  href?: string;
}) {
  return (
    <Container className="py-32">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted">{body}</p>
      <ButtonLink href={href} size="lg">
        {cta} <ArrowRight className="size-4" />
      </ButtonLink>
    </Container>
  );
}
