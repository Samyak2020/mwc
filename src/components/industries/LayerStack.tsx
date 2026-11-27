"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState, useId } from "react";
import { Scene, type Shape, type Tone } from "@/components/nav/iso";
import { duration, ease, layerStack } from "@/lib/motion";

// An exploded isometric stack (after zaro.ai): one plate per point, each
// carrying its own line drawing, inside a sky wireframe box, with a rail of
// stops beside it. The section pins while it scrolls; each step brings one
// plate forward (the plates above it turn to faint ghosts so it can be seen),
// moves the rail marker to its stop and shows its detail. Clicking a stop
// scrolls to that step.

/** the object standing on a plate */
export type StackKey =
  | "estimates"
  | "package"
  | "costs"
  | "procure"
  | "permit"
  | "schedule"
  | "systems"
  | "completion"
  | "waste"
  | "report"
  | "certify"
  | "shutdown"
  | "access"
  | "utility"
  | "generator";
export type StackItem = { lead: string; text: string; stack?: StackKey; icon?: string };

const N_MAX = 4;
const HALF = 100; // plate half-size (world units)
// vertical gap between plates: four plates sit a little closer than three
const gapFor = (n: number) => (n > 3 ? 72 : 96);
const plateZ = (i: number, n: number) => (n - 1 - i) * gapFor(n); // item 0 on top
/** how much taller the stack stands than the three-plate original */
const extraFor = (n: number) => plateZ(0, n) - plateZ(0, 3);

type Layer = { plate: Shape[]; dots: { d: string; r: number }[]; object: Shape[]; cy: number };

// small object standing on each plate
function drawObject(s: Scene, key: StackKey, z: number) {
  if (key === "estimates") {
    // estimates: two plan sheets and a calculator on them
    s.box(-46, -34, z, 70, 56, 2).box(-40, -28, z + 2, 70, 56, 2);
    s.box(-8, -22, z + 4, 34, 44, 9);
    s.poly([[-4, -18, z + 13], [22, -18, z + 13], [22, -8, z + 13], [-4, -8, z + 13]], "accent");
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.box(-2 + c * 8, -2 + r * 7, z + 13, 5, 4, 1.4);
  } else if (key === "package") {
    // contractor readiness: open work package, the plan lifting out
    const t = z + 26;
    s.poly([[-26, -26, t], [26, -26, t], [26, -40, t + 9], [-26, -40, t + 9]], "left");
    s.poly([[-26, -26, t], [-26, 26, t], [-40, 26, t + 9], [-40, -26, t + 9]], "right");
    s.poly([[-26, 26, z], [26, 26, z], [26, 26, t], [-26, 26, t]], "left");
    s.poly([[26, -26, z], [26, 26, z], [26, 26, t], [26, -26, t]], "right");
    s.poly([[-26, -26, t], [26, -26, t], [26, 26, t], [-26, 26, t]], "inner");
    s.box(-17, -13, t + 8, 34, 26, 2);
    s.line([[-7, 4, t + 10], [0, 4, t + 10], [0, -11, t + 10]], "accent");
    s.poly([[-26, 26, t], [26, 26, t], [26, 40, t + 7], [-26, 40, t + 7]], "top");
    s.poly([[26, -26, t], [26, 26, t], [40, 26, t + 7], [40, -26, t + 7]], "top");
  } else if (key === "costs") {
    // cost tracking: columns rising across the outage
    [12, 20, 30, 44].forEach((h, k) => s.box(-32 + k * 16, -8 + k * 4, z, 12, 12, h, k === 3));
  } else if (key === "procure") {
    // procurement a year ahead: a wall calendar laid flat, binder rings along
    // the top, a grid of days and the start month marked
    s.box(-36, -28, z, 72, 56, 3);
    for (let k = 1; k < 4; k++) s.line([[-36, -28 + k * 14, z + 3], [36, -28 + k * 14, z + 3]], "faint");
    for (let k = 1; k < 6; k++) s.line([[-36 + k * 12, -14, z + 3], [-36 + k * 12, 28, z + 3]], "faint");
    s.poly([[-36, -28, z + 3], [36, -28, z + 3], [36, -14, z + 3], [-36, -14, z + 3]], "left");
    s.poly([[-36, -14, z + 3.2], [-24, -14, z + 3.2], [-24, 0, z + 3.2], [-36, 0, z + 3.2]], "accent", "accent");
    for (const x of [-24, -8, 8, 24]) s.cyl(x, -28, z + 3, 2, 6, "left", "top");
  } else if (key === "permit") {
    // permitting by jurisdiction: a permit sheet and the stamp coming down
    s.box(-40, -26, z, 56, 44, 2).box(-34, -20, z + 2, 56, 44, 2);
    for (const y of [-12, -4, 4, 12]) s.line([[-28, y, z + 4], [6, y, z + 4]], "faint");
    s.poly([[8, 6, z + 4.1], [18, 6, z + 4.1], [18, 16, z + 4.1], [8, 16, z + 4.1]], "accent", "accent");
    s.cyl(13, 11, z + 12, 9, 6, "left", "top").cyl(13, 11, z + 18, 3, 10, "left", "top").cyl(13, 11, z + 28, 6, 4, "left", "top");
  } else if (key === "schedule") {
    // integrated cost and schedule: Gantt bars stepping across a board, the
    // current bar in sky, and the cost column at the end
    s.box(-44, -36, z, 88, 72, 2);
    [
      [-36, 24],
      [-24, 30],
      [-8, 22],
      [6, 26],
    ].forEach(([x0, w], k) => s.box(x0, -28 + k * 14, z + 2, w, 8, 5, k === 2));
    s.box(30, -28, z + 2, 8, 8, 10).box(30, -14, z + 2, 8, 8, 16).box(30, 0, z + 2, 8, 8, 24);
  } else if (key === "completion") {
    // define completion: the final site laid out as a plan, a survey flag on it
    s.box(-40, -32, z, 80, 64, 2);
    s.poly([[-30, -22, z + 2.1], [30, -22, z + 2.1], [30, 22, z + 2.1], [-30, 22, z + 2.1]], "none", "faint");
    s.line([[-30, -22, z + 2.2], [30, 22, z + 2.2]], "faint").line([[30, -22, z + 2.2], [-30, 22, z + 2.2]], "faint");
    s.line([[14, 6, z + 2], [14, 6, z + 40]]);
    s.poly([[14, 6, z + 40], [14, 6, z + 30], [30, 6, z + 35]], "accent", "accent");
  } else if (key === "waste") {
    // track the waste: a dump truck on its way, its load marked and tagged
    s.box(-36, -8, z + 4, 46, 20, 3);
    s.box(-34, -6, z + 7, 30, 16, 12, true).box(-2, -6, z + 7, 12, 16, 9);
    for (const x of [-28, -12, 4]) s.cyl(x, 12, z, 4, 4, "right", "left");
    s.box(18, -24, z, 22, 16, 2);
    for (const y of [-20, -16]) s.line([[21, y, z + 2], [36, y, z + 2]], "faint");
  } else if (key === "report") {
    // review and report: an easel board with the month's bars, the report beside
    s.line([[-30, 8, z], [-26, 0, z + 44]]).line([[10, 8, z], [6, 0, z + 44]]);
    s.poly([[-34, 0, z + 12], [14, 0, z + 12], [14, -2, z + 46], [-34, -2, z + 46]], "left");
    [10, 16, 12, 22].forEach((h, k) => s.poly([[-28 + k * 10, -0.3, z + 16], [-22 + k * 10, -0.3, z + 16], [-22 + k * 10, -0.5, z + 16 + h], [-28 + k * 10, -0.5, z + 16 + h]], k === 3 ? "accent" : "top", k === 3 ? "accent" : "ink"));
    s.box(20, -10, z, 24, 30, 4).box(22, -8, z + 4, 22, 28, 2);
  } else if (key === "certify") {
    // certify on the record: the completion certificate with its seal and ribbon
    s.box(-40, -30, z, 62, 52, 2);
    for (const y of [-20, -12, -4]) s.line([[-32, y, z + 2], [8, y, z + 2]], "faint");
    s.poly([[2, 8, z + 2], [8, 8, z + 2], [6, 28, z + 2], [2, 24, z + 2]], "accent", "accent");
    s.cyl(6, 6, z + 2, 9, 3, "left", "top");
    s.poly([[0, 6, z + 5.1], [12, 6, z + 5.1], [12, 6.1, z + 5.1]], "none", "accent");
  } else if (key === "shutdown") {
    // shutdown planning: a row of switchgear cabinets, one locked out and tagged
    for (let k = 0; k < 4; k++) s.box(-40 + k * 18, -14, z, 16, 22, 40, false);
    for (let k = 0; k < 4; k++) s.line([[-32 + k * 18, 8, z + 8], [-32 + k * 18, 8, z + 32]], "faint");
    s.box(-6, 8, z + 18, 6, 2, 8, true);
    s.line([[-3, 10, z + 18], [-3, 14, z + 10]], "accent");
  } else if (key === "access") {
    // contractor access: a marked route past the equipment, barriers and cones
    s.box(-40, -36, z, 30, 24, 22);
    s.line([[-6, -30, z + 0.5], [-6, 36, z + 0.5]], "faint").line([[14, -30, z + 0.5], [14, 36, z + 0.5]], "faint");
    for (const y of [-20, 0, 20]) s.line([[4, y - 4, z + 0.6], [4, y + 4, z + 0.6]], "accent");
    s.box(-12, 6, z, 4, 22, 8, true);
    for (const [x, y] of [[24, -18], [24, 4], [24, 26]] as const) s.cyl(x, y, z, 3.5, 9, "left", "top");
  } else if (key === "utility") {
    // utility coordination: the service pole, transformer and the meter at the building
    s.box(-34, -26, z, 4, 4, 54);
    s.line([[-44, -24, z + 50], [-20, -24, z + 50]]);
    s.box(-29, -30, z + 32, 8, 8, 12, true);
    s.box(4, -6, z, 36, 30, 20);
    s.box(2, 6, z + 8, 2, 6, 8);
    s.wire([-21, -26, z + 40], [4, 9, z + 16], 3);
  } else if (key === "generator") {
    // backup generation: the generator enclosure, its exhaust and the fuel skid
    s.box(-36, -14, z, 56, 26, 24);
    for (let k = 4; k < 24; k += 5) s.line([[20, -14 + k, z + 6], [20, -14 + k, z + 18]], "faint");
    s.cyl(-24, -6, z + 24, 3, 14, "left", "top");
    s.box(26, -14, z, 16, 26, 10, true);
  } else {
    // your systems: a laptop open on the plate, its screen showing the work
    s.box(-34, -6, z, 56, 40, 3);
    for (let r = 0; r < 3; r++) s.line([[-28, 4 + r * 9, z + 3], [14, 4 + r * 9, z + 3]], "faint");
    s.poly([[-34, -6, z + 3], [22, -6, z + 3], [22, -10, z + 42], [-34, -10, z + 42]], "left");
    s.poly([[-30, -6.4, z + 7], [18, -6.4, z + 7], [18, -9.6, z + 38], [-30, -9.6, z + 38]], "top");
    s.poly([[-26, -6.6, z + 26], [-6, -6.6, z + 26], [-6, -9.2, z + 34], [-26, -9.2, z + 34]], "accent", "accent");
    s.box(30, -20, z, 14, 14, 30).box(30, -20, z + 30, 14, 14, 2, true);
  }
}

function build(items: StackItem[]): { layers: Layer[]; frame: string[] } {
  const n = items.length;
  const fallback: StackKey[] = ["estimates", "package", "costs", "schedule"];
  const layers: Layer[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const z = plateZ(i, n);
    const s = new Scene();
    s.box(-HALF, -HALF, z, HALF * 2, HALF * 2, 5);
    const plate = s.shapes;
    // a field of small diamonds across the plate, thinning toward the edges
    const dots: { d: string; r: number }[] = [];
    let seed = 7 + i * 31;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let x = -88; x <= 88; x += 16)
      for (let y = -88; y <= 88; y += 16) {
        const dist = Math.hypot(x, y);
        if (dist < 52 || rnd() > 1 - dist / 260) continue;
        const r = rnd() < 0.3 ? 3.4 : 1.8;
        const [cx, cy] = s.p([x, y, z + 5]);
        dots.push({ d: `M${cx} ${cy - r * 0.58} L${cx + r} ${cy} L${cx} ${cy + r * 0.58} L${cx - r} ${cy} Z`, r });
      }
    const o = new Scene();
    drawObject(o, items[i].stack ?? (items[i].icon as StackKey | undefined) ?? fallback[i], z + 5);
    layers.unshift({ plate, dots, object: o.shapes, cy: s.p([0, 0, z + 5])[1] });
  }
  // the wireframe box around the whole stack
  const s = new Scene();
  const B = HALF + 24;
  const z0 = -24;
  const z1 = plateZ(0, n) + 70;
  const c = (x: number, y: number, z: number) => s.pt([x, y, z]);
  const frame = [
    `M${c(-B, -B, z1)} L${c(B, -B, z1)} L${c(B, B, z1)} L${c(-B, B, z1)} Z`,
    `M${c(-B, B, z0)} L${c(B, B, z0)} L${c(B, -B, z0)}`,
    `M${c(-B, B, z0)} L${c(-B, B, z1)} M${c(B, B, z0)} L${c(B, B, z1)} M${c(B, -B, z0)} L${c(B, -B, z1)}`,
  ];
  return { layers, frame };
}

// same soft palette as the Industries menu graphics (IndustryGraphic):
// pale gradient faces with only a hint of an edge, grainy sky accents
const fillsFor = (u: (k: string) => string): Record<Tone, string> => ({
  top: `url(#${u("top")})`,
  left: `url(#${u("left")})`,
  right: "#b3b9c7",
  inner: "#a5acbb",
  accent: `url(#${u("sky")})`,
  warm: `url(#${u("warm")})`,
  tree: "#d3d7e0",
  water: `url(#${u("sky")})`,
  none: "none",
});
const ink = "rgb(42 46 58)";
/** face edges stay faint; lines (rails, ticks) stay legible */
const edge = (sh: Shape) =>
  sh.stroke === "accent"
    ? { stroke: "#1f78d1", strokeOpacity: 1, strokeWidth: sh.tone === "none" ? 2.4 : 1.2 }
    : { stroke: ink, strokeOpacity: sh.tone === "none" ? 0.6 : 0.16, strokeWidth: sh.tone === "none" ? 0.9 : 0.8 };
const grainy = (sh: Shape) => sh.tone === "accent" || sh.tone === "warm" || sh.tone === "water";
const dotTone = ["#2089d8", "#5cb3ef", "#072871"];

const RAIL_X = 495;
// screen x of the wireframe box's right edge (Scene origin 240, cos 30°)
const BOX_RIGHT = 240 + 2 * (HALF + 24) * Math.cos(Math.PI / 6);

export function LayerStack({ items, header }: { items: StackItem[]; header?: React.ReactNode }) {
  const n = Math.min(items.length, N_MAX);
  const { layers, frame } = build(items.slice(0, n));
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const u = (k: string) => `ls${uid}-${k}`;
  const fills = fillsFor(u);
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)))));

  const go = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    const y = top + ((i + 0.5) / n) * run;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: layerStack.jump });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  const t = { duration: reduce ? 0 : duration.base, ease: ease.out };
  const extra = extraFor(n);
  const compact = n > 3;
  const vb = { x: 10, y: -210 - extra, w: 575, h: 560 + extra };
  const need = Math.round((640 * vb.h) / vb.w + 80);
  const pctY = (y: number) => `${((y - vb.y) / vb.h) * 100}%`;
  const railTop = layers[0].cy - 70;
  const railBot = layers[n - 1].cy + 70;

  return (
    <>
    {header}
    <div ref={wrap} style={{ height: `${n * 65}vh` }} className="relative mt-6 lg:mt-u-24">
      {/* the heading scrolls by; the stack pins under the nav with the whole
          screen to itself, so it keeps its size on short laptop screens */}
      <div
        className="sticky flex flex-col py-8 lg:py-u-40"
        // no taller than the drawing needs at its widest (its column is 640
        // units), centred in the screen under the nav
        style={{
          height: `min(calc(100svh - 72px), calc(var(--u) * ${need}))`,
          top: `max(72px, calc(50svh + 36px - var(--u) * ${need / 2}))`,
        }}
      >
        {/* same columns as the heading and intro above, so the detail lines up with the intro text */}
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*640)] lg:gap-u-96">
          {/* the stack and its rail, as large as the cell allows at its own proportions */}
          <div className="flex h-full min-h-0 w-full items-center [container-type:size]">
          <div
            className="relative"
            style={{ aspectRatio: `${vb.w} / ${vb.h}`, width: `min(100cqw, 100cqh * ${(vb.w / vb.h).toFixed(4)})` }}
          >
            <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="block h-full w-full" aria-hidden>
              <defs>
                <linearGradient id={u("top")} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#e3e7ef" />
                </linearGradient>
                <linearGradient id={u("left")} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d9dee8" />
                  <stop offset="1" stopColor="#c5cbd8" />
                </linearGradient>
                <linearGradient id={u("sky")} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8fd8ff" />
                  <stop offset="0.55" stopColor="#3a9ff0" />
                  <stop offset="1" stopColor="#2070d8" />
                </linearGradient>
                <linearGradient id={u("warm")} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd690" />
                  <stop offset="1" stopColor="#f2952a" />
                </linearGradient>
                <filter id={u("grain")} x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="n" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.75" result="speck" />
                  <feComposite in="speck" in2="SourceAlpha" operator="in" result="g" />
                  <feComponentTransfer in="g" result="gs">
                    <feFuncA type="linear" slope="0.22" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="gs" />
                  </feMerge>
                </filter>
                <filter id={u("blur")} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              {frame.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#2089d8" strokeOpacity={0.45} strokeWidth={0.8} />
              ))}
              {layers.map((_, idx) => {
                const i = n - 1 - idx; // draw the bottom plate first
                const layer = layers[i];
                const on = i === active;
                const above = i < active;
                return (
                  <motion.g
                    key={i}
                    initial={false}
                    animate={{ opacity: on ? 1 : above ? 0.16 : 0.5, y: above ? -18 : 0 }}
                    transition={t}
                  >
                    {layer.plate.map((sh, k) => (
                      <path key={k} d={sh.d} fill={fills[sh.tone]} {...edge(sh)} strokeLinejoin="round" />
                    ))}
                    {layer.dots.map((d, k) => (
                      <path key={k} d={d.d} fill={on ? dotTone[i % 3] : "#9aa1ad"} opacity={on ? (d.r > 2 ? 0.9 : 0.6) : 0.5} />
                    ))}
                    {/* the object's soft shadow on the plate, then the object */}
                    <ellipse cx={240} cy={layer.cy + 6} rx={62} ry={30} fill="#1b2140" opacity={0.1} filter={`url(#${u("blur")})`} />
                    {layer.object.map((sh, k) => (
                      <path
                        key={k}
                        d={sh.d}
                        fill={fills[sh.tone]}
                        {...edge(sh)}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter={grainy(sh) ? `url(#${u("grain")})` : undefined}
                      />
                    ))}
                  </motion.g>
                );
              })}
              {/* rail: line, ticks, stops, connector to the active plate */}
              <line x1={RAIL_X} y1={railTop} x2={RAIL_X} y2={railBot} stroke="#2089d8" strokeOpacity={0.5} strokeWidth={0.8} />
              {Array.from({ length: 25 }, (_, k) => railTop + ((railBot - railTop) * k) / 24).map((y, k) => (
                <line key={k} x1={RAIL_X} y1={y} x2={RAIL_X + (k % 4 === 0 ? 10 : 6)} y2={y} stroke="#2089d8" strokeOpacity={0.35} strokeWidth={0.7} />
              ))}
              <motion.line
                initial={false}
                animate={{ y1: layers[active].cy, y2: layers[active].cy }}
                transition={t}
                x1={BOX_RIGHT}
                x2={RAIL_X}
                stroke="#2089d8"
                strokeOpacity={0.6}
                strokeWidth={0.8}
              />
              <motion.rect initial={false} animate={{ y: layers[active].cy - 9 }} transition={t} x={RAIL_X - 2.5} width={5} height={18} fill="#2089d8" />
            </svg>
            {/* stops (HTML so they're real buttons), placed on the rail */}
            {layers.map((L, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-current={i === active ? "step" : undefined}
                // four stops sit closer together, so number and label share one line
                className={`absolute -translate-y-1/2 text-left ${compact ? "flex w-max items-start gap-2 whitespace-nowrap" : "w-[150px]"}`}
                style={{ left: `${((RAIL_X + 18 - vb.x) / vb.w) * 100}%`, top: pctY(L.cy) }}
              >
                <span
                  className={`inline-block px-2 py-1 text-xs leading-none font-medium tabular-nums transition-colors duration-[var(--duration-base)] ${
                    i === active ? "bg-sky text-bg" : "text-fg/45 hover:text-fg"
                  }`}
                >
                  {String(i + 1)}
                </span>
                <span className={`hidden text-sm leading-[1.25] transition-colors duration-[var(--duration-base)] lg:block ${compact ? "mt-0.5" : "mt-1.5"} ${i === active ? "text-fg" : "text-fg/45"}`}>
                  {items[i].lead}
                </span>
              </button>
            ))}
          </div>
          </div>

          {/* detail for the active step */}
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
                exit={{ opacity: 0, y: -6, transition: { duration: duration.fast, ease: ease.in } }}
              >
                <p className="text-2xl leading-[1.2] font-semibold tracking-[-0.01em] lg:text-[28px]">{items[active].lead}</p>
                <p className="mt-4 max-w-[460px] text-lg leading-[1.55] text-fg/70">{items[active].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
