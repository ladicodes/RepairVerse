import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell, Section, CtaBand } from "@/components/landing/Marketing";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScoreCardPreview, StudentAnswerPreview } from "@/components/landing/EducatorPreviews";
import { missions } from "@/data/missions";

const mission = missions["001"];

export const metadata: Metadata = {
  title: "For educators · RepairVerse",
  description: "Use RepairVerse as a free, safe warm-up before students work on real devices.",
};

const lesson = [
  { min: 6, at: "Before class", t: "Students run a mission", d: "At home or in the lab. Only a browser, no account." },
  { min: 10, at: "0:00", t: "Review the results together", d: "Which questions did people miss? The results page shows each answer with its explanation." },
  { min: 25, at: "0:10", t: "Open a real laptop", d: "Under supervision, find the fan, vents, and heatsink students already inspected in 3D." },
  { min: 10, at: "0:35", t: "Retry and compare", d: "Students run the mission again. Compare first and second scores." },
];
const total = lesson.reduce((s, l) => s + l.min, 0);

const learners = [
  { t: "Technical college students", need: "Practice between lab sessions", how: "A full diagnose-and-repair loop on any laptop or phone browser." },
  { t: "Aspiring technicians", need: "A safe place to make mistakes", how: "Wrong answers cost nothing and come with the reasoning." },
  { t: "Self-taught learners", need: "Structure, not just videos", how: "Stages unlock in order, the same way a technician works." },
  { t: "Training centers", need: "A warm-up before bench time", how: "Six minutes per student, no setup, no accounts to manage." },
];

export default function EducatorsPage() {
  return (
    <MarketingShell>
      {/* Hero with real UI */}
      <Container className="grid items-center gap-12 pb-24 pt-12 lg:grid-cols-12 lg:pt-20">
        <div className="space-y-8 lg:col-span-5">
          <p className="text-sm font-medium text-accent-ink">For educators</p>
          <h1 className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
            Send students to the bench already knowing the parts
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            RepairVerse handles the thinking part of repair: safety, evidence, diagnosis. Your bench time goes to the
            hands-on part.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href="/missions" size="lg">
              Try it as a student <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="#lesson" variant="plain" className="px-0 text-base">
              See a sample lesson
            </ButtonLink>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <StudentAnswerPreview />
            <div className="sm:mt-16">
              <ScoreCardPreview />
            </div>
          </div>
          <p className="mt-4 text-sm text-dim">Screens from the overheating mission: a student&apos;s answer and their results card.</p>
        </div>
      </Container>

      {/* Facts strip */}
      <section className="border-y border-line bg-surface">
        <Container className="grid grid-cols-2 divide-x divide-line md:grid-cols-4">
          {[
            ["About 6 min", "per student, per run"],
            ["No accounts", "nothing to set up or manage"],
            ["Any browser", "laptop, tablet, or phone"],
            ["Free", "no payment, no sign-up"],
          ].map(([v, l]) => (
            <div key={v} className="px-4 py-8 first:pl-0 sm:px-8">
              <p className="text-2xl font-semibold tracking-tight">{v}</p>
              <p className="mt-1 text-muted">{l}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Lesson timeline */}
      <Section
        id="lesson"
        title="A sample 45-minute class"
        intro="One way to use a mission. The bar shows how the time splits."
      >
        <div className="mb-10 flex h-3 overflow-hidden rounded-full" aria-hidden>
          {lesson.map((l, i) => (
            <div
              key={l.t}
              className={i === 0 ? "bg-accent" : i === 2 ? "bg-fg" : "bg-gray-400"}
              style={{ width: `${(l.min / total) * 100}%` }}
            />
          ))}
        </div>
        <ol className="grid gap-8 md:grid-cols-4">
          {lesson.map((l) => (
            <li key={l.t} className="space-y-2">
              <p className="flex items-baseline justify-between font-mono text-sm text-dim">
                <span>{l.at}</span>
                <span className="tabular-nums">{l.min} min</span>
              </p>
              <p className="text-lg font-semibold">{l.t}</p>
              <p className="leading-relaxed text-muted">{l.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Learners table */}
      <Section tone="surface" title="Who it helps, and how">
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl text-left">
            <thead>
              <tr className="border-b-2 border-fg text-sm text-dim">
                <th scope="col" className="pb-3 pr-6 font-normal">Learner</th>
                <th scope="col" className="pb-3 pr-6 font-normal">What they need</th>
                <th scope="col" className="pb-3 font-normal">What RepairVerse gives them</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((l) => (
                <tr key={l.t} className="border-b border-line align-top">
                  <th scope="row" className="py-5 pr-6 text-lg font-semibold">{l.t}</th>
                  <td className="py-5 pr-6 text-muted">{l.need}</td>
                  <td className="py-5">{l.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Curriculum fit */}
      <Section title="What the overheating mission covers" intro="Map it to your syllabus.">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <ul className="divide-y divide-line border-y border-line">
            {mission.objectives.map((o) => (
              <li key={o} className="flex gap-3 py-4 text-lg leading-relaxed">
                <Check className="mt-1.5 size-5 shrink-0 text-ok" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <p className="mb-4 font-semibold">Topics touched</p>
            <ul className="flex flex-wrap gap-2">
              {["Airflow and cooling", "Heat pipes and heatsinks", "Thermal throttling", "Battery hazards", "Safe power-down", "Evidence-based diagnosis"].map((t) => (
                <li key={t} className="rounded-full border border-line-strong px-3 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Questions */}
      <Section tone="surface" title="Questions educators ask">
        <div className="grid gap-x-12 lg:grid-cols-2">
          {[
            ["Do students need accounts?", "No. Progress is stored in each student's browser. Clearing browser data resets it."],
            ["Is there a class dashboard?", "Not yet. Students can show you their results page, which lists each answer and the score."],
            ["Can it replace bench practice?", "No. It prepares students for it. Physical repair still needs hands-on training and supervision."],
            ["Is the score a certification?", "No. It's learning feedback from fixed rules: same answers, same score."],
            ["How accurate is the 3D model?", "The outside comes from Aholo Lux3D. The internal parts are labeled teaching illustrations, not an exact copy of one model."],
            ["How many missions are there?", "Twelve laptop missions today, from overheating to liquid damage. Phones and desktop PCs are planned."],
          ].map(([q, a]) => (
            <details key={q} className="group border-b border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {q}
                <span className="text-2xl font-light text-dim transition-transform duration-150 group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand title="Run it once yourself." body="The fastest way to judge it is to take the ticket." />
    </MarketingShell>
  );
}
