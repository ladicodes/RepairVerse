import clsx from "clsx";
import type { AssetStatus } from "@/components/three/asset";

const COPY: Record<AssetStatus, { label: string; detail: string; dot: string }> = {
  checking: { label: "Locating model", detail: "", dot: "bg-gray-400" },
  lux3d: { label: "Shell generated with Aholo Lux3D", detail: "Internal parts are teaching illustrations", dot: "bg-ok" },
  placeholder: {
    label: "Temporary model",
    detail: "Lux3D export pending. Internal parts are teaching illustrations",
    dot: "bg-warn",
  },
  error: { label: "Model failed to load", detail: "Showing the temporary model instead", dot: "bg-danger" },
};

export function AssetBadge({ status, className }: { status: AssetStatus; className?: string }) {
  const c = COPY[status];
  return (
    <div
      className={clsx("pointer-events-auto flex max-w-xs items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 shadow-raised", className)}
      role="status"
    >
      <span className={clsx("mt-1.5 size-2 shrink-0 rounded-full", c.dot)} />
      <div>
        <p className="text-xs font-medium text-fg">{c.label}</p>
        {c.detail && <p className="text-xs text-muted">{c.detail}</p>}
      </div>
    </div>
  );
}
