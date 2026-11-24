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
  | "thermal";

type Built = { base: Shape[]; float: Shape[]; vb: string; foot?: [number, number, number, number] };

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
  }
}

const cache = new Map<IconKey, Built>();
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

const ICONS: IconKey[] = ["estimates", "package", "costs", "globe", "coins", "pylon", "batteries", "thermal"];
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
