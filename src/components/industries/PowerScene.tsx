"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Scene, type Shape, type Tone } from "@/components/nav/iso";
import { duration, ease, industryHero } from "@/lib/motion";

// Power Producers hero, drawn like the homepage's "Project Support Built
// Around Your Scope" (.field-soft): blueprint-blue ground under a fine white
// survey grid, plots marked out on it (inner grid, boundary, dashed setback,
// corner stakes), glowing power routes between them, turbines and trees.
//
// The main site is the Industries-menu power plant (same layout: stack back
// left, turbine hall with its boiler block, two cooling towers, pipe rack,
// offices, transformer yard, gantry and line out) drawn at homepage detail.
// Around it, the rest of a producer's portfolio: a solar farm, a battery yard
// and a proposed plot in wireframe on the left, a hydro dam behind.
//
// The page title sits centred, so the scene is composed around it: plant on
// the right, the smaller plots on the left, turbines along the top, and the
// middle left open (the ground there fades out under the title).

type V2 = [number, number];
/** place by screen axes: u runs left → right, v runs back → front */
const at = (u: number, v: number): V2 => [(u + v) / 2, (v - u) / 2];

// composition, in viewBox units (1600 × 900, centre 800 × 450)
const VB = { w: 1600, h: 900 };
const SCALE = 1.25;
/** where the plant (the world origin) sits on the sheet */
const O = { x: 1320, y: 625 };
/** the title's footprint, kept clear of objects */
const TITLE = { x0: 360, x1: 1240, y0: 290, y1: 545 };
/** world point under a given viewBox point */
const vb = (X: number, Y: number): V2 => at((X - O.x) / (0.866 * SCALE), (2 * (Y - O.y)) / SCALE);
/** viewBox point over a given world point */
const toVb = (x: number, y: number): V2 => [O.x + (x - y) * 0.866 * SCALE, O.y + ((x + y) / 2) * SCALE];

type Mark = { d: string; c: "gf" | "pl" | "ld" | "rd" | "mk" | "pw" | "pwn" };
type Rotor = { x: number; y: number; r: number; at: number };

/** hyperboloid cooling tower with rings and an open top (homepage style) */
function tower(s: Scene, x: number, y: number, R: number, h: number) {
  s.coolingTower(x, y, 0, R, R * 0.66, R * 0.76, h);
  const [cx, cy] = s.p([x, y, 0]);
  const K = Math.cos(Math.PI / 6) * Math.SQRT2;
  const KY = 0.5 * Math.SQRT2;
  const rad = (t: number) => (t < 0.72 ? 0.66 + 0.34 * (1 - t / 0.72) ** 2 : 0.66 + 0.1 * ((t - 0.72) / 0.28) ** 2) * R;
  for (const t of [0.22, 0.45, 0.7]) {
    const q = rad(t);
    const yy = cy - t * h;
    s.add(`M${cx - q * K} ${yy} A${q * K} ${q * KY} 0 0 0 ${cx + q * K} ${yy}`, "none", "faint");
  }
  const tq = R * 0.76 * 0.84;
  s.add(
    `M${cx - tq * K} ${cy - h + 1.2} A${tq * K} ${tq * KY} 0 1 0 ${cx + tq * K} ${cy - h + 1.2} A${tq * K} ${tq * KY} 0 1 0 ${cx - tq * K} ${cy - h + 1.2} Z`,
    "right",
  );
}

function truck(s: Scene, x: number, y: number) {
  s.box(x, y, 0, 12, 5, 5).box(x + 12, y, 0, 4, 5, 3.4, true);
}

/**
 * The Industries-menu power plant at homepage detail, on a 220 × 220 site
 * centred on the origin: stack back left, turbine hall with its boiler block,
 * two cooling towers, pipe rack, offices, transformer yard, gantry, line out.
 */
export function drawPlant(s: Scene, { trees = true } = {}) {
  // stack, back left: platform ring, ladder, two bands
  s.cyl(-80, -80, 0, 6, 96).band(-80, -80, 58, 6).band(-80, -80, 84, 6, "accent").band(-80, -80, 90, 6);
  s.line([[-76, -74, 0], [-76, -74, 84]], "faint");
  // cooling tower, back
  tower(s, 6, -82, 26, 80);
  // turbine hall with roof monitor, louvre band, the boiler block on top
  s.box(-95, -40, 0, 78, 54, 44);
  for (let x = -90; x < -18; x += 6) s.line([[x, 14, 30], [x, 14, 38]], "faint");
  s.line([[-95, 14, 30], [-17, 14, 30]], "faint").line([[-95, 14, 38], [-17, 14, 38]], "faint");
  for (let y = -34; y < 12; y += 6) s.line([[-17, y, 30], [-17, y, 38]], "faint");
  s.line([[-17, -40, 30], [-17, 14, 30]], "faint").line([[-17, -40, 38], [-17, 14, 38]], "faint");
  s.box(-58, -30, 44, 34, 10, 4).box(-34, 0, 44, 6, 6, 3).box(-24, 0, 44, 6, 6, 3);
  s.box(-95, -40, 44, 34, 26, 22, true);
  for (let x = -90; x < -61; x += 5) s.line([[x, -14, 46], [x, -14, 64]], "faint");
  // cooling tower, front
  tower(s, 72, -78, 26, 80);
  // pipe rack from the hall to the towers, on three bents
  for (const x of [-8, 10, 28]) s.line([[x, -6, 0], [x, -6, 28]], "faint").line([[x, 0, 0], [x, 0, 24]], "faint");
  s.line([[-17, -6, 28], [40, -6, 28], [40, -52, 28]]).line([[-17, 0, 24], [48, 0, 24], [48, -52, 24]]);
  // offices with two rows of windows and roof units
  s.box(-95, 40, 0, 44, 40, 16);
  for (const z of [5, 11]) for (let x = -91; x < -54; x += 6) s.line([[x, 80, z], [x + 3.4, 80, z]], "faint");
  for (const z of [5, 11]) for (let y = 44; y < 78; y += 6) s.line([[-51, y, z], [-51, y + 3.4, z]], "faint");
  s.box(-86, 48, 16, 8, 6, 3).box(-72, 54, 16, 8, 6, 3);
  // transformer yard: fins on the sides, bushings on top
  for (const x of [20, 44]) {
    s.box(x, 38, 0, 16, 12, 14);
    for (let k = 2; k < 12; k += 3) s.line([[x + 16, 38 + k, 3], [x + 16, 38 + k, 11]], "faint");
    for (const bx of [4, 8, 12]) s.line([[x + bx, 44, 14], [x + bx, 44, 19]], "accent");
  }
  // gantry and the line leaving the plant
  s.line([[16, 66, 0], [16, 66, 40]]).line([[72, 66, 0], [72, 66, 40]]).line([[12, 66, 40], [76, 66, 40]]).line([[12, 66, 34], [76, 66, 34]], "faint");
  s.lattice(60, 98, 0, 5, 2, 46, 3).line([[44, 98, 46], [76, 98, 46]]);
  s.wire([28, 66, 40], [48, 98, 46], 2).wire([44, 66, 40], [60, 98, 46], 2).wire([60, 66, 40], [72, 98, 46], 2);
  // a truck on the driveway, trees in the corners
  truck(s, -40, 92);
  if (trees) s.grove(94, -92, 6, 22, 11, 0).grove(98, 22, 5, 18, 5, 0).grove(-78, 98, 6, 26, 17, 0).grove(-18, 100, 3, 14, 29, 0);
  return s;
}

function build() {
  const marks: Mark[] = []; // flat marks on the ground
  const ghost = new Scene(); // the proposed plot, in wireframe
  const back = new Scene(); // behind the plant
  const plant = new Scene(); // the main site
  const front = new Scene(); // in front of it
  const infra = new Scene(); // the line out and the substation (muted)
  const rotors: Rotor[] = [];
  const g = (pts: [number, number, number][], c: Mark["c"], close = false) =>
    marks.push({ d: `M${pts.map((p) => back.pt(p)).join(" L")}${close ? " Z" : ""}`, c });

  /** a plot marked on the ground: inner grid, boundary, dashed setback, stakes */
  const plots: [number, number, number, number][] = [];
  const plot = (x0: number, y0: number, x1: number, y1: number, step = 10) => {
    plots.push([x0, y0, x1, y1]);
    for (let x = x0 + step; x < x1; x += step) g([[x, y0, 0], [x, y1, 0]], "gf");
    for (let y = y0 + step; y < y1; y += step) g([[x0, y, 0], [x1, y, 0]], "gf");
    g([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], "pl", true);
    g([[x0 + 5, y0 + 5, 0], [x1 - 5, y0 + 5, 0], [x1 - 5, y1 - 5, 0], [x0 + 5, y1 - 5, 0]], "ld", true);
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as V2[]) {
      const [sx, sy] = back.p([x, y, 0]);
      marks.push({ d: `M${sx - 2} ${sy - 4}h4v4h-4Z`, c: "mk" });
    }
  };
  /** a route that runs along the survey grid: across, then up/down */
  const lroute = (a: V2, b: V2) => route([a, [b[0], a[1]], b]);
  /** a glowing power route along the ground, with nodes at the turns */
  const route = (pts: V2[]) => {
    marks.push({ d: `M${pts.map(([x, y]) => back.pt([x, y, 0])).join(" L")}`, c: "pw" });
    for (const [x, y] of pts) {
      const [sx, sy] = back.p([x, y, 0]);
      marks.push({ d: `M${sx - 2.6} ${sy}a2.6 1.5 0 1 0 5.2 0a2.6 1.5 0 1 0 -5.2 0Z`, c: "pwn" });
    }
  };
  const turbine = (s: Scene, X: number, Y: number, h: number) => {
    const [x, y] = vb(X, Y);
    s.cyl(x, y, 0, 1.4, h, "left", "top");
    s.box(x - 3, y - 1.5, h - 1, 6, 3, 3);
    const [hx, hy] = s.p([x + 3, y, h + 0.5]);
    rotors.push({ x: hx, y: hy, r: h * 0.36, at: 1 });
  };
  /** shipping-container style enclosure: doors on the front, vents on the side */
  const container = (s: Scene, x: number, y: number, w = 16, d = 7, h = 7) => {
    s.box(x, y, 0, w, d, h);
    s.line([[x + w * 0.5, y + d, 0.6], [x + w * 0.5, y + d, h - 0.8]], "faint");
    for (let k = 1; k < 4; k++) s.line([[x + w, y + (d * k) / 4, h * 0.3], [x + w, y + (d * k) / 4, h * 0.8]], "faint");
  };

  // ── background: ground marks, the proposed plot, hydro, turbines ────────
  // proposed plot (wireframe), back left of the plant
  {
    const [ox, oy] = vb(300, 330);
    plot(ox - 50, oy - 40, ox + 50, oy + 40, 10);
    ghost.box(ox - 40, oy - 30, 0, 44, 22, 12).box(ox + 10, oy - 30, 0, 26, 30, 16);
    ghost.box(ox - 40, oy + 0, 0, 22, 26, 9).box(ox - 12, oy + 4, 0, 10, 10, 20);
    ghost.box(ox + 6, oy + 10, 0, 28, 18, 6);
  }
  // hydro: reservoir behind a gravity dam, powerhouse at the toe, river out
  {
    const [ox, oy] = vb(1420, 215);
    plot(ox - 70, oy - 50, ox + 70, oy + 70, 14);
    const w = 22;
    back.poly([[ox - 70, oy - 50, w], [ox + 70, oy - 50, w], [ox + 70, oy, w], [ox - 70, oy, w]], "water", "accent");
    for (const [x0, x1, y] of [[-50, -10, -38], [10, 50, -30], [-30, 20, -14]] as const)
      back.line([[ox + x0, oy + y, w], [ox + x1, oy + y, w]], "faint");
    const c = 26;
    back.poly([[ox - 70, oy + 6, c], [ox + 70, oy + 6, c], [ox + 70, oy + 22, 0], [ox - 70, oy + 22, 0]], "left");
    back.poly([[ox + 70, oy, 0], [ox + 70, oy, c], [ox + 70, oy + 6, c], [ox + 70, oy + 22, 0]], "right");
    back.poly([[ox - 70, oy, c], [ox + 70, oy, c], [ox + 70, oy + 6, c], [ox - 70, oy + 6, c]], "top");
    for (const x of [-46, -22, 22, 46]) back.line([[ox + x, oy + 6, c], [ox + x, oy + 22, 0]], "faint");
    for (const x of [-8, -3, 2, 7]) back.line([[ox + x, oy + 6, c - 0.5], [ox + x, oy + 22, 0.5], [ox + x + 1, oy + 30, 0.5]], "accent");
    back.box(ox + 26, oy + 24, 0, 30, 18, 12).box(ox + 30, oy + 28, 12, 12, 10, 4, true);
    back.poly([[ox - 12, oy + 22, 0.4], [ox + 14, oy + 22, 0.4], [ox + 18, oy + 50, 0.4], [ox + 12, oy + 70, 0.4], [ox - 14, oy + 70, 0.4], [ox - 16, oy + 50, 0.4]], "water", "accent");
  }
  // turbines along the horizon
  for (const [X, Y, h] of [
    [440, 225, 56],
    [600, 175, 62],
    [1000, 180, 60],
    [1150, 230, 54],
  ] as const)
    turbine(back, X, Y, h);

  // ── the main site: the menu's power plant at homepage detail ────────────
  plot(-110, -110, 110, 110, 10);
  drawPlant(plant);

  // ── foreground: battery yard and solar farm, the line out ───────────────
  // battery storage yard, front centre
  {
    const [ox, oy] = vb(560, 735);
    plot(ox - 50, oy - 34, ox + 50, oy + 34, 10);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) container(front, ox - 40 + c * 20, oy - 26 + r * 14);
    front.box(ox + 30, oy - 26, 0, 10, 12, 9, true).box(ox + 30, oy - 8, 0, 10, 12, 9, true);
  }
  // solar farm, front left: tilted rows, inverter skids
  {
    const [ox, oy] = vb(300, 610);
    plot(ox - 80, oy - 50, ox + 80, oy + 50, 10);
    for (let r = 0; r < 6; r++) {
      const y = oy - 40 + r * 15;
      for (let x = ox - 70; x < ox + 60; x += 34) {
        for (const k of [4, 26]) front.line([[x + k, y + 5, 0], [x + k, y + 5, 3]], "faint");
        front.poly([[x, y + 6, 2.5], [x + 30, y + 6, 2.5], [x + 30, y, 7], [x, y, 7]], "accent", "accent");
        for (let k = 6; k < 30; k += 6) front.line([[x + k, y + 6, 2.5], [x + k, y, 7]], "faint");
      }
    }
    front.box(ox + 66, oy - 30, 0, 8, 8, 7, true).box(ox + 66, oy + 10, 0, 8, 8, 7, true);
  }
  // the line out: tower to tower to the right
  {
    const towers = [vb(1110, 735), vb(920, 785), vb(735, 815)];
    let prev: [number, number, number] = [60, 98, 46];
    for (const [tx, ty] of towers) {
      infra.lattice(tx, ty, 0, 5, 2, 50, 3).line([[tx - 14, ty, 50], [tx + 14, ty, 50]]);
      for (const k of [-12, 12]) infra.wire([prev[0] + k, prev[1], prev[2]], [tx + k, ty, 50], 4);
      prev = [tx, ty, 50];
    }
  }
  // substation where the line lands, by the battery yard
  {
    const [sx, sy] = vb(690, 850);
    plot(sx - 26, sy - 22, sx + 26, sy + 22, 8);
    for (const k of [-12, 4]) {
      infra.box(sx + k, sy - 8, 0, 8, 6, 8);
      for (const bx of [2, 4, 6]) infra.line([[sx + k + bx, sy - 5, 8], [sx + k + bx, sy - 5, 12]], "accent");
    }
    infra.line([[sx - 20, sy + 10, 0], [sx - 20, sy + 10, 22]]).line([[sx + 20, sy + 10, 0], [sx + 20, sy + 10, 22]]).line([[sx - 22, sy + 10, 22], [sx + 22, sy + 10, 22]]);
  }
  // power routes along the ground: solar and storage into the plant's yard,
  // hydro into its back, the proposed plot waiting for its connection
  {
    const solar = vb(300, 610);
    const batt = vb(560, 735);
    const sub = vb(690, 850);
    lroute([solar[0] + 80, solar[1]], [batt[0] - 50, batt[1] - 10]);
    lroute([batt[0] + 50, batt[1]], [sub[0] - 26, sub[1]]);
    const hyd = vb(1420, 215);
    lroute([hyd[0] + 10, hyd[1] + 70], [80, -110]);
  }

  // scattered trees, seeded: off the title, the plots and the roads
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const trees: V2[] = [];
  for (let i = 0; i < 70; i++) {
    const X = rnd() * VB.w;
    const Y = 120 + rnd() * (VB.h - 120);
    if (X > TITLE.x0 - 30 && X < TITLE.x1 + 30 && Y > TITLE.y0 - 30 && Y < TITLE.y1 + 40) continue;
    const [x, y] = vb(X, Y);
    if (plots.some(([x0, y0, x1, y1]) => x > x0 - 10 && x < x1 + 10 && y > y0 - 10 && y < y1 + 10)) continue;
    if (Math.abs(y - 156) < 14 || Math.abs(x + 164) < 14) continue;
    trees.push([x, y]);
  }
  trees.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  for (const [x, y] of trees) {
    const s = x + y < 0 ? back : front;
    if (rnd() < 0.3) s.bush(x, y, 0, 0.8);
    else s.tree(x, y, 0, 0.8 + rnd() * 0.35);
  }
  void toVb;

  return { marks, ghost: ghost.shapes, back: back.shapes, plant: plant.shapes, front: front.shapes, infra: infra.shapes, rotors };
}

let cached: ReturnType<typeof build> | null = null;
const get = () => (cached ??= build());

// .field-soft palette
const fills: Record<Tone, string> = {
  top: "url(#ps-top)",
  left: "url(#ps-left)",
  right: "url(#ps-right)",
  inner: "#7f98c2",
  accent: "url(#ps-sky)",
  warm: "url(#ps-warm)",
  tree: "#b9cbe6",
  water: "url(#ps-water)",
  none: "none",
};
function strokeFor(sh: Shape): { stroke: string; width: number } {
  const st = sh.stroke ?? "ink";
  if (st === "accent") return { stroke: "#b6e8ff", width: 0.8 };
  if (st === "soft") return { stroke: "rgb(255 255 255 / 0.3)", width: 0.45 };
  if (st === "faint") return { stroke: "rgb(255 255 255 / 0.32)", width: 0.4 };
  if (st === "warm") return { stroke: "#ffc46b", width: 0.7 };
  if (sh.tone === "none") return { stroke: "rgb(255 255 255 / 0.85)", width: 0.55 };
  if (sh.tone === "top") return { stroke: "rgb(255 255 255 / 0.55)", width: 0.45 };
  if (sh.tone === "left") return { stroke: "rgb(255 255 255 / 0.35)", width: 0.45 };
  return { stroke: "rgb(255 255 255 / 0.25)", width: 0.45 };
}
const markStyle: Record<Mark["c"], React.SVGProps<SVGPathElement>> = {
  gf: { stroke: "rgb(255 255 255 / 0.08)", strokeWidth: 0.35, fill: "none" },
  pl: { stroke: "rgb(255 255 255 / 0.6)", strokeWidth: 0.6, fill: "none" },
  ld: { stroke: "rgb(255 255 255 / 0.45)", strokeWidth: 0.45, strokeDasharray: "3 2.5", fill: "none" },
  rd: { stroke: "rgb(255 255 255 / 0.28)", strokeWidth: 0.6, fill: "none" },
  mk: { fill: "#9fe0ff" },
  pw: { stroke: "#b6e8ff", strokeWidth: 0.9, fill: "none" },
  pwn: { fill: "#0a48a6", stroke: "#b6e8ff", strokeWidth: 0.7 },
};

function Solids({ shapes, ghost = false }: { shapes: Shape[]; ghost?: boolean }) {
  return (
    <>
      {shapes.map((sh, i) => {
        if (ghost) {
          // proposed massing: faint glassy faces, crisp white edges
          const a = sh.tone === "top" ? 0.14 : sh.tone === "left" ? 0.09 : 0.05;
          return <path key={i} d={sh.d} fill={`rgb(255 255 255 / ${a})`} stroke="rgb(255 255 255 / 0.8)" strokeWidth={0.5} strokeLinejoin="round" />;
        }
        const { stroke, width } = strokeFor(sh);
        const recede = sh.tone === "tree" || sh.stroke === "soft";
        const glow = sh.stroke === "accent" && sh.tone === "none";
        return (
          <g key={i} opacity={recede ? 0.35 : undefined}>
            {glow && <path d={sh.d} fill="none" stroke="rgb(182 232 255 / 0.35)" strokeWidth={2.2} filter="url(#ps-glow)" />}
            <path d={sh.d} fill={fills[sh.tone]} stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        );
      })}
    </>
  );
}


export function PowerScene({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { marks, ghost, back, plant, front, infra, rotors } = get();
  const { startDelay } = industryHero;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // the camera: eases in toward the site as the hero leaves
  const zoom = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : industryHero.zoom]);

  // survey grid across the whole ground, and the roads, as on the homepage
  const sc = new Scene();
  const minor: string[] = [];
  const major: string[] = [];
  for (let k = -1500; k <= 1500; k += 30) {
    const d1 = `M${sc.pt([k, -1500, 0])} L${sc.pt([k, 1500, 0])}`;
    const d2 = `M${sc.pt([-1500, k, 0])} L${sc.pt([1500, k, 0])}`;
    (k % 150 === 0 ? major : minor).push(d1, d2);
  }
  const road = (a: V2, b: V2) => `M${sc.pt([a[0], a[1], 0])} L${sc.pt([b[0], b[1], 0])}`;
  const roads = [road([-1500, 150], [1500, 150]), road([-1500, 162], [1500, 162]), road([-170, -1500], [-170, 1500]), road([-158, -1500], [-158, 1500])];

  // each layer rises in turn: ground, the background plots, the plant, the foreground
  const layer = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: duration.slow * 1.4, ease: ease.out, delay: startDelay + i * 0.22 },
        };

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="ps-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dce6f4" />
          </linearGradient>
          <linearGradient id="ps-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cbd8ec" />
            <stop offset="1" stopColor="#b2c4df" />
          </linearGradient>
          <linearGradient id="ps-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#95acd0" />
            <stop offset="1" stopColor="#7f98c2" />
          </linearGradient>
          <linearGradient id="ps-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2f6ff" />
            <stop offset="1" stopColor="#9fe0ff" />
          </linearGradient>
          <linearGradient id="ps-water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9fe0ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#5cbcf5" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="ps-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd690" />
            <stop offset="1" stopColor="#f2952a" />
          </linearGradient>
          {/* the ground fades out under the title */}
          <radialGradient id="ps-hole" cx="800" cy="418" r="520" gradientUnits="userSpaceOnUse" gradientTransform="translate(800 418) scale(1 0.36) translate(-800 -418)">
            <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="0.95" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <mask id="ps-clear" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
            <rect width={VB.w} height={VB.h} fill="url(#ps-hole)" />
          </mask>
          <filter id="ps-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        <g mask="url(#ps-clear)">
        <motion.g style={{ scale: zoom, transformOrigin: "50% 46%" }}>
          <g transform={`translate(${O.x} ${O.y}) scale(${SCALE}) translate(-240 -190)`}>
            <motion.g {...layer(0)} fill="none">
              {minor.map((d, i) => (
                <path key={`m${i}`} d={d} stroke="rgb(255 255 255 / 0.05)" strokeWidth={0.35} />
              ))}
              {major.map((d, i) => (
                <path key={`g${i}`} d={d} stroke="rgb(255 255 255 / 0.08)" strokeWidth={0.45} />
              ))}
              {roads.map((d, i) => (
                <path key={`r${i}`} d={d} stroke="rgb(255 255 255 / 0.14)" strokeWidth={0.6} />
              ))}
              {marks.map((m, i) =>
                m.c === "pw" ? (
                  <g key={`k${i}`}>
                    <path d={m.d} stroke="rgb(182 232 255 / 0.3)" strokeWidth={2.6} filter="url(#ps-glow)" fill="none" />
                    <path d={m.d} {...markStyle.pw} />
                  </g>
                ) : (
                  <path key={`k${i}`} d={m.d} {...markStyle[m.c]} />
                ),
              )}
            </motion.g>
            <motion.g {...layer(1)}>
              <Solids shapes={ghost} ghost />
              <Solids shapes={back} />
              {rotors.map((r, i) => (
                <g key={`t${i}`} className="ps-rotor" style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${-i * 2.1}s` }}>
                  <circle cx={r.x} cy={r.y} r={r.r} fill="none" stroke="none" />
                  {[0, 120, 240].map((a) => (
                    <path
                      key={a}
                      transform={`rotate(${a} ${r.x} ${r.y})`}
                      d={`M${r.x - 0.8} ${r.y} L${r.x} ${r.y - r.r} L${r.x + 0.8} ${r.y} Z`}
                      fill="url(#ps-left)"
                      stroke="rgb(255 255 255 / 0.4)"
                      strokeWidth={0.3}
                    />
                  ))}
                </g>
              ))}
            </motion.g>
            <motion.g {...layer(2)}>
              <Solids shapes={plant} />
            </motion.g>
            <motion.g {...layer(3)}>
              <Solids shapes={front} />
              <g opacity={0.5}>
                <Solids shapes={infra} />
              </g>
            </motion.g>
          </g>
        </motion.g>
        </g>
      </svg>
    </div>
  );
}
