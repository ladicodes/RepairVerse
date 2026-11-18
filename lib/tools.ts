import type { Hotspot, Mission } from "@/data/missions";

export type ToolId = "inspect" | "thermal" | "meter";

export interface ToolResult {
  value: string;
  note: string;
  tone: "bad" | "ok" | "neutral";
}

export const TOOLS: { id: ToolId; label: string; hint: string }[] = [
  { id: "inspect", label: "Inspect", hint: "Look at the part and note what you see." },
  { id: "thermal", label: "Thermal camera", hint: "Surface temperature from the intake scan, taken while the laptop was running." },
  { id: "meter", label: "Multimeter", hint: "Voltage, continuity or a status reading for the part." },
];

/** Normal readings by part, used when a mission doesn't define a fault reading. */
const DEFAULTS: Record<string, { thermal: ToolResult; meter: ToolResult }> = {
  fan: {
    thermal: { value: "41°C", note: "Motor hub warm, within normal range.", tone: "ok" },
    meter: { value: "5.0 V", note: "Supply present, speed signal steady.", tone: "ok" },
  },
  vents: {
    thermal: { value: "38°C", note: "Steady airflow through the grille.", tone: "ok" },
    meter: { value: "n/a", note: "No electrical test for a vent.", tone: "neutral" },
  },
  heatsink: {
    thermal: { value: "52°C", note: "Heat spreads evenly across the fins.", tone: "ok" },
    meter: { value: "n/a", note: "No electrical test for a heatsink.", tone: "neutral" },
  },
  battery: {
    thermal: { value: "33°C", note: "Even temperature across the pack.", tone: "ok" },
    meter: { value: "11.4 V", note: "Pack voltage normal for a 3-cell battery.", tone: "ok" },
  },
  board: {
    thermal: { value: "58°C", note: "CPU area warm under light load. Normal.", tone: "ok" },
    meter: { value: "3.3 V / 5 V", note: "Main power rails present.", tone: "ok" },
  },
  ram: {
    thermal: { value: "44°C", note: "Normal for memory under load.", tone: "ok" },
    meter: { value: "1.2 V", note: "Memory supply present.", tone: "ok" },
  },
  ssd: {
    thermal: { value: "45°C", note: "Normal for an M.2 SSD.", tone: "ok" },
    meter: { value: "3.3 V", note: "Drive supply present.", tone: "ok" },
  },
  wifi: {
    thermal: { value: "42°C", note: "Normal for a Wi-Fi card.", tone: "ok" },
    meter: { value: "3.3 V", note: "Card supply present. Both antenna leads show continuity.", tone: "ok" },
  },
  dcjack: {
    thermal: { value: "31°C", note: "No hot spot at the jack.", tone: "ok" },
    meter: { value: "19.5 V", note: "Steady charger voltage at the jack.", tone: "ok" },
  },
  ports: {
    thermal: { value: "30°C", note: "Ports at room temperature.", tone: "ok" },
    meter: { value: "5.0 V", note: "USB power present.", tone: "ok" },
  },
  hinge: {
    thermal: { value: "29°C", note: "No heat near the hinge.", tone: "ok" },
    meter: { value: "OK", note: "Display cable continuity normal.", tone: "ok" },
  },
  chassis: {
    thermal: { value: "34°C", note: "Bottom cover evenly warm.", tone: "ok" },
    meter: { value: "n/a", note: "No electrical test for the cover.", tone: "neutral" },
  },
  cable: {
    thermal: { value: "30°C", note: "No heat along the cable.", tone: "ok" },
    meter: { value: "OK", note: "Continuity normal on every line.", tone: "ok" },
  },
};

type Override = Partial<Record<"thermal" | "meter", ToolResult>>;

/** Fault readings, keyed by mission id then hotspot id. They agree with each mission's clues. */
const FAULTS: Record<string, Record<string, Override>> = {
  "001": {
    fan: { thermal: { value: "47°C", note: "Hub hot and airflow weak at the outlet.", tone: "bad" } },
    vents: { thermal: { value: "71°C", note: "Exhaust air hot but barely moving.", tone: "bad" } },
    heatsink: { thermal: { value: "88°C", note: "Fins hot. Heat isn't leaving the stack.", tone: "bad" } },
    board: { thermal: { value: "96°C", note: "CPU at its throttle limit.", tone: "bad" } },
  },
  "002": {
    dcjack: { meter: { value: "0–19 V", note: "Voltage drops out when the cable moves.", tone: "bad" } },
    battery: { meter: { value: "10.8 V", note: "Low, and no charge current flowing in.", tone: "neutral" } },
  },
  "003": {
    battery: {
      thermal: { value: "36°C", note: "Uneven: one cell group warmer than the rest.", tone: "bad" },
      meter: { value: "Unbalanced", note: "Cell groups at different voltages. Stop and replace.", tone: "bad" },
    },
  },
  "004": {
    ssd: { thermal: { value: "71°C", note: "Hot from constant read retries.", tone: "bad" } },
  },
  "005": {
    board: { meter: { value: "Short", note: "Low resistance between keyboard lines and ground.", tone: "bad" } },
  },
  "006": {
    hinge: { meter: { value: "2 open lines", note: "Display cable has broken lines near the connector.", tone: "bad" } },
    ports: { meter: { value: "Signal", note: "HDMI output present. Graphics working.", tone: "ok" } },
  },
  "007": {
    wifi: { meter: { value: "AUX open", note: "No continuity on the AUX antenna lead.", tone: "bad" } },
  },
  "008": {
    ram: { meter: { value: "1.2 V", note: "Supply present, but the module isn't detected.", tone: "bad" } },
  },
  "009": {
    fan: {
      thermal: { value: "58°C", note: "Motor hub hot from bearing friction.", tone: "bad" },
      meter: { value: "Erratic", note: "Speed signal jumps around.", tone: "bad" },
    },
  },
  "010": {
    battery: { meter: { value: "15 / 41 Wh", note: "Full charge capacity far below design.", tone: "bad" } },
  },
  "011": {
    cable: { meter: { value: "Intermittent", note: "Continuity drops when the cable flexes.", tone: "bad" } },
  },
  "012": {
    ssd: { meter: { value: "No link", note: "Supply present but no connection to the board.", tone: "bad" } },
  },
};

export function toolReading(mission: Mission, hotspot: Hotspot, tool: Exclude<ToolId, "inspect">): ToolResult {
  return (
    FAULTS[mission.id]?.[hotspot.id]?.[tool] ??
    DEFAULTS[hotspot.id]?.[tool] ?? { value: "n/a", note: "No reading for this part.", tone: "neutral" }
  );
}
