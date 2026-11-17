"use client";

import { useEffect, useMemo } from "react";
import { Instance, Instances, RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "@/data/missions";
import { makeScreenTexture, type ScreenMode } from "./textures";

export const LID_ANGLE = -0.26;

// HP 15-style layout: full keyboard plus numeric keypad.
const ROWS: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1],
];
const LEGENDS: string[][] = [
  ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "del"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "enter"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["ctrl", "fn", "", "alt", "", "alt", "ctrl", "◀", "▼", "▶"],
];
const NUMPAD: number[][] = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [2, 1, 1],
];
const PAD_LEGENDS: string[][] = [
  ["home", "pgup", "pgdn", "end"],
  ["num", "/", "*", "-"],
  ["7", "8", "9", "+"],
  ["4", "5", "6", "⏎"],
  ["1", "2", "3", "▲"],
  ["0", ".", ""],
];
const MAIN_U = 14.5;
const PAD_U = 4;
const SPLIT_U = 0.35;
const KB_WIDTH = 2.9;
const PITCH = KB_WIDTH / (MAIN_U + SPLIT_U + PAD_U);
const GAP = 0.024;
const KB_LEFT = -KB_WIDTH / 2;
const MAIN_CENTER_X = KB_LEFT + (MAIN_U * PITCH) / 2;
const KB_TOP_Z = -0.92;
const KEY_TOP_Y = 0.143;

type Key = { x: number; z: number; w: number; d: number; label: string };

function layoutKeys(): Key[] {
  const out: Key[] = [];
  const place = (rows: number[][], labels: string[][], left: number) =>
    rows.forEach((row, r) => {
      const fn = r === 0;
      const d = (fn ? 0.6 : 1) * PITCH - GAP;
      const z = KB_TOP_Z + (fn ? 0.3 * PITCH : 0.6 * PITCH + (r - 0.5) * PITCH);
      let x = left;
      row.forEach((u, c) => {
        out.push({ x: x + (u * PITCH) / 2, z, w: u * PITCH - GAP, d, label: labels[r]?.[c] ?? "" });
        x += u * PITCH;
      });
    });
  place(ROWS, LEGENDS, KB_LEFT);
  place(NUMPAD, PAD_LEGENDS, KB_LEFT + (MAIN_U + SPLIT_U) * PITCH);
  return out;
}

/** Key legends painted onto one transparent texture laid over the key tops. */
function makeLegendTexture(keys: Key[], depth: number) {
  if (typeof document === "undefined") return null;
  const scale = 700; // px per world unit
  const w = Math.round(KB_WIDTH * scale);
  const h = Math.round(depth * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "rgba(225,230,238,0.92)";
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const k of keys) {
    if (!k.label) continue;
    const px = (k.x - KB_LEFT) * scale;
    const pz = (k.z - KB_TOP_Z) * scale;
    const long = k.label.length > 1;
    g.font = `${long ? 500 : 600} ${long ? 17 : 26}px ui-sans-serif, system-ui, sans-serif`;
    if (long) {
      g.textAlign = "left";
      g.fillText(k.label, px - (k.w * scale) / 2 + 10, pz + (k.d * scale) / 4);
      g.textAlign = "center";
    } else {
      g.fillText(k.label, px, pz);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const SILVER = { color: "#cdd2d9", metalness: 0.6, roughness: 0.42 } as const;
const SILVER_DARK = { color: "#a9b0ba", metalness: 0.55, roughness: 0.5 } as const;

/**
 * Temporary procedural laptop shell, styled after an HP 15-inch laptop.
 * Used only when the Lux3D export is not listed in the model manifest.
 * The UI labels it as a placeholder.
 */
export function ProceduralShell({ xray, screen }: { xray: boolean; screen: ScreenMode }) {
  const tex = useMemo(() => makeScreenTexture(screen), [screen]);
  useEffect(() => () => tex?.dispose(), [tex]);

  const keys = useMemo(layoutKeys, []);
  const kbDepth = useMemo(() => Math.max(...keys.map((k) => k.z + k.d / 2)) - KB_TOP_Z + 0.02, [keys]);
  const legends = useMemo(() => makeLegendTexture(keys, kbDepth), [keys, kbDepth]);
  useEffect(() => () => legends?.dispose(), [legends]);

  const xr = { transparent: xray, opacity: xray ? 0.1 : 1, depthWrite: !xray };

  return (
    <group>
      {/* Bottom case (darker) */}
      <RoundedBox args={[3.18, 0.05, 2.18]} radius={0.024} smoothness={4} position={[0, 0.026, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...SILVER_DARK} {...xr} />
      </RoundedBox>
      {/* Top case */}
      <RoundedBox args={[3.2, 0.085, 2.2]} radius={0.04} smoothness={5} position={[0, 0.0885, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SILVER} clearcoat={0.25} clearcoatRoughness={0.4} {...xr} />
      </RoundedBox>

      {!xray && (
        <group>
          {/* Keyboard recess */}
          <mesh position={[0, 0.1312, KB_TOP_Z + kbDepth / 2 - 0.01]}>
            <boxGeometry args={[KB_WIDTH + 0.06, 0.001, kbDepth + 0.05]} />
            <meshStandardMaterial color="#20252e" roughness={0.8} />
          </mesh>
          {/* All keys in one draw call */}
          <Instances limit={keys.length}>
            <boxGeometry args={[1, 0.012, 1]} />
            <meshStandardMaterial color="#15181e" roughness={0.75} metalness={0.05} />
            {keys.map((k, i) => (
              <Instance key={i} position={[k.x, KEY_TOP_Y - 0.006, k.z]} scale={[k.w, 1, k.d]} />
            ))}
          </Instances>
          {legends && (
            <mesh position={[0, KEY_TOP_Y + 0.0006, KB_TOP_Z + kbDepth / 2 - 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[KB_WIDTH, kbDepth]} />
              <meshBasicMaterial map={legends} transparent depthWrite={false} toneMapped={false} />
            </mesh>
          )}

          {/* Trackpad: flush glass with a thin chamfer */}
          <mesh position={[MAIN_CENTER_X, 0.1312, 0.56]}>
            <boxGeometry args={[1.18, 0.001, 0.7]} />
            <meshStandardMaterial color="#8f97a2" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[MAIN_CENTER_X, 0.1316, 0.56]}>
            <boxGeometry args={[1.16, 0.001, 0.68]} />
            <meshPhysicalMaterial color="#c3c9d1" metalness={0.3} roughness={0.18} clearcoat={0.6} />
          </mesh>

          {/* Front lip notch and status LED */}
          <mesh position={[0, 0.112, 1.101]}>
            <boxGeometry args={[0.5, 0.012, 0.004]} />
            <meshStandardMaterial color="#8f97a2" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[-1.35, 0.07, 1.101]}>
            <boxGeometry args={[0.03, 0.008, 0.002]} />
            <meshBasicMaterial color={screen === "off" ? "#3b414b" : "#e8f4ff"} toneMapped={false} />
          </mesh>

          {/* Right side: intake vent slots */}
          {Array.from({ length: 14 }).map((_, i) => (
            <mesh key={i} position={[1.6015, 0.06, -0.6 + i * 0.05]}>
              <boxGeometry args={[0.003, 0.03, 0.026]} />
              <meshStandardMaterial color="#1a1e25" />
            </mesh>
          ))}

          {/* Left side ports: barrel jack, USB-A, HDMI, USB-A, USB-C, audio */}
          {[
            { z: -0.72, w: 0.05, h: 0.05, round: true },
            { z: -0.5, w: 0.12, h: 0.04 },
            { z: -0.3, w: 0.13, h: 0.045 },
            { z: -0.1, w: 0.12, h: 0.04 },
            { z: 0.06, w: 0.08, h: 0.025, round: true },
            { z: 0.22, w: 0.04, h: 0.04, round: true },
          ].map((p, i) => (
            <RoundedBox
              key={i}
              args={[0.006, p.h, p.w]}
              radius={p.round ? Math.min(p.h, p.w) / 2 - 0.001 : 0.004}
              smoothness={3}
              position={[-1.6015, 0.075, p.z]}
            >
              <meshStandardMaterial color="#0e1116" roughness={0.6} />
            </RoundedBox>
          ))}
        </group>
      )}

      {/* Hinge bar */}
      <mesh position={[0, 0.135, -1.065]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 2.7, 24]} />
        <meshStandardMaterial color="#3a4049" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Lid */}
      <group position={[0, 0.135, -1.08]} rotation={[LID_ANGLE, 0, 0]}>
        <RoundedBox args={[3.2, 2.08, 0.045]} radius={0.022} smoothness={4} position={[0, 1.04, -0.024]} castShadow>
          <meshPhysicalMaterial {...SILVER} clearcoat={0.25} clearcoatRoughness={0.4} />
        </RoundedBox>
        {/* Bezel */}
        <mesh position={[0, 1.04, 0.0002]}>
          <planeGeometry args={[3.14, 2.02]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.3} />
        </mesh>
        {/* Panel */}
        <mesh position={[0, 1.07, 0.0012]}>
          <planeGeometry args={[3.02, 1.7]} />
          {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshBasicMaterial color="#0a0c10" />}
        </mesh>
        {/* Glass: catches environment reflections */}
        <mesh position={[0, 1.04, 0.003]}>
          <planeGeometry args={[3.14, 2.02]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.06} roughness={0.04} metalness={0} clearcoat={1} depthWrite={false} />
        </mesh>
        {/* Webcam */}
        <mesh position={[0, 1.99, 0.0015]}>
          <circleGeometry args={[0.012, 20]} />
          <meshStandardMaterial color="#1d2633" roughness={0.1} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Loads the Aholo Lux3D-generated GLB, centers it, and fits it to the
 * same footprint as the procedural layout so hotspots line up.
 */
export function Lux3DShell({ url, xray, rotation }: { url: string; xray: boolean; rotation?: Vec3 }) {
  const { scene } = useGLTF(url);

  const { object, scale, offset } = useMemo(() => {
    const obj = scene.clone(true);
    if (rotation) obj.rotation.set(...rotation);
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3.2 / Math.max(size.x, 1e-6);
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.material = Array.isArray(mesh.material) ? mats.map((m) => m.clone()) : mats[0].clone();
      }
    });
    return {
      object: obj,
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [scene, rotation]);

  useEffect(() => {
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        m.transparent = xray;
        m.opacity = xray ? 0.12 : 1;
        m.depthWrite = !xray;
        m.needsUpdate = true;
      }
    });
  }, [object, xray]);

  return (
    <group position={offset} scale={scale}>
      <primitive object={object} />
    </group>
  );
}
