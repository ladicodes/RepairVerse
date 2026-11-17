"use client";

import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Product-shot lighting shared by every 3D view. Metal reflects its surroundings,
 * so the environment holds a soft gray room plus a few large softboxes.
 * Everything is generated in the scene; no HDRI is downloaded.
 */
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <directionalLight position={[-4, 3, -3]} intensity={0.6} />
      <Environment resolution={256} frames={1}>
        <mesh scale={30}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#a3a9b2" side={THREE.BackSide} />
        </mesh>
        {/* Key softbox overhead, slightly behind */}
        <Lightformer form="rect" intensity={3} position={[0, 6, -1]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        {/* Side strips that draw bright lines along the chamfered edges */}
        <Lightformer form="rect" intensity={2.2} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 1.2, 1]} />
        {/* Front fill so the deck isn't black from the viewer's side */}
        <Lightformer form="rect" intensity={1.8} position={[0, 2, 7]} scale={[10, 3, 1]} />
        {/* Dark floor bounce keeps contrast under the case */}
        <Lightformer form="rect" intensity={0.3} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#2a2f37" />
      </Environment>
    </>
  );
}
