import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingShell } from "@/components/landing/Marketing";
import { ResultsView } from "@/components/results/ResultsView";

export const metadata: Metadata = {
  title: "Results · RepairVerse",
  description: "Your score, answers, and what to remember from the mission.",
};

export default function ResultsPage() {
  return (
    <MarketingShell>
      <Suspense fallback={<div className="min-h-96" />}>
        <ResultsView />
      </Suspense>
    </MarketingShell>
  );
}
