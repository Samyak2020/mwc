"use client";

import { Scene } from "@/components/nav/iso";
import { MinimalScene, at, siteMarks, type SceneData } from "./MinimalScene";
import { drawPlant } from "./PowerScene";

// Power Producers hero: the menu's power plant alone on its plot, with faint
// turbines behind, a line running out across the bottom and a few trees.

function build(): SceneData {
  const s = drawPlant(new Scene(), { trees: false });
  const marks = siteMarks(s);
  const far = new Scene();
  const near = new Scene();
  const rotors: SceneData["rotors"] = [];
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
  // motion: current from the transformers through the gantry and out along
  // the line; steam rising off both cooling towers
  const fl = new Scene();
  fl.wire([28, 66, 40], [48, 98, 46], 2).wire([44, 66, 40], [60, 98, 46], 2).wire([60, 66, 40], [72, 98, 46], 2);
  const flows = fl.shapes.map((sh) => ({ d: sh.d }));
  const out = new Scene();
  let from: [number, number, number] = [60, 98, 46];
  for (const [tx, ty] of [[-40, 198], [-140, 298], [-240, 398]]) {
    for (const k of [-12, 12]) out.wire([from[0] + k, from[1], from[2]], [tx + k, ty, 50], 4);
    from = [tx, ty, 50];
  }
  flows.push(...out.shapes.map((sh) => ({ d: sh.d, faint: true })));
  const puffs: [number, number][] = [s.p([6, -82, 82]), s.p([72, -78, 82])];
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors, motion: { flows, puffs } };
}
let cached: SceneData | null = null;

export function PowerSceneMinimal({ className = "" }: { className?: string }) {
  return <MinimalScene data={(cached ??= build())} className={className} />;
}
