/** What the laptop display shows during a mission. Drawn locally, no external assets. */
export interface ScreenSpec {
  /** Window title bar text. */
  window: string;
  heading: string;
  value: string;
  unit?: string;
  pill: string;
  tone: "bad" | "ok";
  /** Shape of the chart under the reading. */
  trend: "rise" | "flat" | "fall" | "unstable" | "none";
  /** Dashed reference line label, for example "Shutdown limit". */
  limit?: string;
  clock?: string;
  /** Black screen, optionally with firmware-style text lines. */
  dark?: boolean;
  lines?: string[];
}

export const HOT_SCREEN: ScreenSpec = {
  window: "System monitor",
  heading: "CPU temperature",
  value: "96",
  unit: "°C",
  pill: "Throttling",
  tone: "bad",
  trend: "rise",
  limit: "Shutdown limit",
  clock: "14:15",
};

export const COOL_SCREEN: ScreenSpec = {
  window: "System monitor",
  heading: "CPU temperature after cleaning",
  value: "61",
  unit: "°C",
  pill: "Stable",
  tone: "ok",
  trend: "flat",
  limit: "Shutdown limit",
  clock: "14:42",
};

