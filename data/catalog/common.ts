import type { Mission } from "../missions";

/** Every mission is scored out of 100 with the same split. */
export const SCORING: Mission["scoring"] = {
  safety: 20,
  inspection: 20,
  diagnosis: 30,
  repair: 30,
  hintCost: 5,
  ineffectiveRepair: 20,
};

/** Missions run on the learner's chosen laptop; this is the fallback asset record. */
export const LAPTOP_MODEL: Mission["model"] = {
  url: "/models/laptop.glb",
  source: "lux3d",
  prompt:
    "A 15.6-inch everyday laptop, lid open, natural silver aluminium chassis, light gray keyboard with numeric keypad, large trackpad, visible side air vents, studio lighting",
};

export const DEVICE = "Laptop of your choice";
