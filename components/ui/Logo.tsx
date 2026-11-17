import Link from "next/link";

/** A laptop with a numbered service-manual callout: the inspect gesture. */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <rect x="3" y="7" width="16" height="11" rx="1.5" stroke="var(--fg)" strokeWidth="2" />
      <path d="M1 21.5h20" stroke="var(--fg)" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.5 12.5 19.5 6.5" stroke="var(--fg)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21.5" cy="5" r="4" fill="var(--accent)" stroke="var(--fg)" strokeWidth="1.5" />
      <circle cx="13.5" cy="12.5" r="1.5" fill="var(--fg)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="RepairVerse home">
      <LogoMark />
      <span className="text-base font-semibold tracking-tight text-fg">RepairVerse</span>
    </Link>
  );
}
