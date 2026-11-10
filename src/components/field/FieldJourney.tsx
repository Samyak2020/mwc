"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { workstreams } from "@/components/comp2/Workstreams2";
import { bladePath, buildScene, plotBounds, PLOTS, type Prim, type Scene, type ZoneId } from "@/components/field/scene";
import { duration, ease, fieldJourney } from "@/lib/motion";

// "Project Support Built Around Your Scope" as one isometric site (Figma
// layout 614:4959). The section pins to the screen; the heading stays put,
// the site fills the background, and scrolling flies the camera:
//
//   overview → 1 Plan and Develop → 2 Build and Commission
//            → 3 Operate and Maintain → overview, where the plant is
//              partly dismantled (4 Decommission)
//
// Only the camera transform, a few opacities and CSS variables change per
// frame; the drawing itself is static SVG generated once by scene.ts.

const ORDER: ZoneId[] = ["A", "B", "C"]; // journey order (stage 4 is the overview)
// painter's order of the plots themselves: far → near
const DRAW_ORDER: ZoneId[] = ["A", "C", "B"];

type View = { cx: number; cy: number; s: number; ax: number; ay: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Camera views for the current viewport. */
function makeViews(vw: number, vh: number): Record<ZoneId | "O", View> {
  const desktop = vw >= 1024;
  const u = Math.min(vw, 1440) / 1440;
  const zone = (id: ZoneId): View => {
    const b = plotBounds(PLOTS[id]);
    return desktop
      ? // centred in the gap between the two text columns
        { cx: b.cx, cy: b.cy, s: Math.min((0.5 * vw) / b.w, (0.62 * vh) / b.h), ax: vw / 2 - 56 * u, ay: vh * 0.57 }
      : { cx: b.cx, cy: b.cy, s: Math.min((0.96 * vw) / b.w, (0.34 * vh) / b.h), ax: vw / 2, ay: vh * 0.37 };
  };
  // Overview: the plant (C) sits mid-screen; plan lands top-right and build
  // bottom-left, clear of the heading and both text columns.
  const c = plotBounds(PLOTS.C);
  let O: View;
  if (desktop) O = { cx: c.cx, cy: c.cy, s: 0.55 * Math.min(vw / 1440, vh / 900), ax: vw / 2 - 16 * u, ay: vh * 0.615 };
  else {
    const a = plotBounds(PLOTS.A);
    const b = plotBounds(PLOTS.B);
    const left = b.cx - b.w / 2;
    const right = a.cx + a.w / 2;
    const top = a.cy - a.h / 2;
    const bottom = b.cy + b.h / 2;
    O = {
      cx: (left + right) / 2,
      cy: (top + bottom) / 2,
      s: Math.min((0.98 * vw) / (right - left), (0.42 * vh) / (bottom - top)),
      ax: vw / 2,
      ay: vh * 0.33,
    };
  }
  return { O, A: zone("A"), B: zone("B"), C: zone("C") };
}

/** Fly from one view to another; `pullBack` dips the zoom mid-flight. */
function blend(a: View, b: View, e: number, pullBack = 0): View {
  let logS = lerp(Math.log(a.s), Math.log(b.s), e);
  if (pullBack) logS += Math.min(0, Math.log(pullBack / Math.sqrt(a.s * b.s))) * Math.sin(Math.PI * e);
  return { cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e), s: Math.exp(logS), ax: lerp(a.ax, b.ax, e), ay: lerp(a.ay, b.ay, e) };
}

function Prims({ list }: { list: Prim[] }) {
  return (
    <>
      {list.map((p, i) => {
        const rm = p.rm
          ? { "data-rm": "", style: { "--dl": p.rm.dl, "--lift": p.rm.lift } as React.CSSProperties }
          : undefined;
        if (p.t !== undefined)
          return (
            <text key={i} className={p.c} x={p.m ? undefined : p.x} y={p.m ? undefined : p.y} transform={p.m} {...rm}>
              {p.t}
            </text>
          );
        return <path key={i} d={p.d} className={p.c} pathLength={p.c.includes("draw") ? 1 : undefined} {...rm} />;
      })}
    </>
  );
}

// The drawing never re-renders: only refs into it are animated.
const Drawing = memo(function Drawing({ scene }: { scene: Scene }) {
  return (
    <>
      <g>
        <Prims list={scene.ground} />
      </g>
      <g data-routes>
        {scene.routes.map((r, i) => (
          <g key={i} data-route={i}>
            <path d={r.d} className="pwg draw" pathLength={1} />
            <path d={r.d} className="pw draw" pathLength={1} />
            <path d={r.nodes} className="pwn" />
          </g>
        ))}
      </g>
      <g>
        <Prims list={scene.filler} />
        {scene.turbines.map((t, i) => (
          <path key={i} data-blade={i} d={bladePath(t.x, t.y, t.h, t.phase)} className="fl" />
        ))}
      </g>
      {DRAW_ORDER.map((id) => {
        const z = scene.zones[id];
        return (
          <g key={id} data-zone={id}>
            <Prims list={z.ground} />
            <Prims list={z.solids} />
            <g data-accents>
              <Prims list={z.accents} />
            </g>
          </g>
        );
      })}
    </>
  );
});

const stages = workstreams.map((w, i) => ({ n: i + 1, title: w.title, description: w.description, services: w.services }));

/** `light`: the white version (comp 4): light faces, ink/navy lines, white scrims. */
export function FieldJourney({ light = false }: { light?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const camRef = useRef<SVGGElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const scene = useMemo(buildScene, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, fieldJourney.spring);

  useEffect(() => {
    const sticky = stickyRef.current;
    const svg = svgRef.current;
    const cam = camRef.current;
    if (!sticky || !svg || !cam) return;

    const zoneEls = Object.fromEntries(
      ORDER.map((id) => [id, svg.querySelector<SVGGElement>(`[data-zone="${id}"]`)!]),
    ) as Record<ZoneId, SVGGElement>;
    const accentEls = Object.fromEntries(
      ORDER.map((id) => [id, zoneEls[id].querySelector<SVGGElement>("[data-accents]")!]),
    ) as Record<ZoneId, SVGGElement>;
    const routeEls = Array.from(svg.querySelectorAll<SVGGElement>("[data-route]"));
    const bladeEls = Array.from(svg.querySelectorAll<SVGPathElement>("[data-blade]"));

    const { enter, planToBuild, buildToOperate, exit } = fieldJourney.moves;
    const mid = (r: readonly [number, number]) => (r[0] + r[1]) / 2;
    // with reduced motion the camera cuts between the four held views
    const HOLDS = [mid([enter[1], planToBuild[0]]), mid([planToBuild[1], buildToOperate[0]]), mid([buildToOperate[1], exit[0]]), 1];
    const stageAt = (p: number) => (p < mid(planToBuild) ? 0 : p < mid(buildToOperate) ? 1 : p < mid(exit) ? 2 : 3);

    let views = makeViews(sticky.clientWidth, sticky.clientHeight);
    let lastStage = -1;

    const apply = (raw: number) => {
      const st = stageAt(raw);
      if (st !== lastStage) {
        lastStage = st;
        setStage(st);
      }
      const p = reduce ? HOLDS[st] : raw;
      const seg = (r: readonly [number, number]) => easeInOut(clamp01((p - r[0]) / (r[1] - r[0])));
      const e0 = seg(enter);
      const e1 = seg(planToBuild);
      const e2 = seg(buildToOperate);
      const e3 = seg(exit);
      const pull = views.O.s * fieldJourney.midZoom;

      const v =
        p <= enter[1]
          ? blend(views.O, views.A, e0)
          : p <= planToBuild[1]
            ? blend(views.A, views.B, e1, pull)
            : p <= buildToOperate[1]
              ? blend(views.B, views.C, e2, pull)
              : blend(views.C, views.O, e3);
      cam.setAttribute("transform", `translate(${(v.ax - v.cx * v.s).toFixed(2)} ${(v.ay - v.cy * v.s).toFixed(2)}) scale(${v.s.toFixed(4)})`);

      // focus per zone (1 = the camera is on it) and how "overview" we are
      const focus: Record<ZoneId, number> = { A: e0 * (1 - e1), B: e1 * (1 - e2), C: e2 * (1 - e3) };
      const overview = Math.max(1 - e0, e3);
      for (const id of ORDER) {
        zoneEls[id].style.opacity = String(fieldJourney.dim + (1 - fieldJourney.dim) * Math.max(focus[id], overview));
        accentEls[id].style.opacity = String(focus[id]);
        accentEls[id].style.setProperty("--f", String(focus[id]));
      }
      // power: plan → operate → build while flying to build; operate → grid next
      routeEls[0]?.style.setProperty("--f", String(clamp01(e1 * 2)));
      routeEls[1]?.style.setProperty("--f", String(clamp01(e1 * 2 - 1)));
      routeEls[2]?.style.setProperty("--f", String(e2));
      // decommission: the plant comes apart
      const [d0, d1] = fieldJourney.decommission;
      zoneEls.C.style.setProperty("--d", String(easeInOut(clamp01((p - d0) / (d1 - d0)))));
      // rotors turn with the scroll
      const turn = p * fieldJourney.bladeTurns * Math.PI * 2;
      bladeEls.forEach((el, i) => {
        const t = scene.turbines[i];
        el.setAttribute("d", bladePath(t.x, t.y, t.h, t.phase + turn));
      });
    };

    const source = reduce ? scrollYProgress : smooth;
    apply(source.get());
    setReady(true);
    const off = source.on("change", apply);
    const ro = new ResizeObserver(() => {
      views = makeViews(sticky.clientWidth, sticky.clientHeight);
      apply(source.get());
    });
    ro.observe(sticky);
    return () => {
      off();
      ro.disconnect();
    };
  }, [reduce, scene, scrollYProgress, smooth]);

  const s = stages[stage];
  const swap = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
    exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } },
  };

  return (
    <section
      ref={sectionRef}
      data-nav-theme={light ? "light" : "dark"}
      aria-labelledby="field-heading"
      className={`relative ${light ? "bg-bg text-fg [--fj-scrim:251_252_255]" : "bg-night text-bg [--fj-scrim:0_6_17]"}`}
      style={{ height: `calc(100svh * ${1 + fieldJourney.length})` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        {/* the site: fills the whole background */}
        <svg
          ref={svgRef}
          aria-hidden
          className={`field ${light ? "field-light " : ""}absolute inset-0 h-full w-full transition-opacity duration-[var(--duration-base)]`}
          style={{ opacity: ready ? 1 : 0 }}
        >
          <g ref={camRef}>
            <Drawing scene={scene} />
          </g>
        </svg>

        {/* scrims: keep the copy readable and fade the grid at the edges */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[34%] bg-[linear-gradient(180deg,rgb(var(--fj-scrim)/0.9),rgb(var(--fj-scrim)/0))]" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(0deg,rgb(var(--fj-scrim)/0.9),rgb(var(--fj-scrim)/0))]" />
          <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(0deg,rgb(var(--fj-scrim)/0.92)_35%,rgb(var(--fj-scrim)/0))] lg:hidden" />
          <div className="absolute inset-y-0 left-0 hidden w-[36%] bg-[linear-gradient(90deg,rgb(var(--fj-scrim)/0.88),rgb(var(--fj-scrim)/0))] lg:block" />
          {/* (white version: the frosted details panel replaces the right-hand fade) */}
          {!light && (
            <div className="absolute inset-y-0 right-0 hidden w-[44%] bg-[linear-gradient(270deg,rgb(var(--fj-scrim)/0.92)_30%,rgb(var(--fj-scrim)/0))] lg:block" />
          )}
        </div>

        <div className="shell pointer-events-none h-full">
          {/* sticky heading: never changes. 64px, sitting 32px below the nav
              bar (nav: 12px from the top, 66 tall) while the section is pinned */}
          <h2
            id="field-heading"
            className="display absolute top-24 left-4 max-w-[683px] text-[36px] sm:text-[48px] lg:top-[calc(12px+var(--u)*66+32px)] lg:left-u-32 lg:w-u-683 lg:text-[64px]"
          >
            Project Support Built Around Your Scope
          </h2>

          {/* left: number + workstream */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`title-${stage}`}
              {...swap}
              className="absolute top-[54%] left-4 flex items-baseline gap-3 lg:top-[41.6%] lg:left-u-32 lg:w-u-378 lg:flex-col lg:items-start lg:gap-[calc(var(--u)*30)]"
            >
              <p aria-hidden className="display text-[28px] lg:fs-u-40">
                {s.n}.
              </p>
              <h3 className="display text-[28px] lg:fs-u-40">{s.title}</h3>
            </motion.div>
          </AnimatePresence>

          {/* right: description + related services, 40 below the title line,
              on a frosted panel (padding pulled outwards so the copy keeps its
              Figma column at x 963) */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`body-${stage}`}
              {...swap}
              className={`pointer-events-auto absolute inset-x-4 top-[calc(54%+4.75rem)] flex flex-col gap-8 p-5 backdrop-blur-md lg:inset-x-auto lg:top-[calc(41.6%+40px)] lg:left-[calc(var(--u)*963-24px)] lg:w-[calc(var(--u)*445+48px)] lg:p-6 ${
                light ? "bg-white/50" : "bg-night/50"
              }`}
            >
              <p className="text-[15px] leading-[1.5] font-medium tracking-[-0.005em] lg:text-base">{s.description}</p>
              <ul className="hidden flex-col gap-2 lg:flex">
                {s.services.map((name) => (
                  <li key={name}>
                    <a
                      href="#"
                      className="block py-1 text-base leading-[1.3] font-bold tracking-[-0.005em] transition-colors hover:text-sky"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
