"use client";

import { useId } from "react";
import { useReducedMotion } from "motion/react";
import type { Shape, Tone } from "@/components/nav/iso";
import { iconShapes, type IconKey } from "./LineIcons";

// A case study's drawing drawn the way the industry heroes are: fine white
// linework with faces a shade off the card's own colour, standing on a survey
// grid laid on the ground plane that dissolves toward the edges. No frame;
// it sits straight on the card.

const C30 = Math.cos(Math.PI / 6);
const P = (x: number, y: number) => [240 + (x - y) * C30, 190 + (x + y) * 0.5] as const;

/** a hex colour moved `t` of the way toward white */
function lift(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * t));
  return `rgb(${ch.join(" ")})`;
}

// how far each face sits off the ground, as on the hero (ground #0a48a6)
const LIFT: Record<Tone, number> = { top: 0.1, left: 0.06, right: 0.03, inner: 0, accent: 0.2, warm: 0.1, tree: -1, water: 0.16, none: -1 };

function stroke(sh: Shape) {
  const st = sh.stroke ?? "ink";
  if (st === "accent") return { c: "#bfeaff", w: 1, o: 0.95 };
  if (st === "faint" || st === "soft") return { c: "#ffffff", w: 0.6, o: 0.25 };
  return { c: "#ffffff", w: 0.9, o: sh.tone === "none" ? 0.75 : 0.6 };
}

/** the grid lines of the ground plane, every `step` units out to `r` */
function grid(step: number, r: number) {
  const d: string[] = [];
  for (let k = -r; k <= r; k += step) {
    const [a, b] = [P(k, -r), P(k, r)];
    const [c, e] = [P(-r, k), P(r, k)];
    d.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
    d.push(`M${c[0].toFixed(1)} ${c[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
  }
  return d.join("");
}
const GRID = grid(14, 420);

export function CaseScene({ icon, ground, tight = false, className = "" }: { icon: IconKey; ground: string; tight?: boolean; className?: string }) {
  const { base, float, foot, flows, puffs } = iconShapes(icon);
  const reduce = useReducedMotion();
  const uid = `cs${useId().replace(/:/g, "")}`;
  const fill = (t: Tone) => (LIFT[t] < 0 ? "none" : lift(ground, LIFT[t]));
  const draw = (list: Shape[]) =>
    list.map((sh, i) => {
      const st = stroke(sh);
      return (
        <path
          key={i}
          d={sh.d}
          fill={fill(sh.tone)}
          stroke={st.c}
          strokeOpacity={st.o}
          strokeWidth={st.w}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      );
    });
  // the plot around the plate: a fine outline, a dashed inset and corner pins
  const [x0, y0, x1, y1] = foot ?? [-56, -50, 56, 50];
  const ring = (o: number) => {
    const pts = [P(x0 - o, y0 - o), P(x1 + o, y0 - o), P(x1 + o, y1 + o), P(x0 - o, y1 + o)];
    return `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L")}Z`;
  };
  const pins = [P(x0 - 14, y0 - 14), P(x1 + 14, y0 - 14), P(x1 + 14, y1 + 14), P(x0 - 14, y1 + 14)];
  return (
    <svg viewBox={tight ? "100 95 280 210" : "52 56 372 270"} preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${uid}-fade`} cx="240" cy="200" r="230" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 200) scale(1 0.62) translate(-240 -200)">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${uid}-mask`} maskUnits="userSpaceOnUse" x="-400" y="-300" width="1300" height="1000">
          <rect x="-400" y="-300" width="1300" height="1000" fill={`url(#${uid}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${uid}-mask)`}>
        <path d={GRID} fill="none" stroke="#ffffff" strokeOpacity={0.2} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
      </g>
      <path d={ring(14)} fill="none" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
      <path d={ring(9)} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={0.8} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
      {pins.map(([x, y], i) => (
        <rect key={i} x={x - 1.4} y={y - 1.4} width={2.8} height={2.8} fill="#bfeaff" />
      ))}
      {draw(base)}
      {float.length > 0 && <g className="iso-float">{draw(float)}</g>}
      {/* coal or water running along its path (still under reduced motion, via CSS) */}
      {flows?.map((fl, i) => (
        <path
          key={`f${i}`}
          d={fl.d}
          fill="none"
          stroke="#d4f3ff"
          strokeOpacity={0.95}
          strokeWidth={1.8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={fl.slow ? "mf-flow mf-flow-slow" : "mf-flow"}
          style={{ animationDelay: `${-i * 0.4}s` }}
        />
      ))}
      {/* dust rising and spreading, as the hero's steam */}
      {!reduce &&
        puffs?.map(([x, y], i) =>
          [0, 1, 2].map((k) => (
            <circle key={`p${i}-${k}`} cx={x} cy={y} r={3} fill="#ffffff" opacity={0}>
              <animate attributeName="cy" values={`${y};${y - 14}`} dur="3.6s" begin={`${-(k * 1.2 + i * 0.5)}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="1;4.5" dur="3.6s" begin={`${-(k * 1.2 + i * 0.5)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.22;0" keyTimes="0;0.25;1" dur="3.6s" begin={`${-(k * 1.2 + i * 0.5)}s`} repeatCount="indefinite" />
            </circle>
          )),
        )}
    </svg>
  );
}

// The ground the drawing stands on, after an aerial terrain photo: mostly
// smooth, with broad soft light and shade, and rough eroded ground only in
// scattered patches (fine relief lit from the top left, masked by a slow noise).
// Drawn once into an image (filters on a static data URI are rasterised and
// cached, so scrolling does not repaint them).
const TERRAIN = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1800' height='1100' viewBox='0 0 1800 1100'>
<filter id='soft' x='0' y='0' width='100%' height='100%'>
<feTurbulence type='fractalNoise' baseFrequency='0.0012 0.0016' numOctaves='3' seed='3'/>
<feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0.02  0 0 0 0 0.06  -2.2 0 0 0 1.25'/>
</filter>
<filter id='rock' x='0' y='0' width='100%' height='100%'>
<feTurbulence type='fractalNoise' baseFrequency='0.022 0.03' numOctaves='5' seed='8' result='n'/>
<feDiffuseLighting in='n' surfaceScale='2.6' lighting-color='#fff' result='l'><feDistantLight azimuth='235' elevation='42'/></feDiffuseLighting>
<feColorMatrix in='l' type='matrix' values='0 0 0 0 0  0 0 0 0 0.02  0 0 0 0 0.07  -2.6 0 0 0 1.9' result='shade'/>
<feColorMatrix in='l' type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.4 0 0 0 -1.75' result='lit'/>
<feMerge result='relief'><feMergeNode in='shade'/><feMergeNode in='lit'/></feMerge>
<feTurbulence type='fractalNoise' baseFrequency='0.0028 0.0034' numOctaves='5' seed='21' result='m'/>
<feColorMatrix in='m' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  6 0 0 0 -3.55' result='patch'/>
<feComposite in='relief' in2='patch' operator='in'/>
</filter>
<filter id='grit' x='0' y='0' width='100%' height='100%'>
<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' seed='7'/>
<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.8 0.9'/>
</filter>
<rect width='100%' height='100%' filter='url(#soft)' opacity='0.38'/>
<rect width='100%' height='100%' filter='url(#rock)' opacity='0.38'/>
<rect width='100%' height='100%' filter='url(#grit)' opacity='0.06'/>
</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ""))}")`;
})();

export function Terrain({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`absolute inset-0 bg-cover bg-center ${className}`} style={{ backgroundImage: TERRAIN }} />;
}
