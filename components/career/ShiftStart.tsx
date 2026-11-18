"use client";

import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { devices } from "@/data/devices";
import { pickShiftMission } from "@/lib/career";
import { useMissionStore } from "@/store/mission-store";
import { Button } from "@/components/ui/Button";

/** Starts a shift: a random open ticket on a random laptop, from a fresh start. */
export function ShiftStart() {
  const router = useRouter();
  const hydrated = useMissionStore((s) => s.hydrated);
  const start = () => {
    const { runs, setDevice, reset } = useMissionStore.getState();
    const mission = pickShiftMission(runs);
    setDevice(devices[Math.floor(Math.random() * devices.length)].id);
    reset(mission.id);
    router.push(`/mission/${mission.id}`);
  };
  return (
    <Button size="lg" onClick={start} disabled={!hydrated}>
      <Shuffle className="size-4" /> Start a shift
    </Button>
  );
}
