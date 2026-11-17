import * as THREE from "three";

export type ScreenMode = "hot" | "off" | "cool";

/** Draws the laptop's display. Generated locally, no external assets. */
export function makeScreenTexture(mode: ScreenMode): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 1024;
  const h = 576;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return null;

  if (mode === "off") {
    g.fillStyle = "#07090d";
    g.fillRect(0, 0, w, h);
    return finish(c);
  }

  const hot = mode === "hot";
  const accent = hot ? "#ea580c" : "#0891b2";

  // Desktop wallpaper: soft blue ribbons on a pale field
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#c9dcf2");
  bg.addColorStop(1, "#8fb3df");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 5; i++) {
    const rib = g.createRadialGradient(w * 0.5, h * 0.62, 10, w * 0.5, h * 0.62, w * (0.18 + i * 0.07));
    rib.addColorStop(0, `rgba(20,70,190,${0.55 - i * 0.08})`);
    rib.addColorStop(1, "rgba(20,70,190,0)");
    g.fillStyle = rib;
    g.beginPath();
    g.ellipse(w * 0.5, h * 0.62, w * (0.12 + i * 0.06), h * (0.3 - i * 0.03), (i - 2) * 0.45, 0, Math.PI * 2);
    g.fill();
  }

  // Taskbar
  const tb = 44;
  g.fillStyle = "rgba(240,243,247,0.94)";
  g.fillRect(0, h - tb, w, tb);
  for (let i = 0; i < 6; i++) {
    g.fillStyle = i === 2 ? accent : "#9aa5b5";
    roundRect(g, w / 2 - 120 + i * 42, h - tb + 10, 26, 24, 6);
    g.fill();
  }
  g.fillStyle = "#343d4f";
  g.font = "500 15px ui-sans-serif, system-ui, sans-serif";
  g.textAlign = "right";
  g.fillText(hot ? "14:15" : "14:42", w - 20, h - tb + 20);
  g.font = "400 12px ui-sans-serif, system-ui, sans-serif";
  g.fillText("17/11/2026", w - 20, h - tb + 36);
  g.textAlign = "left";

  // Window
  const wx = 150;
  const wy = 46;
  const ww = w - 300;
  const wh = h - tb - 92;
  g.fillStyle = "rgba(0,0,0,0.25)";
  roundRect(g, wx + 4, wy + 8, ww, wh, 12);
  g.fill();
  g.fillStyle = "#ffffff";
  roundRect(g, wx, wy, ww, wh, 12);
  g.fill();
  g.fillStyle = "#f1f3f6";
  g.fillRect(wx, wy + 12, ww, 26);
  roundRect(g, wx, wy, ww, 38, 12);
  g.fill();
  g.fillStyle = "#343d4f";
  g.font = "500 14px ui-sans-serif, system-ui, sans-serif";
  g.fillText("System monitor", wx + 16, wy + 24);
  ["#cdd4de", "#cdd4de", "#cdd4de"].forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(wx + ww - 90 + i * 28, wy + 17, 14, 4);
  });

  const px = wx + 28;
  g.font = "500 16px ui-sans-serif, system-ui, sans-serif";
  g.fillStyle = "#4b5568";
  g.fillText(hot ? "CPU temperature" : "CPU temperature after cleaning", px, wy + 74);
  g.font = "600 76px ui-sans-serif, system-ui, sans-serif";
  g.fillStyle = "#080d1b";
  const temp = hot ? "96" : "61";
  g.fillText(temp, px - 3, wy + 148);
  const tw = g.measureText(temp).width;
  g.font = "500 30px ui-sans-serif, system-ui, sans-serif";
  g.fillStyle = "#4b5568";
  g.fillText("°C", px + tw + 2, wy + 118);

  const pill = hot ? "Throttling" : "Stable";
  g.font = "600 15px ui-sans-serif, system-ui, sans-serif";
  const pw = g.measureText(pill).width + 28;
  g.fillStyle = hot ? "#fff1e8" : "#e6fafd";
  roundRect(g, wx + ww - 28 - pw, wy + 56, pw, 30, 15);
  g.fill();
  g.fillStyle = accent;
  g.fillText(pill, wx + ww - 28 - pw + 14, wy + 76);

  // Chart
  const left = px;
  const right = wx + ww - 28;
  const top = wy + 178;
  const bottom = wy + wh - 28;
  g.strokeStyle = "#e2e7ee";
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(left, bottom);
  g.lineTo(right, bottom);
  g.stroke();
  g.setLineDash([6, 6]);
  g.strokeStyle = "#e7a3b3";
  g.beginPath();
  g.moveTo(left, top + 10);
  g.lineTo(right, top + 10);
  g.stroke();
  g.setLineDash([]);
  g.font = "500 12px ui-sans-serif, system-ui, sans-serif";
  g.fillStyle = "#be123c";
  g.fillText("Shutdown limit", left, top + 2);

  g.strokeStyle = accent;
  g.lineWidth = 3.5;
  g.lineJoin = "round";
  g.beginPath();
  for (let i = 0; i <= 60; i++) {
    const x = left + (i / 60) * (right - left);
    const t = i / 60;
    const level = hot ? 0.12 + Math.sqrt(t) * 0.8 : 0.35 + Math.sin(t * Math.PI) * 0.1;
    const y = bottom - level * (bottom - top - 10) - Math.sin(i * 1.4) * 2;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();
  return finish(c);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Soft radial halo for the heat source when the panel is open. */
export function makeGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const s = 128;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.3)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return finish(c);
}

function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
