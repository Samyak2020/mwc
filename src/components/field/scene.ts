// Isometric line-art "field" for the workstreams journey: one big site with
// three zones (Plan and Develop, Build and Commission, Operate and Maintain).
// Pure geometry: everything is generated here as SVG path data, in painter's
// order, so the component only has to render it and move the camera.
//
// World axes: x runs down-right, y runs down-left, z is up.
// 1 world unit = U px at camera scale 1.

export const U = 8;
const C = Math.cos(Math.PI / 6);
const S = 0.5;

export type V3 = [number, number, number];
export type ZoneId = "A" | "B" | "C";
/** A piece that lifts away during "Decommission": delay (0–1) and lift (px). */
export type Rm = { dl: number; lift: number };

export type Prim = {
  /** path data … */
  d?: string;
  /** … or a text label at (x, y), optionally laid on the ground with matrix m */
  t?: string;
  x?: number;
  y?: number;
  m?: string;
  /** style classes (see .field in globals.css) */
  c: string;
  /** painter's key: larger = nearer the viewer = drawn later */
  k: number;
  rm?: Rm;
};

export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * C * U, ((x + y) * S - z) * U];

const n = (v: number) => String(Math.round(v * 10) / 10);
const pt = (p: V3) => {
  const [a, b] = iso(p[0], p[1], p[2]);
  return `${n(a)} ${n(b)}`;
};
const path = (pts: V3[], close = false) => `M${pts.map(pt).join("L")}${close ? "Z" : ""}`;
const ellipse = (sx: number, sy: number, rx: number, ry: number) =>
  `M${n(sx - rx)} ${n(sy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(sx + rx)} ${n(sy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(sx - rx)} ${n(sy)}Z`;
const rect = (x: number, y: number, w: number, d: number, z = 0): V3[] => [
  [x, y, z],
  [x + w, y, z],
  [x + w, y + d, z],
  [x, y + d, z],
];
// a circle of radius r on the ground projects to this ellipse
const RX = Math.SQRT2 * C * U;
const RY = Math.SQRT2 * S * U;

type BoxOpts = { k?: number; ghost?: boolean; rm?: Rm; x?: string };

/** One drawing layer with a local origin: ground marks, sorted solids, callouts. */
class Layer {
  ground: Prim[] = [];
  solids: Prim[] = [];
  accents: Prim[] = [];
  constructor(
    readonly ox = 0,
    readonly oy = 0,
  ) {}

  private W = (p: V3): V3 => [p[0] + this.ox, p[1] + this.oy, p[2]];
  private P = (pts: V3[], close = false) => path(pts.map(this.W), close);
  at(x: number, y: number, z = 0) {
    return iso(x + this.ox, y + this.oy, z);
  }

  /** flat mark on the ground (drawn before every solid) */
  g(pts: V3[], c = "lf", close = false) {
    this.ground.push({ d: this.P(pts, close), c, k: 0 });
  }

  /** free line in space (several polylines allowed), sorted with the solids */
  l(segs: V3[] | V3[][], c = "ln", k?: number, rm?: Rm) {
    const list = (Array.isArray(segs[0][0]) ? segs : [segs]) as V3[][];
    const all = list.flat();
    const key = k ?? all.reduce((s, p) => s + p[0] + p[1], 0) / all.length + 0.02;
    this.solids.push({ d: list.map((s) => this.P(s)).join(""), c, k: key, rm });
    return key;
  }

  /** shaded box: top, left (+y) and right (+x) faces. Returns its sort key. */
  box(x: number, y: number, z: number, w: number, d: number, h: number, o: BoxOpts = {}) {
    const k = o.k ?? x + y + (w + d) / 2 + z * 0.01;
    const [t, l, r] = o.ghost ? ["gt", "gl", "gr"] : ["ft", "fl", "fr"];
    const x2 = x + w;
    const y2 = y + d;
    const z2 = z + h;
    const cls = (c: string) => (o.x ? `${c} ${o.x}` : c);
    if (o.ghost)
      // hidden edges, dashed
      this.solids.push({
        d: this.P([[x2, y, z], [x, y, z], [x, y2, z]]) + this.P([[x, y, z], [x, y, z2]]),
        c: cls("gd"),
        k: k - 0.001,
        rm: o.rm,
      });
    this.solids.push(
      { d: this.P([[x, y2, z2], [x2, y2, z2], [x2, y2, z], [x, y2, z]], true), c: cls(l), k, rm: o.rm },
      { d: this.P([[x2, y, z2], [x2, y2, z2], [x2, y2, z], [x2, y, z]], true), c: cls(r), k, rm: o.rm },
      { d: this.P([[x, y, z2], [x2, y, z2], [x2, y2, z2], [x, y2, z2]], true), c: cls(t), k, rm: o.rm },
    );
    return k;
  }

  /** upright cylinder (stack, tank) */
  cyl(cx: number, cy: number, z: number, r: number, h: number, o: { k?: number; rm?: Rm; x?: string } = {}) {
    const k = o.k ?? cx + cy + z * 0.01;
    const [sx, sy0] = this.at(cx, cy, z);
    const sy1 = sy0 - h * U;
    const rx = r * RX;
    const ry = r * RY;
    const cls = (c: string) => (o.x ? `${c} ${o.x}` : c);
    this.solids.push(
      {
        d: `M${n(sx - rx)} ${n(sy1)}L${n(sx - rx)} ${n(sy0)}A${n(rx)} ${n(ry)} 0 0 0 ${n(sx + rx)} ${n(sy0)}L${n(sx + rx)} ${n(sy1)}A${n(rx)} ${n(ry)} 0 0 1 ${n(sx - rx)} ${n(sy1)}Z`,
        c: cls("fc"),
        k,
        rm: o.rm,
      },
      { d: ellipse(sx, sy1, rx, ry), c: cls("ft"), k, rm: o.rm },
    );
    return k;
  }

  /** hyperboloid cooling tower */
  tower(cx: number, cy: number, r: number, h: number, o: { rm?: Rm } = {}) {
    const k = cx + cy;
    const [sx, sy0] = this.at(cx, cy, 0);
    const rad = (t: number) => {
      const waist = 0.58 * r;
      const top = 0.68 * r;
      return t < 0.72 ? waist + (r - waist) * (1 - t / 0.72) ** 2 : waist + (top - waist) * ((t - 0.72) / 0.28) ** 2;
    };
    const steps = 12;
    const left: string[] = [];
    const right: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = sy0 - t * h * U;
      left.push(`${n(sx - rad(t) * RX)} ${n(y)}`);
      right.push(`${n(sx + rad(t) * RX)} ${n(y)}`);
    }
    const yTop = sy0 - h * U;
    const rt = rad(1);
    this.solids.push({
      d: `M${left.slice().reverse().join("L")}A${n(r * RX)} ${n(r * RY)} 0 0 0 ${right[0]}L${right.join("L")}A${n(rt * RX)} ${n(rt * RY)} 0 0 1 ${left[steps]}Z`,
      c: "fc",
      k,
      rm: o.rm,
    });
    // rings (front halves) + the open top
    const rings = [0.22, 0.45, 0.7]
      .map((t) => {
        const y = sy0 - t * h * U;
        const q = rad(t);
        return `M${n(sx - q * RX)} ${n(y)}A${n(q * RX)} ${n(q * RY)} 0 0 0 ${n(sx + q * RX)} ${n(y)}`;
      })
      .join("");
    this.solids.push(
      { d: rings, c: "lf", k: k + 0.001, rm: o.rm },
      { d: ellipse(sx, yTop, rt * RX, rt * RY), c: "ft", k: k + 0.002, rm: o.rm },
      { d: ellipse(sx, yTop + 1.5, rt * RX * 0.82, rt * RY * 0.82), c: "fr", k: k + 0.003, rm: o.rm },
    );
  }

  /** callout: leader line with a square marker, or a label plate */
  tag(x: number, y: number, z: number, h: number, label?: string, to: Prim[] = this.accents, x2 = "", scale = 1) {
    const [ax, ay] = this.at(x, y, z);
    const ty = ay - h * U;
    const cls = (c: string) => (x2 ? `${c} ${x2}` : c);
    to.push({ d: `M${n(ax)} ${n(ay)}V${n(ty)}`, c: cls("ac"), k: 900 });
    if (!label) {
      const m = 7 * scale;
      to.push({ d: `M${n(ax - m / 2)} ${n(ty - m)}h${n(m)}v${n(m)}h${n(-m)}Z`, c: cls("mk"), k: 901 });
      return;
    }
    const w = (label.length * 6.15 + 12) * scale;
    const ph = 15 * scale;
    to.push(
      { d: `M${n(ax - w / 2)} ${n(ty - ph)}h${n(w)}v${n(ph)}h${n(-w)}Z`, c: cls("mk"), k: 901 },
      { t: label, x: ax, y: ty - ph * 0.48, c: cls(scale > 1 ? "lt lt-big" : "lt"), k: 902 },
    );
  }

  /** dimension line on the ground along x, offset by `off` in y */
  dimX(x1: number, x2: number, y: number, off: number, label: string) {
    const yy = y + off;
    this.accents.push(
      { d: this.P([[x1, yy, 0], [x2, yy, 0]]), c: "ac draw", k: 800 },
      { d: this.P([[x1, yy - 0.8, 0], [x1, yy + 0.8, 0]]) + this.P([[x2, yy - 0.8, 0], [x2, yy + 0.8, 0]]), c: "ac", k: 800 },
      { d: this.P([[x1, y, 0], [x1, y + off * 1.25, 0]]) + this.P([[x2, y, 0], [x2, y + off * 1.25, 0]]), c: "acd", k: 800 },
    );
    const [tx, ty] = this.at((x1 + x2) / 2, yy + (off > 0 ? 2.3 : -1), 0);
    this.accents.push({ t: label, m: `matrix(${n4(C)} ${S} ${n4(-C)} ${S} ${n(tx)} ${n(ty)})`, c: "dt", k: 801 });
  }

  /** dimension line on the ground along y, offset by `off` in x */
  dimY(y1: number, y2: number, x: number, off: number, label: string) {
    const xx = x + off;
    this.accents.push(
      { d: this.P([[xx, y1, 0], [xx, y2, 0]]), c: "ac draw", k: 800 },
      { d: this.P([[xx - 0.8, y1, 0], [xx + 0.8, y1, 0]]) + this.P([[xx - 0.8, y2, 0], [xx + 0.8, y2, 0]]), c: "ac", k: 800 },
      { d: this.P([[x, y1, 0], [x + off * 1.25, y1, 0]]) + this.P([[x, y2, 0], [x + off * 1.25, y2, 0]]), c: "acd", k: 800 },
    );
    const [tx, ty] = this.at(xx + 2.3, (y1 + y2) / 2, 0);
    this.accents.push({ t: label, m: `matrix(${n4(C)} ${-S} ${n4(C)} ${S} ${n(tx)} ${n(ty)})`, c: "dt", k: 801 });
  }

  /** vertical dimension */
  dimZ(x: number, y: number, z1: number, z2: number, label: string) {
    const [sx, s1] = this.at(x, y, z1);
    const [, s2] = this.at(x, y, z2);
    this.accents.push(
      { d: `M${n(sx)} ${n(s1)}V${n(s2)}`, c: "ac draw", k: 800 },
      { d: `M${n(sx - 4)} ${n(s1)}h8M${n(sx - 4)} ${n(s2)}h8`, c: "ac", k: 800 },
      { t: label, x: sx + 8, y: (s1 + s2) / 2, c: "dt dt-start", k: 801 },
    );
  }
}
const n4 = (v: number) => String(Math.round(v * 10000) / 10000);

// ── Reusable equipment ───────────────────────────────────────────────────

function container(L: Layer, x: number, y: number, z = 0, rm?: Rm) {
  const k = L.box(x, y, z, 5, 2.4, 2.6, { rm, k: x + y + 3.7 + (z ? 0.5 : 0) });
  L.box(x + 0.5, y + 0.5, z + 2.6, 1.4, 1.4, 0.45, { k: k + 0.01, rm });
  // doors on the left face, vents on the right
  L.l(
    [
      [[x + 1.67, y + 2.4, z], [x + 1.67, y + 2.4, z + 2.6]],
      [[x + 3.33, y + 2.4, z], [x + 3.33, y + 2.4, z + 2.6]],
      [[x + 5, y + 0.5, z + 1.9], [x + 5, y + 1.9, z + 1.9]],
      [[x + 5, y + 0.5, z + 1.5], [x + 5, y + 1.9, z + 1.5]],
    ],
    "lf",
    k + 0.02,
    rm,
  );
  return k;
}

function transformer(L: Layer, x: number, y: number, rm?: Rm) {
  const k = L.box(x, y, 0, 2.8, 2.2, 2.4, { rm });
  L.box(x + 0.4, y + 0.3, 2.4, 2, 0.7, 0.5, { k: k + 0.01, rm });
  const fins: V3[][] = [];
  for (let i = 1; i <= 5; i++) fins.push([[x + i * 0.47, y + 2.2, 0.3], [x + i * 0.47, y + 2.2, 2]]);
  // three bushings
  for (let i = 0; i < 3; i++) {
    const bx = x + 0.6 + i * 0.8;
    fins.push([[bx, y + 1.6, 2.4], [bx, y + 1.6, 3.7]], [[bx - 0.18, y + 1.6, 3.3], [bx + 0.18, y + 1.6, 3.3]]);
  }
  L.l(fins, "ln", k + 0.02, rm);
  return k;
}

/** lattice transmission tower; the line runs along y, arms point along x */
function pylon(L: Layer, x: number, y: number, h: number) {
  const b = 1.2;
  const t = 0.22;
  const leg = (sx: number, sy: number): V3[] => [[x + sx * b, y + sy * b, 0], [x + sx * t, y + sy * t, h]];
  const segs: V3[][] = [leg(-1, -1), leg(1, -1), leg(1, 1), leg(-1, 1)];
  const at = (f: number, sx: number, sy: number): V3 => {
    const q = b + (t - b) * f;
    return [x + sx * q, y + sy * q, h * f];
  };
  for (const [f0, f1] of [[0, 0.28], [0.28, 0.52], [0.52, 0.72]]) {
    // X braces on the two faces towards the viewer
    segs.push([at(f0, -1, 1), at(f1, 1, 1)], [at(f0, 1, 1), at(f1, -1, 1)], [at(f0, 1, -1), at(f1, 1, 1)], [at(f0, 1, 1), at(f1, 1, -1)]);
    segs.push([at(f1, -1, 1), at(f1, 1, 1), at(f1, 1, -1)]);
  }
  for (const [f, len] of [[0.74, 2.6], [0.9, 1.8]]) segs.push([[x - len, y, h * f], [x + len, y, h * f]]);
  L.l(segs, "lf", x + y + 0.5);
}
const PYLON_ARMS: [number, number][] = [[0.74, 2.6], [0.74, -2.6], [0.9, 1.8], [0.9, -1.8], [1, 0]];

function wires(L: Layer, x: number, y1: number, y2: number, h: number) {
  const segs: V3[][] = [];
  for (const [f, dx] of PYLON_ARMS) {
    const line: V3[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      line.push([x + dx, y1 + (y2 - y1) * t, h * f - 2.4 * 4 * t * (1 - t)]);
    }
    segs.push(line);
  }
  L.l(segs, "wr", x + (y1 + y2) / 2 + 0.6);
}

/** small conifer: trunk + two stacked triangles (drawn upright, in screen space) */
function tree(L: Layer, x: number, y: number, s: number) {
  const [sx, sy] = L.at(x, y, 0);
  const u = s * U;
  const tri = (half: number, base: number, top: number) =>
    `M${n(sx - half * u)} ${n(sy - base * u)}L${n(sx)} ${n(sy - top * u)}L${n(sx + half * u)} ${n(sy - base * u)}Z`;
  L.solids.push(
    { d: `M${n(sx)} ${n(sy)}V${n(sy - 0.6 * u)}`, c: "lf", k: x + y },
    { d: tri(0.95, 0.5, 2.2), c: "tr", k: x + y + 0.001 },
    { d: tri(0.7, 1.5, 3.1), c: "tr", k: x + y + 0.002 },
  );
}

/** Three rotor blades in the plane x = const (hub at height h), at angle a. */
export function bladePath(x: number, y: number, h: number, a: number) {
  const hx = x + 1.5;
  const hz = h + 0.4;
  const L = 6.2;
  let d = "";
  for (let i = 0; i < 3; i++) {
    const th = a + (i * 2 * Math.PI) / 3;
    const c = Math.cos(th);
    const s = Math.sin(th);
    d += path(
      [
        // root: ±0.32 across the blade; tip: L along it
        [hx, y + 0.32 * s, hz - 0.32 * c],
        [hx, y + c * L, hz + s * L],
        [hx, y - 0.32 * s, hz + 0.32 * c],
      ],
      true,
    );
  }
  return d;
}

export type Turbine = { x: number; y: number; h: number; phase: number };

function windTurbine(L: Layer, t: Turbine) {
  const { x, y, h } = t;
  L.solids.push({
    d: path([[x - 0.4, y, 0], [x - 0.16, y, h], [x + 0.16, y, h], [x + 0.4, y, 0]], true),
    c: "fl",
    k: x + y,
  });
  L.box(x - 0.6, y - 0.45, h, 2.1, 0.9, 0.8, { k: x + y + 0.01 });
}

// ── The site ─────────────────────────────────────────────────────────────

export type Zone = {
  id: ZoneId;
  /** plot rectangle in world units */
  rect: { x: number; y: number; w: number; d: number };
  ground: Prim[];
  solids: Prim[];
  accents: Prim[];
};

export type Scene = {
  ground: Prim[];
  filler: Prim[];
  /** power routes between zones (drawn progressively) + their junction dots */
  routes: { d: string; nodes: string }[];
  zones: Record<ZoneId, Zone>;
  turbines: Turbine[];
};

const sorted = (list: Prim[]) => list.slice().sort((a, b) => a.k - b.k);

// Plot rectangles. On screen: A (plan) sits top-right, C (operate) in the
// middle, B (build) bottom-left, so the overview keeps clear of the text.
export const PLOTS: Record<ZoneId, Zone["rect"]> = {
  A: { x: 22, y: 15, w: 50, d: 46 },
  C: { x: 52, y: 96, w: 60, d: 46 },
  B: { x: 38, y: 170, w: 54, d: 44 },
};

function planZone(): Zone {
  const r = PLOTS.A;
  const L = new Layer(r.x, r.y);
  for (let i = 5; i < r.w; i += 5) L.g([[i, 0, 0], [i, r.d, 0]], "gf");
  for (let j = 5; j < r.d; j += 5) L.g([[0, j, 0], [r.w, j, 0]], "gf");
  L.g(rect(0, 0, r.w, r.d), "pl", true);
  L.g(rect(3, 3, r.w - 6, r.d - 6), "ld", true);
  // access road stub and centrelines
  L.g([[25, 3, 0], [25, 43, 0]], "acd");
  L.g([[3, 30.5, 0], [47, 30.5, 0]], "acd");

  // proposed massing: translucent blocks
  L.box(6, 6, 0, 34, 9, 6, { ghost: true });
  L.box(6, 15, 0, 9, 20, 6, { ghost: true });
  L.box(31, 15, 0, 9, 12, 8, { ghost: true });
  L.box(19, 22, 0, 5, 5, 5, { ghost: true });
  L.box(21, 33, 0, 3, 3, 9, { ghost: true });
  L.box(25.5, 34, 0, 3, 3, 7, { ghost: true });
  L.box(8, 39, 0, 14, 4.5, 1.2, { ghost: true });
  L.box(34, 36, 0, 9, 6, 3, { ghost: true });

  L.dimX(0, r.w, r.d, 4, "500 FT");
  L.dimY(0, r.d, r.w, 4, "460 FT");
  L.dimX(6, 40, 6, -3, "340 FT");
  L.dimY(15, 35, 6, -3, "200 FT");
  L.dimZ(41.4, 27.4, 0, 8, "80 FT");

  // survey stakes on the corners
  for (const [x, y] of [[0, 0], [r.w, 0], [r.w, r.d], [0, r.d]]) L.tag(x, y, 0, 2.2);
  // north arrow
  const [nx, ny] = L.at(45, 8, 0);
  L.accents.push(
    { d: ellipse(nx, ny, 2.4 * RX, 2.4 * RY), c: "ac", k: 800 },
    { d: path([[45 + r.x, 10.6 + r.y, 0], [45 + r.x, 4.6 + r.y, 0]]) + path([[44 + r.x, 6.2 + r.y, 0], [45 + r.x, 4.6 + r.y, 0], [46 + r.x, 6.2 + r.y, 0]]), c: "ac", k: 800 },
    { t: "N", x: nx + 14, y: ny - 30, c: "dt", k: 801 },
  );

  L.tag(23, 10.5, 6, 7, "PROPOSED FACILITY");
  L.tag(35.5, 21, 8, 4);
  L.tag(15, 41.2, 1.2, 6, "LAYDOWN AREA");
  L.tag(22.5, 34.5, 9, 3);
  return { id: "A", rect: r, ground: L.ground, solids: sorted(L.solids), accents: L.accents };
}

function buildZone(): Zone {
  const r = PLOTS.B;
  const L = new Layer(r.x, r.y);
  L.g(rect(0, 0, r.w, r.d), "pl", true);
  L.g(rect(1, 1, r.w - 2, r.d - 2), "lf", true);

  // battery enclosures: 4 rows × 7; the front row is still going in
  const rows = [5, 11.5, 18, 24.5];
  rows.forEach((y, ri) => {
    for (let i = 0; i < 7; i++) {
      const x = 4 + i * 6.4;
      if (ri < 3 || i < 4) container(L, x, y);
      else if (i === 4) {
        L.g(rect(x, y, 5, 2.4), "acd", true);
        container(L, x, y, 7);
        // crane hook + slings
        L.l(
          [
            [[x + 2.5, y + 1.2, 17], [x + 2.5, y + 1.2, 11.4]],
            [[x, y, 9.6], [x + 2.5, y + 1.2, 11.4], [x + 5, y + 2.4, 9.6]],
            [[x + 5, y, 9.6], [x + 2.5, y + 1.2, 11.4], [x, y + 2.4, 9.6]],
          ],
          "ln",
          400,
        );
        L.l([[47.9, 21.6, 2.9], [x + 2.5, y + 1.2, 17]], "ln", 401);
        L.l([[x + 2.5, y + 1.2, 0], [x + 2.5, y + 1.2, 7]], "acd", 399);
      } else L.g(rect(x, y, 5, 2.4), "acd", true);
    }
    // cable trench behind each row
    if (ri > 0) {
      L.g([[3, y - 2.3, 0], [49.5, y - 2.3, 0]], "lf");
      L.g([[3, y - 1.6, 0], [49.5, y - 1.6, 0]], "lf");
    }
  });
  L.g([[49.5, 4, 0], [49.5, 38, 0]], "lf");
  L.g([[50.2, 4, 0], [50.2, 38, 0]], "lf");

  // mobile crane
  const ck = L.box(46.5, 19.5, 0, 3, 5.5, 1.4);
  L.box(47, 20.4, 1.4, 2, 2.2, 1.5, { k: ck + 0.01 });

  // inverter skids, step-up transformers, control building
  for (let i = 0; i < 6; i++) L.box(5 + i * 7, 30.5, 0, 2.2, 1.8, 2.2);
  for (let i = 0; i < 4; i++) transformer(L, 6 + i * 8, 36.5);
  const bk = L.box(40, 33, 0, 10, 7, 4);
  L.box(42, 34.5, 4, 3, 2, 0.8, { k: bk + 0.01 });
  L.l([[[43, 40, 0], [43, 40, 2.4], [45, 40, 2.4], [45, 40, 0]]], "lf", bk + 0.02);
  // pallets of material waiting by the gate
  L.box(41, 4, 0, 2.4, 1.6, 0.7);
  L.box(44.4, 4.6, 0, 2.4, 1.6, 1.1);
  L.box(42.4, 7.4, 0, 2.4, 1.6, 0.5);

  L.tag(18.5, 6.2, 3.05, 6, "BATTERY ENCLOSURE");
  L.tag(15.4, 37.6, 3.7, 5, "STEP-UP TRANSFORMER");
  L.tag(45, 36.5, 4.8, 4);
  L.tag(32.1, 25.7, 17, 2);
  L.tag(8.1, 31.4, 2.2, 3.5);
  return { id: "B", rect: r, ground: L.ground, solids: sorted(L.solids), accents: L.accents };
}

function operateZone(): Zone {
  const r = PLOTS.C;
  const L = new Layer(r.x, r.y);
  L.g(rect(0, 0, r.w, r.d), "pl", true);
  L.g(rect(1, 1, r.w - 2, r.d - 2), "lf", true);
  const foot = (x: number, y: number, w: number, d: number) => L.g(rect(x, y, w, d), "fp", true);

  // turbine hall, in three bays; two of them come down
  for (let s = 0; s < 3; s++) {
    const x = 4 + s * 13;
    const rm: Rm | undefined = s >= 1 ? { dl: (2 - s) * 0.14, lift: 70 } : undefined;
    if (rm) foot(x, 4, 13, 10);
    const k = L.box(x, 4, 0, 13, 10, 8, { rm });
    L.box(x + 2, 6, 8, 2, 2, 1, { k: k + 0.01, rm });
    L.box(x + 8, 6, 8, 2, 2, 1, { k: k + 0.011, rm });
    const bays: V3[][] = [];
    for (let i = 1; i < 4; i++) bays.push([[x + i * 3.25, 14, 0], [x + i * 3.25, 14, 8]]);
    bays.push([[x, 14, 5.6], [x + 13, 14, 5.6]]);
    L.l(bays, "lf", k + 0.02, rm);
  }

  // pipe rack between the hall and the units
  const rack: V3[][] = [[[4, 15.6, 4], [43, 15.6, 4]], [[4, 16.4, 4], [43, 16.4, 4]]];
  for (let x = 4; x <= 43; x += 6.5) rack.push([[x, 16, 0], [x, 16, 4]]);
  L.l(rack, "lf", 0);

  // five generating units: stack, HRSG, turbine, generator, transformer
  for (let i = 0; i < 5; i++) {
    const x = 5 + i * 8;
    const rm = (j: number): Rm | undefined => (i >= 1 ? { dl: 0.06 + (4 - i) * 0.1 + j * 0.04, lift: 44 + j * 7 } : undefined);
    if (i >= 1) {
      foot(x, 19.5, 4, 6);
      foot(x + 0.5, 27, 3, 5);
      foot(x + 0.8, 33, 2.4, 3);
      foot(x + 0.6, 38.5, 2.8, 2.2);
    }
    L.cyl(x + 2, 17.6, 0, 1, 14, { rm: rm(4) });
    const hk = L.box(x, 19.5, 0, 4, 6, 6, { rm: rm(3) });
    L.l([[[x, 25.5, 2], [x + 4, 25.5, 2]], [[x, 25.5, 4], [x + 4, 25.5, 4]]], "lf", hk + 0.02, rm(3));
    const tk = L.box(x + 0.5, 27, 0, 3, 5, 3, { rm: rm(2) });
    L.box(x + 1, 27.6, 3, 2, 1.6, 1.4, { k: tk + 0.01, rm: rm(2) });
    L.box(x + 0.8, 33, 0, 2.4, 3, 2.4, { rm: rm(1) });
    transformer(L, x + 0.6, 38.5, rm(0));
  }

  // cooling towers and tanks
  L.tower(51.5, 9.5, 4.6, 13);
  foot(46.9, 18.4, 9.2, 9.2);
  L.tower(51.5, 23, 4.6, 13, { rm: { dl: 0.3, lift: 60 } });
  foot(47, 32, 6, 6);
  L.cyl(50, 35, 0, 3, 4, { rm: { dl: 0.42, lift: 40 } });
  L.cyl(56, 41, 0, 2, 3);

  // switchyard gantries along the front
  const yard: V3[][] = [[[5, 43.4, 5], [43, 43.4, 5]], [[5, 44.4, 5], [43, 44.4, 5]]];
  for (let x = 6; x <= 42; x += 9) yard.push([[x, 43.4, 0], [x, 43.4, 5], [x, 44.4, 5], [x, 44.4, 0]]);
  L.l(yard, "lf", 300);

  // ── only during decommissioning: crane, haul trucks, skips ──
  const ck = L.box(45, 3.5, 0, 3, 5.5, 1.4, { x: "dc" });
  L.box(45.5, 4.4, 1.4, 2, 2.2, 1.5, { k: ck + 0.01, x: "dc" });
  L.l([[[46.4, 5.6, 2.9], [36.5, 9, 22]], [[36.5, 9, 22], [36.5, 9, 17]]], "ln dc", 500);
  for (const [x, y] of [[44.5, 29.5], [44.5, 33.2]]) {
    const k = L.box(x, y, 0, 4.6, 1.8, 1.5, { x: "dc" });
    L.box(x + 4.6, y + 0.1, 0, 1.4, 1.6, 1.9, { k: k + 0.01, x: "dc" });
  }
  L.box(30, 30, 0, 3, 1.6, 1.1, { x: "dc" });
  L.box(38.5, 34.5, 0, 3, 1.6, 1.1, { x: "dc" });
  L.tag(36.5, 9, 22, 2.5, "REMOVAL IN PROGRESS", L.solids, "dc", 1.9);
  L.tag(34.2, 34.5, 0, 9, "CLEARED PAD", L.solids, "dc", 1.9);

  L.tag(14.5, 29.5, 4.4, 6, "GAS TURBINE");
  L.tag(23, 39.6, 3.7, 5, "STEP-UP TRANSFORMER");
  L.tag(51.5, 9.5, 13, 3, "COOLING TOWER");
  L.tag(10.5, 9, 9, 3);
  L.tag(50, 35, 4, 3);
  return { id: "C", rect: r, ground: L.ground, solids: sorted(L.solids), accents: L.accents };
}

export function buildScene(): Scene {
  const G = new Layer();

  // ground grid (well past the screen; the page fades its edges)
  for (let x = -140; x <= 270; x += 10) G.g([[x, -90, 0], [x, 320, 0]], "gg");
  for (let y = -90; y <= 320; y += 10) G.g([[-140, y, 0], [270, y, 0]], "gg");

  // roads: two along x, one along y, with driveways into each plot
  const edge = (pts: V3[]) => G.g(pts, "rd");
  for (const y of [75, 152]) {
    for (const yy of [y, y + 6]) {
      edge([[-140, yy, 0], [122, yy, 0]]);
      edge([[128, yy, 0], [270, yy, 0]]);
    }
    G.g([[-140, y + 3, 0], [270, y + 3, 0]], "rdc");
  }
  for (const x of [122, 128]) {
    edge([[x, -90, 0], [x, 75, 0]]);
    edge([[x, 81, 0], [x, 152, 0]]);
    edge([[x, 158, 0], [x, 320, 0]]);
  }
  G.g([[125, -90, 0], [125, 320, 0]], "rdc");
  for (const [x, y1, y2] of [[47, 61, 75], [80, 81, 96], [80, 142, 152], [65, 158, 170]]) {
    edge([[x - 1.5, y1, 0], [x - 1.5, y2, 0]]);
    edge([[x + 1.5, y1, 0], [x + 1.5, y2, 0]]);
  }

  // transmission line along the y road
  const ys = [-50, -14, 22, 58, 94, 130, 166, 202, 238, 274];
  ys.forEach((y, i) => {
    pylon(G, 136, y, 15);
    if (i) wires(G, 136, ys[i - 1], y, 15);
  });

  // wind turbines, trees, a few vehicles
  const turbines: Turbine[] = [
    { x: 150, y: 150, h: 15, phase: 0.2 },
    { x: 164, y: 172, h: 15, phase: 1.1 },
    { x: 150, y: 194, h: 15, phase: 2.3 },
    { x: 166, y: 214, h: 15, phase: 0.7 },
    { x: -6, y: 96, h: 15, phase: 1.7 },
    { x: 6, y: 118, h: 15, phase: 2.9 },
  ];
  turbines.forEach((t) => windTurbine(G, t));

  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const clusters: [number, number, number][] = [
    [96, 44, 6], [104, 24, 5], [8, 40, 5], [22, 124, 5], [30, 148, 4], [104, 178, 6], [110, 204, 5],
    [10, 196, 5], [-14, 160, 5], [150, 110, 5], [156, 60, 6], [86, 232, 5], [40, -8, 5], [150, 24, 4],
  ];
  for (const [cx, cy, count] of clusters)
    for (let i = 0; i < count; i++) tree(G, cx + (rnd() - 0.5) * 14, cy + (rnd() - 0.5) * 14, 0.8 + rnd() * 0.6);

  for (const [x, y, alongX] of [[30, 76.2, 1], [96, 79, 1], [-20, 153.2, 1], [100, 156, 1], [123, 40, 0], [126.2, 118, 0], [123, 190, 0]]) {
    const k = alongX ? G.box(x, y, 0, 2.6, 1.2, 0.9) : G.box(x, y, 0, 1.2, 2.6, 0.9);
    if (alongX) G.box(x + 0.3, y + 0.1, 0.9, 1.4, 1, 0.6, { k: k + 0.01 });
    else G.box(x + 0.1, y + 0.3, 0.9, 1, 1.4, 0.6, { k: k + 0.01 });
  }

  // power routes: plan → operate → build, then operate → the grid
  const route = (pts: [number, number][]) => {
    const nodes = pts
      .map(([x, y]) => {
        const [sx, sy] = iso(x, y, 0);
        return ellipse(sx, sy, 0.55 * RX, 0.55 * RY);
      })
      .join("");
    return { d: path(pts.map(([x, y]) => [x, y, 0] as V3)), nodes };
  };
  const routes = [
    route([[55, 61], [55, 71], [90, 71], [90, 96]]),
    route([[70, 142], [70, 148.5], [58, 148.5], [58, 170]]),
    route([[112, 130], [136, 130]]),
  ];

  return {
    ground: G.ground,
    filler: sorted(G.solids),
    routes,
    zones: { A: planZone(), B: buildZone(), C: operateZone() },
    turbines,
  };
}

/** Screen-space box of a plot (at camera scale 1), allowing for its height. */
export function plotBounds(r: Zone["rect"], height = 9) {
  const xs = [iso(r.x, r.y + r.d)[0], iso(r.x + r.w, r.y)[0]];
  const top = iso(r.x, r.y, height)[1];
  const bottom = iso(r.x + r.w, r.y + r.d)[1];
  return { cx: (xs[0] + xs[1]) / 2, cy: (top + bottom) / 2, w: xs[1] - xs[0], h: bottom - top };
}
