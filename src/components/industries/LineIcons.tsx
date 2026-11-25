"use client";

import { useId } from "react";
import { Scene, type Shape, type Tone } from "@/components/nav/iso";
import { Blueprint } from "@/components/nav/Blueprint";

// Small isometric drawings for the industry pages, in the soft light style of
// the Industries menu graphics: pale gradient solids with hinted edges, grainy
// sky accents, a faint blueprint sheet fading out underneath, a soft plate
// shadow and trees around the plate. Each drawing has a still base and, where it helps the
// idea, one piece that floats gently (.iso-float) so the figure feels alive.

export type IconKey =
  | "estimates"
  | "package"
  | "costs"
  | "globe"
  | "coins"
  | "pylon"
  | "batteries"
  | "thermal"
  | "ashpond"
  | "service"
  | "water"
  | "demolition"
  | "federal";

type Built = {
  base: Shape[];
  float: Shape[];
  vb: string;
  foot?: [number, number, number, number];
  /** paths that coal or water runs along, for drawings that move */
  flows?: { d: string; slow?: boolean }[];
  /** screen points that dust rises from */
  puffs?: [number, number][];
};

// A Scene that remembers how far its projected points reach, so each
// drawing gets a tight viewBox and fills its frame.
class Tracked extends Scene {
  box2 = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  grow(x: number, y: number, r = 0) {
    const b = this.box2;
    b.x0 = Math.min(b.x0, x - r);
    b.y0 = Math.min(b.y0, y - r);
    b.x1 = Math.max(b.x1, x + r);
    b.y1 = Math.max(b.y1, y + r);
  }
  // round solids reach past their centre point: track their full extent
  override cyl(x: number, y: number, z: number, r: number, h: number, tone?: Tone, topTone?: Tone) {
    const [cx, cy] = super.p([x, y, z]);
    this.grow(cx, cy, r * 1.23);
    this.grow(cx, cy - h, r * 1.23);
    return super.cyl(x, y, z, r, h, tone, topTone);
  }
  override coolingTower(x: number, y: number, z: number, R: number, waist: number, top: number, h: number) {
    const [cx, cy] = super.p([x, y, z]);
    this.grow(cx, cy, R * 1.23);
    this.grow(cx, cy - h, top * 1.23);
    return super.coolingTower(x, y, z, R, waist, top, h);
  }
  override p(v: [number, number, number]): [number, number] {
    const q = super.p(v);
    this.grow(q[0], q[1]);
    return q;
  }
}
const fit = (a: Tracked, b: Tracked, pad = 10) => {
  const x0 = Math.min(a.box2.x0, b.box2.x0) - pad;
  const y0 = Math.min(a.box2.y0, b.box2.y0) - pad - 6; // room for the float
  const x1 = Math.max(a.box2.x1, b.box2.x1) + pad;
  const y1 = Math.max(a.box2.y1, b.box2.y1) + pad;
  return `${x0.toFixed(1)} ${y0.toFixed(1)} ${(x1 - x0).toFixed(1)} ${(y1 - y0).toFixed(1)}`;
};

/** a sphere drawn in screen space: outline, equator and one meridian */
function sphere(s: Tracked, x: number, y: number, z: number, r: number) {
  const [cx, cy] = s.p([x, y, z]);
  s.grow(cx, cy, r);
  const c = (rx: number, ry: number) =>
    `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  s.add(c(r, r), "top");
  s.add(`M${cx - r} ${cy} A${r} ${r * 0.34} 0 0 0 ${cx + r} ${cy}`, "none", "soft");
  s.add(`M${cx} ${cy - r} A${r * 0.42} ${r} 0 0 0 ${cx} ${cy + r}`, "none", "soft");
  s.add(`M${cx - r * 0.86} ${cy - r * 0.5} A${r} ${r * 0.3} 0 0 0 ${cx + r * 0.86} ${cy - r * 0.5}`, "none", "soft");
  return [cx, cy] as const;
}
const dot = (s: Tracked, cx: number, cy: number, r = 2.6) =>
  s.add(`M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`, "top");

function build(key: IconKey): Built {
  const b = new Tracked();
  const f = new Tracked();
  switch (key) {
    // two estimates: the plans underneath, the calculator lifting off them
    case "estimates": {
      for (let i = 0; i < 3; i++) b.box(-44 + i * 5, -38 + i * 5, i * 3, 72, 62, 2);
      for (const y of [-14, -4, 6, 16]) b.line([[-24, y, 8], [16, y, 8]], "faint");
      f.box(-4, -26, 22, 36, 48, 9);
      f.poly([[0, -22, 31], [28, -22, 31], [28, -10, 31], [0, -10, 31]], "accent", "ink");
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) f.box(2 + c * 9, -4 + r * 8, 31, 6, 5, 1.5);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f) };
    }
    // the work package: an open box, the execution plan rising out of it
    case "package": {
      b.poly([[-30, -30, 30], [30, -30, 30], [30, -46, 40], [-30, -46, 40]], "left");
      b.poly([[-30, -30, 30], [-30, 30, 30], [-46, 30, 40], [-46, -30, 40]], "right");
      b.poly([[-30, 30, 0], [30, 30, 0], [30, 30, 30], [-30, 30, 30]], "left");
      b.poly([[30, -30, 0], [30, 30, 0], [30, 30, 30], [30, -30, 30]], "right");
      b.poly([[-30, -30, 30], [30, -30, 30], [30, 30, 30], [-30, 30, 30]], "inner");
      f.box(-20, -16, 40, 40, 30, 2);
      for (const y of [-10, -3, 4]) f.line([[-14, y, 42], [12, y, 42]], "faint");
      f.line([[-14, 10, 42], [-10, 14, 42], [-2, 6, 42]], "accent");
      b.poly([[-30, 30, 30], [30, 30, 30], [30, 46, 38], [-30, 46, 38]], "top");
      b.poly([[30, -30, 30], [30, 30, 30], [46, 30, 38], [46, -30, 38]], "top");
      return { base: b.shapes, float: f.shapes, vb: fit(b, f) };
    }
    // cost tracking: rising columns on a plate, a marker on the latest
    case "costs": {
      b.box(-44, -44, 0, 88, 88, 6);
      b.grove(-34, -36, 3, 12, 5, 6);
      for (const k of [-22, 0, 22]) b.line([[k, -44, 6], [k, 44, 6]], "faint").line([[-44, k, 6], [44, k, 6]], "faint");
      const hs = [14, 22, 32, 46];
      hs.forEach((h, i) => b.box(-34 + i * 18, -6 + i * 4, 6, 13, 13, h, i === 3));
      sphere(f, 20.5, 18.5, 66, 7);
      b.grove(34, 34, 3, 10, 9, 6).grove(-36, 30, 2, 8, 13, 6);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-44, -44, 44, 44] };
    }
    // international owners: the globe on its stand
    case "globe": {
      b.box(-34, -34, 0, 68, 68, 8);
      b.grove(-26, -26, 2, 8, 3, 8);
      const [cx, cy] = sphere(f, 0, 0, 44, 30);
      dot(f, cx - 18, cy - 16);
      dot(f, cx + 24, cy - 4);
      dot(f, cx + 2, cy + 18);
      b.grove(26, 24, 3, 10, 7, 8);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-34, -34, 34, 34] };
    }
    // fund-owned platforms: three stacks of coins, the top one lifting
    case "coins": {
      b.box(-44, -44, 0, 88, 88, 4);
      b.grove(34, -36, 3, 10, 11, 4);
      const stacks: [number, number, number][] = [[-20, -18, 4], [14, -16, 6], [-6, 18, 3]];
      stacks.forEach(([x, y, n], si) => {
        for (let i = 0; i < n; i++) b.cyl(x, y, 4 + i * 6, 13, 6, "left", "top");
        if (si === 1) f.cyl(x, y, 4 + n * 6 + 10, 13, 6, "accent", "top");
      });
      b.grove(32, 30, 3, 12, 17, 4).grove(-36, 34, 2, 8, 19, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-44, -44, 44, 44] };
    }
    // new market developers: a transmission tower feeding a new substation,
    // its transformer being set in place
    case "pylon": {
      b.box(-50, -46, 0, 100, 92, 4);
      b.grove(38, -36, 3, 12, 23, 4);
      // monopole with two crossarms: reads cleanly at icon size
      b.cyl(-24, -18, 4, 3.4, 66, "left", "top");
      b.box(-44, -19, 54, 36, 2.4, 2.4).box(-40, -19, 64, 28, 2.4, 2.4);
      b.box(4, 4, 4, 40, 34, 2);
      for (const x of [10, 24, 38]) b.line([[x, 8, 6], [x, 8, 26]]).line([[x, 34, 6], [x, 34, 26]]).line([[x, 6, 26], [x, 36, 26]]);
      b.wire([-8, -18, 54], [10, 8, 26], 3).wire([-12, -18, 64], [24, 8, 26], 4);
      f.box(14, 16, 14, 20, 14, 14, true);
      b.grove(-40, 34, 3, 12, 29, 4).grove(42, 40, 2, 8, 31, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-50, -46, 50, 46] };
    }
    // storage developers: a row of containers, the next one being set down
    case "batteries": {
      b.box(-48, -40, 0, 96, 80, 4);
      b.grove(-38, -32, 3, 10, 37, 4).grove(38, -32, 2, 8, 41, 4);
      for (const x of [-40, -12, 16]) {
        b.box(x, -16, 4, 24, 16, 14);
        b.line([[x + 3, 0, 9], [x + 21, 0, 9]], "accent");
      }
      b.box(-36, 16, 4, 12, 12, 12);
      f.box(16, 14, 26, 24, 16, 14);
      f.line([[19, 30, 31], [37, 30, 31]], "accent");
      b.grove(38, 30, 3, 10, 43, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-48, -40, 48, 40] };
    }
    // thermal operators: turbine hall, stack and cooling tower
    case "thermal": {
      b.box(-46, -46, 0, 92, 92, 4);
      b.grove(36, -38, 3, 12, 47, 4);
      b.cyl(-30, -30, 4, 5, 66).band(-30, -30, 60, 5, "accent");
      b.coolingTower(18, -16, 4, 20, 14, 15, 54);
      b.box(-36, 2, 4, 40, 30, 24);
      b.box(-36, 2, 28, 16, 14, 10, true);
      b.grove(30, 32, 4, 14, 53, 4).grove(-38, 36, 3, 10, 59, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-46, -46, 46, 46] };
    }
    case "ashpond": {
      // coal ash closure: a capped pond stepping down in lifts, monitoring and
      // extraction wells along its edge
      b.box(-46, -46, 0, 92, 92, 4);
      b.grove(36, -38, 3, 12, 61, 4);
      b.box(-36, -30, 4, 56, 56, 6).box(-30, -24, 10, 44, 44, 6).box(-24, -18, 16, 32, 32, 4);
      b.poly([[-20, -14, 20.2], [4, -14, 20.2], [4, 10, 20.2], [-20, 10, 20.2]], "accent", "accent");
      for (const [x, y] of [[30, -24], [30, -4], [30, 16]] as const) b.cyl(x, y, 4, 2.2, 20, "left", "top").band(x, y, 18, 2.2, "accent");
      b.grove(-36, 36, 3, 12, 67, 4).grove(34, 36, 2, 8, 71, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-46, -46, 46, 46] };
    }
    case "service": {
      // service coordination: a pole-mounted transformer feeding a new house
      b.box(-46, -46, 0, 92, 92, 4);
      b.grove(36, -38, 3, 12, 73, 4);
      b.box(-24, -20, 4, 4, 4, 60);
      b.line([[-36, -18, 60], [-10, -18, 60]]).line([[-32, -18, 54], [-14, -18, 54]], "faint");
      b.box(-19, -24, 36, 8, 8, 12, true);
      b.box(4, 2, 4, 30, 24, 16).gable(4, 2, 20, 30, 24, 10);
      b.line([[34, 10, 9], [34, 10, 15]], "faint").line([[34, 18, 9], [34, 18, 15]], "faint");
      b.wire([-11, -20, 44], [4, 10, 22], 3);
      b.grove(-36, 34, 3, 12, 79, 4).grove(38, 38, 2, 8, 83, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-46, -46, 46, 46] };
    }
    case "demolition": {
      // a coal plant being taken down: the stack cut to a stump, half the
      // boiler house gone to its bare frame with a wall section falling, a
      // high-reach excavator biting at the broken edge (dust rising), rubble
      // and sorted spoil heaps, the coal conveyor stripped back to its
      // trestles, and trucks hauling debris out along the road
      b.box(-56, -50, 0, 112, 100, 4);
      const run = (pts: [number, number, number][]) => `M${pts.map((v) => b.pt(v)).join(" L")}`;
      // haul road
      b.line([[-56, 12, 4.1], [56, 12, 4.1]], "faint").line([[-56, 18, 4.1], [56, 18, 4.1]], "faint");
      b.grove(46, -44, 3, 10, 107, 4);
      // the stack, cut down to a stump with a ragged rim
      b.cyl(-46, -36, 4, 5, 22).band(-46, -36, 18, 5, "accent");
      b.line([[-50, -36, 26], [-48, -38, 23], [-46, -39, 27], [-44, -38, 24], [-42, -36, 26]], "faint");
      // what is left of the boiler house
      b.box(-38, -46, 4, 10, 24, 26).box(-28, -46, 4, 6, 24, 18);
      // the demolished half: its bare steel frame, columns and floor beams
      // stepping down toward the excavator
      const cols: [number, number][] = [[-22, 22], [-14, 18], [-6, 13], [2, 8]];
      for (const [x, h] of cols) b.line([[x, -46, 4], [x, -46, 4 + h]], "faint").line([[x, -34, 4], [x, -34, 4 + h]], "faint").line([[x, -22, 4], [x, -22, 4 + h]]);
      for (const lv of [12, 18]) {
        const span = cols.filter(([, h]) => h + 4 >= lv);
        const x1 = span[span.length - 1][0];
        b.line([[-22, -22, lv], [x1, -22, lv]]).line([[-22, -46, lv], [x1, -46, lv]], "faint");
        for (const [x] of span) b.line([[x, -46, lv], [x, -22, lv]], "faint");
      }
      // a wall panel peeling away from the broken edge
      b.poly([[-22, -22, 4], [-22, -22, 22], [-17, -17, 16], [-17, -17, 4]], "left");
      // rubble at the foot, and broken pieces
      b.heap(-8, -12, 4, 10, 6, 0.3);
      b.box(-20, -8, 4, 4, 3, 2).box(0, -18, 4, 3, 4, 2).box(-14, -2, 4, 5, 3, 1.5);
      // high-reach excavator working the edge
      b.box(6, -10, 4, 13, 7, 3).box(8, -9, 7, 9, 5, 4).box(14, -9, 11, 3, 3, 4, true);
      b.line([[9, -7, 11], [-2, -16, 32], [-13, -21, 25]], "accent").line([[-13, -21, 25], [-16, -23, 20]], "accent").line([[-13, -21, 25], [-17, -20, 22]], "accent");
      // the coal conveyor, stripped: one stub of belt, then bare trestles
      b.box(20, -30, 4, 10, 10, 18);
      for (const x of [34, 42, 50]) b.lattice(x, -25, 4, 1.6, 1, 14 - (x - 34) * 0.3, 2);
      b.poly([[30, -27, 20], [38, -27, 18.5], [38, -23, 18.5], [30, -23, 20]], "top");
      b.poly([[30, -23, 20], [38, -23, 18.5], [38, -23, 17], [30, -23, 18.5]], "left");
      // sorted spoil heaps: concrete, and scrap steel
      b.heap(36, 2, 4, 12, 9, 0.2);
      b.heap(-36, 32, 4, 11, 7, 0.25);
      for (const [x, y] of [[-28, 40], [-22, 36], [-26, 44]] as const) b.line([[x, y, 4.2], [x + 5, y - 2, 6]], "accent");
      // roll-off containers and a loaded truck on the road
      b.box(14, 24, 4, 10, 6, 4).box(28, 26, 4, 10, 6, 4);
      b.box(-2, 13, 4, 14, 4, 5, true).box(12, 13, 4, 5, 4, 6);
      // the closed tanks, flat discs now
      for (const [x, y] of [[40, 40], [50, 34]] as const) b.cyl(x, y, 4, 5, 1, "left", "top");
      b.grove(-50, 46, 3, 8, 113, 4).grove(52, 48, 2, 7, 117, 4);
      return {
        base: b.shapes,
        float: f.shapes,
        vb: fit(b, f),
        foot: [-56, -50, 56, 50],
        // trucks hauling debris out along the road
        flows: [{ d: run([[-50, 15, 4.4], [54, 15, 4.4]]), slow: true }],
        // dust where the excavator bites and off the rubble
        puffs: [b.p([-15, -22, 22]), b.p([-8, -12, 10])],
      };
    }
    case "federal": {
      // a water utility's three programmes: the dam being raised (new crest
      // and a crane on it) with its reservoir behind, pumped storage (an upper
      // reservoir on the hill, penstocks down to a powerhouse and its lower
      // pond) and a pipeline on supports carrying water away across the site
      b.box(-56, -50, 0, 112, 100, 4);
      const run = (pts: [number, number, number][]) => `M${pts.map((v) => b.pt(v)).join(" L")}`;
      // main reservoir and the dam holding it
      b.poly([[-56, -50, 13], [18, -50, 13], [18, -20, 13], [-56, -20, 13]], "water", "accent");
      b.line([[-46, -42, 13.2], [-20, -42, 13.2]], "faint").line([[-30, -30, 13.2], [6, -30, 13.2]], "faint");
      b.box(-56, -20, 4, 74, 8, 12);
      for (const x of [-44, -32, -20, -8, 4]) b.line([[x, -12, 6], [x, -12, 15]], "faint");
      // the raise: a new crest section, and a crane working on it
      b.box(-40, -20, 16, 40, 8, 4, true);
      b.lattice(10, -16, 16, 1.6, 1, 18, 2);
      b.line([[10, -16, 34], [-14, -16, 34]]).line([[-12, -16, 34], [-12, -16, 25]], "accent");
      // pumped storage: the upper reservoir on its hill
      b.box(24, -50, 4, 32, 30, 30);
      b.poly([[27, -47, 34.2], [53, -47, 34.2], [53, -23, 34.2], [27, -23, 34.2]], "water", "accent");
      // river below the dam
      b.poly([[-56, -10, 4.2], [-18, -10, 4.2], [-26, 2, 4.2], [-56, 6, 4.2]], "water", "faint");
      // penstocks down the hill face to the powerhouse
      for (const x of [34, 40]) b.line([[x, -20, 30], [x, -6, 14], [x, 6, 14]]);
      b.box(28, 6, 4, 22, 14, 13);
      b.box(30, 8, 17, 6, 10, 3, true);
      // the lower pond
      b.poly([[24, 26, 4.2], [54, 26, 4.2], [54, 46, 4.2], [24, 46, 4.2]], "water", "faint");
      // the pipeline on its supports, from the dam toe out across the site
      const pipe: [number, number, number][] = [[-14, -10, 8], [-14, 14, 8], [12, 34, 8], [12, 50, 8]];
      for (const [x, y] of [[-14, -4], [-14, 6], [-10, 18], [-2, 24], [6, 29], [12, 42]] as const) b.box(x - 1, y - 1, 4, 2, 2, 3);
      b.line(pipe, "accent");
      b.line(pipe.map(([x, y, zz]) => [x + 1.4, y + 1.4, zz - 1.2] as [number, number, number]), "faint");
      // power out from the powerhouse
      b.lattice(-36, 30, 4, 3.2, 1.2, 28, 2);
      b.wire([28, 13, 14], [-36, 30, 32], 3);
      b.grove(-48, 44, 3, 8, 127, 4).grove(52, 0, 2, 6, 131, 4);
      return {
        base: b.shapes,
        float: f.shapes,
        vb: fit(b, f),
        foot: [-56, -50, 56, 50],
        flows: [
          // water down the penstocks, along the pipeline, over the spillway
          { d: run([[37, -20, 30.6], [37, -6, 14.6], [37, 6, 14.6]]) },
          { d: run(pipe.map(([x, y, zz]) => [x, y, zz + 0.6] as [number, number, number])), slow: true },
          { d: run([[-50, -36, 13.4], [8, -36, 13.4]]), slow: true },
        ],
      };
    }
    case "water": {
      // water and storage: a ground storage tank on the plate, a reservoir cut
      // into it and a pipeline between them
      b.box(-46, -46, 0, 92, 92, 4);
      b.grove(36, -38, 3, 12, 89, 4);
      b.poly([[-40, 10, 4.2], [-6, 10, 4.2], [-6, 40, 4.2], [-40, 40, 4.2]], "water", "accent");
      b.line([[-34, 20, 4.4], [-16, 20, 4.4]], "faint").line([[-30, 30, 4.4], [-12, 30, 4.4]], "faint");
      b.box(-4, 20, 4, 30, 4, 4, true);
      b.cyl(10, -12, 4, 22, 22, "left", "top").band(10, -12, 16, 22, "accent").dome(10, -12, 26, 22, 5);
      b.grove(-36, -34, 3, 12, 97, 4).grove(38, 36, 2, 8, 101, 4);
      return { base: b.shapes, float: f.shapes, vb: fit(b, f), foot: [-46, -46, 46, 46] };
    }
  }
}

const cache = new Map<IconKey, Built>();
export const iconShapes = (k: IconKey) => get(k);
const get = (k: IconKey) => cache.get(k) ?? (cache.set(k, build(k)), cache.get(k)!);

// same palette as the Industries menu graphics (IndustryGraphic)
const fills: Record<Tone, string> = {
  top: "url(#li-top)",
  left: "url(#li-left)",
  right: "#b3b9c7",
  inner: "#a5acbb",
  accent: "url(#li-sky)",
  warm: "url(#li-warm)",
  tree: "#d3d7e0",
  water: "url(#li-sky)",
  none: "none",
};
const strokes: Record<NonNullable<Shape["stroke"]>, string> = {
  ink: "rgb(42 46 58)",
  faint: "rgb(42 46 58 / 0.1)",
  accent: "#1f78d1",
  warm: "#e08a1e",
  soft: "rgb(42 46 58 / 0.2)",
};

function Paths({ shapes, uid }: { shapes: Shape[]; uid: string }) {
  // gradient and filter ids are made unique per drawing (a hidden copy of
  // the same drawing elsewhere on the page must not own the definitions)
  const u = (v: string) => v.replace(/#li-/g, `#${uid}-`);
  return (
    <>
      {shapes.map((sh, i) => {
        const stroke = sh.stroke ?? "ink";
        return (
          <path
            key={i}
            d={sh.d}
            fill={u(fills[sh.tone])}
            stroke={strokes[stroke]}
            // faces carry only a hint of an edge; lines (rails, masts, wires) stay legible
            strokeOpacity={stroke === "ink" ? (sh.tone === "none" ? 0.6 : 0.16) : 1}
            strokeWidth={stroke === "accent" ? 1.2 : sh.tone === "none" ? 0.9 : 0.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={sh.tone === "accent" || sh.tone === "warm" || sh.tone === "water" ? `url(#${uid}-grain)` : undefined}
          />
        );
      })}
    </>
  );
}

const ICONS: IconKey[] = ["estimates", "package", "costs", "globe", "coins", "pylon", "batteries", "thermal", "ashpond", "service", "water", "demolition", "federal"];
const C30 = Math.cos(Math.PI / 6);
const pt = (x: number, y: number) => `${(240 + (x - y) * C30).toFixed(1)} ${(190 + (x + y) * 0.5).toFixed(1)}`;

export function LineIcon({ icon, className = "" }: { icon: IconKey; className?: string }) {
  const { base, float, vb, foot } = get(icon);
  const [vx, vy, vw, vh] = vb.split(" ").map(Number);
  const uid = `li${useId().replace(/:/g, "")}`;
  const maskId = `${uid}-mask`;
  return (
    <svg viewBox={vb} className={`block h-full w-auto overflow-visible ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e7ef" />
        </linearGradient>
        <linearGradient id={`${uid}-left`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dee8" />
          <stop offset="1" stopColor="#c5cbd8" />
        </linearGradient>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd8ff" />
          <stop offset="0.55" stopColor="#3a9ff0" />
          <stop offset="1" stopColor="#2070d8" />
        </linearGradient>
        <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd690" />
          <stop offset="1" stopColor="#f2952a" />
        </linearGradient>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
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
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id={`${uid}-fade`} cx="50%" cy="60%" r="60%">
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh}>
          <rect x={vx} y={vy} width={vw} height={vh} fill={`url(#${uid}-fade)`} />
        </mask>
      </defs>
      {/* the plans underneath, then the plate's soft shadow */}
      <g mask={`url(#${maskId})`} opacity={0.75}>
        <Blueprint
          ox={240}
          oy={190}
          scale={0.55}
          variant={ICONS.indexOf(icon)}
          sheet={{ x0: -150, y0: -150, x1: 150, y1: 150 }}
          ink="#3f6db3"
          paper="#2089d8"
          paperOpacity={0.05}
        />
      </g>
      {foot && (
        <path
          d={`M${pt(foot[0] + 8, foot[1] + 8)} L${pt(foot[2] + 10, foot[1] + 8)} L${pt(foot[2] + 10, foot[3] + 10)} L${pt(foot[0] + 8, foot[3] + 10)} Z`}
          fill="#1b2140"
          opacity={0.12}
          filter={`url(#${uid}-blur)`}
        />
      )}
      <Paths shapes={base} uid={uid} />
      {float.length > 0 && (
        <g className="iso-float">
          <Paths shapes={float} uid={uid} />
        </g>
      )}
    </svg>
  );
}
