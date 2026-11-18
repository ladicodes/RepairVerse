"use client";

import { useEffect, useMemo } from "react";
import { Instance, Instances, RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Vec3 } from "@/data/missions";
import type { DeviceLook } from "@/data/devices";
import { makeScreenTexture, screenKey, type ScreenInput } from "./textures";

export const LID_ANGLE = -0.32;

// Full keyboard layout; the numeric keypad is optional per device.
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
const KB_TOP_Z = -0.92;
const KEY_TOP_Y = 0.143;

type Key = { x: number; z: number; w: number; d: number; label: string };

interface KeyLayout {
  keys: Key[];
  width: number;
  left: number;
  mainCenterX: number;
  pitch: number;
}

/** Full keyboard with keypad spans 2.9 units; a tenkeyless board is centered and slightly larger per key. */
function layoutKeys(numpad: boolean, gap: number): KeyLayout {
  const width = numpad ? 2.9 : 2.62;
  const pitch = width / (numpad ? MAIN_U + SPLIT_U + PAD_U : MAIN_U);
  const left = -width / 2;
  const out: Key[] = [];
  const place = (rows: number[][], labels: string[][], start: number) =>
    rows.forEach((row, r) => {
      const fn = r === 0;
      const d = (fn ? 0.6 : 1) * pitch - gap;
      const z = KB_TOP_Z + (fn ? 0.3 * pitch : 0.6 * pitch + (r - 0.5) * pitch);
      let x = start;
      row.forEach((u, c) => {
        out.push({ x: x + (u * pitch) / 2, z, w: u * pitch - gap, d, label: labels[r]?.[c] ?? "" });
        x += u * pitch;
      });
    });
  place(ROWS, LEGENDS, left);
  if (numpad) place(NUMPAD, PAD_LEGENDS, left + (MAIN_U + SPLIT_U) * pitch);
  return { keys: out, width, left, mainCenterX: left + (MAIN_U * pitch) / 2, pitch };
}

/** Key legends painted onto one transparent texture laid over the key tops. */
function makeLegendTexture({ keys, width, left }: KeyLayout, depth: number, color: string) {
  if (typeof document === "undefined") return null;
  const scale = 700; // px per world unit
  const w = Math.round(width * scale);
  const h = Math.round(depth * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = color;
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const k of keys) {
    if (!k.label) continue;
    const px = (k.x - left) * scale;
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

/** Case surface: brushed aluminium, or a matte soft-touch coating. */
function CaseMaterial({
  tone,
  finish,
  rough = 0.34,
  xray,
}: {
  tone: string;
  finish: DeviceLook["finish"];
  rough?: number;
  xray: boolean;
}) {
  if (finish === "metal") return <Aluminium tone={tone} rough={rough} xray={xray} />;
  return (
    <meshPhysicalMaterial
      color={tone}
      metalness={0.05}
      roughness={0.82}
      sheen={0.3}
      sheenRoughness={0.8}
      transparent={xray}
      opacity={xray ? 0.1 : 1}
      depthWrite={!xray}
    />
  );
}

/** Shifts a hex color toward black (amount < 0) or white (amount > 0). */
function shade(hex: string, amount: number) {
  const c = new THREE.Color(hex);
  return `#${c.lerp(new THREE.Color(amount < 0 ? "#000000" : "#ffffff"), Math.abs(amount)).getHexString()}`;
}

/* ---------- Keycaps ---------- */

/** Keycaps grouped by size so each size is one instanced draw with true rounded corners. */
function Keycaps({ keys, color }: { keys: Key[]; color: string }) {
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
          <meshPhysicalMaterial color={color} roughness={0.55} metalness={0.25} clearcoat={0.1} />
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
const PAD_Z = 0.56;

/* ---------- Lid cover ---------- */

/** Chevron outline for the gaming emblem, centered on the origin. */
function wingShape(w: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(0, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(w * 0.28, h / 2);
  s.lineTo(0, -h * 0.05);
  s.lineTo(-w * 0.28, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  return s;
}

/** Thin inset seam around the lid back. */
function seamFrame(w: number, h: number, r: number, t: number) {
  const outer = roundedRect(w, h, r);
  outer.holes.push(new THREE.Path(roundedRect(w - t * 2, h - t * 2, Math.max(r - t, 0.002)).getPoints(24)));
  return new THREE.ShapeGeometry(outer, 16);
}

/**
 * Outside of the lid: generic emblem and trim, styled from the device look.
 * Gaming looks get a chevron emblem lit in the backlight color, accent strips and
 * hinge-side vents; business looks a small corner plate; others a polished ring.
 * No manufacturer logos are drawn.
 */
function LidCover({ look, powered }: { look: DeviceLook; powered: boolean }) {
  const kind = look.rearVent || look.lightbar ? "gaming" : look.trackpoint ? "business" : "premium";
  const glow = look.backlight ?? look.lightbar ?? "#e5e7eb";
  const geo = useMemo(
    () => ({
      seam: seamFrame(LID.w - 0.08, LID.h - 0.08, LID.r - 0.03, 0.006),
      wing: new THREE.ShapeGeometry(wingShape(0.42, 0.26)),
      plate: flatRounded(0.42, 0.09, 0.02),
    }),
    [],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const z = -LID.t - 0.0009;
  const cy = LID.h * 0.56;
  const trim = shade(look.lid, new THREE.Color(look.lid).getHSL({ h: 0, s: 0, l: 0 }).l < 0.4 ? 0.18 : -0.18);

  return (
    <group position={[0, 0, z]} rotation={[0, Math.PI, 0]}>
      <mesh geometry={geo.seam} position={[0, LID.h / 2, 0]}>
        <meshStandardMaterial color={trim} metalness={0.5} roughness={0.5} />
      </mesh>

      {kind === "premium" && (
        <group position={[0, cy, 0.0004]}>
          <mesh>
            <ringGeometry args={[0.1, 0.135, 48]} />
            <meshStandardMaterial color={shade(look.lid, 0.35)} metalness={1} roughness={0.08} />
          </mesh>
          <mesh position={[0, 0, 0.0003]}>
            <circleGeometry args={[0.1, 48]} />
            <meshStandardMaterial color={shade(look.lid, -0.08)} metalness={0.9} roughness={0.35} />
          </mesh>
        </group>
      )}

      {kind === "business" && (
        <group position={[-LID.w / 2 + 0.42, LID.h - 0.2, 0.0004]}>
          <mesh geometry={geo.plate} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={shade(look.lid, 0.12)} metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0.15, 0, 0.0004]}>
            <circleGeometry args={[0.014, 20]} />
            <meshBasicMaterial color={powered ? "#ef4444" : "#7f1d1d"} toneMapped={false} />
          </mesh>
        </group>
      )}

      {kind === "gaming" && (
        <group>
          <mesh geometry={geo.wing} position={[0, cy, 0.0004]}>
            <meshBasicMaterial color={powered ? glow : shade(glow, -0.6)} toneMapped={false} />
          </mesh>
          {/* Accent strips running diagonally from the emblem */}
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * 0.78, cy - 0.32, 0.0004]} rotation={[0, 0, sd * 0.5]}>
              <planeGeometry args={[0.9, 0.012]} />
              <meshBasicMaterial color={powered ? glow : shade(glow, -0.6)} toneMapped={false} transparent opacity={0.85} />
            </mesh>
          ))}
          {/* Faceted panel across the top of the lid */}
          <mesh position={[0, LID.h - 0.32, 0.0003]}>
            <planeGeometry args={[LID.w - 0.5, 0.24]} />
            <meshStandardMaterial color={shade(look.lid, 0.08)} metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Hinge-side vents */}
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh key={i} position={[-0.75 + i * 0.1, 0.09, 0.0004]}>
              <planeGeometry args={[0.05, 0.07]} />
              <meshStandardMaterial color="#0b0c0f" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/** HP 15 look, used when no device look is passed. */
export const DEFAULT_LOOK: DeviceLook = {
  deck: "#dde1e6",
  bottom: "#aab0b8",
  lid: "#dde1e6",
  finish: "metal",
  keycap: "#d6d9de",
  legend: "rgba(48,53,61,0.9)",
  keyGap: 0.024,
  numpad: true,
};

/**
 * Procedural laptop styled from a device look: case finish and colors, island
 * keyboard with or without numeric keypad, optional backlight, pointing stick,
 * light bar and rear vents. Used only when the Lux3D export is not listed in the
 * model manifest. The UI labels it as a placeholder.
 */
export function ProceduralShell({
  xray,
  screen,
  look = DEFAULT_LOOK,
}: {
  xray: boolean;
  screen: ScreenInput;
  look?: DeviceLook;
}) {
  const key = screenKey(screen);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on content, not object identity
  const tex = useMemo(() => makeScreenTexture(screen), [key]);
  useEffect(() => () => tex?.dispose(), [tex]);

  const powered = screen !== "off";
  const layout = useMemo(() => layoutKeys(look.numpad, look.keyGap), [look.numpad, look.keyGap]);
  const { keys } = layout;
  const kbDepth = useMemo(() => Math.max(...keys.map((k) => k.z + k.d / 2)) - KB_TOP_Z + 0.02, [keys]);
  const legendColor = powered && look.backlight ? look.backlight : look.legend;
  const legends = useMemo(() => makeLegendTexture(layout, kbDepth, legendColor), [layout, kbDepth, legendColor]);
  useEffect(() => () => legends?.dispose(), [legends]);

  // Pointing stick sits where G, H and B meet.
  const stick = useMemo(() => {
    if (!look.trackpoint) return null;
    const g = keys.find((k) => k.label === "G");
    const h = keys.find((k) => k.label === "H");
    if (!g || !h) return null;
    return { x: (g.x + h.x) / 2, z: g.z + layout.pitch / 2 };
  }, [look.trackpoint, keys, layout.pitch]);

  const padX = look.numpad ? layout.mainCenterX : 0;
  const padSize = look.trackpoint ? { w: 1.02, d: 0.56 } : { w: 1.18, d: 0.7 };
  const padZ = look.trackpoint ? PAD_Z + 0.07 : PAD_Z;
  const dark = new THREE.Color(look.deck).getHSL({ h: 0, s: 0, l: 0 }).l < 0.4;
  // Dark laptops get a bezel in their own case color; light ones keep a near-black bezel like the real models.
  const bezel = dark ? shade(look.lid, -0.35) : "#0b0d11";

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
      well: flatRounded(layout.width + 0.07, kbDepth + 0.06, 0.03),
      padRim: flatRounded(padSize.w + 0.02, padSize.d + 0.02, 0.04),
      pad: flatRounded(padSize.w, padSize.d, 0.035),
      lid,
      glass,
    };
  }, [kbDepth, layout.width, padSize.w, padSize.d]);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  return (
    <group>
      {/* Bottom case: slightly inset, darker shell */}
      <mesh geometry={geo.bottom} position={[0, 0, 0]} castShadow receiveShadow>
        <CaseMaterial tone={look.bottom} finish={look.finish} rough={0.48} xray={xray} />
      </mesh>
      {/* Top case with diamond-cut edge */}
      <mesh geometry={geo.top} position={[0, 0.036, 0]} castShadow receiveShadow>
        <CaseMaterial tone={look.deck} finish={look.finish} xray={xray} />
      </mesh>

      {!xray && (
        <group>
          {/* Keyboard well: shadowed recess in the deck, visible between the keys */}
          <mesh geometry={geo.well} position={[0, DECK_Y + 0.0004, KB_TOP_Z + kbDepth / 2 - 0.01]}>
            <meshStandardMaterial color={shade(look.deck, -0.5)} metalness={look.finish === "metal" ? 0.6 : 0.1} roughness={0.6} />
          </mesh>
          {/* Backlight glow leaking between the keys */}
          {powered && look.backlight && (
            <mesh position={[0, DECK_Y + 0.0012, KB_TOP_Z + kbDepth / 2 - 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[layout.width, kbDepth]} />
              <meshBasicMaterial color={look.backlight} transparent opacity={0.18} depthWrite={false} toneMapped={false} />
            </mesh>
          )}
          <Keycaps keys={keys} color={look.keycap} />
          {legends && (
            <mesh position={[0, KEY_TOP_Y + 0.0006, KB_TOP_Z + kbDepth / 2 - 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[layout.width, kbDepth]} />
              <meshBasicMaterial map={legends} transparent depthWrite={false} toneMapped={false} />
            </mesh>
          )}

          {/* Pointing stick with a red rubber cap */}
          {stick && (
            <mesh position={[stick.x, KEY_TOP_Y + 0.002, stick.z]}>
              <cylinderGeometry args={[0.022, 0.022, 0.02, 24]} />
              <meshStandardMaterial color="#d8232a" roughness={0.9} />
            </mesh>
          )}
          {/* Three physical buttons above the trackpad on business laptops */}
          {look.trackpoint &&
            [-1, 0, 1].map((i) => (
              <RoundedBox
                key={i}
                args={[i === 0 ? 0.26 : 0.36, 0.008, 0.07]}
                radius={0.003}
                smoothness={2}
                position={[padX + i * 0.35, DECK_Y + 0.004, padZ - padSize.d / 2 - 0.07]}
              >
                <meshStandardMaterial color={look.keycap} roughness={0.7} />
              </RoundedBox>
            ))}

          {/* Trackpad: rim around a fine-matte glass surface */}
          <mesh geometry={geo.padRim} position={[padX, DECK_Y + 0.0004, padZ]}>
            <meshStandardMaterial color={shade(look.deck, dark ? 0.15 : 0.3)} metalness={look.finish === "metal" ? 1 : 0.2} roughness={0.1} />
          </mesh>
          <mesh geometry={geo.pad} position={[padX, DECK_Y + 0.0008, padZ]}>
            <meshPhysicalMaterial
              color={shade(look.deck, dark ? 0.04 : -0.05)}
              metalness={look.finish === "metal" ? 0.85 : 0.1}
              roughness={0.42}
              clearcoat={0.3}
              clearcoatRoughness={0.4}
            />
          </mesh>

          {/* Front lip notch and status LED */}
          <mesh position={[0, 0.112, 1.101]}>
            <boxGeometry args={[0.5, 0.012, 0.004]} />
            <meshStandardMaterial color={shade(look.deck, -0.3)} metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[-1.35, 0.07, 1.101]}>
            <boxGeometry args={[0.03, 0.008, 0.002]} />
            <meshBasicMaterial color={powered ? "#e8f4ff" : "#3b414b"} toneMapped={false} />
          </mesh>
          {/* Light bar along the front edge */}
          {look.lightbar && (
            <mesh position={[0, 0.05, 1.1015]}>
              <boxGeometry args={[2.6, 0.01, 0.002]} />
              <meshBasicMaterial color={powered ? look.lightbar : shade(look.lightbar, -0.7)} toneMapped={false} />
            </mesh>
          )}

          {/* Right side: intake vent slots */}
          {Array.from({ length: 14 }).map((_, i) => (
            <mesh key={i} position={[1.6015, 0.06, -0.6 + i * 0.05]}>
              <boxGeometry args={[0.003, 0.03, 0.026]} />
              <meshStandardMaterial color="#1a1e25" />
            </mesh>
          ))}
          {/* Rear exhaust grilles on gaming chassis */}
          {look.rearVent &&
            [-1, 1].map((s) =>
              Array.from({ length: 12 }).map((_, i) => (
                <mesh key={`${s}-${i}`} position={[s * (0.75 + i * 0.06), 0.065, -1.1015]}>
                  <boxGeometry args={[0.03, 0.05, 0.003]} />
                  <meshStandardMaterial color="#0d0f13" />
                </mesh>
              )),
            )}

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

      {/* Hinge: dark barrel tucked behind the deck, with case-colored end caps */}
      <mesh position={[0, 0.118, -1.075]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 32]} />
        <meshStandardMaterial color="#2b3038" metalness={0.6} roughness={0.45} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.37, 0.118, -1.075]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.22, 32]} />
          <CaseMaterial tone={look.lid} finish={look.finish} xray={false} />
        </mesh>
      ))}

      {/* Lid */}
      <group position={[0, 0.118, -1.06]} rotation={[LID_ANGLE, 0, 0]}>
        <mesh geometry={geo.lid} castShadow>
          <CaseMaterial tone={look.lid} finish={look.finish} xray={false} />
        </mesh>
        {/* Bezel glass, tinted toward the case color so lid and body read as one laptop */}
        <mesh geometry={geo.glass} position={[0, 0, 0.0004]}>
          <meshStandardMaterial color={bezel} roughness={0.35} metalness={0} />
        </mesh>
        {/* Panel */}
        <mesh position={[0, SCREEN.y, 0.0012]}>
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshBasicMaterial color="#07080b" />}
        </mesh>
        {/* Cover glass: picks up softbox reflections across the whole front */}
        <mesh geometry={geo.glass} position={[0, 0, 0.0024]}>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.03} roughness={0.03} metalness={0} clearcoat={1} depthWrite={false} />
        </mesh>
        {/* Rubber bumpers on the bezel corners */}
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * (LID.w / 2 - 0.09), LID.h - 0.05, 0.003]}>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#15171b" roughness={0.95} />
          </mesh>
        ))}
        {/* Chin badge below the panel */}
        <mesh position={[0, (SCREEN.y - SCREEN.h / 2) / 2 + 0.02, 0.0026]}>
          <planeGeometry args={[0.26, 0.022]} />
          <meshStandardMaterial color="#9aa3ad" metalness={1} roughness={0.25} />
        </mesh>
        <LidCover look={look} powered={powered} />
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
