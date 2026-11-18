import type { Vec3 } from "./missions";

/**
 * Where each internal part sits in the viewer's normalized laptop frame, and where
 * the camera goes to look at it. Missions place their hotspots on these anchors so
 * every mission lines up with the same 3D model and internal illustration.
 */
export const PARTS = {
  fan: { position: [0.92, 0.2, -0.42], camera: [2.2, 2.5, 1.0] },
  vents: { position: [1.63, 0.08, -0.22], camera: [3.5, 1.2, 0.9] },
  heatsink: { position: [0.92, 0.2, -0.94], camera: [1.9, 2.8, 0.4] },
  battery: { position: [0, 0.16, 0.55], camera: [0.4, 2.4, 2.6] },
  board: { position: [-0.25, 0.2, -0.5], camera: [-1.4, 2.4, 1.2] },
  ram: { position: [-1.0, 0.12, -0.05], camera: [-2.1, 2.3, 1.7] },
  ssd: { position: [0.1, 0.1, 0.0], camera: [0.7, 2.5, 2.1] },
  wifi: { position: [-1.32, 0.1, -0.55], camera: [-2.7, 2.3, 0.7] },
  dcjack: { position: [-1.6, 0.08, -0.72], camera: [-3.4, 1.2, -0.1] },
  ports: { position: [-1.6, 0.08, -0.2], camera: [-3.4, 1.2, 0.6] },
  hinge: { position: [-0.6, 0.14, -1.04], camera: [-1.1, 2.6, 1.7] },
} satisfies Record<string, { position: Vec3; camera: Vec3 }>;

export type PartId = keyof typeof PARTS;

/** Anchor fields for a hotspot on a known part. */
export function at(part: PartId) {
  const p = PARTS[part];
  return { position: [...p.position] as Vec3, camera: [...p.camera] as Vec3 };
}
