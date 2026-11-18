import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingShell, PageHeader, Section, CtaBand } from "@/components/landing/Marketing";
import { ButtonLink } from "@/components/ui/Button";
import { MissionGrid } from "@/components/missions/MissionGrid";
import { missionList } from "@/data/missions";
import { STEPS } from "@/components/landing/steps";
import { CareerCard } from "@/components/career/CareerCard";
import { ShiftStart } from "@/components/career/ShiftStart";

export const metadata: Metadata = {
  title: "Missions · RepairVerse",
  description: `${missionList.length} laptop repair missions: overheating, charging, batteries, storage, displays, liquid damage and more.`,
};

export default function MissionsPage() {
  const minutes = missionList.reduce((t, m) => t + m.durationMin, 0);
  return (
    <MarketingShell>
      <PageHeader
        kicker={`${missionList.length} missions · about ${minutes} minutes in total`}
        title="Missions"
        intro="Each mission is a real repair ticket. Make the laptop safe, inspect the parts, diagnose the fault, and choose the repair. Pick any laptop for the bench, and replay as often as you like."
      >
        <ButtonLink href={`/mission/${missionList[0].id}`} size="lg">
          Start with {missionList[0].code} <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHeader>

      <Section title="Your career" intro="Every closed ticket adds points toward your next rank." action={<ShiftStart />}>
        <CareerCard />
      </Section>

      <Section tone="surface" title="Choose a ticket" intro="Filter by the kind of fault or by difficulty. Your progress and scores save in this browser.">
        <MissionGrid />
      </Section>

      <Section title="How every mission is scored" intro="The same four stages, out of 100 points.">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.title} className="bg-surface p-6">
              <dt className="text-sm text-muted">{s.title}</dt>
              <dd className="mt-2 font-mono text-4xl font-semibold tabular-nums">{s.points}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand title="The bench is full of tickets." body="Start with any mission. Each one takes five to eight minutes." />
    </MarketingShell>
  );
}
