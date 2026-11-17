import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMission, missions } from "@/data/missions";
import { MissionRunner } from "@/components/simulator/MissionRunner";

export function generateStaticParams() {
  return Object.keys(missions).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = getMission(id);
  return { title: m ? `${m.code} · ${m.title} · RepairVerse` : "Mission not found · RepairVerse" };
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getMission(id)) notFound();
  return <MissionRunner id={id} />;
}
