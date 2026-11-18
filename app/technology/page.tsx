import type { Metadata } from "next";
import { photoCredits } from "@/data/credits";
import { getDevice } from "@/data/devices";
import { DevicePrompt } from "@/components/landing/DevicePrompt";
import { Box, FileCode2, MousePointerClick, TextCursorInput } from "lucide-react";
import { MarketingShell, PageHeader, Section, CtaBand } from "@/components/landing/Marketing";
import { AssetAttribution } from "@/components/landing/AssetAttribution";
import { HeroVisual } from "@/components/landing/HeroVisual";


export const metadata: Metadata = {
  title: "Lux3D pipeline · RepairVerse",
  description: "How RepairVerse uses Aholo Lux3D to generate device models and turns them into interactive repair lessons.",
};

const pipeline = [
  { icon: TextCursorInput, who: "You", t: "Write a prompt", d: "Describe the device: model, color, lid position, visible vents." },
  { icon: Box, who: "Aholo Lux3D", t: "Generate the model", d: "Lux3D generates the laptop's 3D geometry and materials." },
  { icon: FileCode2, who: "RepairVerse", t: "Prepare for the web", d: "Export, check scale and orientation, and keep textures small." },
  { icon: MousePointerClick, who: "RepairVerse", t: "Add the lesson", d: "Hotspots, internal illustrations, questions, feedback, scoring." },
];

export default function TechnologyPage() {
  return (
    <MarketingShell>
      <PageHeader
        kicker="Lux3D pipeline"
        title="Generated devices, written lessons"
        intro="Aholo Lux3D generates the device model. Everything you interact with on top of it, from the numbered hotspots to the score, is written by RepairVerse."
      >
        <p className="text-sm leading-relaxed text-dim">
          <AssetAttribution />
        </p>
      </PageHeader>

      <Section tone="surface" title="From prompt to lesson" intro="Four steps. Only the second one is Lux3D's job.">
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {pipeline.map((p, i) => (
            <li key={p.t} className="flex flex-col gap-6 bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className={p.who === "Aholo Lux3D" ? "grid size-11 place-items-center rounded-xl bg-accent text-fg" : "grid size-11 place-items-center rounded-xl bg-sunken text-fg"}>
                  <p.icon className="size-5" />
                </span>
                <span className="font-mono text-sm text-dim">{i + 1}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-accent-ink">{p.who}</p>
                <h3 className="text-xl font-semibold tracking-tight">{p.t}</h3>
                <p className="leading-relaxed text-muted">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="The prompt behind the model" intro="The exact text sent to Lux3D for the laptop on your bench. Each of the 50 laptops has its own.">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-line bg-fg p-6 text-surface lg:col-span-5 sm:p-8">
            <DevicePrompt />
          </div>
          <div className="lg:col-span-7">
            <HeroVisual />
          </div>
        </div>
      </Section>

      <Section tone="surface" title="Who does what" intro="We don't claim Lux3D does more than it does.">
        <div className="grid gap-6 md:grid-cols-2">
          <Column
            title="Aholo Lux3D"
            items={["Exterior laptop geometry", "Materials and surface detail", "The exported model file"]}
          />
          <Column
            title="RepairVerse"
            items={[
              "Numbered hotspots placed on the model",
              "Internal cooling parts, drawn as labeled teaching illustrations",
              "Mission steps, questions, and written feedback",
              "Fixed-rule scoring out of 100",
              "Loading, error, and fallback states",
            ]}
          />
        </div>
      </Section>

      <Section title="If the model can't load" intro="The simulator keeps working.">
        <dl className="grid gap-8 md:grid-cols-3">
          {[
            ["Export not deployed yet", "A clearly labeled temporary model is shown. It is never presented as Lux3D output."],
            ["File fails to load", "The viewer falls back to the temporary model and says so in the corner badge."],
            ["Internals", "Lux3D models the outside. The fan, heatsink, and battery are RepairVerse illustrations, labeled in the viewer."],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-line pt-4">
              <dt className="mb-1 font-semibold">{t}</dt>
              <dd className="leading-relaxed text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        title="Photo credits"
        intro="Some laptops are generated from a photo with Lux3D image-to-3D. These photos are freely licensed on Wikimedia Commons. Models made from CC BY-SA photos are shared under the same license."
      >
        <ul className="divide-y divide-line border-y border-line">
          {photoCredits.map((c) => {
            const device = getDevice(c.deviceId);
            return (
              <li key={c.deviceId} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium">
                  {device.brand} {device.name}
                </span>
                <span className="text-sm text-muted">
                  <a href={c.source} className="underline underline-offset-2 hover:text-fg" rel="noreferrer" target="_blank">
                    “{c.title}”
                  </a>{" "}
                  by {c.author},{" "}
                  <a href={c.licenseUrl} className="underline underline-offset-2 hover:text-fg" rel="noreferrer" target="_blank">
                    {c.license}
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaBand title="See the model up close." body="Rotate it, zoom in, and open the bottom panel in any mission." />
    </MarketingShell>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <p className="mb-4 border-b border-line pb-4 text-xl font-semibold">{title}</p>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i} className="leading-relaxed text-muted">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
