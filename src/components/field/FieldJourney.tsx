"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { workstreams } from "@/components/comp2/Workstreams2";
import { bladePath, buildScene, plotBounds, PLOTS, type Prim, type Scene, type ZoneId } from "@/components/field/scene";
import { duration, ease, fieldJourney } from "@/lib/motion";
import { StageDial, type DialApi } from "@/components/field/StageDial";

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

/** `light`: the white version (comp 4): light faces, ink/navy lines, white scrims.
 *  `soft`: soft style on blueprint blue: pale gradient faces, white lines. */
/** `intro`: before the journey, the heading sits large and centred on the
 *  page's white ground; then the blue opens out from behind it to fill the
 *  screen (tall first, then wide, as the Power Generation panels do), the
 *  heading settles into its corner and the site is revealed inside the blue. */
const INTRO = 0.9; // extra pinned scroll for the intro, in screen heights
const HEAD_LINES = ["Project Support", "Built Around Your Scope"];
const HEAD_START = 2.4; // heading scale while centred (40px settled, 96px centred)

export function FieldJourney({ light = false, soft = false, intro: introProp = false }: { light?: boolean; soft?: boolean; intro?: boolean } = {}) {
  // the intro is a desktop moment: on a phone the small heading alone on a
  // white screen reads as a gap, so there the section starts on the blue
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const intro = introProp && wide;
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const camRef = useRef<SVGGElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const scene = useMemo(buildScene, []);
  const dial = useRef<DialApi | null>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  // the heading is drawn twice in the same place: in ink on the page and in
  // white inside the blue, so each letter takes the colour of what's behind it
  const headRef = useRef<HTMLHeadingElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const headLines = useRef<(HTMLSpanElement | null)[]>([]);
  // the pinned scroll: the intro, then the journey
  const total = fieldJourney.length + (intro ? INTRO : 0);
  const introShare = intro ? INTRO / total : 0;
  // scroll to a stage's held view (the dial's names are buttons)
  const pick = (i: number) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const { enter, planToBuild, buildToOperate, exit } = fieldJourney.moves;
    const holds = [(enter[1] + planToBuild[0]) / 2, (planToBuild[1] + buildToOperate[0]) / 2, (buildToOperate[1] + exit[0]) / 2, 0.97];
    const y = sec.getBoundingClientRect().top + window.scrollY + (introShare + holds[i] * (1 - introShare)) * (sec.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

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

    // the heading's two places, measured without the intro transform:
    // centred (scaled up, each line centred over the longest) and settled
    let head = { dx: 0, dy: 0, s0: HEAD_START, shifts: [0, 0, 0] };
    const measureHead = () => {
      const h = headRef.current;
      if (!h) return;
      if (!intro) {
        // leaving the intro (a narrow screen): drop what it set on the heading
        h.style.transform = "";
        headLines.current.forEach((l) => l && (l.style.transform = ""));
        return;
      }
      const prev = h.style.transform;
      h.style.transform = "none";
      const lines = headLines.current.slice(0, HEAD_LINES.length).map((l) => l?.offsetWidth ?? 0);
      const box = sticky.getBoundingClientRect();
      const r = h.getBoundingClientRect();
      h.style.transform = prev;
      const w = Math.max(...lines);
      // as large as HEAD_START, but never wider than the screen less 16px a side
      const s0 = Math.min(HEAD_START, (box.width - 32) / w);
      head = {
        dx: (box.width - w * s0) / 2 - (r.left - box.left),
        dy: (box.height - r.height * s0) / 2 - (r.top - box.top),
        s0,
        shifts: lines.map((lw) => (w - lw) / 2),
      };
    };
    measureHead();
    const sec = sectionRef.current;

    const showIntro = (t: number) => {
      const clip = clipRef.current;
      const h = headRef.current;
      const inkH = inkRef.current?.querySelector("h2") as HTMLElement | null;
      if (!clip || !h) return;
      // the blue: grows tall from the middle first, then out to the edges
      const kv = easeInOut(clamp01((t - 0.15) / 0.4));
      const kh = easeInOut(clamp01((t - 0.4) / 0.6));
      const side = 24 * (1 - kh);
      const end = kh >= 1;
      clip.style.clipPath = end ? "none" : `inset(${(50 * (1 - kv)).toFixed(3)}% ${side.toFixed(3)}% round ${(4 * (1 - kh)).toFixed(2)}px)`;
      // the heading: centred and large, then into its corner
      const sh = easeInOut(clamp01((t - 0.35) / 0.65));
      const sc = head.s0 + (1 - head.s0) * sh;
      // settled: no transform at all, so the type renders crisp rather than
      // as a scaled bitmap
      const tf =
        sh >= 1 ? "" : `translate(${(head.dx * (1 - sh)).toFixed(1)}px, ${(head.dy * (1 - sh)).toFixed(1)}px) scale(${sc.toFixed(4)})`;
      h.style.transform = tf;
      if (inkH) inkH.style.transform = tf;
      headLines.current.forEach((l, i) => {
        if (l) l.style.transform = sh >= 1 ? "" : `translateX(${(head.shifts[i % HEAD_LINES.length] * (1 - sh)).toFixed(1)}px)`;
      });
      // the ink copy is only needed until the blue fills the screen
      if (inkRef.current) inkRef.current.style.visibility = end ? "hidden" : "visible";
      // the nav reads white ground until the blue reaches the top
      if (sec) {
        const theme = kh > 0.9 ? "dark" : "light";
        if (sec.dataset.navTheme !== theme) {
          sec.dataset.navTheme = theme;
          if (theme === "dark" && soft) sec.setAttribute("data-nav-clear", "");
          else sec.removeAttribute("data-nav-clear");
          // the nav re-reads the page on scroll; the spring can settle after it stops
          window.dispatchEvent(new Event("scroll"));
        }
      }
    };

    const apply = (whole: number) => {
      if (intro) showIntro(reduce ? (whole < introShare / 2 ? 0 : 1) : clamp01(whole / introShare));
      const raw = intro ? clamp01((whole - introShare) / (1 - introShare)) : whole;
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
      // the dial: 0 at plan, 1 build, 2 operate, 3 decommission
      dial.current?.(e1 + e2 + e3);

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
      measureHead();
      apply(source.get());
    });
    ro.observe(sticky);
    return () => {
      off();
      ro.disconnect();
    };
  }, [reduce, scene, scrollYProgress, smooth, intro, introShare, soft]);

  const s = stages[stage];
  const swap = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
    exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } },
  };

  return (
    <section
      ref={sectionRef}
      data-nav-theme={light || intro ? "light" : "dark"}
      // soft: full-bleed; the nav stays transparent over it, as on the hero
      data-nav-clear={soft && !intro ? "" : undefined}
      aria-labelledby="field-heading"
      className={`relative ${intro ? "bg-bg text-bg [--fj-scrim:10_72_166]" : light ? "bg-bg text-fg [--fj-scrim:251_252_255]" : soft ? "bg-[#0a48a6] text-bg [--fj-scrim:10_72_166]" : "bg-night text-bg [--fj-scrim:0_6_17]"}`}
      style={{ height: `calc(100svh * ${1 + total})` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        {/* intro: the heading in ink on the white page, under the blue */}
        {intro && (
          <div ref={inkRef} aria-hidden className="shell pointer-events-none absolute inset-0 h-full">
            <h2
              className="display absolute top-24 left-4 max-w-[683px] origin-top-left text-[32px] sm:text-[40px] lg:top-[calc(12px+var(--u)*66+48px)] lg:left-u-32 lg:w-u-683 lg:text-[40px] text-fg"
            >
              {HEAD_LINES.map((l, i) => (
                <span
                  key={l}
                  ref={(el) => {
                    headLines.current[i + HEAD_LINES.length] = el;
                  }}
                  className={intro ? "block sm:w-max" : ""}
                >
                  {l}
                  {!intro && i < HEAD_LINES.length - 1 ? " " : ""}
                </span>
              ))}
            </h2>
          </div>
        )}

        {/* everything sits in the blue, which the intro opens out */}
        <div
          ref={clipRef}
          className={`absolute inset-0 ${light ? "bg-bg text-fg [--fj-scrim:251_252_255]" : soft ? "bg-[#0a48a6] text-bg [--fj-scrim:10_72_166]" : "bg-night text-bg [--fj-scrim:0_6_17]"}`}
          style={intro ? { clipPath: "inset(50% 24% round 4px)" } : undefined}
        >
        {/* the site: fills the whole background */}
        <svg
          ref={svgRef}
          aria-hidden
          className={`field ${light ? "field-light " : soft ? "field-soft " : ""}absolute inset-0 h-full w-full transition-opacity duration-[var(--duration-base)]`}
          style={{ opacity: ready ? 1 : 0 }}
        >
          {soft && (
            // soft faces: pale gradients lit from the top left (see .field-soft)
            <defs>
              <linearGradient id="fs-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#dce6f4" />
              </linearGradient>
              <linearGradient id="fs-left" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#cbd8ec" />
                <stop offset="1" stopColor="#b2c4df" />
              </linearGradient>
              <linearGradient id="fs-right" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#95acd0" />
                <stop offset="1" stopColor="#7f98c2" />
              </linearGradient>
              <linearGradient id="fs-round" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f2f6fc" />
                <stop offset="0.55" stopColor="#c3d2e8" />
                <stop offset="1" stopColor="#8ea6cc" />
              </linearGradient>
            </defs>
          )}
          <g ref={camRef}>
            <Drawing scene={scene} />
          </g>
        </svg>

        {/* scrims: keep the copy readable and fade the grid at the edges */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[34%] bg-[linear-gradient(180deg,rgb(var(--fj-scrim)/0.9),rgb(var(--fj-scrim)/0))]" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(0deg,rgb(var(--fj-scrim)/0.9),rgb(var(--fj-scrim)/0))]" />
          <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(0deg,rgb(var(--fj-scrim)/0.92)_35%,rgb(var(--fj-scrim)/0))] lg:hidden" />
          <div className="absolute inset-y-0 left-0 hidden w-[44%] bg-[linear-gradient(90deg,rgb(var(--fj-scrim)/0.92)_45%,rgb(var(--fj-scrim)/0))] lg:block" />
          {/* (no right-hand fade: the details panel keeps that copy readable) */}
        </div>

        {/* desktop: the stage names on a circular ruler */}
        <StageDial stages={stages} api={dial} onPick={pick} />

        <div className="shell pointer-events-none h-full">
          {/* sticky heading: 64px, 48px below the nav bar (nav: 12px from the
              top, 66 tall) while the section is pinned; with the intro it
              starts large and centred and settles here */}
          <h2
            ref={headRef}
            id="field-heading"
            className="display absolute top-24 left-4 max-w-[683px] origin-top-left text-[32px] sm:text-[40px] lg:top-[calc(12px+var(--u)*66+48px)] lg:left-u-32 lg:w-u-683 lg:text-[40px]"
          >
            {HEAD_LINES.map((l, i) => (
              <span
                key={l}
                ref={(el) => {
                  headLines.current[i] = el;
                }}
                className={intro ? "block sm:w-max" : ""}
              >
                {l}
                {!intro && i < HEAD_LINES.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>

          {/* left: number + workstream */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`title-${stage}`}
              {...swap}
              className="sr-only"
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
              className={`pointer-events-auto absolute inset-x-4 bottom-4 flex flex-col gap-4 rounded-[4px] p-5 lg:inset-x-auto lg:top-auto lg:gap-8 lg:bottom-[calc(var(--u)*104)] lg:left-[calc(var(--u)*963-24px)] lg:w-[calc(var(--u)*445+48px)] lg:p-6 ${
                light ? "bg-white" : soft ? "bg-[#073d8f]" : "bg-night"
              }`}
            >
              {/* phones: the stage title heads the card (desktop has the ruler) */}
              <p aria-hidden className="display text-[24px] sm:text-[28px] lg:hidden">
                {s.n}. {s.title}
              </p>
              <p className="text-[15px] leading-[1.5] font-medium tracking-[-0.005em] lg:text-base">{s.description}</p>
              {/* the services as menu rows, as in the nav: ruled, each with a
                  chevron that nudges toward its page on hover */}
              <ul className="flex flex-col border-t border-bg/20">
                {s.services.map((name) => (
                  <li key={name} className="border-b border-bg/20">
                    <a
                      href="#"
                      className="group/link flex min-h-9 items-center justify-between gap-4 py-1.5 text-[15px] lg:text-base leading-[1.25] font-medium decoration-bg/50 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {name}
                      <svg
                        aria-hidden
                        width="6"
                        height="10"
                        viewBox="0 0 6 10"
                        className="shrink-0 opacity-70 transition-[opacity,transform] duration-[var(--duration-base)] group-hover/link:translate-x-1 group-hover/link:opacity-100 group-focus-visible/link:translate-x-1 group-focus-visible/link:opacity-100"
                      >
                        <path d="M1 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>

      </div>
    </section>
  );
}
