import type { Mission } from "../missions";
import { failingSsd, noBootDevice, ramUpgrade } from "./storage";
import { swollenBattery, wontCharge, wornBattery } from "./power";
import { crackedHinge, grindingFan, liquidSpill, noDisplay, wifiDrops } from "./hardware";

/** Missions beyond the original overheating laptop, keyed by id. */
export const extraMissions: Record<string, Mission> = Object.fromEntries(
  [
    wontCharge,
    swollenBattery,
    failingSsd,
    liquidSpill,
    noDisplay,
    wifiDrops,
    ramUpgrade,
    grindingFan,
    wornBattery,
    crackedHinge,
    noBootDevice,
  ].map((m) => [m.id, m]),
);
