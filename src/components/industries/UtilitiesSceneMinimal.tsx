"use client";

import { Scene } from "@/components/nav/iso";
import { MinimalScene, at, siteMarks, type SceneData } from "./MinimalScene";

// Utilities hero: the Industries-menu utilities drawing at hero detail, on
// its plot. Water tower back left, a transmission line crossing the site from
// back to front, a fenced substation with its transformers and gantry, and
// the houses the network serves. Faint company: the line carrying on off the
// plot, a street of houses beyond it, a few trees.

/** the menu's utilities drawing, at hero detail, on a 220 × 220 plot */
export function drawUtilities(s: Scene) {
  // water tower: four raked legs with cross bracing, tank with bands, cap
  const legs: [number, number][] = [
    [-10, -10],
    [10, -10],
    [-10, 10],
    [10, 10],
  ];
  for (const [dx, dy] of legs) s.line([[-80 + dx, -72 + dy, 0], [-80 + dx * 0.6, -72 + dy * 0.6, 46]]);
  for (const z of [16, 32]) {
    const k = 1 - (z / 46) * 0.4;
    s.line([[-80 - 10 * k, -72 + 10 * k, z], [-80 + 10 * k, -72 + 10 * k, z], [-80 + 10 * k, -72 - 10 * k, z]], "faint");
  }
  s.cyl(-80, -72, 46, 17, 22).band(-80, -72, 56, 17, "accent").dome(-80, -72, 68, 17, 7);
  s.line([[-80, -72, 75], [-80, -72, 80]]);

  // transmission tower, back
  s.lattice(40, -78, 0, 9, 3, 92, 4);
  s.line([[12, -78, 76], [68, -78, 76]]).line([[16, -78, 88], [64, -78, 88]]);

  // substation: fenced yard, two transformers with bushings, gantry
  s.poly([[-92, 0, 0], [-22, 0, 0], [-22, 70, 0], [-92, 70, 0]], "none", "faint");
  for (const x of [-92, -80, -69, -57, -45, -33, -22]) s.line([[x, 70, 0], [x, 70, 9]], "faint");
  for (const y of [0, 12, 23, 35, 47, 58, 70]) s.line([[-22, y, 0], [-22, y, 9]], "faint");
  s.line([[-92, 70, 9], [-22, 70, 9], [-22, 0, 9]]);
  for (const x of [-82, -54]) {
    s.box(x, 12, 0, 20, 16, 16, true);
    for (let k = 3; k < 16; k += 4) s.line([[x + 20, 12 + k, 3], [x + 20, 12 + k, 12]], "faint");
    for (const bx of [5, 10, 15]) s.line([[x + bx, 20, 16], [x + bx, 20, 22]], "accent");
  }
  s.line([[-86, 46, 0], [-86, 46, 34]]).line([[-30, 46, 0], [-30, 46, 34]]).line([[-90, 46, 34], [-26, 46, 34]]);
  s.line([[-90, 46, 28], [-26, 46, 28]], "faint");

  // transmission tower, front, and the conductors between
  s.lattice(40, 46, 0, 9, 3, 92, 4);
  s.line([[12, 46, 76], [68, 46, 76]]).line([[16, 46, 88], [64, 46, 88]]);
  for (const x of [12, 68]) s.wire([x, -78, 76], [x, 46, 76], 7);
  for (const x of [16, 64]) s.wire([x, -78, 88], [x, 46, 88], 6);
  s.wire([-26, 46, 34], [12, 46, 76], 3);

  // houses served by the network, front right: windows and a door each
  for (const y of [26, 74]) {
    s.box(70, y, 0, 24, 18, 12).gable(70, y, 12, 24, 18, 8);
    s.line([[76, y + 18, 4], [76, y + 18, 8]], "faint").line([[84, y + 18, 4], [84, y + 18, 8]], "faint");
    s.line([[94, y + 6, 0], [94, y + 6, 7]], "faint");
  }
  // service drop to the houses
  s.line([[100, 52, 0], [100, 52, 30]]);
  s.wire([64, 46, 76], [100, 52, 30], 4).wire([100, 52, 30], [94, 35, 14], 2).wire([100, 52, 30], [94, 83, 14], 2);
  return s;
}

function build(): SceneData {
  const s = drawUtilities(new Scene());
  const marks = siteMarks(s);
  const far = new Scene();
  const near = new Scene();
  // the line carries on off the plot: towers behind, back-left
  let prev: [number, number, number] = [40, -78, 76];
  for (const [tx, ty] of [[40, -230], [40, -380]]) {
    far.lattice(tx, ty, 0, 9, 3, 92, 4).line([[tx - 28, ty, 76], [tx + 28, ty, 76]]);
    for (const k of [-28, 28]) far.wire([prev[0] + k, prev[1], prev[2]], [tx + k, ty, 76], 7);
    prev = [tx, ty, 76];
  }
  // and on in front, toward the viewer
  prev = [40, 46, 76];
  for (const [tx, ty] of [[40, 200], [40, 350]]) {
    near.lattice(tx, ty, 0, 9, 3, 92, 4).line([[tx - 28, ty, 76], [tx + 28, ty, 76]]);
    for (const k of [-28, 28]) near.wire([prev[0] + k, prev[1], prev[2]], [tx + k, ty, 76], 7);
    prev = [tx, ty, 76];
  }
  // a street of houses beyond the plot, behind it to the right
  for (const [u, v] of [[170, -300], [230, -270], [290, -240], [350, -210], [410, -180]] as const) {
    const [x, y] = at(u, v);
    far.box(x, y, 0, 22, 16, 11).gable(x, y, 11, 22, 16, 7);
  }
  for (const [u, v] of [[-300, -180], [-150, -260], [220, -250], [360, -120], [-420, 60], [-120, 200], [-260, 230]] as const) {
    const [x, y] = at(u, v);
    (v < 0 ? far : near).tree(x, y, 0, 0.9);
  }
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors: [] };
}
let cached: SceneData | null = null;

export function UtilitiesSceneMinimal({ className = "" }: { className?: string }) {
  return <MinimalScene data={(cached ??= build())} className={className} />;
}
