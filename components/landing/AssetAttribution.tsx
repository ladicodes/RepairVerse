"use client";

import { useAssetStatus } from "@/components/three/asset";
import { useDevice } from "@/store/mission-store";

/** Attribution text that never claims Lux3D unless the Lux3D export is deployed. */
export function AssetAttribution() {
  const device = useDevice();
  const status = useAssetStatus(device.model.url);
  if (status === "lux3d") {
    return (
      <>
        The {device.name} shell was generated with <span className="text-fg">Aholo Lux3D</span>. Hotspots, mission logic, scoring, and
        internal cooling illustrations by RepairVerse.
      </>
    );
  }
  return (
    <>
      Designed around <span className="text-fg">Aholo Lux3D</span> assets. The Lux3D export for the {device.name} is
      pending, so a temporary model is shown. Mission logic and internal illustrations by RepairVerse.
    </>
  );
}
