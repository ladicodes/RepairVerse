import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function PageHeader({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="grid gap-8 pb-16 pt-12 lg:grid-cols-12 lg:items-end lg:pt-20">
      <div className="space-y-6 lg:col-span-7">
        <p className="text-sm font-medium text-accent-ink">{kicker}</p>
        <h1 className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl">{title}</h1>
      </div>
      <div className="space-y-6 lg:col-span-5">
        <p className="text-lg leading-relaxed text-muted">{intro}</p>
        {children}
      </div>
    </Container>
  );
}

/** A section whose heading sits above full-width content. One gap token: py-24. */
export function Section({
  id,
  title,
  intro,
  tone = "bg",
  action,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  tone?: "bg" | "surface";
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={clsx("scroll-mt-16 border-t border-line py-24", tone === "surface" && "bg-surface")}>
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
            {intro && <p className="text-lg leading-relaxed text-muted">{intro}</p>}
          </div>
          {action}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-fg py-24 text-surface">
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h2>
          <p className="text-lg text-gray-300">{body}</p>
        </div>
        <ButtonLink href="/mission/001" size="lg" variant="accent">
          Start repair mission <ArrowRight className="size-4" />
        </ButtonLink>
      </Container>
    </section>
  );
}
