"use client";

// A blueprint sheet lying flat on the ground under an isometric drawing, so
// the structure reads as being built on its own plans: a blue sheet with an
// inset border, a floor plan (double-line walls, door swings, a tiled room),
// dimension lines and a title block in the corner. Kept quiet: the sheet is a
// muted blue and its lines are faint, so the structure on top leads.

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const f = (n: number) => Math.round(n * 10) / 10;

type P2 = [number, number];
type Variant = { flipX?: boolean; flipY?: boolean };

const variants: Variant[] = [{}, { flipX: true }, { flipY: true }, { flipX: true, flipY: true }, {}];

// sheet and plan, in plan units (× scale = world units on the ground)
const SHEET = { x0: -125, y0: -95, x1: 125, y1: 95 };

export function Blueprint({
  ox,
  oy,
  scale = 1,
  variant = 0,
  z = 0,
  sheet = SHEET,
  ink = "rgb(120 180 240)",
  paper = "rgb(22 70 150)",
  paperOpacity = 0.22,
}: {
  /** screen position of the world origin (the Scene's ox, oy) */
  ox: number;
  oy: number;
  /** world units per plan unit */
  scale?: number;
  variant?: number;
  /** height of the ground the sheet lies on */
  z?: number;
  /** sheet extents in plan units; make it large to fill the whole frame */
  sheet?: { x0: number; y0: number; x1: number; y1: number };
  /** line colour, sheet colour and sheet strength (defaults: night drawings) */
  ink?: string;
  paper?: string;
  paperOpacity?: number;
}) {
  const v = variants[variant % variants.length];
  const p = ([a, b]: P2): P2 => {
    const x = (v.flipX ? -a : a) * scale;
    const y = (v.flipY ? -b : b) * scale;
    return [ox + (x - y) * C, oy + (x + y) * S - z];
  };
  const pt = (q: P2) => p(q).map(f).join(" ");
  const line = (...qs: P2[]) => `M${qs.map(pt).join(" L")}`;
  const rect = (x0: number, y0: number, x1: number, y1: number) => line([x0, y0], [x1, y0], [x1, y1], [x0, y1]) + " Z";
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 8) => {
    const qs: P2[] = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      qs.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return line(...qs);
  };

  const { x0, y0, x1, y1 } = sheet;
  const big = x1 - x0 > 300;

  // faint drafting grid inside the border
  const grid: string[] = [];
  for (let x = x0 + 15; x < x1 - 9; x += 10) grid.push(line([x, y0 + 9], [x, y1 - 9]));
  for (let y = y0 + 15; y < y1 - 9; y += 10) grid.push(line([x0 + 9, y], [x1 - 9, y]));

  // floor plan: rooms as double walls
  const rooms: [number, number, number, number][] = [
    [-105, -78, -30, -20],
    [-30, -78, 40, -30],
    [40, -78, 105, -10],
    [-105, -20, -50, 62],
    [-50, -30, 30, 62],
    [30, -10, 105, 62],
  ];
  // a large sheet carries more of the plan out to its edges
  if (big)
    rooms.push(
      [-175, -175, -110, -90],
      [-100, -175, 20, -95],
      [30, -175, 175, -95],
      [115, -85, 175, 40],
      [115, 50, 175, 175],
      [-20, 75, 105, 175],
      [-175, 75, -30, 175],
      [-175, -80, -115, 65],
    );
  const walls: string[] = [];
  for (const [a, b, c, d] of rooms) walls.push(rect(a, b, c, d), rect(a + 2.5, b + 2.5, c - 2.5, d - 2.5));

  const detail: string[] = [
    // door leaves and swings
    line([-30, -50], [-16, -50]) + arc(-30, -50, 14, 0, Math.PI / 2),
    line([40, -45], [54, -45]) + arc(40, -45, 14, 0, Math.PI / 2),
    line([-50, 20], [-36, 20]) + arc(-50, 20, 14, 0, -Math.PI / 2),
    line([30, 30], [44, 30]) + arc(30, 30, 14, 0, Math.PI / 2),
    line([-80, -20], [-80, -6]) + arc(-80, -20, 14, 0, Math.PI / 2),
    // windows on the outer walls
    line([-90, 62], [-65, 62]),
    line([50, 62], [85, 62]),
    line([105, -60], [105, -30]),
  ];
  // tiled room and a stair run
  const fine: string[] = [];
  for (let x = 45; x <= 100; x += 4) fine.push(line([x, -73], [x, -15]));
  for (let y = -73; y <= -15; y += 4) fine.push(line([45, y], [100, y]));
  for (let y = -15; y <= 57; y += 5) fine.push(line([-100, y], [-80, y]));

  // dimension lines in the margins, with 45° ticks
  const dims: string[] = [];
  const labels: { at: P2; t: string; vertical?: boolean }[] = [];
  const dim = (a: P2, b: P2, label: string, vertical = false) => {
    dims.push(line(a, b));
    for (const [x, y] of [a, b]) dims.push(line([x - 2, y + 2], [x + 2, y - 2]));
    labels.push({ at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t: label, vertical });
  };
  dim([-105, -86], [105, -86], "21.00");
  dim([-114, -78], [-114, 62], "14.00", true);
  dim([-105, 70], [-30, 70], "7.50");

  // title block, bottom-right corner
  const tb = [
    rect(x1 - 55, y1 - 23, x1 - 5, y1 - 5),
    line([x1 - 55, y1 - 14], [x1 - 5, y1 - 14]),
    line([x1 - 30, y1 - 14], [x1 - 30, y1 - 5]),
  ];

  // text lying on the ground plane, never mirrored
  const ground = (q: P2, vertical?: boolean) => {
    const [tx, ty] = p(q);
    const map = ([a, b]: P2): P2 => {
      const x = (v.flipX ? -a : a) * scale;
      const y = (v.flipY ? -b : b) * scale;
      return [(x - y) * C, (x + y) * S];
    };
    let ex = map(vertical ? [0, 1] : [1, 0]);
    let ey = map(vertical ? [-1, 0] : [0, 1]);
    if (ex[0] < 0) {
      ex = [-ex[0], -ex[1]];
      ey = [-ey[0], -ey[1]];
    }
    if (ex[0] * ey[1] - ex[1] * ey[0] < 0) ey = [-ey[0], -ey[1]];
    const r = (n: number) => Math.round(n * 1000) / 1000;
    return `matrix(${r(ex[0])} ${r(ex[1])} ${r(ey[0])} ${r(ey[1])} ${f(tx)} ${f(ty)})`;
  };

  return (
    <g aria-hidden strokeLinecap="round" strokeLinejoin="round">
      {/* the sheet */}
      <path d={rect(x0, y0, x1, y1)} fill={paper} fillOpacity={paperOpacity} stroke={ink} strokeOpacity={0.3} strokeWidth={0.8} />
      <g fill="none" stroke={ink}>
        <path d={grid.join("")} strokeOpacity={0.05} strokeWidth={0.5} />
        <path d={rect(x0 + 7, y0 + 7, x1 - 7, y1 - 7) + rect(x0 + 9, y0 + 9, x1 - 9, y1 - 9)} strokeOpacity={0.2} strokeWidth={0.6} />
        <path d={fine.join("")} strokeOpacity={0.08} strokeWidth={0.5} />
        <path d={walls.join("")} strokeOpacity={0.24} strokeWidth={0.7} />
        <path d={detail.join("")} strokeOpacity={0.18} strokeWidth={0.6} />
        <path d={dims.join("")} strokeOpacity={0.18} strokeWidth={0.5} />
        <path d={tb.join("")} strokeOpacity={0.22} strokeWidth={0.6} />
      </g>
      <g fill={ink} fillOpacity={0.3} fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fontSize={4.5} textAnchor="middle">
        {labels.map((l, i) => (
          <text key={i} transform={ground(l.at, l.vertical)} dy={-1.5}>
            {l.t}
          </text>
        ))}
      </g>
    </g>
  );
}
