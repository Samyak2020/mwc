"use client";

import { Scene } from "@/components/nav/iso";
import { commercial, government, oil } from "@/components/nav/IndustryGraphic";
import { MinimalScene, at, siteMarks, type SceneData } from "./MinimalScene";

// Hero drawings for Government, Commercial and Oil and Gas: each is the
// industry's Industries-menu drawing, redrawn on a ground-only scene (no
// plate, no trees, set down onto the ground) so it stands on its marked plot
// like the Power Producers and Utilities heroes. Each gets a little faint
// company of its own around the plot.

/** a scene without plates or trees, set 5 units lower (the menu drawings
 *  stand on a 5-unit plate) */
class GroundScene extends Scene {
  p([x, y, z]: [number, number, number]): [number, number] {
    return super.p([x, y, z - 5]);
  }
  plate() {
    return this;
  }
  grove() {
    return this;
  }
  tree() {
    return this;
  }
  bush() {
    return this;
  }
}

function trees(far: Scene, near: Scene, spots: readonly (readonly [number, number])[]) {
  for (const [u, v] of spots) {
    const [x, y] = at(u, v);
    (v < 0 ? far : near).tree(x, y, 0, 0.9);
  }
}

function governmentData(): SceneData {
  const s = new GroundScene();
  government(s);
  const marks = siteMarks(s);
  const far = new Scene();
  const near = new Scene();
  // the river carries on past the plot, out toward the viewer
  near.poly([[-20, 110, 0.3], [24, 110, 0.3], [30, 200, 0.3], [10, 320, 0.3], [-40, 320, 0.3], [-30, 200, 0.3]], "water", "accent");
  // the line out keeps going: towers on the right bank
  let prev: [number, number, number] = [78, 84, 53];
  for (const [tx, ty] of [[110, 200], [140, 320]]) {
    near.lattice(tx, ty, 0, 6, 2, 56, 3).line([[tx - 12, ty, 56], [tx + 12, ty, 56]]);
    for (const k of [-8, 8]) near.wire([prev[0] + k, prev[1], prev[2]], [tx + k, ty, 56], 4);
    prev = [tx, ty, 56];
  }
  trees(far, near, [[-300, -120], [-200, -230], [140, -260], [300, -150], [-380, 40], [-160, 170], [-300, 200]]);
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors: [] };
}

function commercialData(): SceneData {
  const s = new GroundScene();
  commercial(s);
  const marks = siteMarks(s);
  const far = new Scene();
  const near = new Scene();
  // a second factory shed and a yard beyond the plot
  for (const [u, v] of [[220, -260], [320, -210]] as const) {
    const [x, y] = at(u, v);
    far.box(x, y, 0, 60, 34, 18);
    for (let i = 0; i < 3; i++) far.gable(x + i * 20, y, 18, 20, 34, 7);
  }
  // delivery trucks on the road in front
  for (const [u, v] of [[-160, 200], [-60, 250]] as const) {
    const [x, y] = at(u, v);
    near.box(x, y, 0, 16, 7, 7).box(x + 16, y, 0, 6, 7, 5);
  }
  trees(far, near, [[-300, -120], [-160, -250], [120, -290], [-400, 40], [-260, 180], [-120, 120]]);
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors: [] };
}

function oilData(): SceneData {
  const s = new GroundScene();
  oil(s);
  const marks = siteMarks(s);
  const far = new Scene();
  const near = new Scene();
  // a tank farm beyond the plot
  for (const [u, v, r] of [[180, -280, 22], [250, -250, 18], [320, -220, 22]] as const) {
    const [x, y] = at(u, v);
    far.cyl(x, y, 0, r, 26, "left", "top").dome(x, y, 26, r, 4);
  }
  // the pipeline carries on off the plot, on its supports
  const ys = [200, 300, 400];
  for (const y of ys) near.line([[62, y, 0], [62, y, 11]]);
  near.line([[62, 110, 11], [62, 420, 11]]).line([[56, 110, 7], [56, 420, 7]]);
  // a second pumpjack base, faint, left
  const [px, py] = at(-280, 60);
  near.box(px, py, 0, 60, 10, 3).box(px + 20, py + 2, 3, 6, 6, 30);
  trees(far, near, [[-300, -150], [-140, -260], [60, -300], [-400, 0], [-180, 190]]);
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors: [] };
}

const cache = new Map<string, SceneData>();
const get = (k: string, build: () => SceneData) => cache.get(k) ?? (cache.set(k, build()), cache.get(k)!);

export function GovernmentSceneMinimal({ className = "" }: { className?: string }) {
  return <MinimalScene data={get("government", governmentData)} className={className} />;
}
export function CommercialSceneMinimal({ className = "" }: { className?: string }) {
  return <MinimalScene data={get("commercial", commercialData)} className={className} />;
}
export function OilSceneMinimal({ className = "" }: { className?: string }) {
  return <MinimalScene data={get("oil", oilData)} className={className} />;
}
