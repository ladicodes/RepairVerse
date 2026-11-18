"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function HeroCopy() {
  const reduce = useReducedMotion();
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="max-w-xl space-y-8">
      <motion.h1 {...item(0)} className="text-5xl font-semibold leading-none tracking-tight text-fg sm:text-6xl xl:text-7xl">
        Learn real-world repair skills in 3D
      </motion.h1>

      <motion.p {...item(1)} className="max-w-md text-lg leading-relaxed text-muted">
        Open a virtual laptop, collect clues, and decide what a technician would do. Every choice gets an explanation, so
        you learn before you pick up a screwdriver.
      </motion.p>

      <motion.div {...item(2)} className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <ButtonLink href="/missions" size="lg">
          Browse missions <ArrowRight className="size-4" />
        </ButtonLink>
        <ButtonLink href="/how-it-works" variant="plain" className="px-0 text-base">
          How a mission works
        </ButtonLink>
      </motion.div>

      <motion.p {...item(3)} className="text-sm text-dim">
        Free, no account, about 6 minutes.
      </motion.p>
    </div>
  );
}
