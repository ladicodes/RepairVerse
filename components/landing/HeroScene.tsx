"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Studio } from "@/components/three/Studio";
import * as THREE from "three";
import { missions } from "@/data/missions";
import { LaptopModel } from "@/components/three/LaptopModel";
import { useAssetStatus } from "@/components/three/asset";

const asset = missions["001"].model;

function Rig({ xray }: { xray: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const targetY = -0.42 + Math.sin(t * 0.2) * 0.18 + state.pointer.x * 0.2;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.5, dt);
  });
  return (
    <group ref={group} position={[0, -0.2, 0.2]}>
      <HeroModel xray={xray} />
    </group>
  );
}

function HeroModel({ xray }: { xray: boolean }) {
  const status = useAssetStatus(asset.url);
  const [failed, setFailed] = useState(false);
  return (
    <LaptopModel
      asset={asset}
      status={failed ? "error" : status}
      onLoadError={() => setFailed(true)}
      state={{ xray, dusty: true, powered: true, cooled: false }}
    />
  );
}

export default function HeroScene({ xray = false }: { xray?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.0, 7.2], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0.55, -0.3)}
      aria-label="3D model of an HP-style laptop reporting a CPU temperature of 96°C"
    >
      <Studio />
      <Suspense fallback={null}>
        <Rig xray={xray} />
        <ContactShadows position={[0, -0.21, 0]} opacity={0.35} scale={10} blur={2.4} far={3} color="#1b2333" />
      </Suspense>
    </Canvas>
  );
}
