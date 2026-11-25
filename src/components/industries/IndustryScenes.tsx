"use client";

import { Scene } from "@/components/nav/iso";
import { commercial, government, oil } from "@/components/nav/IndustryGraphic";
import { MinimalScene, at, bushes, pluck, siteMarks, type SceneData } from "./MinimalScene";

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
  bushes(far, near, [[-250, -170], [220, -210], [-340, 90], [-90, 200], [200, 240]]);
  // the county building the board meets in, far off to the right of the reservoir:
  // a colonnade under a pediment, steps in front
  {
    const [x, y] = at(330, -250);
    far.box(x, y, 0, 44, 26, 3).box(x + 2, y + 2, 3, 40, 22, 16);
    for (let k = 0; k < 6; k++) far.line([[x + 5 + k * 7, y + 24, 3], [x + 5 + k * 7, y + 24, 19]], "faint");
    far.gable(x + 2, y + 2, 19, 40, 22, 7);
  }
  // motion: water pouring down the spillway chute and the penstocks, running
  // on down the river; current leaving the powerhouse along the line
  const w = new GroundScene();
  for (const x of [-12, -6, 0, 6, 12, 18]) w.line([[x, -20, 67], [x, 10, 6], [x + 1, 24, 6]], "accent");
  for (const x of [56, 70]) w.line([[x, -20, 62], [x, 12, 14]], "accent");
  const river = new GroundScene();
  river.line([[-6, 12, 5.6], [-6, 60, 5.6], [-4, 108, 5.6]]).line([[12, 12, 5.6], [16, 60, 5.6], [12, 108, 5.6]]);
  const riverOn = new Scene();
  riverOn.line([[-4, 112, 0.4], [0, 200, 0.4], [-14, 318, 0.4]]).line([[12, 112, 0.4], [16, 200, 0.4], [0, 318, 0.4]]);
  const cur = new GroundScene();
  cur.wire([60, 38, 25], [70, 84, 58], 3).wire([76, 38, 25], [86, 84, 58], 3);
  const curOn = new Scene();
  let from: [number, number, number] = [78, 84, 53];
  for (const [tx, ty] of [[110, 200], [140, 320]]) {
    for (const k of [-8, 8]) curOn.wire([from[0] + k, from[1], from[2]], [tx + k, ty, 56], 4);
    from = [tx, ty, 56];
  }
  const flows = [
    ...w.shapes.map((sh) => ({ d: sh.d })),
    ...river.shapes.map((sh) => ({ d: sh.d, slow: true })),
    ...riverOn.shapes.map((sh) => ({ d: sh.d, slow: true, faint: true })),
    ...cur.shapes.map((sh) => ({ d: sh.d })),
    ...curOn.shapes.map((sh) => ({ d: sh.d, faint: true })),
  ];
  return { marks, shapes: s.shapes, far: far.shapes, near: near.shapes, rotors: [], motion: { flows } };
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
  bushes(far, near, [[-230, -160], [60, -320], [380, -140], [-340, 120], [-200, 240]]);
  // another job going up across town: a second tower crane over a frame
  {
    const [x, y] = at(-250, -300);
    far.box(x - 20, y - 6, 0, 30, 30, 26);
    far.lattice(x + 18, y, 0, 3, 3, 64, 3);
    far.line([[x + 18, y, 66], [x - 22, y + 40, 66]]).line([[x + 18, y, 66], [x + 32, y - 14, 66]]);
    far.line([[x + 18, y, 66], [x + 18, y, 74]]).line([[x - 22, y + 40, 66], [x + 18, y, 74], [x + 32, y - 14, 66]], "faint");
  }
  // motion: the hook and its load come off the drawing and move on their own
  const hook = new GroundScene();
  hook.line([[-56, 24, 124], [-56, 24, 102]], "accent");
  const load = new GroundScene();
  load.box(-64, 18, 94, 16, 12, 6, true);
  const { rest } = pluck(s.shapes, [...hook.shapes, ...load.shapes]);
  return {
    marks,
    shapes: rest,
    far: far.shapes,
    near: near.shapes,
    rotors: [],
    motion: { lift: { top: hook.p([-56, 24, 124]), bottom: hook.p([-56, 24, 102]), load: load.shapes, travel: 16 } },
  };
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
  bushes(far, near, [[-240, -190], [140, -320], [380, -160], [-330, 110], [-100, 230]]);
  // more of the field: two small pumpjacks off the plot, back left
  for (const [u, v] of [[-300, -260], [-120, -330]] as const) {
    const [x, y] = at(u, v);
    far.box(x - 20, y - 3, 0, 40, 6, 2);
    far.line([[x, y - 2, 2], [x, y, 18], [x, y + 2, 2]]);
    far.line([[x - 18, y, 20], [x + 16, y, 16]]);
    far.line([[x + 16, y, 16], [x + 17, y, 6]], "faint");
  }
  // motion: the pumpjack beam and horsehead rock on the samson post, the flare
  // burns, and oil runs from the wellhead back to the tanks
  const m = 1.3;
  const oy = 64;
  const L = ([x, y, z]: [number, number, number]): [number, number, number] => [x * m, oy + y * m, 5 + z * m];
  const beam = new GroundScene();
  beam.poly([L([-44, 4, 54]), L([44, 4, 48]), L([44, 4, 42]), L([-44, 4, 48])], "left");
  beam.poly([L([-44, -2, 54]), L([44, -2, 48]), L([44, 4, 48]), L([-44, 4, 54])], "top");
  beam.poly([L([42, 4, 56]), L([54, 4, 48]), L([52, 4, 30]), L([46, 4, 24]), L([44, 4, 30]), L([48, 4, 44]), L([40, 4, 50])], "right");
  const flame = s.shapes.filter((sh) => sh.tone === "warm");
  const { rest } = pluck(s.shapes, [...beam.shapes, ...flame]);
  const pipe = new GroundScene();
  pipe.line([[62, 52, 16], [62, -18, 16], [-44, -18, 16]]).line([[56, 52, 12], [56, -12, 12], [-44, -12, 12]]);
  const pipeOn = new Scene();
  pipeOn.line([[62, 420, 11], [62, 110, 11]]).line([[56, 420, 7], [56, 110, 7]]);
  return {
    marks,
    shapes: rest,
    far: far.shapes,
    near: near.shapes,
    rotors: [],
    motion: {
      rock: { shapes: beam.shapes, pivot: beam.p(L([2, 0, 52])), angle: 7 },
      flame,
      flows: [...pipe.shapes.map((sh) => ({ d: sh.d, slow: true })), ...pipeOn.shapes.map((sh) => ({ d: sh.d, slow: true, faint: true }))],
    },
  };
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
