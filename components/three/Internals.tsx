"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { makeGlowTexture } from "./textures";

/**
 * Supplementary educational illustration of a laptop cooling system.
 * This is app-authored geometry, not part of any generated asset.
 */
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
  const glow = useMemo(() => makeGlowTexture(), []);

  const pipe = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.085, -0.5),
      new THREE.Vector3(0.2, 0.09, -0.72),
      new THREE.Vector3(0.62, 0.09, -0.9),
      new THREE.Vector3(1.3, 0.09, -0.94),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.028, 10, false);
  }, []);

  useFrame((state, dt) => {
    const speed = powered ? (dusty ? 9 : 22) : 0.4;
    if (blades.current) {
      blades.current.rotation.y -= dt * speed;
      // strained wobble when dusty and running
      blades.current.position.y = 0.082 + (powered && dusty ? Math.sin(state.clock.elapsedTime * 40) * 0.002 : 0);
    }
    if (cpuMat.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
      cpuMat.current.emissiveIntensity = cooled ? 0.6 : powered ? 1.6 + pulse * 1.2 : 0.8;
    }
  });

  const heatColor = cooled ? "#22d3ee" : "#fb7a3c";
  const dustColor = "#8a8f99";

  return (
    <group>
      {/* Motherboard */}
      <mesh position={[0.1, 0.035, -0.5]} receiveShadow>
        <boxGeometry args={[2.95, 0.018, 1.0]} />
        <meshStandardMaterial color="#0f3b3a" roughness={0.7} metalness={0.2} />
      </mesh>
      {[
        [-0.9, -0.3, 0.3, 0.2],
        [-1.15, -0.75, 0.22, 0.14],
        [-0.65, -0.82, 0.4, 0.1],
        [0.35, -0.2, 0.18, 0.18],
        [-1.25, -0.35, 0.14, 0.3],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.052, z]}>
          <boxGeometry args={[w, 0.016, d]} />
          <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* CPU */}
      <mesh position={[-0.25, 0.06, -0.5]}>
        <boxGeometry args={[0.34, 0.03, 0.34]} />
        <meshStandardMaterial ref={cpuMat} color="#2a2f3a" emissive={heatColor} emissiveIntensity={1.4} roughness={0.4} />
      </mesh>
      <mesh position={[-0.25, 0.08, -0.5]}>
        <boxGeometry args={[0.42, 0.012, 0.42]} />
        <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Heat pipe */}
      <mesh geometry={pipe}>
        <meshStandardMaterial color="#c8794a" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Fan housing */}
      <group position={[0.92, 0, -0.42]}>
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.09, 40, 1, true]} />
          <meshStandardMaterial color="#1a2030" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.034, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.008, 40]} />
          <meshStandardMaterial color="#141a28" roughness={0.7} />
        </mesh>
        <group ref={blades} position={[0, 0.082, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 24]} />
            <meshStandardMaterial color={dusty ? "#4b4f57" : "#2b3345"} roughness={0.5} />
          </mesh>
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (i / 11) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2]} rotation={[0, -a + 0.5, 0]}>
                <boxGeometry args={[0.2, 0.045, 0.012]} />
                <meshStandardMaterial color={dusty ? "#6b6f78" : "#334155"} roughness={dusty ? 0.95 : 0.4} />
              </mesh>
            );
          })}
        </group>
        {dusty && (
          <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.34, 40]} />
            <meshStandardMaterial color={dustColor} transparent opacity={0.35} roughness={1} />
          </mesh>
        )}
      </group>

      {/* Heatsink fins (exhaust at the back edge) */}
      <group position={[0.92, 0.08, -0.96]}>
        {Array.from({ length: 22 }).map((_, i) => (
          <mesh key={i} position={[-0.42 + i * 0.04, 0, 0]}>
            <boxGeometry args={[0.012, 0.09, 0.16]} />
            <meshStandardMaterial color="#a8b3c4" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {dusty && (
          <mesh position={[0, 0.005, 0.02]}>
            <boxGeometry args={[0.86, 0.075, 0.1]} />
            <meshStandardMaterial color={dustColor} transparent opacity={0.55} roughness={1} />
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

      {/* Battery */}
      <group position={[0, 0.06, 0.52]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 0.06, 0.62]} />
          <meshStandardMaterial color="#1e2638" roughness={0.6} metalness={0.3} />
        </mesh>
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.031, 0]}>
            <boxGeometry args={[0.7, 0.002, 0.5]} />
            <meshStandardMaterial color="#253049" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.032, -0.24]}>
          <boxGeometry args={[0.5, 0.002, 0.06]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Heat / cooling halo */}
      {glow && xray && (
        <sprite position={[0.3, 0.25, -0.62]} scale={cooled ? [1.6, 1.0, 1] : [2.6, 1.6, 1]}>
          <spriteMaterial
            map={glow}
            color={heatColor}
            transparent
            opacity={cooled ? 0.25 : powered ? 0.65 : 0.4}
            depthWrite={false}
            
          />
        </sprite>
      )}
      {xray && <pointLight position={[0.2, 0.4, -0.6]} color={heatColor} intensity={cooled ? 0.6 : 2.2} distance={2.5} />}

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
