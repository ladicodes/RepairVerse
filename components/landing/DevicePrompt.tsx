"use client";

import { useDevice } from "@/store/mission-store";

/** The Lux3D prompt for the laptop currently on the bench. */
export function DevicePrompt() {
  const device = useDevice();
  return (
    <>
      <p className="mb-4 text-sm text-gray-300">Prompt for the {device.name}</p>
      <p className="font-mono text-lg leading-relaxed">{device.model.prompt}</p>
    </>
  );
}
