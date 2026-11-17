"use client";

import clsx from "clsx";
import { Check, X } from "lucide-react";
import type { Question } from "@/data/missions";

export function QuestionCard({
  question,
  answered,
  points,
  onAnswer,
}: {
  question: Question;
  answered: string | undefined;
  points: number;
  onAnswer: (choiceId: string) => void;
}) {
  const picked = question.choices.find((c) => c.id === answered);
  const locked = answered !== undefined;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-snug tracking-tight">{question.prompt}</h2>
        {question.hint && !locked && <p className="text-sm text-muted">Hint: {question.hint}</p>}
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
            {picked.correct ? `Correct. +${points} points` : "Not quite. 0 points"}
          </p>
          <p className="leading-relaxed">{picked.feedback}</p>
          <p className="border-t border-line-strong pt-3 text-sm leading-relaxed text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
