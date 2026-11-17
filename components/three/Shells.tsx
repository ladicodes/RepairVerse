"use client";

import { useEffect, useMemo } from "react";
import { Instance, Instances, RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Vec3 } from "@/data/missions";
import { makeScreenTexture, type ScreenMode } from "./textures";

export const LID_ANGLE = -0.32;

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
  g.fillStyle = "rgba(48,53,61,0.9)";
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

/* ---------- Case geometry ---------- */

function roundedRect(w: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + d - r);
  s.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + d);
  s.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * A flat slab with rounded corners in plan and a single diamond-cut chamfer on the
 * top and bottom edges, like a machined aluminium case. Lies flat: y from 0 to h,
 * centered on x and z. Normals are smooth around the corners and sharp at the chamfer.
 */
function caseSlab(w: number, d: number, h: number, r: number, chamfer: number) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * chamfer, d - 2 * chamfer, Math.max(r - chamfer, 0.002)), {
    depth: h - 2 * chamfer,
    bevelEnabled: true,
    bevelThickness: chamfer,
    bevelSize: chamfer,
    bevelSegments: 1,
    curveSegments: 20,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, chamfer, 0);
  return toCreasedNormals(g, 0.5);
}

function flatRounded(w: number, d: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRect(w, d, r), 16);
  g.rotateX(-Math.PI / 2);
  return g;
}

/* ---------- Brushed aluminium ---------- */

let brushed: { color: THREE.CanvasTexture; rough: THREE.CanvasTexture } | null = null;

/** Fine horizontal grain, shared by every metal part. Created once per page. */
function brushedTextures() {
  if (brushed || typeof document === "undefined") return brushed;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "rgb(236,236,236)";
  g.fillRect(0, 0, 512, 512);
  // Deterministic grain so every render looks the same.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 3200; i++) {
    const v = 222 + Math.floor(rand() * 33);
    g.strokeStyle = `rgba(${v},${v},${v},${0.12 + rand() * 0.2})`;
    g.lineWidth = 1;
    const y = rand() * 512;
    const x = rand() * 512;
    g.beginPath();
    g.moveTo(x - 300, y);
    g.lineTo(x + 300, y + (rand() - 0.5));
    g.stroke();
  }
  const make = (srgb: boolean) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  brushed = { color: make(true), rough: make(false) };
  return brushed;
}

function Aluminium({ tone = "#dde1e6", rough = 0.34, xray }: { tone?: string; rough?: number; xray: boolean }) {
  const tex = brushedTextures();
  return (
    <meshPhysicalMaterial
      color={tone}
      map={tex?.color ?? null}
      roughnessMap={tex?.rough ?? null}
      metalness={0.92}
      roughness={rough}
      clearcoat={0.15}
      clearcoatRoughness={0.35}
      transparent={xray}
      opacity={xray ? 0.1 : 1}
      depthWrite={!xray}
    />
  );
}

/* ---------- Keycaps ---------- */

/** Keycaps grouped by size so each size is one instanced draw with true rounded corners. */
function Keycaps({ keys }: { keys: Key[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, { w: number; d: number; geo: RoundedBoxGeometry; items: Key[] }>();
    for (const k of keys) {
      const id = `${k.w.toFixed(4)}x${k.d.toFixed(4)}`;
      if (!m.has(id)) m.set(id, { w: k.w, d: k.d, geo: new RoundedBoxGeometry(k.w, KEY_H, k.d, 3, 0.0055), items: [] });
      m.get(id)!.items.push(k);
    }
    return [...m.values()];
  }, [keys]);
  useEffect(() => () => groups.forEach((g) => g.geo.dispose()), [groups]);

  return (
    <>
      {groups.map((g, gi) => (
        <Instances key={gi} limit={g.items.length} geometry={g.geo}>
          <meshPhysicalMaterial color="#d6d9de" roughness={0.55} metalness={0.25} clearcoat={0.1} />
          {g.items.map((k, i) => (
            <Instance key={i} position={[k.x, KEY_TOP_Y - KEY_H / 2, k.z]} />
          ))}
        </Instances>
      ))}
    </>
  );
}

/* ---------- Shell ---------- */

const DECK_Y = 0.131;
const KEY_H = 0.013;
const BASE = { w: 3.2, d: 2.2, r: 0.11 };
const LID = { w: 3.2, h: 2.08, t: 0.036, r: 0.1 };
const SCREEN = { w: 3.02, h: 1.7, y: 1.09 };

/**
 * Procedural laptop, styled after an HP 15-inch laptop: machined aluminium case,
 * island keyboard with numeric keypad, glass-covered display with slim bezels.
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

  const geo = useMemo(() => {
    const lid = caseSlab(LID.w, LID.h, LID.t, LID.r, 0.006);
    // Stand the lid up: plan depth becomes height, thickness faces the user.
    lid.rotateX(Math.PI / 2);
    lid.translate(0, LID.h / 2, -LID.t);
    const glass = new THREE.ShapeGeometry(roundedRect(LID.w - 0.03, LID.h - 0.03, LID.r - 0.015), 16);
    glass.translate(0, LID.h / 2, 0);
    return {
      top: caseSlab(BASE.w, BASE.d, DECK_Y - 0.036, BASE.r, 0.009),
      bottom: caseSlab(BASE.w - 0.02, BASE.d - 0.02, 0.04, BASE.r - 0.01, 0.008),
      well: flatRounded(KB_WIDTH + 0.07, kbDepth + 0.06, 0.03),
      padRim: flatRounded(1.2, 0.72, 0.04),
      pad: flatRounded(1.18, 0.7, 0.035),
      lid,
      glass,
    };
  }, [kbDepth]);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  return (
    <group>
      {/* Bottom case: slightly inset, darker anodized shell */}
      <mesh geometry={geo.bottom} position={[0, 0, 0]} castShadow receiveShadow>
        <Aluminium tone="#aab0b8" rough={0.48} xray={xray} />
      </mesh>
      {/* Top case with diamond-cut edge */}
      <mesh geometry={geo.top} position={[0, 0.036, 0]} castShadow receiveShadow>
        <Aluminium xray={xray} />
      </mesh>

      {!xray && (
        <group>
          {/* Keyboard well: shadowed recess in the deck, visible between the keys */}
          <mesh geometry={geo.well} position={[0, DECK_Y + 0.0004, KB_TOP_Z + kbDepth / 2 - 0.01]}>
            <meshStandardMaterial color="#6f757d" metalness={0.6} roughness={0.6} />
          </mesh>
          <Keycaps keys={keys} />
          {legends && (
            <mesh position={[0, KEY_TOP_Y + 0.0006, KB_TOP_Z + kbDepth / 2 - 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[KB_WIDTH, kbDepth]} />
              <meshBasicMaterial map={legends} transparent depthWrite={false} toneMapped={false} />
            </mesh>
          )}

          {/* Trackpad: polished rim around a fine-matte glass surface */}
          <mesh geometry={geo.padRim} position={[MAIN_CENTER_X, DECK_Y + 0.0004, 0.56]}>
            <meshStandardMaterial color="#eef0f3" metalness={1} roughness={0.08} />
          </mesh>
          <mesh geometry={geo.pad} position={[MAIN_CENTER_X, DECK_Y + 0.0008, 0.56]}>
            <meshPhysicalMaterial color="#d3d7dd" metalness={0.85} roughness={0.42} clearcoat={0.3} clearcoatRoughness={0.4} />
          </mesh>

          {/* Front lip notch and status LED */}
          <mesh position={[0, 0.112, 1.101]}>
            <boxGeometry args={[0.5, 0.012, 0.004]} />
            <meshStandardMaterial color="#8f97a2" metalness={0.8} roughness={0.4} />
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

      {/* Hinge: dark barrel tucked behind the deck, with aluminium end caps */}
      <mesh position={[0, 0.118, -1.075]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 32]} />
        <meshStandardMaterial color="#2b3038" metalness={0.6} roughness={0.45} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.37, 0.118, -1.075]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.22, 32]} />
          <Aluminium xray={false} />
        </mesh>
      ))}

      {/* Lid */}
      <group position={[0, 0.118, -1.06]} rotation={[LID_ANGLE, 0, 0]}>
        <mesh geometry={geo.lid} castShadow>
          <Aluminium xray={false} />
        </mesh>
        {/* Edge-to-edge black glass */}
        <mesh geometry={geo.glass} position={[0, 0, 0.0004]}>
          <meshStandardMaterial color="#07080b" roughness={0.25} metalness={0} />
        </mesh>
        {/* Panel */}
        <mesh position={[0, SCREEN.y, 0.0012]}>
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshBasicMaterial color="#07080b" />}
        </mesh>
        {/* Cover glass: picks up softbox reflections across the whole front */}
        <mesh geometry={geo.glass} position={[0, 0, 0.0024]}>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.03} metalness={0} clearcoat={1} depthWrite={false} />
        </mesh>
        {/* Webcam with lens ring */}
        <mesh position={[0, SCREEN.y + SCREEN.h / 2 + 0.06, 0.0016]}>
          <circleGeometry args={[0.016, 24]} />
          <meshStandardMaterial color="#141820" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, SCREEN.y + SCREEN.h / 2 + 0.06, 0.0018]}>
          <circleGeometry args={[0.007, 24]} />
          <meshPhysicalMaterial color="#1b2a44" roughness={0.05} clearcoat={1} />
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
