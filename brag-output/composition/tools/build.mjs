// Builds the RepairVerse brag composition: compositions/*.html + index.html.
// Footage: assets/walkthrough.mp4 (real screencast of the running app).
// Run: node tools/build.mjs   (overwrites hand edits made in Studio)
import fs from "fs";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const W = 1920, H = 1080;
const C = { ground: "#f6f7f9", surface: "#ffffff", line: "#cdd4de", ink: "#080d1b", muted: "#4b5568", accent: "#22d3ee", accentInk: "#0e7490" };
const FONTS = `
@font-face{font-family:"Geist";src:url("assets/fonts/geist-latin-var.woff2") format("woff2");font-weight:100 900}
@font-face{font-family:"Geist Mono";src:url("assets/fonts/geist-mono-latin-var.woff2") format("woff2");font-weight:100 900}`;
const r3 = (n) => Math.round(n * 1000) / 1000;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const words = (s, cls) => s.split(" ").map((w) => `<span class="${cls}">${esc(w)}</span>`).join(" ");
// Audio-reactive: the root sets --energy (0..1, from music RMS); shadows deepen with it.
const SHADOW = `0 calc(26px + var(--energy, 0) * 18px) calc(60px + var(--energy, 0) * 30px) -24px rgb(8 13 27 / calc(0.22 + var(--energy, 0) * 0.16))`;

function camState(s, fx, fy) {
  const mx = (W / 2) * (s - 1), my = (H / 2) * (s - 1);
  return { scale: s, x: r3(Math.max(-mx, Math.min(mx, -(fx - W / 2) * s))), y: r3(Math.max(-my, Math.min(my, -(fy - H / 2) * s))) };
}
const wrap = (id, style, els, js) => `<template>
  <style>${FONTS}
#root{position:absolute;inset:0;background:${C.ground};overflow:hidden;font-family:"Geist",sans-serif;color:${C.ink}}
${style}
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    ${els}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${js}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;
const CAP_STYLE = `.cap{position:absolute;left:192px;bottom:118px;z-index:20}
.cap .bar{display:inline-block;background:${C.ink};color:#fff;font-weight:520;font-size:44px;letter-spacing:-0.01em;line-height:1.15;padding:20px 30px 22px;border-radius:16px}`;
function capJs(sel, t, d) {
  return `tl.fromTo("${sel} .bar", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }, ${t});
    tl.fromTo("${sel} .cw", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.13, stagger: 0.05, ease: "power2.out" }, ${r3(t + 0.06)});
    tl.to("${sel} .bar", { opacity: 0, filter: "blur(6px)", duration: 0.18, ease: "power3.in" }, ${r3(t + d - 0.2)});`;
}

/* Full-frame footage scene with camera keys and captions. */
function footage({ id, src, rate, dur, cam, caps, enter }) {
  const els = [`<div id="${id}-frame"><video id="${id}-video" class="clip" src="assets/walkthrough.mp4" muted playsinline data-start="0" data-duration="${dur}" data-media-start="${src}" data-playback-rate="${rate}" data-track-index="0"></video></div>`];
  caps.forEach(([t, d, text], i) => els.push(`<div id="${id}-cap${i + 1}" class="clip cap" data-start="${t}" data-duration="${d}" data-track-index="1"><span class="bar">${words(text, "cw")}</span></div>`));
  const js = [];
  const s0 = camState(...cam[0].slice(1, 4));
  if (enter === "settle") js.push(`tl.fromTo("#${id}-frame", { scale: ${r3(s0.scale * 1.08)}, x: ${s0.x}, y: ${s0.y} }, { scale: ${s0.scale}, duration: 0.5, ease: "expo.out" }, 0);`);
  else js.push(`tl.set("#${id}-frame", { scale: ${s0.scale}, x: ${s0.x}, y: ${s0.y} }, 0);`);
  for (const [t, s, fx, fy, d] of cam.slice(1)) {
    const st = camState(s, fx, fy);
    js.push(`tl.to("#${id}-frame", { scale: ${st.scale}, x: ${st.x}, y: ${st.y}, duration: ${d}, ease: "power2.inOut" }, ${t});`);
  }
  caps.forEach(([t, d], i) => js.push(capJs(`#${id}-cap${i + 1}`, t, d)));
  const style = `#${id}-frame{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:50% 50%;overflow:hidden}
#${id}-video{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:contain}
${CAP_STYLE}`;
  return wrap(id, style, els.join("\n    "), js.join("\n    "));
}

/* Scene 1: the ticket. Real 96°C laptop screen in a window, line from the ticket beside it. */
function ticket(dur) {
  const id = "ticket";
  // Window 860x800 at (900,140); footage scaled s, focus point centred in the window.
  const win = { x: 900, y: 140, w: 860, h: 800 };
  const focus = (s, fx, fy) => ({ scale: s, x: r3(win.w / 2 - fx * s), y: r3(win.h / 2 - fy * s) });
  const a = focus(1.32, 680, 330), b = focus(1.5, 620, 300);
  const style = `#ticket-line{position:absolute;left:192px;top:0;height:${H}px;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px}
#ticket-kicker{font-size:40px;font-weight:520;color:${C.accentInk};letter-spacing:-0.01em}
#ticket-title{font-size:112px;line-height:0.98;font-weight:650;letter-spacing:-0.045em}
#ticket-title .w{display:inline-block}
#ticket-win{position:absolute;left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;overflow:hidden;border-radius:30px;background:${C.surface};box-shadow:0 0 0 2px ${C.line}, ${SHADOW}}
#ticket-cam{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
#ticket-video{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:contain}`;
  const els = `<div id="ticket-win"><div id="ticket-cam"><video id="ticket-video" class="clip" src="assets/walkthrough.mp4" muted playsinline data-start="0" data-duration="${dur}" data-media-start="63.6" data-playback-rate="1" data-track-index="0"></video></div></div>
    <div id="ticket-text" class="clip" data-start="0" data-duration="${dur}" data-track-index="1"><div id="ticket-line"><div id="ticket-kicker">Work order M-001</div><div id="ticket-title">${words("Shuts down after 15 minutes.", "w")}</div></div></div>`;
  const js = `tl.fromTo("#ticket-win", { x: 90 }, { x: 0, duration: 0.7, ease: "expo.out" }, 0);
    tl.fromTo("#ticket-cam", { scale: ${a.scale}, x: ${a.x}, y: ${a.y} }, { scale: ${b.scale}, x: ${b.x}, y: ${b.y}, duration: ${dur}, ease: "power1.inOut" }, 0);
    tl.fromTo("#ticket-kicker", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2 }, 0.1);
    tl.fromTo("#ticket-title .w", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, stagger: 0.07, ease: "power2.out" }, 0.2);`;
  return wrap(id, style, els, js);
}

const MARK = (id) => `<svg id="${id}" viewBox="0 0 28 28" fill="none" overflow="visible">
      <rect class="m-rect" x="3" y="7" width="16" height="11" rx="1.5" stroke="${C.ink}" stroke-width="2" pathLength="100"/>
      <path class="m-base" d="M1 21.5h20" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" pathLength="100"/>
      <path class="m-lead" d="M13.5 12.5 19.5 6.5" stroke="${C.ink}" stroke-width="1.5" stroke-linecap="round" pathLength="100"/>
      <circle class="m-pin" cx="13.5" cy="12.5" r="1.5" fill="${C.ink}"/>
      <circle class="m-dot" cx="21.5" cy="5" r="4" fill="${C.accent}" stroke="${C.ink}" stroke-width="1.5"/>
    </svg>`;
// Draws the mark; the cyan dot lands at t0 + 0.5.
const markDraw = (sel, t0) => `
    tl.fromTo("${sel} .m-rect", { strokeDasharray: "100 120", strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, ${r3(t0)});
    tl.fromTo("${sel} .m-base", { strokeDasharray: "100 120", strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, ${r3(t0 + 0.2)});
    tl.fromTo("${sel} .m-pin", { opacity: 0 }, { opacity: 1, duration: 0.08 }, ${r3(t0 + 0.34)});
    tl.fromTo("${sel} .m-lead", { strokeDasharray: "100 120", strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.16, ease: "power2.out" }, ${r3(t0 + 0.36)});
    tl.fromTo("${sel} .m-dot", { scale: 0, transformOrigin: "21.5px 5px" }, { scale: 1, duration: 0.4, ease: "expo.out" }, ${r3(t0 + 0.5)});`;

function reveal(dur) {
  const style = `#rv-stack{position:absolute;left:0;top:0;width:${W}px;height:${H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px}
#rv-lock{display:flex;align-items:center;gap:36px}
#rv-mark{width:190px;height:190px}
#rv-word{font-size:136px;font-weight:650;letter-spacing:-0.045em;line-height:1}
#rv-word .l{display:inline-block}
#rv-head{font-size:64px;font-weight:520;letter-spacing:-0.025em;color:${C.ink}}
#rv-head .w{display:inline-block}`;
  const els = `<div id="rv-g" class="clip" data-start="0" data-duration="${dur}" data-track-index="0"><div id="rv-stack"><div id="rv-lock">${MARK("rv-mark")}<div id="rv-word">${[..."RepairVerse"].map((c) => `<span class="l">${c}</span>`).join("")}</div></div><div id="rv-head">${words("Learn real-world repair skills in 3D", "w")}</div></div></div>`;
  const js = `${markDraw("#rv-mark", 0)}
    tl.fromTo("#rv-word .l", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.14, stagger: 0.03, ease: "power2.out" }, 0.12);
    tl.fromTo("#rv-head .w", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.14, stagger: 0.05, ease: "power2.out" }, 0.22);
    tl.to("#rv-stack", { scale: 6, opacity: 0, filter: "blur(14px)", duration: 0.36, ease: "power3.in" }, ${r3(dur - 0.37)});`;
  return wrap("reveal", style, els, js);
}

function endcard(dur) {
  const style = `#end-stack{position:absolute;left:0;top:0;width:${W}px;height:${H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:60px}
#end-lock{display:flex;align-items:center;gap:26px}
#end-mark{width:132px;height:132px}
#end-word{font-size:96px;font-weight:650;letter-spacing:-0.045em;line-height:1}
#end-cta{display:flex;flex-direction:column;align-items:center;gap:22px}
#end-btn{display:inline-flex;align-items:center;gap:16px;background:${C.ink};color:#fff;font-size:42px;font-weight:560;padding:24px 44px;border-radius:999px;box-shadow:${SHADOW}}
#end-btn svg{width:36px;height:36px}
#end-note{font-size:36px;color:${C.muted};font-weight:500}`;
  const els = `<div id="end-g" class="clip" data-start="0" data-duration="${dur}" data-track-index="0"><div id="end-stack">
      <div id="end-lock">${MARK("end-mark")}<div id="end-word">RepairVerse</div></div>
      <div id="end-cta"><div id="end-btn">Start repair mission <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
      <div id="end-note">Free, no account, about 6 minutes.</div></div>
    </div></div>`;
  // beat-locked: logo dot lands at film 21.10s (beat 21.07s) = scene 0.50s
  const js = `${markDraw("#end-mark", 0)}
    tl.fromTo("#end-word", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" }, 0.22);
    tl.fromTo("#end-btn", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.62);
    tl.fromTo("#end-note", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.8);`;
  return wrap("endcard", style, els, js);
}

/* ---------- timeline (film seconds; cuts beat-locked to vol-11 strong cues) ---------- */
const SCENES = [
  { id: "ticket", start: 0, dur: 3.7, html: () => ticket(3.7) },
  { id: "reveal", start: 3.7, dur: 2.64, html: () => reveal(2.64) }, // beat-locked: 3.70s
  { // beat-locked: 6.34s. Fan hotspot click at source 85.4s = scene 0.71s.
    id: "inspect", start: 6.34, dur: 6.31,
    html: () => footage({ id: "inspect", src: 84.4, rate: 1.4, dur: 6.31,
      cam: [[0, 1.4, 640, 560], [1.5, 1.6, 1570, 700, 0.9], [4.7, 1.0, 960, 540, 0.9]],
      caps: [[1.3, 4.2, "Open it up. Click a part. Read the clue."]] }) },
  { // beat-locked: 12.65s. Repair answer click at source 146.6s = scene 1.48s.
    id: "decide", start: 12.65, dur: 5.26,
    html: () => footage({ id: "decide", src: 144.9, rate: 1.15, dur: 5.26,
      cam: [[0, 1.6, 1575, 430], [2.6, 2.2, 1030, 140, 0.9]],
      caps: [[0.2, 2.3, "Some fixes make it worse."], [3.3, 1.9, "Then it's tested: 61°C"]] }) },
  { // beat-locked: 17.91s
    id: "score", start: 17.91, dur: 2.69,
    html: () => footage({ id: "score", src: 154.3, rate: 1.0, dur: 2.69, enter: "settle",
      cam: [[0, 1.7, 1560, 330]], caps: [[0.3, 2.3, "Every choice scored and explained"]] }) },
  { id: "endcard", start: 20.6, dur: 3.4, html: () => endcard(3.4) },
];
const TOTAL = 24.0;

fs.mkdirSync(path.join(ROOT, "compositions"), { recursive: true });
for (const s of SCENES) fs.writeFileSync(path.join(ROOT, "compositions", `${s.id}.html`), s.html());

const hosts = SCENES.map((s) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`).join("\n");

// SFX land one frame after their picture (peaks at file start).
const SFX = [
  ["sfx-reveal", "assets/sfx/impact/impactSoft_medium_001.ogg", 3.733, 0.7, 0.18],
  ["sfx-click-fan", "assets/sfx/ui/click2.ogg", 7.087, 0.9, 0.06],      // 6.34 + 0.714 + 1f
  ["sfx-click-fix", "assets/sfx/ui/click2.ogg", 14.163, 0.9, 0.06],     // 12.65 + 1.478 + 1f
  ["sfx-score", "assets/sfx/impact/impactSoft_medium_003.ogg", 17.943, 0.6, 0.14],
  ["sfx-logo", "assets/sfx/impact/impactBell_heavy_000.ogg", 21.133, 0.45, 1.48], // dot lands 21.10
];
const audio = [
  `      <audio id="music" class="clip" src="assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3" data-start="0" data-duration="${TOTAL}" data-volume="0.5" data-fade-in="0.3" data-fade-out="1.2" data-track-index="4"></audio>`,
  ...SFX.map(([id, src, t, v, d]) => `      <audio id="${id}" class="clip" src="${src}" data-start="${t}" data-duration="${d}" data-volume="${v}" data-track-index="5"></audio>`),
].join("\n");

const ad = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/audio-data.json"), "utf8"));
const rms = ad.frames.map((f) => f.rms);
const max = Math.max(...rms);
const energy = rms.map((v) => Math.round((v / max) * 100) / 100);

const index = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>${FONTS}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: ${C.ground}; }
      #root { width: 100%; height: 100%; position: relative; font-family: "Geist", sans-serif; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
${hosts}
${audio}
    </div>
    <script>
      // Audio-reactive: per-frame music RMS (pre-extracted, assets/audio-data.json) drives --energy.
      const ENERGY = ${JSON.stringify(energy)};
      const tl = gsap.timeline({ paused: true });
      const rootEl = document.getElementById("root");
      for (let f = 0; f < ENERGY.length && f / 30 < ${TOTAL}; f++) {
        tl.call((v) => rootEl.style.setProperty("--energy", v), [ENERGY[f]], f / 30);
      }
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(ROOT, "index.html"), index);
console.log("built", SCENES.length, "scenes,", TOTAL, "s");
