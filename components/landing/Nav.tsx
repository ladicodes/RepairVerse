"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { RAIL } from "@/components/ui/Container";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/missions", label: "Missions" },
  { href: "/shift", label: "Shift mode" },
  { href: "/technology", label: "Lux3D pipeline" },
  { href: "/educators", label: "For educators" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b bg-bg transition-colors duration-150",
        scrolled || open ? "border-line" : "border-transparent",
      )}
    >
      <nav className={clsx(RAIL, "flex h-16 items-center justify-between gap-6")}>
        <Logo />
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className="text-sm text-muted transition-colors duration-150 hover:text-fg aria-[current=page]:text-fg"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ButtonLink href="/missions" className="hidden sm:inline-flex">
            Browse missions
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className={clsx(RAIL, "space-y-1 border-t border-line pb-4 pt-2 md:hidden")}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-2 py-3 text-base text-fg hover:bg-sunken"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="/missions" className="mt-2 w-full" onClick={() => setOpen(false)}>
            Browse missions
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
