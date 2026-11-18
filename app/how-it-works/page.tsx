import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { MarketingShell, PageHeader, Section, CtaBand } from "@/components/landing/Marketing";
import { DecisionMock, StepArt } from "@/components/landing/Illustrations";
import { STEPS } from "@/components/landing/steps";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How it works · RepairVerse",
  description: "Each RepairVerse mission walks you through safety, inspection, diagnosis, and repair, with a 100-point score.",
};

export default function HowItWorks() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="How it works"
        title="Practice the habit, not just the steps"
        intro="A mission is a ticket from a customer. You make it safe, inspect the device in 3D, decide what's wrong, and choose a fix. Each decision is explained, right or wrong."
      >
        <ButtonLink href="/missions" size="lg">
          Browse missions
        </ButtonLink>
      </PageHeader>

      <Section tone="surface" title="The four stages" intro="Stages unlock in order. You can't open the device before you've made it safe.">
        <ol className="space-y-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid gap-6 rounded-3xl border border-line bg-surface p-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4">
                <StepArt step={i as 0 | 1 | 2 | 3} />
              </div>
              <div className="space-y-2 md:col-span-5">
                <p className="font-mono text-sm text-dim">Stage {i + 1}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="leading-relaxed text-muted">{s.body}</p>
              </div>
              <div className="rounded-2xl bg-sunken p-5 md:col-span-3">
                <p className="font-mono text-3xl font-semibold tabular-nums">
                  {s.points}
                  <span className="ml-1 text-base font-normal text-muted">pts</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.scoring}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Feedback that explains itself"
        intro="Picking the wrong answer is part of learning. Every choice shows why it's right or wrong, the way a mentor at the bench would tell you."
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-md">
            <DecisionMock />
          </div>
          <dl className="grid gap-8 sm:grid-cols-2">
            {[
              ["Start with full marks", "You begin at 100. Wrong calls, fixes that make things worse, and hints (5 points each) take points off. Your first answer is the one that counts."],
              ["Same input, same score", "Scoring is fixed rules, not a judgment call. Two people who choose the same way get the same score."],
              ["Survives a refresh", "Progress is saved in your browser, so a reload puts you back on the same stage."],
              ["Retry any time", "Run the mission again from the start. Retrying resets the stage and the score."],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-line pt-4">
                <dt className="mb-1 font-semibold">{t}</dt>
                <dd className="leading-relaxed text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="safety" tone="surface" title="Safety" intro="RepairVerse is a simulator. It teaches decisions, not hands-on technique.">
        <div className="flex flex-col gap-4 rounded-2xl border border-line-strong bg-warn-soft p-6 sm:flex-row sm:p-8">
          <ShieldAlert className="size-6 shrink-0 text-warn" aria-hidden />
          <ul className="max-w-3xl list-disc space-y-2 pl-5 leading-relaxed text-fg">
            <li>Never work on powered equipment. Shut down and unplug first.</li>
            <li>A swollen or damaged battery is a fire risk. Stop and hand it to a professional.</li>
            <li>Never put liquid inside a device to cool it.</li>
            <li>Practice real repairs under supervision the first time.</li>
            <li>Scores are learning feedback, not a professional certification.</li>
          </ul>
        </div>
      </Section>

      <CtaBand title="Ready for your first ticket?" body="No account. Your progress stays in this browser." />
    </MarketingShell>
  );
}
