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

export type StackItem = { lead: string; text: string };

const N_MAX = 3;
const HALF = 100; // plate half-size (world units)
const GAP = 96; // vertical gap between plates
const plateZ = (i: number, n: number) => (n - 1 - i) * GAP; // item 0 on top

type Layer = { plate: Shape[]; dots: { d: string; r: number }[]; object: Shape[]; cy: number };

// small line-art object standing on each plate
function drawObject(s: Scene, i: number, z: number) {
  if (i === 0) {
    // estimates: two plan sheets and a calculator on them
    s.box(-46, -34, z, 70, 56, 2).box(-40, -28, z + 2, 70, 56, 2);
    s.box(-8, -22, z + 4, 34, 44, 9);
    s.poly([[-4, -18, z + 13], [22, -18, z + 13], [22, -8, z + 13], [-4, -8, z + 13]], "accent");
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.box(-2 + c * 8, -2 + r * 7, z + 13, 5, 4, 1.4);
  } else if (i === 1) {
    // contractor readiness: open work package, the plan lifting out
    const t = z + 26;
    s.poly([[-26, -26, t], [26, -26, t], [26, -40, t + 9], [-26, -40, t + 9]], "left");
    s.poly([[-26, -26, t], [-26, 26, t], [-40, 26, t + 9], [-40, -26, t + 9]], "right");
    s.poly([[-26, 26, z], [26, 26, z], [26, 26, t], [-26, 26, t]], "left");
    s.poly([[26, -26, z], [26, 26, z], [26, 26, t], [26, -26, t]], "right");
    s.poly([[-26, -26, t], [26, -26, t], [26, 26, t], [-26, 26, t]], "inner");
    s.box(-17, -13, t + 8, 34, 26, 2);
    s.line([[-12, 8, t + 10], [-8, 12, t + 10], [-1, 5, t + 10]], "accent");
    s.poly([[-26, 26, t], [26, 26, t], [26, 40, t + 7], [-26, 40, t + 7]], "top");
    s.poly([[26, -26, t], [26, 26, t], [40, 26, t + 7], [40, -26, t + 7]], "top");
  } else {
    // cost tracking: columns rising across the outage
    [12, 20, 30, 44].forEach((h, k) => s.box(-32 + k * 16, -8 + k * 4, z, 12, 12, h, k === 3));
  }
}

function build(n: number): { layers: Layer[]; frame: string[] } {
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
    drawObject(o, i, z + 5);
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
    ? { stroke: "#1f78d1", strokeOpacity: 1, strokeWidth: 1.2 }
    : { stroke: ink, strokeOpacity: sh.tone === "none" ? 0.6 : 0.16, strokeWidth: sh.tone === "none" ? 0.9 : 0.8 };
const grainy = (sh: Shape) => sh.tone === "accent" || sh.tone === "warm" || sh.tone === "water";
const dotTone = ["#2089d8", "#5cb3ef", "#072871"];

const RAIL_X = 520;
// screen x of the wireframe box's right edge (Scene origin 240, cos 30°)
const BOX_RIGHT = 240 + 2 * (HALF + 24) * Math.cos(Math.PI / 6);

export function LayerStack({ items, header }: { items: StackItem[]; header?: React.ReactNode }) {
  const n = Math.min(items.length, N_MAX);
  const { layers, frame } = build(n);
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
  const vb = { x: 10, y: -210, w: 600, h: 560 };
  const pctY = (y: number) => `${((y - vb.y) / vb.h) * 100}%`;
  const railTop = layers[0].cy - 70;
  const railBot = layers[n - 1].cy + 70;

  return (
    <div ref={wrap} style={{ height: `${n * 100}vh` }} className="relative">
      {/* the whole section pins under the nav: heading and intro on top, the
          stack filling the rest of the screen below them */}
      <div className="sticky top-16 flex h-[calc(100svh-64px)] flex-col pt-8 pb-8 xl:top-[72px] xl:h-[calc(100svh-72px)] lg:pt-u-48">
        {header}
        <div className="mt-6 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-center gap-12 lg:mt-u-64 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-u-72">
          {/* the stack and its rail, sized by the height left on screen */}
          <div className="relative aspect-[600/560] h-full max-h-full max-w-full justify-self-start">
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
                className="absolute w-[150px] -translate-y-1/2 text-left"
                style={{ left: `${((RAIL_X + 18 - vb.x) / vb.w) * 100}%`, top: pctY(L.cy) }}
              >
                <span
                  className={`inline-block px-2 py-1 text-xs leading-none font-medium tabular-nums transition-colors duration-[var(--duration-base)] ${
                    i === active ? "bg-sky text-bg" : "text-fg/45 hover:text-fg"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`mt-1.5 hidden text-sm leading-[1.25] transition-colors duration-[var(--duration-base)] lg:block ${i === active ? "text-fg" : "text-fg/45"}`}>
                  {items[i].lead}
                </span>
              </button>
            ))}
          </div>

          {/* detail for the active step */}
          <div aria-live="polite">
            <p className="border-b border-fg/15 pb-2 text-right text-sm leading-none tabular-nums">
              <span className="text-fg">{String(active + 1).padStart(2, "0")}</span>
              <span className="text-fg/40"> / {String(n).padStart(2, "0")}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
                exit={{ opacity: 0, y: -6, transition: { duration: duration.fast, ease: ease.in } }}
              >
                <p className="mt-6 text-2xl leading-[1.2] font-semibold tracking-[-0.01em] lg:text-[28px]">{items[active].lead}</p>
                <p className="mt-4 max-w-[460px] text-lg leading-[1.55] text-fg/70">{items[active].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
