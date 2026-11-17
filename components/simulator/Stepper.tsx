import clsx from "clsx";
import { Check } from "lucide-react";
import type { StageId } from "@/data/missions";

export const SIM_STAGES: { id: StageId; label: string }[] = [
  { id: "SAFETY_CHECK", label: "Safety" },
  { id: "DEVICE_INSPECTION", label: "Inspect" },
  { id: "DIAGNOSIS", label: "Diagnose" },
  { id: "REPAIR_DECISION", label: "Repair" },
];

export function Stepper({ stage }: { stage: StageId }) {
  const current = stage === "COMPLETED" ? SIM_STAGES.length : SIM_STAGES.findIndex((s) => s.id === stage);
  return (
    <ol className="flex items-center gap-2" aria-label="Mission progress">
      {SIM_STAGES.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s.id} className="flex items-center gap-2" aria-current={now ? "step" : undefined}>
            {i > 0 && <span className={clsx("hidden h-px w-6 sm:block", done || now ? "bg-fg" : "bg-line-strong")} />}
            <span
              className={clsx(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm",
                now && "bg-fg text-surface",
                done && "text-fg",
                !done && !now && "text-dim",
              )}
            >
              {done ? <Check className="size-3.5 text-ok" strokeWidth={3} aria-label="Done" /> : <span className="font-mono text-xs">{i + 1}</span>}
              <span className={clsx(!now && "hidden md:inline")}>{s.label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
