// Tiny isometric line-art kit for the nav's industry graphics (same drawing
// language as the field journey: hairline ink on paper, flat face tones, sky
// accents). World units: x runs to the lower right, y to the lower left, z up.
// A Scene collects shapes in painter's order (call primitives back to front);
// each primitive gets a build step `at`, which the renderer turns into a delay
// so the graphic is drawn from the ground up.

const C = Math.cos(Math.PI / 6); // 0.866
const S = 0.5;
const K = C * Math.SQRT2; // screen half-width of a ground circle of radius 1
const KY = S * Math.SQRT2; // screen half-height of the same circle

export type Tone = "top" | "left" | "right" | "inner" | "accent" | "warm" | "tree" | "water" | "none";
export type Shape = { d: string; tone: Tone; at: number; stroke?: "ink" | "faint" | "accent" | "warm" | "soft" };
type V3 = [number, number, number];

const f = (n: number) => Math.round(n * 10) / 10;

export class Scene {
  shapes: Shape[] = [];
  step = 0;
  constructor(
    private ox = 240,
    private oy = 190,
  ) {}

  p([x, y, z]: V3): [number, number] {
    return [this.ox + (x - y) * C, this.oy + (x + y) * S - z];
  }
  pt(v: V3) {
    const [a, b] = this.p(v);
    return `${f(a)} ${f(b)}`;
  }
  /** start the next build step (shapes added after this appear later) */
  next() {
    this.step++;
    return this;
  }
  add(d: string, tone: Tone, stroke: Shape["stroke"] = "ink") {
    this.shapes.push({ d, tone, at: this.step, stroke });
    return this;
  }

  poly(pts: V3[], tone: Tone, stroke: Shape["stroke"] = "ink") {
    return this.add(`M${pts.map((v) => this.pt(v)).join(" L")} Z`, tone, stroke);
  }
  line(pts: V3[], stroke: Shape["stroke"] = "ink") {
    return this.add(`M${pts.map((v) => this.pt(v)).join(" L")}`, "none", stroke);
  }

  /** axis-aligned box: top, front (+y) and right (+x) faces */
  box(x: number, y: number, z: number, w: number, d: number, h: number, accent = false) {
    const t = z + h;
    this.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], accent ? "accent" : "left");
    this.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], accent ? "accent" : "right");
    this.poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]], accent ? "accent" : "top");
    return this;
  }

  /** ground plate with a faint survey grid */
  plate(x0: number, y0: number, x1: number, y1: number, h: number, grid = 40) {
    this.box(x0, y0, 0, x1 - x0, y1 - y0, h);
    for (let x = x0 + grid; x < x1; x += grid) this.line([[x, y0, h], [x, y1, h]], "faint");
    for (let y = y0 + grid; y < y1; y += grid) this.line([[x0, y, h], [x1, y, h]], "faint");
    return this;
  }

  private ell(cx: number, cy: number, rx: number, ry: number) {
    return `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)} Z`;
  }

  /** vertical cylinder standing on z */
  cyl(x: number, y: number, z: number, r: number, h: number, tone: Tone = "left", topTone: Tone = "top") {
    const [cx, yb] = this.p([x, y, z]);
    const yt = yb - h;
    const rx = r * K;
    const ry = r * KY;
    this.add(
      `M${f(cx - rx)} ${f(yt)} L${f(cx - rx)} ${f(yb)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yb)} L${f(cx + rx)} ${f(yt)} Z`,
      tone,
    );
    this.add(this.ell(cx, yt, rx, ry), topTone);
    return this;
  }

  /** a ring drawn on a cylinder (front half only) */
  band(x: number, y: number, z: number, r: number, stroke: Shape["stroke"] = "ink") {
    const [cx, cy] = this.p([x, y, z]);
    const rx = r * K;
    return this.add(`M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(r * KY)} 0 0 0 ${f(cx + rx)} ${f(cy)}`, "none", stroke);
  }

  /** hyperbolic cooling tower */
  coolingTower(x: number, y: number, z: number, R: number, waist: number, top: number, h: number) {
    const [cx, yb] = this.p([x, y, z]);
    const yt = yb - h;
    const [bR, wR, tR] = [R * K, waist * K, top * K];
    this.add(
      `M${f(cx - bR)} ${f(yb)} A${f(bR)} ${f(R * KY)} 0 0 0 ${f(cx + bR)} ${f(yb)}` +
        ` C${f(cx + wR)} ${f(yb - h * 0.55)} ${f(cx + wR)} ${f(yt + h * 0.2)} ${f(cx + tR)} ${f(yt)}` +
        ` A${f(tR)} ${f(top * KY)} 0 0 0 ${f(cx - tR)} ${f(yt)}` +
        ` C${f(cx - wR)} ${f(yt + h * 0.2)} ${f(cx - wR)} ${f(yb - h * 0.55)} ${f(cx - bR)} ${f(yb)} Z`,
      "left",
    );
    this.add(this.ell(cx, yt, tR, top * KY), "inner");
    return this;
  }

  /** dome sitting on z (half ellipsoid) */
  dome(x: number, y: number, z: number, r: number, hd: number, tone: Tone = "top") {
    const [cx, cy] = this.p([x, y, z]);
    const rx = r * K;
    const ry = r * KY;
    this.add(
      `M${f(cx - rx)} ${f(cy)} C${f(cx - rx)} ${f(cy - hd * 1.33)} ${f(cx + rx)} ${f(cy - hd * 1.33)} ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)} Z`,
      tone,
    );
    return this;
  }

  /** gable roof prism, ridge along y, front gable facing +y */
  gable(x: number, y: number, z: number, w: number, d: number, hr: number) {
    const m = x + w / 2;
    const t = z + hr;
    this.poly([[x, y, z], [m, y, t], [m, y + d, t], [x, y + d, z]], "top");
    this.poly([[m, y, t], [x + w, y, z], [x + w, y + d, z], [m, y + d, t]], "right");
    this.poly([[x, y + d, z], [x + w, y + d, z], [m, y + d, t]], "left");
    return this;
  }

  /** catenary-ish wire between two points */
  wire(a: V3, b: V3, sag: number) {
    const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 - sag * 2];
    return this.add(`M${this.pt(a)} Q${this.pt(mid)} ${this.pt(b)}`, "none", "accent");
  }

  /** square lattice mast/pylon: legs taper from half-width b to t */
  lattice(x: number, y: number, z: number, b: number, t: number, h: number, bays: number) {
    const corner = (sx: number, sy: number, k: number): V3 => {
      const hw = b + (t - b) * k;
      return [x + sx * hw, y + sy * hw, z + h * k];
    };
    // back legs first, then the two visible faces with their bracing
    this.line([corner(-1, -1, 0), corner(-1, -1, 1)]);
    for (const [sx, sy] of [
      [1, -1],
      [-1, 1],
      [1, 1],
    ] as const)
      this.line([corner(sx, sy, 0), corner(sx, sy, 1)]);
    for (let i = 0; i < bays; i++) {
      const k0 = i / bays;
      const k1 = (i + 1) / bays;
      // +x face and +y face zig-zags
      this.line([corner(1, -1, k0), corner(1, 1, k1)]);
      this.line([corner(1, 1, k0), corner(1, -1, k1)]);
      this.line([corner(-1, 1, k0), corner(1, 1, k1)]);
      this.line([corner(1, 1, k0), corner(-1, 1, k1)]);
    }
    return this;
  }

  /** small conifer standing at (x, y, z): trunk and two stacked triangles,
   *  drawn upright in screen space like the field journey's trees */
  tree(x: number, y: number, z: number, s = 1) {
    const [sx, sy] = this.p([x, y, z]);
    const tri = (half: number, base: number, top: number) =>
      `M${f(sx - half * s)} ${f(sy - base * s)} L${f(sx)} ${f(sy - top * s)} L${f(sx + half * s)} ${f(sy - base * s)} Z`;
    this.add(`M${f(sx)} ${f(sy)} L${f(sx)} ${f(sy - 2.5 * s)}`, "none", "soft");
    this.add(tri(4.6, 2, 10), "tree", "soft");
    this.add(tri(3.4, 6, 14.5), "tree", "soft");
    return this;
  }

  /** low rounded bush at (x, y, z) */
  bush(x: number, y: number, z: number, s = 1) {
    const [sx, sy] = this.p([x, y, z]);
    const r = 4 * s;
    return this.add(
      `M${f(sx - r)} ${f(sy)} C${f(sx - r)} ${f(sy - r * 1.1)} ${f(sx - r * 0.1)} ${f(sy - r * 1.3)} ${f(sx + r * 0.15)} ${f(sy - r * 0.9)}` +
        ` C${f(sx + r * 0.5)} ${f(sy - r * 1.2)} ${f(sx + r)} ${f(sy - r * 0.8)} ${f(sx + r)} ${f(sy)} Z`,
      "tree",
      "soft",
    );
  }

  /** a loose clump of trees and bushes around (cx, cy), back to front;
   *  seeded so the same scene always grows the same way */
  grove(cx: number, cy: number, n: number, spread: number, seed: number, z = 5) {
    let st = seed;
    const rnd = () => (st = (st * 16807) % 2147483647) / 2147483647;
    const spots = Array.from({ length: n }, () => ({
      x: cx + (rnd() - 0.5) * spread,
      y: cy + (rnd() - 0.5) * spread,
      s: 0.95 + rnd() * 0.55,
      bush: rnd() < 0.3,
    })).sort((a, b) => a.x + a.y - (b.x + b.y));
    for (const t of spots) {
      if (t.bush) this.bush(t.x, t.y, z, t.s);
      else this.tree(t.x, t.y, z, t.s);
    }
    return this;
  }

  /** a vertical circle in the plane y = const (crank discs, wheels) */
  discXZ(x: number, y: number, z: number, r: number, tone: Tone = "right") {
    const pts: V3[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      pts.push([x + r * Math.cos(a), y, z + r * Math.sin(a)]);
    }
    return this.poly(pts, tone);
  }
}
