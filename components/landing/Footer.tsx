import Link from "next/link";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { RAIL } from "@/components/ui/Container";
import { AssetAttribution } from "./AssetAttribution";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className={clsx(RAIL, "grid gap-12 py-16 md:grid-cols-4")}>
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Practice repair decisions on a virtual device before you touch real hardware.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            ["/missions", "Mission 001"],
            ["/how-it-works", "How it works"],
            ["/results", "Your last result"],
          ]}
        />
        <FooterCol
          title="Learn more"
          links={[
            ["/technology", "Lux3D pipeline"],
            ["/educators", "For educators"],
            ["/how-it-works#safety", "Safety"],
          ]}
        />
        <div className="space-y-3">
          <p className="text-sm font-medium text-fg">Attribution</p>
          <p className="text-sm leading-relaxed text-muted">
            <AssetAttribution />
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className={clsx(RAIL, "flex flex-col gap-2 py-6 text-sm text-dim sm:flex-row sm:justify-between")}>
          <p>Built for the Aholo Global 3D AI Hackathon.</p>
          <p>Scores are learning feedback, not a certification.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-fg">{title}</p>
      <ul className="space-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-sm text-muted transition-colors duration-150 hover:text-fg">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
