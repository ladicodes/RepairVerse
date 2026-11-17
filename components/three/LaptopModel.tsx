"use client";

import { Component, Suspense, type ReactNode } from "react";
import type { ModelAsset } from "@/data/missions";
import { Internals } from "./Internals";
import { Lux3DShell, ProceduralShell } from "./Shells";
import type { ScreenMode } from "./textures";
import type { AssetStatus } from "./asset";

class ModelBoundary extends Component<{ fallback: ReactNode; onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export interface LaptopState {
  xray: boolean;
  dusty: boolean;
  powered: boolean;
  cooled: boolean;
}

export function LaptopModel({
  asset,
  status,
  onLoadError,
  state,
  showInternals = true,
}: {
  asset: ModelAsset;
  status: AssetStatus;
  onLoadError: () => void;
  state: LaptopState;
  showInternals?: boolean;
}) {
  const screen: ScreenMode = !state.powered ? "off" : state.cooled ? "cool" : "hot";
  const fallback = <ProceduralShell xray={state.xray} screen={screen} />;

  return (
    <group>
      {status === "lux3d" ? (
        <ModelBoundary fallback={fallback} onError={onLoadError}>
          <Suspense fallback={null}>
            <Lux3DShell url={asset.url} xray={state.xray} rotation={asset.rotation} />
          </Suspense>
        </ModelBoundary>
      ) : status === "checking" ? null : (
        fallback
      )}
      {showInternals && <Internals dusty={state.dusty} powered={state.powered} cooled={state.cooled} xray={state.xray} />}
    </group>
  );
}
