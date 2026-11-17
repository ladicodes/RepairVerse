import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell, PageHeader, Section, CtaBand } from "@/components/landing/Marketing";
import { ThermalChart } from "@/components/landing/Illustrations";
import { PartsExplorer } from "@/components/landing/PartsExplorer";
import { ButtonLink } from "@/components/ui/Button";
import { missions } from "@/data/missions";
import { STEPS } from "@/components/landing/steps";

const mission = missions["001"];

export const metadata: Metadata = {
  title: "Mission 001 · RepairVerse",
  description: mission.ticket.symptom,
};

export default function MissionsPage() {
  return (
    <MarketingShell>
      <PageHeader kicker={`Mission 001 · ${mission.difficulty}`} title={mission.title} intro={mission.ticket.symptom}>
        <ButtonLink href="/mission/001" size="lg">
          Take the ticket <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHeader>

      <Section tone="surface" title="The work order" intro="What the customer told the front desk.">
        <div className="grid gap-6 lg:grid-cols-12">
          <article className="overflow-hidden rounded-3xl border border-line-strong bg-surface lg:col-span-5" aria-label="Work order">
            <header className="flex items-center justify-between gap-4 border-b border-line bg-sunken px-6 py-4">
              <p className="font-mono text-sm">Work order {mission.code}</p>
              <p className="text-sm text-muted">About {mission.durationMin} min</p>
            </header>
            <dl className="divide-y divide-line">
              <Field label="Device">{mission.device}</Field>
              <Field label="Reported fault">Overheats, then shuts down after about 15 minutes</Field>
              <div className="px-6 py-5">
                <dt className="mb-3 text-sm text-dim">Intake notes</dt>
                <dd>
                  <ul className="space-y-2">
                    {mission.ticket.notes.map((n) => (
                      <li key={n} className="flex gap-3">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gray-400" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </article>
          <div className="lg:col-span-7">
            <ThermalChart />
          </div>
        </div>
      </Section>

      <Section
        title="Parts you will inspect"
        intro="This is the simulator with the bottom panel off. Click a number or a row to fly the camera to that part. In the mission, each one also holds a clue."
      >
        <PartsExplorer />
      </Section>

      <Section tone="surface" title="What you'll learn" intro="Four objectives, scored out of 100.">
        <div className="grid gap-12 lg:grid-cols-2">
          <ul className="space-y-4">
            {mission.objectives.map((o) => (
              <li key={o} className="flex gap-3 border-b border-line pb-4 text-lg leading-relaxed">
                <Check className="mt-1.5 size-5 shrink-0 text-ok" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {STEPS.map((s) => (
              <div key={s.title} className="bg-surface p-6">
                <dt className="text-sm text-muted">{s.title}</dt>
                <dd className="mt-2 font-mono text-4xl font-semibold tabular-nums">{s.points}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section title="More devices" intro="Mission 001 is the only mission today. Phones and desktop PCs are planned, not built yet.">
        <ul className="grid gap-6 md:grid-cols-3">
          {[
            ["001", "Overheating laptop", "Available now", true],
            ["002", "Phone that won't charge", "Planned", false],
            ["003", "Desktop PC that won't boot", "Planned", false],
          ].map(([code, t, status, live]) => (
            <li
              key={code as string}
              className={live ? "rounded-3xl border border-fg bg-surface p-6" : "rounded-3xl border border-dashed border-line-strong p-6"}
            >
              <p className="font-mono text-sm text-dim">Mission {code}</p>
              <p className="mt-2 text-xl font-semibold">{t}</p>
              <p className={live ? "mt-6 text-sm font-medium text-ok" : "mt-6 text-sm text-dim"}>{status}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="The customer is waiting at the counter." body="Inspect, diagnose, and repair in about six minutes." />
    </MarketingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <dt className="mb-1 text-sm text-dim">{label}</dt>
      <dd className="text-lg">{children}</dd>
    </div>
  );
}
