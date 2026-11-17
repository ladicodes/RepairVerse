"use client";

import { useEffect, useState } from "react";

export type AssetStatus = "checking" | "lux3d" | "placeholder" | "error";

const cache = new Map<string, Promise<boolean>>();

const MANIFEST = "/models/manifest.json";

/**
 * Checks once per URL whether a Lux3D export is deployed. The manifest lists
 * the files that came from Lux3D, so an unrelated file is never labeled Lux3D
 * and a missing file never triggers a 404.
 */
function probe(url: string): Promise<boolean> {
  let p = cache.get(url);
  if (!p) {
    const file = url.split("/").pop() ?? "";
    p = fetch(MANIFEST, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { lux3d: [] }))
      .then((m: { lux3d?: unknown }) => Array.isArray(m.lux3d) && m.lux3d.includes(file))
      .catch(() => false);
    cache.set(url, p);
  }
  return p;
}

export function useAssetStatus(url: string): AssetStatus {
  const [status, setStatus] = useState<AssetStatus>("checking");
  useEffect(() => {
    let alive = true;
    probe(url).then((ok) => alive && setStatus(ok ? "lux3d" : "placeholder"));
    return () => {
      alive = false;
    };
  }, [url]);
  return status;
}
