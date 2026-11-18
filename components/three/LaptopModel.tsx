"use client";

import { Component, Suspense, type ReactNode } from "react";
import type { ModelAsset } from "@/data/missions";
import type { DeviceLook } from "@/data/devices";
import { Internals } from "./Internals";
import { Lux3DShell, ProceduralShell } from "./Shells";
import type { ScreenInput, ScreenSpec } from "./textures";
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
  /** Mission-specific display content while powered. Defaults to the overheating monitor. */
  screen?: ScreenSpec;
  /** Take-apart step while the cover is off. */
  teardown?: number;
}

export function LaptopModel({
  asset,
  status,
  onLoadError,
  state,
  showInternals = true,
  look,
}: {
  asset: ModelAsset;
  status: AssetStatus;
  onLoadError: () => void;
  state: LaptopState;
  showInternals?: boolean;
  /** Case and keyboard style for the procedural placeholder. */
  look?: DeviceLook;
}) {
  const screen: ScreenInput = !state.powered ? "off" : (state.screen ?? (state.cooled ? "cool" : "hot"));
  const fallback = <ProceduralShell xray={state.xray} screen={screen} look={look} />;

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
      {/* A generated shell has its own solid base, so the illustration only shows with the panel open. */}
      {showInternals && (state.xray || status !== "lux3d") && <Internals dusty={state.dusty} powered={state.powered} cooled={state.cooled} xray={state.xray} teardown={state.teardown} />}
    </group>
  );
}
