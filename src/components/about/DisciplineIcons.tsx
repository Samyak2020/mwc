"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Scene, type Shape, type Tone } from "@/components/nav/iso";
import { navMenu } from "@/lib/motion";

// Small isometric line drawings for the About page's disciplines, in the same
// language as the nav's industry graphics. Each builds up from the plate the
// first time it scrolls into view.

export type DisciplineKey = "pm" | "engineering" | "construction" | "operations" | "controls";

const P = () => new Scene(160, 132);

function pm() {
  // a schedule board with Gantt bars
  const s = P();
  s.plate(-60, -60, 60, 60, 4).next();
  s.line([[-34, -6, 4], [-34, -6, 20]]).line([[34, -6, 4], [34, -6, 20]]).next();
  s.box(-42, -12, 20, 84, 6, 54).next();
  const y = -6;
  s.poly([[-34, y, 64], [-6, y, 64], [-6, y, 58], [-34, y, 58]], "accent", "accent");
  s.poly([[-16, y, 52], [12, y, 52], [12, y, 46], [-16, y, 46]], "inner").next();
  s.poly([[0, y, 40], [30, y, 40], [30, y, 34], [0, y, 34]], "accent", "accent");
  s.poly([[14, y, 28], [36, y, 28], [36, y, 22], [14, y, 22]], "inner").next();
  // a milestone marker on the floor in front
  s.box(26, 26, 4, 8, 8, 8, true);
  return s.shapes;
}

function engineering() {
  // a drawing on the plate with a set square, and a gear standing behind
  const s = P();
  s.plate(-60, -60, 60, 60, 4).next();
  const teeth: [number, number, number][] = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const r = i % 2 ? 24 : 19;
    teeth.push([18 + r * Math.cos(a), -44, 34 + r * Math.sin(a)]);
  }
  s.poly(teeth, "right").discXZ(18, -43.8, 34, 8, "top").next();
  s.poly([[-46, -20, 5], [30, -20, 5], [30, 46, 5], [-46, 46, 5]], "top").next();
  s.poly([[-38, -12, 5], [22, -12, 5], [22, 38, 5], [-38, 38, 5]], "none", "accent");
  s.line([[-38, 12, 5], [-6, 12, 5], [-6, 38, 5]], "accent").line([[-6, -12, 5], [-6, 0, 5]], "accent").next();
  s.poly([[4, 2, 5], [40, 2, 6], [4, 34, 6]], "accent", "ink");
  return s.shapes;
}

function construction() {
  // a two-storey frame going up, beams stacked beside it
  const s = P();
  s.plate(-60, -60, 60, 60, 4).next();
  const xs = [-44, -20, 4];
  const ys = [-36, -12, 12];
  const floors = [4, 30, 56];
  for (let f = 0; f < 2; f++) {
    s.box(-48, -40, floors[f], 56, 56, 3).next();
    for (const x of xs) for (const y of ys) if (f === 0 || x < 0 || y < 0) s.line([[x, y, floors[f] + 3], [x, y, floors[f + 1]]]);
    s.next();
  }
  s.box(22, 26, 4, 32, 7, 4).box(22, 34, 4, 32, 7, 4).box(22, 30, 8, 32, 7, 4).next();
  s.line([[-8, 0, 92], [-8, 0, 70]], "accent").box(-20, -4, 62, 24, 7, 4, true);
  return s.shapes;
}

function operations() {
  // a vessel, a pipe with a valve wheel, and a control cabinet
  const s = P();
  s.plate(-60, -60, 60, 60, 4).next();
  s.cyl(-30, -26, 4, 20, 46).dome(-30, -26, 50, 20, 6).band(-30, -26, 30, 20, "faint").next();
  s.box(-10, -29, 26, 52, 6, 6).box(36, -29, 4, 6, 6, 22).next();
  s.discXZ(16, -22, 38, 9, "top");
  s.line([[7, -22, 38], [25, -22, 38]]).line([[16, -22, 29], [16, -22, 47]]).line([[16, -22, 32], [16, -24, 26]]).next();
  s.box(4, 18, 4, 30, 16, 34).next();
  s.line([[10, 34, 30], [28, 34, 30]], "accent").line([[10, 34, 24], [22, 34, 24]], "accent").line([[10, 34, 18], [26, 34, 18]], "accent");
  return s.shapes;
}

function controls() {
  // a bar chart rising, with the trend line over it
  const s = P();
  s.plate(-60, -60, 60, 60, 4).next();
  const bars: [number, number, boolean][] = [
    [-46, 16, false],
    [-24, 28, false],
    [-2, 40, false],
    [20, 56, true],
  ];
  for (const [x, h, accent] of bars) s.box(x, -4, 4, 14, 14, h, accent).next();
  s.line(
    bars.map(([x, h]) => [x + 7, 3, 4 + h + 10] as [number, number, number]),
    "accent",
  );
  return s.shapes;
}

const scenes: Record<DisciplineKey, () => Shape[]> = { pm, engineering, construction, operations, controls };

const fills: Record<Tone, string> = {
  top: "#fbfcff",
  left: "#e8edf5",
  right: "#d5deeb",
  inner: "#c3cfe0",
  accent: "#cfe5f7",
  warm: "#f6c27a",
  tree: "#e3eaf3",
  water: "#d8eaf8",
  none: "none",
};
const strokes = { ink: "rgb(0 6 17 / 0.82)", faint: "rgb(0 6 17 / 0.14)", accent: "#2089d8", warm: "#d9822b", soft: "rgb(0 6 17 / 0.4)" } as const;

export function DisciplineIcon({ kind }: { kind: DisciplineKey }) {
  const reduce = useReducedMotion();
  const shapes = scenes[kind]();
  const { stepDelay, draw, fill } = navMenu.build;
  const path = (at: number): Variants => ({
    hidden: { pathLength: 0, fillOpacity: 0 },
    shown: {
      pathLength: 1,
      fillOpacity: 1,
      transition: {
        pathLength: { duration: draw, ease: [0.65, 0, 0.35, 1], delay: at * stepDelay },
        fillOpacity: { duration: fill, ease: "easeOut", delay: at * stepDelay + draw * 0.6 },
      },
    },
  });
  return (
    <motion.svg
      viewBox="40 0 240 200"
      className="block h-full w-full"
      aria-hidden
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      {shapes.map((sh, i) => (
        <motion.path
          key={i}
          d={sh.d}
          fill={fills[sh.tone]}
          stroke={strokes[sh.stroke ?? "ink"]}
          strokeWidth={sh.stroke === "accent" ? 1.3 : 1}
          strokeLinejoin="round"
          strokeLinecap="round"
          variants={path(sh.at)}
        />
      ))}
    </motion.svg>
  );
}
