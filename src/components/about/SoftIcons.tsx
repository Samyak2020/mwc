"use client";

import { motion, useReducedMotion } from "motion/react";
import { createContext, useContext, useId } from "react";
import { duration, ease, navMenu } from "@/lib/motion";
import { Blueprint } from "@/components/nav/Blueprint";

// Trial style for the About disciplines, after privy.io's nav graphics: a pale
// page with a thin isometric grid, a few solid objects with grainy gradient
// faces or dark slate faces, soft shadows on the grid, thick connector lines
// and thin wireframe outlines. Brand blues with one violet accent.

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const OX = 150;
const OY = 132;
const f = (n: number) => Math.round(n * 10) / 10;
type V3 = [number, number, number];
const xy = ([x, y, z]: V3): [number, number] => [OX + (x - y) * C, OY + (x + y) * S - z];
const P = ([x, y, z]: V3) => `${f(OX + (x - y) * C)} ${f(OY + (x + y) * S - z)}`;
const poly = (pts: V3[]) => `M${pts.map(P).join(" L")} Z`;
const path = (pts: V3[]) => `M${pts.map(P).join(" L")}`;

export type SoftKey = "pm" | "engineering" | "construction" | "operations" | "controls";
const KEYS: SoftKey[] = ["pm", "engineering", "construction", "operations", "controls"];
type Mat = "slate" | "sky" | "violet" | "paper" | "mist";

type Item =
  | { t: "box"; x: number; y: number; z: number; w: number; d: number; h: number; m: Mat; shadow?: boolean }
  | { t: "wire"; x: number; y: number; z: number; w: number; d: number; h: number }
  | { t: "line"; pts: V3[]; dots?: boolean; thin?: boolean }
  | { t: "cyl"; x: number; y: number; z: number; r: number; h: number; m: Mat; shadow?: boolean }
  | { t: "prism"; pts: [number, number][]; z: number; h: number; m: Mat; shadow?: boolean }
  | { t: "tree"; x: number; y: number; s: number; bush: boolean };

/** a loose clump of trees and bushes, back to front, seeded */
function grove(cx: number, cy: number, n: number, spread: number, seed: number): Item[] {
  let st = seed;
  const rnd = () => (st = (st * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => ({
    t: "tree" as const,
    x: cx + (rnd() - 0.5) * spread,
    y: cy + (rnd() - 0.5) * spread,
    s: 0.8 + rnd() * 0.45,
    bush: rnd() < 0.3,
  })).sort((a, b) => a.x + a.y - (b.x + b.y));
}

/* ---------------------------------------------------------------- scenes */

function pm(): Item[][] {
  // a delivery plan as a flowchart of cards (after the second reference)
  const z = 14;
  const card = (x: number, y: number, w: number, d: number, m: Mat): Item => ({ t: "box", x, y, z, w, d, h: 3, m, shadow: true });
  return [
    [...grove(-125, -30, 4, 26, 3), ...grove(-20, -125, 4, 26, 7)],
    [
      { t: "line", pts: [[-55, -48, z + 3], [-30, -48, z + 3], [-30, -78, z + 3], [10, -78, z + 3]] },
      { t: "line", pts: [[-30, -48, z + 3], [-30, -10, z + 3], [-10, -10, z + 3]] },
      { t: "line", pts: [[-55, 22, z + 3], [-30, 22, z + 3], [-30, 52, z + 3], [-15, 52, z + 3]] },
      { t: "line", pts: [[-30, 22, z + 3], [-30, -10, z + 3]] },
      { t: "line", pts: [[50, -68, z + 3], [70, -68, z + 3], [70, 0, z + 3]] },
      { t: "line", pts: [[25, -10, z + 3], [45, -10, z + 3], [45, 0, z + 3]] },
    ],
    [card(-100, -58, 46, 22, "slate")],
    [card(-100, 12, 46, 22, "slate")],
    [card(10, -82, 42, 24, "sky")],
    [card(-12, -22, 38, 24, "violet")],
    [card(-16, 42, 40, 22, "sky")],
    [card(36, 0, 66, 48, "slate")],
    [...grove(25, 108, 4, 26, 11), ...grove(112, 48, 3, 22, 13)],
  ];
}

function construction(): Item[][] {
  // floors going up on columns; the next floor drawn as a wireframe
  const cols = (z0: number, z1: number): Item[] =>
    [
      [-36, -36],
      [30, -36],
      [-36, 30],
      [30, 30],
    ].map(([x, y]) => ({ t: "box", x, y, z: z0, w: 5, d: 5, h: z1 - z0, m: "slate" }) as Item);
  return [
    [...grove(-122, 8, 4, 24, 17), ...grove(8, -122, 4, 24, 19)],
    [{ t: "box", x: -48, y: -48, z: 0, w: 96, d: 96, h: 6, m: "paper", shadow: true }],
    [...cols(6, 26)],
    [{ t: "box", x: -42, y: -42, z: 26, w: 84, d: 84, h: 5, m: "slate" }],
    [...cols(31, 51)],
    [{ t: "box", x: -42, y: -42, z: 51, w: 84, d: 84, h: 5, m: "sky" }],
    // the next storey's columns already rising into the outline
    [...cols(56, 72)],
    [{ t: "wire", x: -42, y: -42, z: 56, w: 84, d: 84, h: 24 }],
    // beams stacked on the ground, ready to go up
    [
      { t: "box", x: -22, y: 58, z: 0, w: 44, d: 7, h: 4, m: "mist", shadow: true },
      { t: "box", x: -22, y: 67, z: 0, w: 44, d: 7, h: 4, m: "mist", shadow: true },
      { t: "box", x: -22, y: 62, z: 4, w: 44, d: 7, h: 4, m: "mist" },
    ],
    [...grove(-78, 68, 4, 24, 23), ...grove(85, -55, 3, 20, 29), ...grove(72, 62, 4, 24, 31)],
  ];
}

function controls(): Item[][] {
  // the numbers rising: slate bars, the latest in colour and outlined. The
  // bars step along x − y so they stand side by side across the screen.
  const hs = [28, 44, 62, 88];
  const mats: Mat[] = ["slate", "slate", "violet", "sky"];
  const at = (i: number): [number, number] => [-62 + i * 30, 22 - i * 30];
  const bars: Item[][] = hs.map((h, i) => {
    const [x, y] = at(i);
    return [{ t: "box", x, y, z: 0, w: 20, d: 20, h, m: mats[i], shadow: true }];
  });
  const [lx, ly] = at(3);
  return [
    [...grove(-110, -25, 3, 22, 37)],
    ...bars,
    [{ t: "wire", x: lx - 4, y: ly - 4, z: 0, w: 28, d: 28, h: 104 }],
    [{ t: "line", pts: hs.map((h, i) => [at(i)[0] + 10, at(i)[1] + 10, h + 12] as V3), dots: true }],
    [...grove(-45, 70, 4, 24, 43), ...grove(75, 15, 3, 20, 47)],
  ];
}

function engineering(): Item[][] {
  // the design on the drawing sheet, then the part it describes taking shape
  // inside its own wireframe; a set square and a rule beside it
  const z = 3;
  return [
    [...grove(-122, -10, 4, 24, 61), ...grove(-10, -122, 4, 24, 67)],
    [{ t: "box", x: -66, y: -50, z: 0, w: 132, d: 100, h: 3, m: "paper", shadow: true }],
    [
      { t: "line", thin: true, pts: [[-56, -40, z], [56, -40, z], [56, 40, z], [-56, 40, z], [-56, -40, z]] },
      { t: "line", thin: true, pts: [[-56, -6, z], [-14, -6, z], [-14, 40, z]] },
      { t: "line", thin: true, pts: [[-14, -40, z], [-14, -20, z]] },
      { t: "line", thin: true, pts: [[-46, 14, z], [-24, 14, z], [-24, 32, z], [-46, 32, z], [-46, 14, z]] },
    ],
    [{ t: "box", x: -60, y: 46, z, w: 70, d: 6, h: 3, m: "slate" }],
    [{ t: "prism", pts: [[-50, -34], [-20, -34], [-50, -6]], z, h: 3, m: "violet" }],
    [{ t: "box", x: 12, y: -22, z, w: 26, d: 26, h: 20, m: "sky", shadow: true }],
    [{ t: "wire", x: 6, y: -28, z, w: 38, d: 38, h: 40 }],
    [...grove(-70, 78, 4, 24, 71), ...grove(88, -40, 3, 20, 73), ...grove(76, 66, 3, 22, 79)],
  ];
}

function operations(): Item[][] {
  // a running plant: a vessel, a pipe run to the control cabinet, a gauge
  return [
    [...grove(-120, 0, 4, 24, 83), ...grove(10, -122, 4, 24, 89)],
    [{ t: "cyl", x: -42, y: -34, z: 0, r: 24, h: 58, m: "sky", shadow: true }],
    [{ t: "box", x: -20, y: -38, z: 22, w: 64, d: 7, h: 7, m: "slate" }],
    [{ t: "box", x: 40, y: -38, z: 0, w: 7, d: 7, h: 29, m: "slate", shadow: true }],
    [{ t: "cyl", x: 14, y: -34, z: 29, r: 6, h: 6, m: "violet" }],
    [{ t: "box", x: 14, y: 6, z: 0, w: 38, d: 22, h: 46, m: "slate", shadow: true }],
    [{ t: "box", x: 19, y: 28, z: 24, w: 28, d: 1.5, h: 16, m: "violet" }],
    [{ t: "box", x: 19, y: 28, z: 8, w: 12, d: 1.5, h: 10, m: "sky" }],
    [...grove(-74, 74, 4, 24, 97), ...grove(92, -30, 3, 20, 101), ...grove(86, 70, 3, 22, 103)],
  ];
}

const scenes: Record<SoftKey, () => Item[][]> = { pm, engineering, construction, operations, controls };

/* ------------------------------------------------------------- rendering */

/* ---------------------------------------------------------------- themes */

const light = {
  bg: "#f2f3f8",
  grid: "#c7cad6",
  bpInk: "#3f6db3",
  bpOpacity: 0.05,
  slateTop: ["#6e717c", "#3b3d46"],
  slateLeft: ["#3a3c45", "#2b2d34"],
  slateRight: "#24262d",
  paperTop: ["#fbfcff", "#e2e5ee"],
  paperLeft: "#cfd3dd",
  paperRight: "#b9bdc9",
  mistTop: ["#eef0f5", "#d8dce5"],
  mistLeft: "#c9cdd8",
  mistRight: "#b3b8c5",
  treeLit: "#d3d7e0",
  treeShade: "#b4bac7",
  trunk: "#a7adbb",
  bush: ["#ffffff", "#dde1ea"],
  shadow: "#1b2140",
  shadowOpacity: 0.14,
  softShadowOpacity: 0.07,
  wire: "#2a2d38",
  line: "#1c1f27",
  dot: "#fbfcff",
};
const dark: typeof light = {
  bg: "#0b1224",
  grid: "#1e2942",
  bpInk: "#5b8fd6",
  bpOpacity: 0.07,
  slateTop: ["#646a7d", "#373c4b"],
  slateLeft: ["#30343f", "#262a33"],
  slateRight: "#1d2028",
  paperTop: ["#2b3348", "#1f2638"],
  paperLeft: "#1a2030",
  paperRight: "#141a28",
  mistTop: ["#283148", "#1e2538"],
  mistLeft: "#1a2133",
  mistRight: "#141a29",
  treeLit: "#2e3852",
  treeShade: "#1f2740",
  trunk: "#1a2136",
  bush: ["#334060", "#222b44"],
  shadow: "#000000",
  shadowOpacity: 0.45,
  softShadowOpacity: 0.25,
  wire: "rgb(220 228 245 / 0.6)",
  line: "#dfe5f2",
  dot: "#0b1224",
};
const Theme = createContext(light);

const solid: Record<Mat, { top: string; left: string; right: string; grain: boolean }> = {
  slate: { top: "slateTop", left: "slateLeft", right: "slateRight", grain: false },
  sky: { top: "skyTop", left: "skyLeft", right: "#174a96", grain: true },
  violet: { top: "violetTop", left: "violetLeft", right: "#4234ae", grain: true },
  paper: { top: "paperTop", left: "paperLeft", right: "paperRight", grain: false },
  // background props (beams, etc.): light grey so they stay behind the subject
  mist: { top: "mistTop", left: "mistLeft", right: "mistRight", grain: false },
};

function Box({ it, id }: { it: Extract<Item, { t: "box" }>; id: string }) {
  const { x, y, z, w, d, h, m } = it;
  const t = z + h;
  const mat = solid[m];
  const th = useContext(Theme) as Record<string, unknown>;
  const fill = (v: string) => (v.startsWith("#") ? v : typeof th[v] === "string" ? (th[v] as string) : `url(#${id}-${v})`);
  // stroking each face in its own fill softens the corners, as in the reference
  const face = (pts: V3[], v: string) => (
    <path d={poly(pts)} fill={fill(v)} stroke={fill(v)} strokeWidth={1.4} strokeLinejoin="round" />
  );
  return (
    <g filter={mat.grain ? `url(#${id}-grain)` : undefined}>
      {face([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], mat.left)}
      {face([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], mat.right)}
      {face([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]], mat.top)}
    </g>
  );
}

function Cyl({ it, id }: { it: Extract<Item, { t: "cyl" }>; id: string }) {
  const th = useContext(Theme) as Record<string, unknown>;
  const mat = solid[it.m];
  const fill = (v: string) => (typeof th[v] === "string" ? (th[v] as string) : `url(#${id}-${v})`);
  const [cx, yb] = xy([it.x, it.y, it.z]);
  const yt = yb - it.h;
  const rx = it.r * C * Math.SQRT2;
  const ry = it.r * S * Math.SQRT2;
  const side = `M${f(cx - rx)} ${f(yt)} L${f(cx - rx)} ${f(yb)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yb)} L${f(cx + rx)} ${f(yt)} Z`;
  const top = `M${f(cx - rx)} ${f(yt)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(yt)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(yt)} Z`;
  return (
    <g filter={mat.grain ? `url(#${id}-grain)` : undefined}>
      <path d={side} fill={`url(#${id}-${it.m}Round)`} />
      <path d={top} fill={fill(mat.top)} />
    </g>
  );
}

function Prism({ it, id }: { it: Extract<Item, { t: "prism" }>; id: string }) {
  const th = useContext(Theme) as Record<string, unknown>;
  const mat = solid[it.m];
  const fill = (v: string) => (v.startsWith("#") ? v : typeof th[v] === "string" ? (th[v] as string) : `url(#${id}-${v})`);
  const b = it.pts.map(([x, y]) => [x, y, it.z] as V3);
  const t = it.pts.map(([x, y]) => [x, y, it.z + it.h] as V3);
  const sides = b.map((p, i) => {
    const q = b[(i + 1) % b.length];
    return [p, q, t[(i + 1) % b.length], t[i]] as V3[];
  });
  return (
    <g filter={mat.grain ? `url(#${id}-grain)` : undefined}>
      {sides.map((sd, i) => (
        <path key={i} d={poly(sd)} fill={fill(i % 2 ? mat.right : mat.left)} />
      ))}
      <path d={poly(t)} fill={fill(mat.top)} />
    </g>
  );
}

function Shadow({ it, id }: { it: Extract<Item, { t: "box" }>; id: string }) {
  const th = useContext(Theme);
  const { x, y, w, d } = it;
  const o = 6 + it.z * 0.25; // further from the ground, softer and further away
  return (
    <path
      d={poly([[x + o, y + o, 0], [x + w + o, y + o, 0], [x + w + o, y + d + o, 0], [x + o, y + d + o, 0]])}
      fill={th.shadow}
      opacity={it.m === "mist" ? th.softShadowOpacity : th.shadowOpacity}
      filter={`url(#${id}-blur)`}
    />
  );
}

function Tree({ it, id }: { it: Extract<Item, { t: "tree" }>; id: string }) {
  const th = useContext(Theme);
  const [sx, sy] = xy([it.x, it.y, 0]);
  const s = it.s;
  const n = (v: number) => f(v);
  if (it.bush)
    return (
      <path
        d={`M${n(sx - 7 * s)} ${n(sy)} C${n(sx - 7 * s)} ${n(sy - 9 * s)} ${n(sx + 7 * s)} ${n(sy - 9 * s)} ${n(sx + 7 * s)} ${n(sy)} Z`}
        fill={`url(#${id}-bush)`}
      />
    );
  // a cone split down the middle: lit left half, shaded right half
  const top = sy - 27 * s;
  const base = sy - 5 * s;
  return (
    <g>
      <rect x={n(sx - 1.2 * s)} y={n(sy - 6 * s)} width={n(2.4 * s)} height={n(6 * s)} fill={th.trunk} />
      <path d={`M${n(sx)} ${n(top)} L${n(sx - 8 * s)} ${n(base)} Q${n(sx - 4 * s)} ${n(base + 2.2 * s)} ${n(sx)} ${n(base + 2.6 * s)} Z`} fill={th.treeLit} />
      <path d={`M${n(sx)} ${n(top)} L${n(sx + 8 * s)} ${n(base)} Q${n(sx + 4 * s)} ${n(base + 2.2 * s)} ${n(sx)} ${n(base + 2.6 * s)} Z`} fill={th.treeShade} />
    </g>
  );
}

function TreeShadow({ it, id }: { it: Extract<Item, { t: "tree" }>; id: string }) {
  const th = useContext(Theme);
  const [sx, sy] = xy([it.x, it.y, 0]);
  return <ellipse cx={f(sx + 7 * it.s)} cy={f(sy)} rx={f(10 * it.s)} ry={f(3.4 * it.s)} fill={th.shadow} opacity={th.softShadowOpacity} filter={`url(#${id}-blur-sm)`} />;
}

function Wire({ it }: { it: Extract<Item, { t: "wire" }> }) {
  const th = useContext(Theme);
  const { x, y, z, w, d, h } = it;
  const t = z + h;
  const A: V3 = [x, y, t];
  const B: V3 = [x + w, y, t];
  const Cc: V3 = [x + w, y + d, t];
  const D: V3 = [x, y + d, t];
  return (
    <g fill="none" stroke={th.wire} strokeWidth={0.9} strokeLinejoin="round">
      <path d={poly([A, B, Cc, D])} />
      <path d={path([D, [x, y + d, z], [x + w, y + d, z], [x + w, y, z], B])} />
      <path d={path([Cc, [x + w, y + d, z]])} />
    </g>
  );
}

function Line({ it }: { it: Extract<Item, { t: "line" }> }) {
  const th = useContext(Theme);
  return (
    <g>
      <path d={path(it.pts)} fill="none" stroke={it.thin ? th.wire : th.line} strokeWidth={it.thin ? 0.7 : 2.4} strokeOpacity={it.thin ? 0.5 : 1} strokeLinecap="round" strokeLinejoin="round" />
      {it.dots &&
        it.pts.map((p, i) => {
          const [sx, sy] = P(p).split(" ").map(Number);
          return <circle key={i} cx={sx} cy={sy} r={3.2} fill={th.dot} stroke={th.line} strokeWidth={1.8} />;
        })}
    </g>
  );
}

export function SoftIcon({ kind, tone = "light" }: { kind: SoftKey; tone?: "light" | "dark" }) {
  const th = tone === "dark" ? dark : light;
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const groups = scenes[kind]();
  const grid: string[] = [];
  for (let k = -200; k <= 200; k += 24) grid.push(path([[k, -200, 0], [k, 200, 0]]), path([[-200, k, 0], [200, k, 0]]));

  return (
    <Theme.Provider value={th}>
    <motion.svg
      viewBox="0 0 300 250"
      className="block h-full w-full"
      aria-hidden
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      <defs>
        <linearGradient id={`${id}-slateTop`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={th.slateTop[0]} />
          <stop offset="1" stopColor={th.slateTop[1]} />
        </linearGradient>
        <linearGradient id={`${id}-slateLeft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={th.slateLeft[0]} />
          <stop offset="1" stopColor={th.slateLeft[1]} />
        </linearGradient>
        <linearGradient id={`${id}-skyTop`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd8ff" />
          <stop offset="0.55" stopColor="#3a9ff0" />
          <stop offset="1" stopColor="#2070d8" />
        </linearGradient>
        <linearGradient id={`${id}-skyLeft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a86e0" />
          <stop offset="1" stopColor="#1a5bb8" />
        </linearGradient>
        <linearGradient id={`${id}-violetTop`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7b8ff" />
          <stop offset="0.5" stopColor="#8a78f5" />
          <stop offset="1" stopColor="#5c4be0" />
        </linearGradient>
        <linearGradient id={`${id}-violetLeft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a58e8" />
          <stop offset="1" stopColor="#4b3cc4" />
        </linearGradient>
        <linearGradient id={`${id}-paperTop`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={th.paperTop[0]} />
          <stop offset="1" stopColor={th.paperTop[1]} />
        </linearGradient>
        <linearGradient id={`${id}-bush`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={th.bush[0]} />
          <stop offset="1" stopColor={th.bush[1]} />
        </linearGradient>
        <linearGradient id={`${id}-mistTop`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={th.mistTop[0]} />
          <stop offset="1" stopColor={th.mistTop[1]} />
        </linearGradient>
        <linearGradient id={`${id}-skyRound`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8fd8ff" />
          <stop offset="0.5" stopColor="#2f8fe8" />
          <stop offset="1" stopColor="#174a96" />
        </linearGradient>
        <linearGradient id={`${id}-violetRound`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c7b8ff" />
          <stop offset="0.5" stopColor="#7462ee" />
          <stop offset="1" stopColor="#4234ae" />
        </linearGradient>
        <linearGradient id={`${id}-slateRound`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={th.slateTop[0]} />
          <stop offset="1" stopColor={th.slateRight} />
        </linearGradient>
        <filter id={`${id}-blur-sm`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={`${id}-fade`} cx="50%" cy="55%" r="60%">
          <stop offset="0.4" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="250">
          <rect width="300" height="250" fill={`url(#${id}-fade)`} />
        </mask>
        {/* fine film grain, kept inside each face */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
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
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect width="300" height="250" fill={th.bg} />
      <path d={grid.join("")} fill="none" stroke={th.grid} strokeWidth={0.6} mask={`url(#${id}-mask)`} />
      {/* the plans the work is built from, laid under everything */}
      <g mask={`url(#${id}-mask)`}>
        <Blueprint ox={OX} oy={OY} scale={1.3} variant={KEYS.indexOf(kind)} sheet={{ x0: -185, y0: -185, x1: 185, y1: 185 }} ink={th.bpInk} paper="#2089d8" paperOpacity={th.bpOpacity} />
      </g>

      {/* shadows first, all on the ground */}
      {groups.flat().map((it, i) =>
        it.t === "box" && it.shadow ? (
          <Shadow key={`s${i}`} it={it} id={id} />
        ) : it.t === "tree" ? (
          <TreeShadow key={`s${i}`} it={it} id={id} />
        ) : it.t === "cyl" && it.shadow ? (
          <ellipse
            key={`s${i}`}
            cx={f(xy([it.x + 6, it.y + 6, 0])[0])}
            cy={f(xy([it.x + 6, it.y + 6, 0])[1])}
            rx={f(it.r * C * Math.SQRT2 * 1.1)}
            ry={f(it.r * S * Math.SQRT2 * 1.1)}
            fill={th.shadow}
            opacity={th.shadowOpacity}
            filter={`url(#${id}-blur)`}
          />
        ) : null,
      )}

      {groups.map((g, gi) => (
        <motion.g
          key={gi}
          variants={{
            hidden: { opacity: 0, y: 6 },
            shown: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out, delay: gi * navMenu.build.stepDelay * 1.6 } },
          }}
        >
          {g.map((it, i) =>
            it.t === "box" ? (
              <Box key={i} it={it} id={id} />
            ) : it.t === "wire" ? (
              <Wire key={i} it={it} />
            ) : it.t === "tree" ? (
              <Tree key={i} it={it} id={id} />
            ) : it.t === "cyl" ? (
              <Cyl key={i} it={it} id={id} />
            ) : it.t === "prism" ? (
              <Prism key={i} it={it} id={id} />
            ) : (
              <Line key={i} it={it} />
            ),
          )}
        </motion.g>
      ))}
    </motion.svg>
    </Theme.Provider>
  );
}
