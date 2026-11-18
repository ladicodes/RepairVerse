"use client";

import { Suspense, useEffect, useRef, useState, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, ContactShadows } from "@react-three/drei";
import { Studio } from "@/components/three/Studio";
import * as THREE from "three";
import { LaptopModel } from "@/components/three/LaptopModel";
import { useAssetStatus } from "@/components/three/asset";
import { useDevice } from "@/store/mission-store";

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

/** Shows the laptop the visitor last put on the bench (the XPS 13 by default). */
function HeroModel({ xray }: { xray: boolean }) {
  const device = useDevice();
  const asset = device.model;
  const status = useAssetStatus(asset.url);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = failedUrl === asset.url;
  return (
    <LaptopModel
      key={asset.url}
      asset={asset}
      look={device.look}
      status={failed ? "error" : status}
      onLoadError={() => setFailedUrl(asset.url)}
      state={{ xray, dusty: true, powered: true, cooled: false }}
    />
  );
}

type Controls = ComponentRef<typeof CameraControls>;
const { ACTION } = CameraControlsImpl;

/**
 * Drag to rotate, pinch (touch or trackpad) to zoom. A plain mouse wheel keeps
 * scrolling the page, so the hero never traps the visitor.
 */
function HeroControls() {
  const ref = useRef<Controls>(null);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    ref.current?.setLookAt(0, 3.0, 7.2, 0, 0.55, -0.3, false);
    const el = gl.domElement;
    // Vertical swipes keep scrolling the page on phones; horizontal drags rotate, pinch zooms.
    const touch = () => (el.style.touchAction = "pan-y");
    touch();
    const t = window.setTimeout(touch, 0);
    const onWheel = (e: WheelEvent) => {
      // Trackpad pinch arrives as a wheel event with ctrlKey set.
      if (!e.ctrlKey) return;
      e.preventDefault();
      ref.current?.dolly(-e.deltaY * 0.02, true);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl]);
  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={3}
      maxDistance={16}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.49}
      mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.DOLLY, right: ACTION.NONE, wheel: ACTION.NONE }}
      touches={{ one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY_ROTATE, three: ACTION.NONE }}
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
      aria-label="3D model of a laptop reporting a CPU temperature of 96°C"
    >
      <Studio />
      <HeroControls />
      <Suspense fallback={null}>
        <Rig xray={xray} />
        <ContactShadows position={[0, -0.21, 0]} opacity={0.35} scale={10} blur={2.4} far={3} color="#1b2333" />
      </Suspense>
    </Canvas>
  );
}
