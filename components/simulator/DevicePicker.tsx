"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";
import { DEVICE_CATEGORIES, devices, type Device, type DeviceCategory } from "@/data/devices";

type Filter = "All" | DeviceCategory;

/** Lid color with a keyboard strip, so cards differ at a glance without 20 WebGL views. */
function Swatch({ device }: { device: Device }) {
  const { lid, keycap, backlight, lightbar } = device.look;
  return (
    <span
      aria-hidden
      className="relative grid h-9 w-12 shrink-0 place-items-end overflow-hidden rounded-md border border-line-strong"
      style={{ background: lid }}
    >
      <span
        className="mb-1.5 h-2 w-9 rounded-sm"
        style={{ background: keycap, boxShadow: backlight ? `0 0 6px ${backlight}` : undefined }}
      />
      {lightbar && <span className="absolute inset-x-1 bottom-0.5 h-px" style={{ background: lightbar }} />}
    </span>
  );
}

export function DevicePicker({
  value,
  onChange,
  showCooling = true,
}: {
  value: string;
  onChange: (id: string) => void;
  /** Show the model's overheating notes. Only useful on cooling missions. */
  showCooling?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const counts = useMemo(() => {
    const m = new Map<Filter, number>([["All", devices.length]]);
    for (const d of devices) m.set(d.category, (m.get(d.category) ?? 0) + 1);
    return m;
  }, []);
  const shown = filter === "All" ? devices : devices.filter((d) => d.category === filter);
  const selected = devices.find((d) => d.id === value) ?? devices[0];

  return (
    <section aria-labelledby="picker-title" className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="picker-title" className="font-medium">
          Choose the laptop on your bench
        </h2>
        <p className="text-sm text-dim">{devices.length} models</p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter by laptop type">
        {(["All", ...DEVICE_CATEGORIES] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
              filter === f ? "border-fg bg-fg text-surface" : "border-line text-muted hover:bg-sunken hover:text-fg",
            )}
          >
            {f} <span className="font-mono tabular-nums opacity-60">{counts.get(f) ?? 0}</span>
          </button>
        ))}
      </div>

      <ul className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2" aria-label="Laptops">
        {shown.map((d) => {
          const active = d.id === selected.id;
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onChange(d.id)}
                aria-pressed={active}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-150",
                  active ? "border-fg bg-sunken" : "border-line hover:border-line-strong hover:bg-sunken",
                )}
              >
                <Swatch device={d} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{d.name}</span>
                  <span className="block truncate text-sm text-dim">
                    {d.brand} · {d.screen} · {d.weight}
                  </span>
                </span>
                {active && <Check className="size-4 shrink-0" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rounded-2xl border border-line bg-sunken p-4">
        <p className="text-sm text-dim">
          {selected.brand} {selected.name} · {selected.category}
          {showCooling && ` · ${selected.cooling}`}
        </p>
        {showCooling && <p className="mt-1 leading-relaxed">{selected.benchNote}</p>}
        <p className="mt-2 text-sm text-dim">
          Specs are typical for the model line. Parts vary by configuration, so check the service manual for a real unit.
        </p>
      </div>
    </section>
  );
}
