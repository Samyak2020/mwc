"use client";

import { motion, useReducedMotion } from "motion/react";
import { Scene, type Shape, type Tone } from "./iso";
import { navMenu } from "@/lib/motion";

// Isometric line drawings for the Industries menu, one per industry, built
// from the ground up when shown: the plate first, then each structure, its
// edges drawing in before its faces fill. Cropped to a 400×290 view.

export type IndustryKey = "power" | "utilities" | "government" | "commercial" | "oil";

function power() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
  // chimney, back left, with two bands
  s.cyl(-80, -80, 5, 6, 82).band(-80, -80, 72, 6).band(-80, -80, 78, 6, "accent").next();
  // cooling towers
  s.coolingTower(10, -80, 5, 28, 19, 22, 80).next();
  // turbine hall with a raised boiler block
  s.box(-95, -40, 5, 78, 54, 44).next();
  s.box(-95, -40, 49, 34, 26, 20).next();
  s.coolingTower(62, -30, 5, 28, 19, 22, 80).next();
  // pipe rack from the hall to the towers
  s.line([[-17, -6, 28], [36, -6, 28], [36, -30, 28]]).line([[-17, 0, 24], [42, 0, 24], [42, -30, 24]]).next();
  // offices, front left
  s.box(-95, 40, 5, 44, 40, 16).line([[-95, 80, 13], [-51, 80, 13]], "faint").next();
  // transformer yard, gantry and the line leaving the plant
  s.box(20, 38, 5, 16, 12, 14).box(44, 38, 5, 16, 12, 14).next();
  s.line([[16, 66, 5], [16, 66, 40]]).line([[72, 66, 5], [72, 66, 40]]).line([[12, 66, 40], [76, 66, 40]]).next();
  s.lattice(60, 98, 5, 5, 2, 42, 2).line([[44, 98, 47], [76, 98, 47]]).next();
  s.wire([28, 66, 40], [48, 98, 47], 2).wire([44, 66, 40], [60, 98, 47], 2).wire([60, 66, 40], [72, 98, 47], 2);
  return s.shapes;
}

function utilities() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
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
  s.box(-82, 12, 5, 20, 16, 18).box(-54, 12, 5, 20, 16, 18).next();
  s.line([[-86, 46, 5], [-86, 46, 34]]).line([[-30, 46, 5], [-30, 46, 34]]).line([[-90, 46, 34], [-26, 46, 34]]).next();
  s.lattice(40, 46, 5, 9, 3, 92, 4).next();
  s.line([[12, 46, 76], [68, 46, 76]]).line([[16, 46, 88], [64, 46, 88]]).next();
  // conductors, and the feeder into the substation
  for (const x of [12, 68]) s.wire([x, -78, 76], [x, 46, 76], 7);
  for (const x of [16, 64]) s.wire([x, -78, 88], [x, 46, 88], 6);
  s.wire([-26, 46, 34], [12, 46, 76], 3).next();
  // houses served by the network, front right
  s.box(70, 74, 5, 24, 18, 12).gable(70, 74, 17, 24, 18, 8).next();
  s.box(70, 26, 5, 24, 18, 12).gable(70, 26, 17, 24, 18, 8);
  return s.shapes;
}

function government() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
  // stepped base
  s.box(-88, -70, 5, 150, 128, 6).box(-81, -63, 11, 136, 114, 6).box(-74, -56, 17, 122, 100, 6).next();
  // hall behind the portico
  s.box(-66, -48, 23, 106, 62, 46).next();
  // drum, dome, lantern
  s.cyl(-13, -17, 69, 22, 13).next().dome(-13, -17, 82, 22, 24).next();
  s.cyl(-13, -17, 104, 4, 8).line([[-13, -17, 112], [-13, -17, 122]], "accent").next();
  // portico columns
  for (const x of [-60, -38, -16, 6, 28]) s.cyl(x, 36, 23, 4, 38);
  s.next();
  // entablature and pediment
  s.box(-68, 26, 61, 106, 18, 7).next();
  s.gable(-68, 26, 68, 106, 18, 16).next();
  // flagpole and flag
  s.line([[90, 72, 5], [90, 72, 98]]).next();
  s.poly([[90, 72, 97], [66, 72, 94], [66, 72, 80], [90, 72, 83]], "accent", "accent");
  return s.shapes;
}

function commercial() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
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
  s.box(-64, 18, 94, 16, 12, 6, true);
  return s.shapes;
}

function oil() {
  const s = new Scene();
  s.plate(-110, -110, 110, 110, 5).next();
  // storage tanks with a stair rail
  s.cyl(-70, -72, 5, 26, 34).dome(-70, -72, 39, 26, 5).band(-70, -72, 22, 26, "faint").next();
  s.cyl(-8, -88, 5, 20, 26).dome(-8, -88, 31, 20, 4).next();
  s.line([[-50, -54, 5], [-57, -47, 39]], "accent").next();
  // flare stack with its flame
  s.cyl(84, -68, 5, 4, 84).line([[78, -74, 5], [84, -68, 56], [90, -62, 5]]).next();
  s.poly([[84, -68, 89], [82, -68, 96], [84, -68, 104], [87, -68, 95]], "accent", "accent").next();
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
  bx(41, -6, 0, 12, 12, 8);
  return s.shapes;
}

const scenes: Record<IndustryKey, () => Shape[]> = { power, utilities, government, commercial, oil };
const cache = new Map<IndustryKey, Shape[]>();
const get = (k: IndustryKey) => {
  if (!cache.has(k)) cache.set(k, scenes[k]());
  return cache.get(k)!;
};

const fills: Record<Tone, string> = {
  top: "#fbfcff",
  left: "#e8edf5",
  right: "#d5deeb",
  inner: "#c3cfe0",
  accent: "#cfe5f7",
  none: "none",
};
const strokes = { ink: "rgb(0 6 17 / 0.82)", faint: "rgb(0 6 17 / 0.14)", accent: "#2089d8" } as const;

export function IndustryGraphic({ industry, className = "" }: { industry: IndustryKey; className?: string }) {
  const reduce = useReducedMotion();
  const shapes = get(industry);
  const { stepDelay, draw, fill } = navMenu.build;
  return (
    <svg viewBox="40 15 400 290" className={`block h-auto w-full ${className}`} aria-hidden>
      {shapes.map((sh, i) => {
        const delay = sh.at * stepDelay;
        return (
          <motion.path
            key={i}
            d={sh.d}
            fill={fills[sh.tone]}
            stroke={strokes[sh.stroke ?? "ink"]}
            strokeWidth={sh.stroke === "accent" ? 1.3 : 1}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: { duration: draw, ease: [0.65, 0, 0.35, 1], delay },
              fillOpacity: { duration: fill, ease: "easeOut", delay: delay + draw * 0.6 },
            }}
          />
        );
      })}
    </svg>
  );
}
