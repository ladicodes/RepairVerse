"use client";

import { missions } from "@/data/missions";
import { useAssetStatus } from "@/components/three/asset";

/** Attribution text that never claims Lux3D unless the Lux3D export is deployed. */
export function AssetAttribution() {
  const status = useAssetStatus(missions["001"].model.url);
  if (status === "lux3d") {
    return (
      <>
        Device shell generated with <span className="text-fg">Aholo Lux3D</span>. Hotspots, mission logic, scoring, and
        internal cooling illustrations by RepairVerse.
      </>
    );
  }
  return (
    <>
      Designed around <span className="text-fg">Aholo Lux3D</span> assets. The Lux3D device export is pending, so a
      temporary model is shown. Mission logic and internal illustrations by RepairVerse.
    </>
  );
}
