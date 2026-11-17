"use client";

import clsx from "clsx";
import { Check, Lightbulb, X } from "lucide-react";
import type { Question } from "@/data/missions";

export function QuestionCard({
  question,
  answered,
  lost,
  hintUsed,
  hintCost,
  onHint,
  onAnswer,
}: {
  question: Question;
  answered: string | undefined;
  /** Points the picked answer lost, not counting the hint. */
  lost: number;
  hintUsed: boolean;
  hintCost: number;
  onHint?: () => void;
  onAnswer: (choiceId: string) => void;
}) {
  const picked = question.choices.find((c) => c.id === answered);
  const locked = answered !== undefined;
  const verdict = !picked
    ? ""
    : picked.correct
      ? hintUsed
        ? `Correct. You spent ${hintCost} points on the hint.`
        : "Correct. No points lost."
      : picked.harmful
        ? `Wrong, and it would make things worse. −${lost} points.`
        : question.choices.some((c) => c.harmful)
          ? `That doesn't fix it. −${lost} points.`
          : `Not quite. −${lost} points.`;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-snug tracking-tight">{question.prompt}</h2>
        {question.hint && !locked &&
          (hintUsed ? (
            <p className="flex gap-2 text-sm leading-relaxed text-muted">
              <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden /> {question.hint}
            </p>
          ) : (
            onHint && (
              <button
                type="button"
                onClick={onHint}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-ink underline-offset-4 hover:underline"
              >
                <Lightbulb className="size-4" aria-hidden /> Show a hint (−{hintCost} points)
              </button>
            )
          ))}
      </div>

      <fieldset disabled={locked} className="space-y-2">
        <legend className="sr-only">{question.prompt}</legend>
        {question.choices.map((c, i) => {
          const isPicked = c.id === answered;
          const reveal = locked && c.correct;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onAnswer(c.id)}
              aria-pressed={isPicked}
              className={clsx(
                "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-150",
                !locked && "border-line-strong bg-surface hover:border-fg",
                locked && isPicked && c.correct && "border-ok bg-ok-soft",
                locked && isPicked && !c.correct && "border-danger bg-danger-soft",
                locked && !isPicked && reveal && "border-ok bg-surface",
                locked && !isPicked && !reveal && "border-line bg-surface text-dim",
              )}
            >
              <span
                className={clsx(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold",
                  !locked && "border-line-strong text-muted",
                  locked && c.correct && "border-ok bg-ok text-surface",
                  locked && isPicked && !c.correct && "border-danger bg-danger text-surface",
                  locked && !isPicked && !c.correct && "border-line text-dim",
                )}
              >
                {locked && c.correct ? (
                  <Check className="size-3.5" strokeWidth={3} aria-label="Correct answer" />
                ) : locked && isPicked ? (
                  <X className="size-3.5" strokeWidth={3} aria-label="Your answer, incorrect" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="leading-relaxed">{c.text}</span>
            </button>
          );
        })}
      </fieldset>

      {picked && (
        <div
          role="status"
          className={clsx("space-y-3 rounded-2xl border p-4", picked.correct ? "border-ok bg-ok-soft" : "border-danger bg-danger-soft")}
        >
          <p className="font-semibold">
            {verdict}
          </p>
          <p className="leading-relaxed">{picked.feedback}</p>
          <p className="border-t border-line-strong pt-3 text-sm leading-relaxed text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
