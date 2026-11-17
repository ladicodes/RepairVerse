import * as THREE from "three";

/**
 * Canvas textures for the laptop's internal parts, drawn to look like a real
 * teardown: blue PCB with traces and parts, a black battery with a printed label,
 * a green RAM module, an M.2 SSD sticker. Generated locally, no photos or brand marks.
 */

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function canvas(w: number, h: number) {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  return g ? { c, g } : null;
}

function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Blue motherboard: copper traces under solder mask, vias, SMD parts, silkscreen, mounting holes. */
export function makePcbTexture(w = 1536, h = 768) {
  const cv = canvas(w, h);
  if (!cv) return null;
  const { c, g } = cv;
  const r = rng(11);

  g.fillStyle = "#14557a";
  g.fillRect(0, 0, w, h);
  // Ground pour variation
  for (let i = 0; i < 26; i++) {
    g.fillStyle = `rgba(30,110,150,${0.15 + r() * 0.2})`;
    g.fillRect(r() * w, r() * h, 60 + r() * 260, 40 + r() * 160);
  }
  // Traces: orthogonal runs with 45° jogs
  g.lineCap = "round";
  for (let i = 0; i < 520; i++) {
    g.strokeStyle = `rgba(70,160,200,${0.35 + r() * 0.35})`;
    g.lineWidth = r() < 0.8 ? 1.2 : 2.6;
    let x = r() * w;
    let y = r() * h;
    g.beginPath();
    g.moveTo(x, y);
    for (let s = 0; s < 3; s++) {
      const len = 20 + r() * 140;
      const dir = Math.floor(r() * 4);
      if (dir === 0) x += len;
      else if (dir === 1) y += len;
      else if (dir === 2) {
        x += len * 0.5;
        y += len * 0.5;
      } else x -= len;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  // Vias
  for (let i = 0; i < 900; i++) {
    g.fillStyle = r() < 0.5 ? "#c8b27a" : "#9fb7c4";
    g.beginPath();
    g.arc(r() * w, r() * h, 1.6 + r() * 1.4, 0, Math.PI * 2);
    g.fill();
  }
  // SMD resistors and capacitors
  for (let i = 0; i < 1100; i++) {
    const x = r() * w;
    const y = r() * h;
    const vertical = r() < 0.5;
    const pw = vertical ? 4 : 9;
    const ph = vertical ? 9 : 4;
    const kind = r();
    g.fillStyle = kind < 0.45 ? "#1a1a1a" : kind < 0.8 ? "#b08d5a" : "#d9d9d9";
    g.fillRect(x, y, pw, ph);
    g.fillStyle = "#d8d8d8";
    if (vertical) {
      g.fillRect(x, y, pw, 2);
      g.fillRect(x, y + ph - 2, pw, 2);
    } else {
      g.fillRect(x, y, 2, ph);
      g.fillRect(x + pw - 2, y, 2, ph);
    }
  }
  // Small ICs with pins
  for (let i = 0; i < 60; i++) {
    const x = r() * w;
    const y = r() * h;
    const s = 16 + r() * 30;
    g.fillStyle = "#c0c0c0";
    g.fillRect(x - 2, y - 2, s + 4, s + 4);
    g.fillStyle = "#151515";
    g.fillRect(x, y, s, s);
  }
  // Silkscreen labels and outlines
  g.fillStyle = "rgba(235,240,245,0.85)";
  g.strokeStyle = "rgba(235,240,245,0.7)";
  g.lineWidth = 1;
  g.font = "600 13px ui-monospace, monospace";
  for (let i = 0; i < 140; i++) {
    const x = r() * w;
    const y = r() * h;
    const label = ["C", "R", "U", "Q", "L", "PJ", "PU"][Math.floor(r() * 7)] + Math.floor(r() * 900 + 100);
    g.fillText(label, x, y);
    if (r() < 0.3) g.strokeRect(x - 4, y + 4, 30 + r() * 30, 16 + r() * 20);
  }
  g.font = "700 22px ui-monospace, monospace";
  g.fillText("MB REV 1.0", w * 0.06, h * 0.93);
  g.fillText("6050A3XXXX01", w * 0.62, h * 0.08);
  // Gold-ringed mounting holes
  for (const [x, y] of [
    [0.03, 0.06],
    [0.97, 0.06],
    [0.03, 0.94],
    [0.55, 0.9],
    [0.4, 0.12],
    [0.82, 0.55],
  ]) {
    g.fillStyle = "#c9a856";
    g.beginPath();
    g.arc(x * w, y * h, 14, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#0b0d10";
    g.beginPath();
    g.arc(x * w, y * h, 7, 0, Math.PI * 2);
    g.fill();
  }
  return finish(c);
}

/** Black battery pack with a printed white label, safety icons, and a barcode sticker. */
export function makeBatteryTexture(w = 1536, h = 560) {
  const cv = canvas(w, h);
  if (!cv) return null;
  const { c, g } = cv;
  const r = rng(5);
  g.fillStyle = "#121316";
  g.fillRect(0, 0, w, h);
  // Cell seams under the wrap
  g.strokeStyle = "rgba(255,255,255,0.05)";
  g.lineWidth = 3;
  for (const x of [w / 3, (2 * w) / 3]) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, h);
    g.stroke();
  }
  g.fillStyle = "#e9ebee";
  g.font = "700 46px ui-sans-serif, system-ui, sans-serif";
  g.fillText("Rechargeable Li-ion Battery", 60, 90);
  g.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  const lines = [
    "11.55V  41.04Wh  3470mAh   Model: RV3XL",
    "WARNING: Do not crush, puncture, or expose to heat above 60°C.",
    "Replace only with the same type. Dispose of according to local rules.",
    "Made for RepairVerse training. Not a real part.",
  ];
  lines.forEach((l, i) => g.fillText(l, 60, 140 + i * 34));
  // Fine-print block
  g.fillStyle = "rgba(233,235,238,0.55)";
  for (let i = 0; i < 9; i++) g.fillRect(60, 300 + i * 18, 560 + r() * 200, 6);
  // Safety icons (generic outlines)
  g.strokeStyle = "#e9ebee";
  g.lineWidth = 5;
  const icons = 6;
  for (let i = 0; i < icons; i++) {
    const x = w - 620 + i * 92;
    const y = 110;
    if (i % 3 === 0) {
      g.beginPath();
      g.arc(x, y, 32, 0, Math.PI * 2);
      g.stroke();
    } else if (i % 3 === 1) {
      g.strokeRect(x - 30, y - 30, 60, 60);
    } else {
      g.beginPath();
      g.moveTo(x, y - 34);
      g.lineTo(x + 34, y + 28);
      g.lineTo(x - 34, y + 28);
      g.closePath();
      g.stroke();
    }
  }
  // Crossed-out bin
  g.strokeRect(w - 220, 200, 110, 140);
  g.beginPath();
  g.moveTo(w - 240, 180);
  g.lineTo(w - 90, 360);
  g.moveTo(w - 90, 180);
  g.lineTo(w - 240, 360);
  g.stroke();
  // White barcode sticker
  g.fillStyle = "#f4f5f7";
  g.fillRect(w - 760, 380, 520, 140);
  g.fillStyle = "#111";
  let x = w - 740;
  while (x < w - 260) {
    const bw = 2 + Math.floor(r() * 5);
    g.fillRect(x, 400, bw, 80);
    x += bw + 2 + Math.floor(r() * 4);
  }
  g.font = "600 18px ui-monospace, monospace";
  g.fillText("SN 5CD0 2611 7RV", w - 740, 506);
  // Screw labels at corners
  g.fillStyle = "#e9ebee";
  g.font = "600 20px ui-monospace, monospace";
  g.fillText("M2 L4", 24, h - 20);
  g.fillText("M2 L4", w - 100, h - 20);
  return finish(c);
}

/** SO-DIMM RAM: green PCB, black memory chips, white sticker, gold edge contacts. */
export function makeRamTexture(w = 1024, h = 256) {
  const cv = canvas(w, h);
  if (!cv) return null;
  const { c, g } = cv;
  g.fillStyle = "#1f6b3a";
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    g.fillStyle = "#121212";
    g.fillRect(70 + i * 230, 40, 150, 120);
  }
  g.fillStyle = "#f2f2f2";
  g.fillRect(380, 52, 260, 90);
  g.fillStyle = "#222";
  g.font = "600 22px ui-monospace, monospace";
  g.fillText("8GB 1Rx8 PC4", 395, 90);
  g.fillText("3200AA-SA0", 395, 122);
  g.fillStyle = "#d4a943";
  for (let x = 8; x < w - 8; x += 13) g.fillRect(x, h - 44, 8, 40);
  return finish(c);
}

/** M.2 2280 SSD: black PCB under a white/black sticker. */
export function makeSsdTexture(w = 1024, h = 256) {
  const cv = canvas(w, h);
  if (!cv) return null;
  const { c, g } = cv;
  g.fillStyle = "#16181b";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#e8eaed";
  g.fillRect(90, 24, 820, 208);
  g.fillStyle = "#111";
  g.font = "700 40px ui-sans-serif, system-ui, sans-serif";
  g.fillText("NVMe SSD  512GB", 120, 92);
  g.font = "500 22px ui-monospace, monospace";
  g.fillText("M.2 2280  PCIe Gen3 x4", 120, 136);
  g.fillText("S/N 21RV0001", 120, 172);
  g.fillStyle = "#d4a943";
  for (let y = 30; y < h - 30; y += 18) g.fillRect(w - 40, y, 30, 10);
  return finish(c);
}

/** Wi-Fi card: dark board with a metal shield and two antenna connectors. */
export function makeWifiTexture(w = 512, h = 512) {
  const cv = canvas(w, h);
  if (!cv) return null;
  const { c, g } = cv;
  g.fillStyle = "#1b2b2a";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#c8ccd1";
  g.fillRect(40, 140, 430, 300);
  g.fillStyle = "#222";
  g.font = "600 30px ui-monospace, monospace";
  g.fillText("WLAN 802.11ax", 70, 230);
  g.font = "500 22px ui-monospace, monospace";
  g.fillText("FCC ID: RV-WIFI6", 70, 280);
  g.fillStyle = "#d4a943";
  for (const x of [130, 340]) {
    g.beginPath();
    g.arc(x, 70, 26, 0, Math.PI * 2);
    g.fill();
  }
  return finish(c);
}
