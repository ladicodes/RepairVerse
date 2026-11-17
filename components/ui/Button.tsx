import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps } from "react";

/** Action pyramid: one ink primary per view, outline secondary, plain tertiary. */
type Variant = "primary" | "secondary" | "plain" | "accent";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-surface hover:bg-gray-700",
  secondary: "border border-line-strong bg-surface text-fg hover:border-gray-400",
  plain: "text-fg hover:text-accent-ink",
  /** Only on the dark surface, where an ink button would vanish. */
  accent: "bg-accent text-fg hover:bg-surface",
};

const sizes = { md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...rest} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link className={clsx(base, variants[variant], sizes[size], className)} {...rest} />;
}
