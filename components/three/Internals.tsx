"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { makeGlowTexture } from "./textures";
import { makeBatteryTexture, makePcbTexture, makeRamTexture, makeSsdTexture, makeWifiTexture } from "./hardwareTextures";

/**
 * Supplementary educational illustration of a laptop's insides, laid out like a
 * real 15-inch teardown: blue motherboard at the back, CPU under a copper cold
 * plate, heat pipes to a fin stack, a blower fan, RAM, SSD, Wi-Fi card, and a
 * wide battery at the front. App-authored geometry, not part of any generated asset.
 */

const FAN = { x: 0.92, z: -0.42, r: 0.3, h: 0.07, floor: 0.02 };
const CPU = { x: -0.25, z: -0.5 };
const PCB = { x0: -1.52, x1: 0.78, z0: -1.02, z1: 0.14, y: 0.03, t: 0.012 };
const PCB_TOP = PCB.y + PCB.t / 2;
const BLADES = 31;

/** Blower outline: round housing with a straight outlet toward the fins at the back (-z). */
function blowerShape(r: number, outlet: number) {
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.absarc(0, 0, r, Math.PI, Math.PI * 2, false);
  s.lineTo(r, outlet);
  s.lineTo(-r, outlet);
  s.closePath();
  return s;
}

/** Shape lying flat on xz, extruded upward by `h`. Shape +y maps to world -z. */
function flatExtrude(shape: THREE.Shape, h: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 40 });
  g.rotateX(-Math.PI / 2);
  return g;
}

function useTextures() {
  const t = useMemo(
    () => ({
      pcb: makePcbTexture(),
      battery: makeBatteryTexture(),
      ram: makeRamTexture(),
      ssd: makeSsdTexture(),
      wifi: makeWifiTexture(),
      glow: makeGlowTexture(),
    }),
    [],
  );
  useEffect(() => () => Object.values(t).forEach((x) => x?.dispose()), [t]);
  return t;
}

function useFanGeometry() {
  const g = useMemo(() => {
    const outlet = Math.abs(-0.89 - FAN.z);
    const outer = blowerShape(FAN.r + 0.02, outlet);
    // Wall: outline with the inside cut out.
    const wallShape = blowerShape(FAN.r + 0.02, outlet);
    const inner = new THREE.Path();
    inner.moveTo(-FAN.r, 0);
    inner.absarc(0, 0, FAN.r, Math.PI, Math.PI * 2, false);
    inner.lineTo(FAN.r, outlet + 0.01);
    inner.lineTo(-FAN.r, outlet + 0.01);
    inner.closePath();
    wallShape.holes.push(inner);
    // Cover: outline with a round intake hole.
    const coverShape = blowerShape(FAN.r + 0.02, outlet);
    const intake = new THREE.Path();
    intake.absarc(0, 0, FAN.r * 0.68, 0, Math.PI * 2, true);
    coverShape.holes.push(intake);
    return {
      base: flatExtrude(outer, 0.004),
      wall: flatExtrude(wallShape, FAN.h),
      cover: flatExtrude(coverShape, 0.004),
      blade: new THREE.BoxGeometry(FAN.r * 0.52, FAN.h * 0.78, 0.006),
    };
  }, []);
  useEffect(() => () => Object.values(g).forEach((x) => x.dispose()), [g]);
  return g;
}

function useHeatPipes() {
  const pipes = useMemo(
    () =>
      [0, 1].map((i) => {
        const dz = i * 0.07;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(CPU.x - 0.14, 0.066, CPU.z - 0.04 + dz),
          new THREE.Vector3(CPU.x + 0.2, 0.068, CPU.z - 0.08 + dz),
          new THREE.Vector3(0.25, 0.07, -0.86 + dz * 0.5),
          new THREE.Vector3(0.55, 0.07, -0.93 + dz * 0.4),
          new THREE.Vector3(1.32, 0.07, -0.93 + dz * 0.4),
        ]);
        return new THREE.TubeGeometry(curve, 64, 0.02, 12, false);
      }),
    [],
  );
  useEffect(() => () => pipes.forEach((p) => p.dispose()), [pipes]);
  return pipes;
}

export function Internals({
  dusty,
  powered,
  cooled,
  xray,
}: {
  dusty: boolean;
  powered: boolean;
  cooled: boolean;
  xray: boolean;
}) {
  const blades = useRef<THREE.Group>(null);
  const cpuMat = useRef<THREE.MeshStandardMaterial>(null);
  const tex = useTextures();
  const fan = useFanGeometry();
  const pipes = useHeatPipes();

  useFrame((state, dt) => {
    const speed = powered ? (dusty ? 9 : 22) : 0.4;
    if (blades.current) {
      blades.current.rotation.y -= dt * speed;
      // Strained wobble when dusty and running
      blades.current.position.y = FAN.floor + (powered && dusty ? Math.sin(state.clock.elapsedTime * 40) * 0.0015 : 0);
    }
    if (cpuMat.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
      cpuMat.current.emissiveIntensity = cooled ? 0.4 : powered ? 1.2 + pulse * 1.0 : 0.5;
    }
  });

  const heatColor = cooled ? "#22d3ee" : "#fb7a3c";
  const dustColor = "#9a9ea6";

  return (
    <group>
      {/* Chassis tray: black plastic with screw bosses */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.08, 2.08]} />
        <meshStandardMaterial color="#17191d" roughness={0.85} />
      </mesh>
      <Instances limit={16}>
        <cylinderGeometry args={[0.026, 0.03, 0.03, 16]} />
        <meshStandardMaterial color="#202328" roughness={0.7} />
        {[
          [-1.48, -0.98], [-0.4, -1.0], [0.4, -1.0], [1.48, -0.98], [-1.48, 0.2], [1.48, 0.0],
          [-1.48, 0.98], [-0.6, 1.0], [0.6, 1.0], [1.48, 0.98], [-1.1, 0.25], [1.1, 0.25],
        ].map(([x, z], i) => (
          <Instance key={i} position={[x, 0.027, z]} />
        ))}
      </Instances>

      {/* Motherboard */}
      <group>
        <mesh position={[(PCB.x0 + PCB.x1) / 2, PCB.y, (PCB.z0 + PCB.z1) / 2]} receiveShadow>
          <boxGeometry args={[PCB.x1 - PCB.x0, PCB.t, PCB.z1 - PCB.z0]} />
          <meshStandardMaterial color="#0f4566" roughness={0.6} />
        </mesh>
        <mesh position={[(PCB.x0 + PCB.x1) / 2, PCB_TOP + 0.0005, (PCB.z0 + PCB.z1) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[PCB.x1 - PCB.x0, PCB.z1 - PCB.z0]} />
          <meshStandardMaterial map={tex.pcb} roughness={0.45} metalness={0.15} color={tex.pcb ? "#ffffff" : "#14557a"} />
        </mesh>

        {/* VRM: row of black inductors and polymer capacitors beside the CPU */}
        <Instances limit={8}>
          <boxGeometry args={[0.055, 0.03, 0.055]} />
          <meshStandardMaterial color="#202226" roughness={0.6} metalness={0.3} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Instance key={i} position={[-0.7 + i * 0.07, PCB_TOP + 0.015, -0.26]} />
          ))}
        </Instances>
        <Instances limit={8}>
          <cylinderGeometry args={[0.018, 0.018, 0.034, 16]} />
          <meshStandardMaterial color="#c9ccd1" roughness={0.3} metalness={0.9} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Instance key={i} position={[-0.68 + i * 0.08, PCB_TOP + 0.017, -0.18]} />
          ))}
        </Instances>

        {/* Chipset and controller chips */}
        {[
          [0.3, -0.25, 0.16, 0.16],
          [-0.95, -0.72, 0.14, 0.1],
          [-0.75, -0.9, 0.22, 0.08],
          [0.45, -0.62, 0.1, 0.1],
        ].map(([x, z, w, d], i) => (
          <mesh key={i} position={[x, PCB_TOP + 0.005, z]}>
            <boxGeometry args={[w, 0.01, d]} />
            <meshStandardMaterial color="#141518" roughness={0.45} />
          </mesh>
        ))}

        {/* RAM: SO-DIMM in its slot */}
        <group position={[-1.0, PCB_TOP, -0.05]}>
          <mesh position={[0, 0.012, -0.12]}>
            <boxGeometry args={[0.66, 0.024, 0.06]} />
            <meshStandardMaterial color="#1a1b1e" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.024, 0.02]}>
            <boxGeometry args={[0.62, 0.006, 0.27]} />
            <meshStandardMaterial color="#1f6b3a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.0275, 0.02]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <planeGeometry args={[0.62, 0.27]} />
            <meshStandardMaterial map={tex.ram} roughness={0.5} />
          </mesh>
          {/* Metal retention clips */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.34, 0.016, 0.02]}>
              <boxGeometry args={[0.02, 0.03, 0.08]} />
              <meshStandardMaterial color="#c4c8ce" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* M.2 SSD */}
        <group position={[0.1, PCB_TOP, 0.0]}>
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={[0.71, 0.008, 0.2]} />
            <meshStandardMaterial color="#16181b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.71, 0.2]} />
            <meshStandardMaterial map={tex.ssd} roughness={0.55} />
          </mesh>
          <mesh position={[-0.37, 0.012, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.012, 16]} />
            <meshStandardMaterial color="#c4c8ce" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>

        {/* Wi-Fi card with antenna leads to the hinge */}
        <group position={[-1.32, PCB_TOP, -0.55]}>
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 0.27]} />
            <meshStandardMaterial map={tex.wifi} roughness={0.5} metalness={0.2} />
          </mesh>
          {[
            [-0.04, "#111"],
            [0.05, "#e5e7eb"],
          ].map(([dx, color], i) => (
            <mesh key={i} position={[dx as number, 0.012, -0.28]}>
              <boxGeometry args={[0.012, 0.01, 0.42]} />
              <meshStandardMaterial color={color as string} roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Left-edge ports: USB-A and HDMI shells */}
        {[-0.5, -0.3, -0.1].map((z, i) => (
          <mesh key={i} position={[-1.48, PCB_TOP + 0.025, z]}>
            <boxGeometry args={[0.16, 0.045, i === 1 ? 0.13 : 0.12]} />
            <meshStandardMaterial color="#c4c8ce" metalness={0.9} roughness={0.35} />
          </mesh>
        ))}
      </group>

      {/* CPU: green substrate, die, copper cold plate, black spring bracket */}
      <group position={[CPU.x, PCB_TOP, CPU.z]}>
        <mesh position={[0, 0.003, 0]}>
          <boxGeometry args={[0.32, 0.006, 0.24]} />
          <meshStandardMaterial ref={cpuMat} color="#245a3a" emissive={heatColor} emissiveIntensity={1.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.26, 0.012, 0.2]} />
          <meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.28} />
        </mesh>
        {[0.62, -0.62].map((a) => (
          <mesh key={a} position={[0, 0.021, 0]} rotation={[0, a, 0]}>
            <boxGeometry args={[0.52, 0.004, 0.05]} />
            <meshStandardMaterial color="#1b1d21" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        {[
          [-0.21, -0.15],
          [0.21, -0.15],
          [-0.21, 0.15],
          [0.21, 0.15],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.024, z]}>
            <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
            <meshStandardMaterial color="#b8bcc2" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Flattened copper heat pipes */}
      {pipes.map((g, i) => (
        <mesh key={i} geometry={g} scale={[1, 0.55, 1]} position={[0, 0.03, 0]}>
          <meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.25} />
        </mesh>
      ))}

      {/* Blower fan */}
      <group position={[FAN.x, 0, FAN.z]}>
        <mesh geometry={fan.base} position={[0, FAN.floor - 0.004, 0]}>
          <meshStandardMaterial color="#b3b9c1" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh geometry={fan.wall} position={[0, FAN.floor, 0]}>
          <meshStandardMaterial color="#141518" roughness={0.6} />
        </mesh>
        <group ref={blades} position={[0, FAN.floor, 0]}>
          <mesh position={[0, FAN.h * 0.45, 0]}>
            <cylinderGeometry args={[FAN.r * 0.32, FAN.r * 0.32, FAN.h * 0.8, 32]} />
            <meshStandardMaterial color={dusty ? "#3d4046" : "#18191c"} roughness={0.5} />
          </mesh>
          <Instances limit={BLADES} geometry={fan.blade}>
            <meshStandardMaterial color={dusty ? "#55595f" : "#1c1d20"} roughness={dusty ? 0.95 : 0.45} />
            {Array.from({ length: BLADES }).map((_, i) => {
              const a = (i / BLADES) * Math.PI * 2;
              const rr = FAN.r * 0.62;
              return <Instance key={i} position={[Math.cos(a) * rr, FAN.h * 0.42, Math.sin(a) * rr]} rotation={[0, -a + 0.45, 0]} />;
            })}
          </Instances>
        </group>
        <mesh geometry={fan.cover} position={[0, FAN.floor + FAN.h, 0]}>
          <meshStandardMaterial color="#c9ced5" metalness={0.85} roughness={0.32} />
        </mesh>
        {/* Model sticker on the cover */}
        <mesh position={[FAN.r * 0.55, FAN.floor + FAN.h + 0.0045, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.08]} />
          <meshStandardMaterial color="#eef0f2" roughness={0.8} />
        </mesh>
        {dusty && (
          <>
            <mesh position={[0, FAN.floor + FAN.h + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[FAN.r * 0.55, FAN.r * 0.8, 48]} />
              <meshStandardMaterial color={dustColor} transparent opacity={0.55} roughness={1} />
            </mesh>
            <mesh position={[0, FAN.floor + FAN.h * 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[FAN.r * 0.66, 48]} />
              <meshStandardMaterial color={dustColor} transparent opacity={0.3} roughness={1} depthWrite={false} />
            </mesh>
          </>
        )}
      </group>

      {/* Heatsink fin stack at the rear exhaust */}
      <group position={[0.92, FAN.floor, -0.95]}>
        <Instances limit={40}>
          <boxGeometry args={[0.006, 0.07, 0.13]} />
          <meshStandardMaterial color="#c3c8cf" metalness={0.9} roughness={0.3} />
          {Array.from({ length: 36 }).map((_, i) => (
            <Instance key={i} position={[-0.35 + i * 0.02, 0.035, 0]} />
          ))}
        </Instances>
        {dusty && (
          <mesh position={[0, 0.035, 0.07]}>
            <boxGeometry args={[0.72, 0.066, 0.02]} />
            <meshStandardMaterial color={dustColor} transparent opacity={0.85} roughness={1} />
          </mesh>
        )}
      </group>

      {/* Side intake vent grille */}
      <group position={[1.6, 0.075, -0.22]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[0, 0, -0.33 + i * 0.06]}>
            <boxGeometry args={[0.02, 0.07, 0.03]} />
            <meshStandardMaterial color="#0b0f18" roughness={0.8} />
          </mesh>
        ))}
        {dusty &&
          [-0.25, -0.05, 0.12, 0.28].map((z, i) => (
            <mesh key={i} position={[0.015, -0.005 + (i % 2) * 0.01, z]} rotation={[i * 0.6, 0, 0]}>
              <boxGeometry args={[0.012, 0.05, 0.12]} />
              <meshStandardMaterial color="#9aa0aa" transparent opacity={0.8} roughness={1} />
            </mesh>
          ))}
      </group>

      {/* Battery: wide black pack with printed label, cable to the board */}
      <group position={[0, 0.012, 0.56]}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <boxGeometry args={[2.0, 0.07, 0.62]} />
          <meshStandardMaterial color="#131417" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.0705, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.62]} />
          <meshStandardMaterial map={tex.battery} roughness={0.5} color={tex.battery ? "#ffffff" : "#131417"} />
        </mesh>
        {/* Mounting tabs */}
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0.004, -0.33]}>
            <boxGeometry args={[0.12, 0.008, 0.08]} />
            <meshStandardMaterial color="#b8bcc2" metalness={0.9} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0.3, 0.02, -0.38]}>
          <boxGeometry args={[0.16, 0.006, 0.16]} />
          <meshStandardMaterial color="#d08a2b" roughness={0.5} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Speakers in the front corners */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.33, 0.035, 0.68]}>
          <boxGeometry args={[0.3, 0.045, 0.34]} />
          <meshStandardMaterial color="#1a1b1f" roughness={0.7} />
        </mesh>
      ))}

      {/* Keyboard and trackpad ribbon cables */}
      {[
        [-0.2, "#d08a2b"],
        [0.55, "#e7e9ec"],
      ].map(([x, color], i) => (
        <mesh key={i} position={[x as number, 0.03, 0.2]}>
          <boxGeometry args={[0.18, 0.003, 0.18]} />
          <meshStandardMaterial color={color as string} roughness={0.5} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Heat / cooling halo */}
      {tex.glow && xray && (
        <sprite position={[0.3, 0.25, -0.62]} scale={cooled ? [1.6, 1.0, 1] : [2.6, 1.6, 1]}>
          <spriteMaterial map={tex.glow} color={heatColor} transparent opacity={cooled ? 0.2 : powered ? 0.5 : 0.3} depthWrite={false} />
        </sprite>
      )}
      {xray && <pointLight position={[0.2, 0.4, -0.6]} color={heatColor} intensity={cooled ? 0.5 : 1.6} distance={2.5} />}

      {dusty && xray && (
        <Sparkles
          position={[0.95, 0.22, -0.6]}
          count={40}
          scale={[1.1, 0.35, 0.9]}
          size={2.2}
          speed={powered ? 0.6 : 0.15}
          color="#b8bcc6"
          opacity={0.6}
        />
      )}
    </group>
  );
}
