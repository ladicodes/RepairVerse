import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell, Section, CtaBand } from "@/components/landing/Marketing";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { HeroCopy } from "@/components/landing/HeroCopy";
import { DecisionMock, StepArt, ThermalChart, TutorialMock } from "@/components/landing/Illustrations";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { missions } from "@/data/missions";
import { STEPS } from "@/components/landing/steps";

const mission = missions["001"];

export default function Home() {
  return (
    <MarketingShell>
      {/* Hero */}
      <Container className="grid items-center gap-12 pb-24 pt-12 lg:grid-cols-12 lg:pt-16">
        <div className="lg:col-span-5">
          <HeroCopy />
        </div>
        <div className="lg:col-span-7">
          <HeroVisual />
        </div>
      </Container>

      {/* Watching vs deciding */}
      <Section
        tone="surface"
        title="Most repair learning is watching. Here you make the calls."
        intro="Workshops and spare devices cost money. Tutorials are free, but they never ask you to decide anything, and trial and error on real hardware can break it."
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted">A tutorial video</p>
            <TutorialMock />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-fg">A RepairVerse mission</p>
            <DecisionMock />
          </div>
        </div>
      </Section>

      {/* Steps */}
      <Section
        title="Four decisions between a ticket and a fix"
        intro="The order a technician follows: make it safe, gather evidence, then act. You can't skip ahead."
        action={
          <ButtonLink href="/how-it-works" variant="secondary">
            How scoring works
          </ButtonLink>
        }
      >
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="space-y-4">
              <StepArt step={i as 0 | 1 | 2 | 3} />
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  <span className="mr-2 font-mono text-sm font-normal text-dim">{i + 1}</span>
                  {s.title}
                </h3>
                <span className="font-mono text-sm tabular-nums text-muted">{s.points} pts</span>
              </div>
              <p className="leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Mission teaser */}
      <Section
        tone="surface"
        title={`Mission 001: ${mission.title}`}
        intro={mission.ticket.symptom.split(". ")[0] + "."}
        action={
          <Link href="/missions" className="inline-flex items-center gap-2 font-medium text-fg hover:text-accent-ink">
            Read the full brief <ArrowRight className="size-4" />
          </Link>
        }
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ThermalChart />
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-3xl border border-line bg-sunken p-6 lg:col-span-5">
            <div>
              <p className="mb-4 text-sm text-dim">Intake notes from the customer</p>
              <ul className="space-y-3">
                {mission.ticket.notes.map((n) => (
                  <li key={n} className="border-b border-line pb-3 text-lg text-fg last:border-0">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink href="/mission/001" size="lg" className="self-start">
              Take the ticket <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand title="A laptop on bench 3 is overheating." body="Six minutes, one device, and every decision is yours." />
    </MarketingShell>
  );
}
