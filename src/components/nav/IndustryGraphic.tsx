"use client";

import { motion, useReducedMotion } from "motion/react";
import { Scene, type Shape, type Tone } from "./iso";
import { Blueprint } from "./Blueprint";
import { duration, ease, navMenu } from "@/lib/motion";

// Isometric drawings for the Industries menu, one per industry, in the soft
// light style shared with the About page: pale gradient solids on a light
// blueprint sheet, sky-blue and amber accents, trees around the edges. Each
// builds up from the plate, step by step, when shown. Cropped to 400×290.

export type IndustryKey = "power" | "utilities" | "government" | "commercial" | "oil";

function power() {
  const s = new Scene();
  drawPowerPlant(s);
  return s.shapes;
}

/** The power plant on its plate, centred on the origin. Shared with the
 *  Power Producers hero, which builds a wider landscape around it. */
export function drawPowerPlant(s: Scene) {
  s.plate(-110, -110, 110, 110, 5).next();
  s.grove(94, -92, 6, 22, 11).next();
  // chimney, back left, with two bands
  s.cyl(-80, -80, 5, 6, 82).band(-80, -80, 72, 6).band(-80, -80, 78, 6, "accent").next();
  // cooling towers
  s.coolingTower(10, -80, 5, 28, 19, 22, 80).next();
  // turbine hall with a raised boiler block
  s.box(-95, -40, 5, 78, 54, 44).next();
  s.box(-95, -40, 49, 34, 26, 20, true).next();
  s.coolingTower(62, -30, 5, 28, 19, 22, 80).next();
  // pipe rack from the hall to the towers
  s.line([[-17, -6, 28], [36, -6, 28], [36, -30, 28]]).line([[-17, 0, 24], [42, 0, 24], [42, -30, 24]]).next();
  // offices, front left
  s.box(-95, 40, 5, 44, 40, 16).line([[-95, 80, 13], [-51, 80, 13]], "faint").next();
  // transformer yard, gantry and the line leaving the plant
  s.box(20, 38, 5, 16, 12, 14).box(44, 38, 5, 16, 12, 14).next();
  s.line([[16, 66, 5], [16, 66, 40]]).line([[72, 66, 5], [72, 66, 40]]).line([[12, 66, 40], [76, 66, 40]]).next();
  s.lattice(60, 98, 5, 5, 2, 42, 2).line([[44, 98, 47], [76, 98, 47]]).next();
  s.wire([28, 66, 40], [48, 98, 47], 2).wire([44, 66, 40], [60, 98, 47], 2).wire([60, 66, 40], [72, 98, 47], 2).next();
  s.grove(98, 22, 5, 18, 5).grove(-78, 98, 6, 26, 17).grove(-18, 98, 4, 20, 29);
  return s;
}

function utilities() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
  s.grove(-20, -98, 5, 22, 3).grove(94, -80, 6, 26, 41).next();
  // water tower, back left: legs, tank, cap
  for (const [dx, dy] of [
    [-10, -10],
    [10, -10],
    [-10, 10],
    [10, 10],
  ])
    s.line([[-80 + dx, -72 + dy, 5], [-80 + dx * 0.6, -72 + dy * 0.6, 50]]);
  s.next().cyl(-80, -72, 50, 17, 20).dome(-80, -72, 70, 17, 7).next();
  // transmission line: pylon A (back), substation, pylon B (front)
  s.lattice(40, -78, 5, 9, 3, 92, 4).next();
  s.line([[12, -78, 76], [68, -78, 76]]).line([[16, -78, 88], [64, -78, 88]]).next();
  s.poly([[-92, 0, 5], [-22, 0, 5], [-22, 70, 5], [-92, 70, 5]], "none", "faint");
  for (const x of [-92, -69, -45, -22]) s.line([[x, 70, 5], [x, 70, 14]]);
  for (const y of [0, 23, 47, 70]) s.line([[-22, y, 5], [-22, y, 14]]);
  s.line([[-92, 70, 14], [-22, 70, 14], [-22, 0, 14]]).next();
  s.box(-82, 12, 5, 20, 16, 18, true).box(-54, 12, 5, 20, 16, 18, true).next();
  s.line([[-86, 46, 5], [-86, 46, 34]]).line([[-30, 46, 5], [-30, 46, 34]]).line([[-90, 46, 34], [-26, 46, 34]]).next();
  s.lattice(40, 46, 5, 9, 3, 92, 4).next();
  s.line([[12, 46, 76], [68, 46, 76]]).line([[16, 46, 88], [64, 46, 88]]).next();
  // conductors, and the feeder into the substation
  for (const x of [12, 68]) s.wire([x, -78, 76], [x, 46, 76], 7);
  for (const x of [16, 64]) s.wire([x, -78, 88], [x, 46, 88], 6);
  s.wire([-26, 46, 34], [12, 46, 76], 3).next();
  // houses served by the network, front right
  s.box(70, 74, 5, 24, 18, 12).gable(70, 74, 17, 24, 18, 8).next();
  s.box(70, 26, 5, 24, 18, 12).gable(70, 26, 17, 24, 18, 8).next();
  s.grove(100, 60, 3, 10, 13).grove(-72, 96, 6, 34, 23).grove(6, 96, 5, 26, 37);
  return s.shapes;
}

// Government: a federal hydro dam. The reservoir is drawn as a cut block of
// water behind a concrete gravity dam; the spillway runs down the middle,
// the powerhouse sits at the toe and a line carries the power away.
/** also drawn by the government industry hero, on a ground-only scene */
export function government(s: Scene = new Scene()) {
  s.plate(-110, -110, 110, 110, 5).next();
  // reservoir: cut section on the right, water surface on top with ripples
  const w = 60;
  s.poly([[110, -110, 5], [110, -30, 5], [110, -30, w], [110, -110, w]], "inner");
  s.poly([[-110, -110, w], [110, -110, w], [110, -30, w], [-110, -30, w]], "water", "accent");
  for (const [x0, x1, y] of [[-80, -30, -92], [10, 70, -96], [-50, 20, -72], [40, 90, -60], [-95, -45, -50]] as const)
    s.line([[x0, y, w], [x1, y, w]], "faint");
  s.next();
  // gravity dam: crest, sloped downstream face, cut end
  const c = 68;
  s.poly([[-110, -20, c], [110, -20, c], [110, 10, 5], [-110, 10, 5]], "left");
  s.poly([[110, -30, 5], [110, -30, c], [110, -20, c], [110, 10, 5]], "right");
  s.poly([[-110, -30, c], [110, -30, c], [110, -20, c], [-110, -20, c]], "top");
  // block joints down the face
  for (const x of [-80, -50, 50, 80]) s.line([[x, -20, c], [x, 10, 5]], "faint");
  s.next();
  // spillway: gate piers on the crest, white water down the chute
  for (const x of [-18, -4, 10, 24]) s.box(x, -31, c, 4, 12, 9);
  s.next();
  for (const x of [-12, -6, 0, 6, 12, 18]) s.line([[x, -20, c - 1], [x, 10, 6], [x + 1, 24, 6]], "accent");
  // control house on the crest, left
  s.box(-84, -30, c, 18, 10, 12).next();
  // river below the dam, out the front of the plate
  s.poly([[-22, 10, 5.5], [30, 10, 5.5], [36, 60, 5.5], [24, 110, 5.5], [-20, 110, 5.5], [-28, 60, 5.5]], "water", "accent");
  for (const [x0, x1, y] of [[-14, 6, 40], [4, 22, 66], [-10, 12, 92]] as const) s.line([[x0, y, 5.5], [x1, y, 5.5]], "faint");
  s.next();
  // penstocks down the face to the powerhouse at the toe
  for (const x of [56, 70]) s.line([[x, -20, c - 6], [x, 12, 14]], "accent");
  s.box(46, 12, 5, 42, 26, 20).box(52, 16, 25, 16, 14, 6, true).next();
  // the line out: pylon on the right bank
  s.lattice(78, 84, 5, 6, 2, 56, 3).line([[66, 84, 58], [90, 84, 58]]).next();
  s.wire([60, 38, 25], [70, 84, 58], 3).wire([76, 38, 25], [86, 84, 58], 3).next();
  // banks: trees on both sides of the river
  s.grove(-74, 46, 9, 46, 19).grove(-62, 94, 5, 34, 7).grove(100, 54, 4, 14, 31).grove(46, 100, 4, 22, 43);
  return s.shapes;
}

/** also drawn by the commercial industry hero, on a ground-only scene */
export function commercial(s: Scene = new Scene()) {
  s.plate(-110, -110, 110, 110, 5).next();
  s.grove(-74, -82, 8, 44, 9).next();
  // factory with a row of gables, back right
  s.box(-4, -100, 5, 104, 56, 30).next();
  for (let i = 0; i < 4; i++) s.gable(-4 + i * 26, -100, 35, 26, 56, 11);
  s.next();
  // building frame going up, floor by floor, front left
  const xs = [-90, -62, -34];
  const ys = [2, 30, 58];
  const floors = [5, 31, 57, 83];
  for (let f = 0; f < 3; f++) {
    s.box(-94, -2, floors[f], 64, 64, 3).next();
    for (const x of xs) for (const y of ys) if (f < 2 || x < -50 || y < 40) s.line([[x, y, floors[f] + 3], [x, y, floors[f + 1]]]);
    s.next();
  }
  // tower crane between them, its jib swung over the frame
  s.lattice(-8, -24, 5, 5, 5, 112, 5).next();
  s.box(-13, -29, 117, 10, 10, 7).next();
  s.line([[-8, -24, 124], [-8, -24, 138]]).next();
  s.line([[-8, -24, 124], [-66, 34, 124]]).line([[-8, -24, 124], [16, -48, 124]]).next();
  s.line([[-66, 34, 124], [-8, -24, 138], [16, -48, 124]]).box(10, -54, 116, 10, 10, 8).next();
  s.line([[-56, 24, 124], [-56, 24, 102]], "accent").next();
  s.box(-64, 18, 94, 16, 12, 6, true).next();
  s.grove(64, 30, 7, 40, 27).grove(80, 90, 6, 34, 53).grove(-70, 96, 4, 30, 61);
  return s.shapes;
}

/** also drawn by the oil industry hero, on a ground-only scene */
export function oil(s: Scene = new Scene()) {
  s.plate(-110, -110, 110, 110, 5).next();
  s.grove(44, -92, 6, 30, 15).grove(-98, -6, 5, 16, 47).next();
  // storage tanks with a stair rail
  s.cyl(-70, -72, 5, 26, 34).dome(-70, -72, 39, 26, 5).band(-70, -72, 22, 26, "faint").next();
  s.cyl(-8, -88, 5, 20, 26).dome(-8, -88, 31, 20, 4).next();
  s.line([[-50, -54, 5], [-57, -47, 39]], "accent").next();
  // flare stack with its flame
  s.cyl(84, -68, 5, 4, 84).line([[78, -74, 5], [84, -68, 56], [90, -62, 5]]).next();
  s.poly([[84, -68, 89], [82, -68, 96], [84, -68, 104], [87, -68, 95]], "warm", "warm").next();
  // pipeline on supports from the tanks to the wellhead
  for (const x of [-30, 0, 30]) s.line([[x, -18, 5], [x, -18, 14]]);
  s.line([[-44, -18, 16], [62, -18, 16], [62, 52, 16]]).line([[-44, -12, 12], [56, -12, 12], [56, 52, 12]]).next();
  // pumpjack (plane y ≈ 64), drawn 1.3× in local units
  const m = 1.3;
  const oy = 64;
  const L = ([x, y, z]: [number, number, number]): [number, number, number] => [x * m, oy + y * m, 5 + z * m];
  const bx = (x: number, y: number, z: number, w: number, d: number, h: number) => s.box(x * m, oy + y * m, 5 + z * m, w * m, d * m, h * m);
  bx(-70, -8, 0, 124, 16, 4).next();
  bx(-48, -6, 4, 18, 12, 12);
  bx(-66, -6, 4, 12, 10, 8).next();
  s.line([L([0, -7, 4]), L([2, 0, 52]), L([0, 7, 4])]).line([L([-14, 0, 4]), L([2, 0, 52])]).next();
  s.discXZ(-38 * m, oy + 8 * m, 5 + 22 * m, 10 * m).next();
  s.line([L([-38, 7, 22]), L([-40, 4, 52])]).next();
  s.poly([L([-44, 4, 54]), L([44, 4, 48]), L([44, 4, 42]), L([-44, 4, 48])], "left");
  s.poly([L([-44, -2, 54]), L([44, -2, 48]), L([44, 4, 48]), L([-44, 4, 54])], "top").next();
  s.poly([L([42, 4, 56]), L([54, 4, 48]), L([52, 4, 30]), L([46, 4, 24]), L([44, 4, 30]), L([48, 4, 44]), L([40, 4, 50])], "right").next();
  s.line([L([47, 0, 26]), L([47, 0, 8])], "accent");
  bx(41, -6, 0, 12, 12, 8).next();
  s.grove(98, 30, 4, 16, 33).grove(-40, 100, 5, 40, 57).grove(64, 100, 4, 26, 71);
  return s.shapes;
}

const scenes: Record<IndustryKey, () => Shape[]> = { power, utilities, government, commercial, oil };
const cache = new Map<IndustryKey, Shape[]>();
const get = (k: IndustryKey) => {
  if (!cache.has(k)) cache.set(k, scenes[k]());
  return cache.get(k)!;
};

// Soft light palette (as the About drawings): pale gradient faces, edges only
// hinted, colour picked out with grainy gradients.
const fills: Record<Tone, string> = {
  top: "url(#ig-top)",
  left: "url(#ig-left)",
  right: "#b3b9c7",
  inner: "#a5acbb",
  accent: "url(#ig-sky)",
  warm: "url(#ig-warm)",
  tree: "#d3d7e0",
  water: "url(#ig-water)",
  none: "none",
};
const strokes: Record<NonNullable<Shape["stroke"]>, string> = {
  ink: "rgb(42 46 58)",
  faint: "rgb(42 46 58 / 0.1)",
  accent: "#1f78d1",
  warm: "#e08a1e",
  soft: "rgb(42 46 58 / 0.2)",
};

const C = Math.cos(Math.PI / 6);
const pt = (x: number, y: number) => `${(240 + (x - y) * C).toFixed(1)} ${(190 + (x + y) * 0.5).toFixed(1)}`;
// the plate's footprint, nudged down-right and blurred: its shadow on the sheet
const plateShadow = `M${pt(-100, -100)} L${pt(122, -100)} L${pt(122, 122)} L${pt(-100, 122)} Z`;

export function IndustryGraphic({ industry, className = "" }: { industry: IndustryKey; className?: string }) {
  const reduce = useReducedMotion();
  const shapes = get(industry);
  const { stepDelay } = navMenu.build;
  const keys: IndustryKey[] = ["power", "utilities", "government", "commercial", "oil"];
  return (
    <svg viewBox="40 15 400 290" className={`block h-auto w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id="ig-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e7ef" />
        </linearGradient>
        <linearGradient id="ig-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dee8" />
          <stop offset="1" stopColor="#c5cbd8" />
        </linearGradient>
        <linearGradient id="ig-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd8ff" />
          <stop offset="0.55" stopColor="#3a9ff0" />
          <stop offset="1" stopColor="#2070d8" />
        </linearGradient>
        <linearGradient id="ig-warm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd690" />
          <stop offset="1" stopColor="#f2952a" />
        </linearGradient>
        <linearGradient id="ig-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c6e8ff" />
          <stop offset="1" stopColor="#6fb4ef" />
        </linearGradient>
        <filter id="ig-grain" x="0" y="0" width="100%" height="100%">
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
        <filter id="ig-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id="ig-fade" cx="50%" cy="58%" r="62%">
          <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="ig-mask" maskUnits="userSpaceOnUse" x="40" y="15" width="400" height="290">
          <rect x="40" y="15" width="400" height="290" fill="url(#ig-fade)" />
        </mask>
      </defs>
      {/* the plans underneath, then the plate's soft shadow */}
      <g mask="url(#ig-mask)">
        <Blueprint ox={240} oy={190} scale={1.3} variant={keys.indexOf(industry)} sheet={{ x0: -185, y0: -185, x1: 185, y1: 185 }} ink="#3f6db3" paper="#2089d8" paperOpacity={0.05} />
      </g>
      <path d={plateShadow} fill="#1b2140" opacity={0.12} filter="url(#ig-blur)" />
      {shapes.map((sh, i) => {
        const line = sh.tone === "none";
        const colour = sh.tone === "accent" || sh.tone === "warm" || sh.tone === "water";
        return (
          <motion.path
            key={i}
            d={sh.d}
            fill={fills[sh.tone]}
            stroke={strokes[sh.stroke ?? "ink"]}
            // faces carry only a hint of an edge; lines (rails, masts, wires) stay legible
            strokeOpacity={(sh.stroke ?? "ink") === "ink" ? (line ? 0.6 : 0.16) : 1}
            strokeWidth={sh.stroke === "accent" ? 1.2 : line ? 0.9 : 0.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={colour ? "url(#ig-grain)" : undefined}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: sh.at * stepDelay }}
          />
        );
      })}
    </svg>
  );
}
