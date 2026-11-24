"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Scene, type Shape, type Tone } from "@/components/nav/iso";
import { duration, ease, industryHero } from "@/lib/motion";
import { drawPlant } from "./PowerScene";

// Power Producers hero, version 2 (after cantor8.io/partners): one object on
// a quiet field. The plant alone, drawn as fine white linework with its faces
// only a shade lighter than the ground, standing on its marked-out site; the
// survey grid around it dissolves toward the edges. No trees, no neighbours.

type Mark = { d: string; c: "grid" | "pl" | "ld" | "mk" };

function build() {
  const s = drawPlant(new Scene(), { trees: false });
  const marks: Mark[] = [];
  const g = (pts: [number, number, number][], c: Mark["c"], close = false) =>
    marks.push({ d: `M${pts.map((p) => s.pt(p)).join(" L")}${close ? " Z" : ""}`, c });
  for (let k = -704; k <= 704; k += 22) {
    g([[k, -704, 0], [k, 704, 0]], "grid");
    g([[-704, k, 0], [704, k, 0]], "grid");
  }
  const [x0, y0, x1, y1] = [-110, -110, 110, 110];
  g([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], "pl", true);
  g([[x0 + 6, y0 + 6, 0], [x1 - 6, y0 + 6, 0], [x1 - 6, y1 - 6, 0], [x0 + 6, y1 - 6, 0]], "ld", true);
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
    const [sx, sy] = s.p([x, y, 0]);
    marks.push({ d: `M${sx - 1.6} ${sy - 3.2}h3.2v3.2h-3.2Z`, c: "mk" });
  }
  // very faint company in the background: turbines behind, a line running
  // out across the bottom, a few trees
  const far = new Scene();
  const near = new Scene();
  const rotors: { x: number; y: number; r: number }[] = [];
  const at = (u: number, v: number) => [(u + v) / 2, (v - u) / 2] as const;
  for (const [u, v, h] of [
    [-250, -150, 54],
    [-110, -235, 62],
    [190, -265, 58],
    [330, -215, 50],
  ] as const) {
    const [x, y] = at(u, v);
    far.cyl(x, y, 0, 1.3, h, "left", "top").box(x - 3, y - 1.5, h - 1, 6, 3, 3);
    const [hx, hy] = far.p([x + 3, y, h + 0.5]);
    rotors.push({ x: hx, y: hy, r: h * 0.36 });
  }
  let prev: [number, number, number] = [60, 98, 46];
  for (const [tx, ty] of [[-40, 198], [-140, 298], [-240, 398]]) {
    near.lattice(tx, ty, 0, 5, 2, 50, 3).line([[tx - 14, ty, 50], [tx + 14, ty, 50]]);
    for (const k of [-12, 12]) near.wire([prev[0] + k, prev[1], prev[2]], [tx + k, ty, 50], 4);
    prev = [tx, ty, 50];
  }
  for (const [u, v] of [[-330, -60], [-280, -205], [-40, -250], [80, -290], [260, -150], [420, -90], [-420, 40], [-200, 150], [-330, 210]] as const) {
    const [x, y] = at(u, v);
    (v < 0 ? far : near).tree(x, y, 0, 0.9);
  }
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors };
}
let cached: ReturnType<typeof build> | null = null;
const get = () => (cached ??= build());

// faces a shade off the ground (#0a48a6), so hidden edges stay hidden
const fills: Record<Tone, string> = {
  top: "#235aaf",
  left: "#1953ab",
  right: "#114ea9",
  inner: "#0a48a6",
  accent: "#3a7cc8",
  warm: "#235aaf",
  tree: "none",
  water: "#1953ab",
  none: "none",
};
function stroke(sh: Shape) {
  const st = sh.stroke ?? "ink";
  if (st === "accent") return { c: "#9fe0ff", w: 0.9, o: 0.9 };
  if (st === "faint" || st === "soft") return { c: "#ffffff", w: 0.6, o: 0.22 };
  return { c: "#ffffff", w: 0.9, o: sh.tone === "none" ? 0.7 : 0.55 };
}

const VB = { w: 1600, h: 900 };
/** where the plant stands on the sheet, and how big */
const AT = { x: 1180, y: 660, scale: 2 };

export function PowerSceneMinimal({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { marks, shapes, far, near, rotors } = get();
  const faint = (list: Shape[]) =>
    list.map((sh, i) => (
      <path
        key={i}
        d={sh.d}
        fill={sh.tone === "none" ? "none" : sh.tone === "tree" ? "rgb(255 255 255 / 0.35)" : "rgb(255 255 255 / 0.5)"}
        stroke="#ffffff"
        strokeOpacity={0.8}
        strokeWidth={0.8}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    ));
  const T = `translate(${AT.x} ${AT.y}) scale(${AT.scale}) translate(-240 -190)`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const enter = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: duration.slow * 1.6, ease: ease.out, delay: industryHero.startDelay + i * 0.25 },
        };

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMaxYMax slice" className="block h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="psm-fade" cx={AT.x} cy={AT.y - 60} r="760" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${AT.x} ${AT.y - 60}) scale(1 0.52) translate(${-AT.x} ${-(AT.y - 60)})`}>
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="psm-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
            <rect width={VB.w} height={VB.h} fill="url(#psm-fade)" />
          </mask>
        </defs>
        <motion.g style={{ scale: zoom, transformOrigin: `${(AT.x / VB.w) * 100}% ${(AT.y / VB.h) * 100}%` }}>
          {/* the grid fades out in sheet space, so the mask sits outside the drawing's transform */}
          <g mask="url(#psm-mask)">
            <motion.g {...enter(0)} fill="none">
              <g transform={T}>
              {marks
                .filter((m) => m.c === "grid")
                .map((m, i) => (
                  <path key={i} d={m.d} stroke="rgb(255 255 255 / 0.13)" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            </motion.g>
          </g>
          <g transform={T}>
            {/* background company: turbines and far trees */}
            <motion.g {...enter(1)}>
              <g opacity={0.22}>
                {faint(far)}
                {rotors.map((r, i) => (
                  <g key={i} className="ps-rotor" style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${-i * 2.3}s` }}>
                    <circle cx={r.x} cy={r.y} r={r.r} fill="none" />
                    {[0, 120, 240].map((a) => (
                      <path key={a} transform={`rotate(${a} ${r.x} ${r.y})`} d={`M${r.x - 0.8} ${r.y} L${r.x} ${r.y - r.r} L${r.x + 0.8} ${r.y} Z`} fill="#fff" fillOpacity={0.7} />
                    ))}
                  </g>
                ))}
              </g>
            </motion.g>
            <motion.g {...enter(1)}>
              {marks.map((m, i) =>
                m.c === "pl" ? (
                  <path key={i} d={m.d} fill="none" stroke="rgb(255 255 255 / 0.5)" strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
                ) : m.c === "ld" ? (
                  <path key={i} d={m.d} fill="none" stroke="rgb(255 255 255 / 0.35)" strokeWidth={0.8} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
                ) : m.c === "mk" ? (
                  <path key={i} d={m.d} fill="#9fe0ff" />
                ) : null,
              )}
            </motion.g>
            <motion.g {...enter(2)}>
              {shapes.map((sh, i) => {
                const st = stroke(sh);
                return (
                  <path
                    key={i}
                    d={sh.d}
                    fill={fills[sh.tone]}
                    stroke={st.c}
                    strokeOpacity={st.o}
                    strokeWidth={st.w}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                );
              })}
            </motion.g>
            {/* the line out across the bottom, and near trees */}
            <motion.g {...enter(3)}>
              <g opacity={0.22}>{faint(near)}</g>
            </motion.g>
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
