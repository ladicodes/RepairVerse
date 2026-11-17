import { MarketingShell } from "@/components/landing/Marketing";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <MarketingShell>
      <Container className="py-32">
        <p className="mb-4 font-mono text-sm text-dim">404</p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">There&apos;s no ticket with that number</h1>
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted">
          The mission or page you asked for doesn&apos;t exist. Mission 001 is the one available right now.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/mission/001" size="lg">
            Open Mission 001
          </ButtonLink>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </MarketingShell>
  );
}
