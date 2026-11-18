import type { Metadata } from "next";
import { MarketingShell, PageHeader, Section } from "@/components/landing/Marketing";
import { CareerCard } from "@/components/career/CareerCard";
import { ShiftStart } from "@/components/career/ShiftStart";

export const metadata: Metadata = {
  title: "Shift mode · RepairVerse",
  description: "A random repair ticket on a random laptop. Diagnose it without knowing the fault in advance.",
};

export default function ShiftPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Shift mode"
        title="Clock in. Take the next ticket."
        intro="Each shift hands you a random open ticket on a random laptop, so you can't pick the fault you already know. Finish it for a technician report, and every closed ticket adds to your career points."
      >
        <ShiftStart />
      </PageHeader>
      <Section tone="surface" title="Your career" intro="Saved in this browser. Retrying a mission replaces its score.">
        <CareerCard />
      </Section>
    </MarketingShell>
  );
}
