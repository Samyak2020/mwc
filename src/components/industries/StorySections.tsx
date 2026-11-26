"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { useLayoutEffect, useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { Band } from "@/components/about/Band";
import { ServiceTabs } from "./ServiceTabs";
import type { ProjectRecord } from "./ProjectSections";

// A project page laid out as an editorial story (after letsgrowcanada.ca's
// story pages): a coloured hero with the title and one large rounded image,
// then a white page where each section keeps its name in a narrow left column
// and its content in the wide columns beside it; the project records slide
// past sideways as drawing cards paired with their results; the related
// links as hairline rows; a large close.

type L = { label: string; href: string };

const link =
  "cta group inline-flex items-center gap-2 text-base leading-[1.3] font-semibold tracking-[-0.005em] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current";

/** the label column and the content columns every section shares */
const grid = "grid gap-6 lg:grid-cols-12 lg:gap-x-[calc(var(--u)*24)]";
const labelCol = "text-sm leading-[1.3] font-semibold text-fg/60 lg:col-span-3";
const bodyCol = "lg:col-span-8 lg:col-start-4";

/* ------------------------------------------------------------------ hero */

// The hero's sky (after the reference's red-to-black fade): the primary navy
// holds through the title, eases into the sky blue (#2089d8), then into the
// white page. Eased stops, so neither change shows a band. The gradient is
// lifted as the hero scrolls away, so the light rises toward the title.
const EASE = [0.04, 0.13, 0.28, 0.47, 0.67, 0.84, 0.96, 1];
const leg = (from: string, to: string, start: number, end: number) =>
  EASE.map((t, i) => `color-mix(in srgb, ${from}, ${to} ${Math.round(t * 100)}%) ${(start + ((end - start) * (i + 1)) / EASE.length).toFixed(1)}%`);
/** the hero sky, its changes lifted by `up` percent as the page scrolls */
const skyFade = (up: number) => {
  const n = 52 - up, k = 76 - up, w = 96 - up;
  return `linear-gradient(to bottom, ${[
    "var(--color-navy) 0%",
    `var(--color-navy) ${n}%`,
    ...leg("var(--color-navy)", "var(--color-sky)", n, k),
    ...leg("var(--color-sky)", "var(--color-bg)", k, w),
    "var(--color-bg) 100%",
  ].join(", ")})`;
};

export function StoryHero({
  title,
  image,
  band,
}: {
  title: string[];
  image?: { src: string; alt: string };
  /** phrases for the scrolling sky band along the foot of the photo, drawn from the page */
  band?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // the sky slides up through the hero as it scrolls away
  const { scrollYProgress: away } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const sky = useTransform(away, (p) => skyFade(reduce ? 0 : Math.min(p, 1) * 28));
  // the image opens out a little as it rises toward the top of the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.94, 1]);
  return (
    <motion.header
      ref={hero}
      data-hero
      data-nav-theme="dark"
      data-nav-clear=""
      className="relative pb-16 text-bg lg:pb-u-56"
      style={{ backgroundImage: sky }}
    >
      <div className="shell pt-36 lg:pt-[calc(var(--u)*190)]">
        <RevealHeading as="h1" trigger="load" className="display text-[38px] sm:text-[52px] lg:fs-u-64">
          {title.map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
      </div>
      {/* the image sits in the fade, the colour giving way to the page around it */}
      <div className="relative mt-12 lg:mt-u-72">
        <div ref={ref} className="shell relative">
          <motion.div
            style={{ scale }}
            className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[#e6e9ee] sm:aspect-[16/9]"
          >
            {image ? (
              <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
            ) : (
              <>
                {/* placeholder until the photograph is supplied */}
                <div
                  aria-hidden
                  className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgb(0_6_17/0.05)_0_1px,transparent_1px_14px)]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-sm font-semibold text-fg/55">Hero image</span>
                  <span className="text-xs text-fg/40">Placeholder · 16:9 photograph</span>
                </div>
              </>
            )}
            {/* the page's phrases running along the foot of the photo, as on About */}
            {band && <Band phrases={band} className="absolute inset-x-0 bottom-0 h-8" />}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

/* ------------------------------------------------- statement and points */

// The page's opening paragraph, whole and set large in the content columns.
export function StoryIntro({ text }: { text: string }) {
  return (
    <section data-nav-theme="light" aria-label="Introduction" className="shell pt-20 text-fg lg:pt-u-120">
      <div className={grid}>
        <Rise as="p" className={`${bodyCol} text-[24px] leading-[1.3] font-semibold tracking-[-0.015em] lg:fs-u-36`}>
          {text}
        </Rise>
      </div>
    </section>
  );
}

// A section's heading in the label column, its points as hairline rows.
export function StoryPoints({ id, label, points }: { id: string; label: string; points: { lead: string; text: string }[] }) {
  return (
    <section data-nav-theme="light" aria-labelledby={id} className="shell pt-24 text-fg lg:pt-u-160">
      <div className={grid}>
        <h2 id={id} className={labelCol}>
          {label}
        </h2>
        <ul className={bodyCol}>
          {points.map((p, i) => (
            <Rise
              as="li"
              key={p.lead}
              order={i}
              className="grid gap-2 border-t border-fg/20 py-6 last:border-b sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-8 lg:py-u-28"
            >
              <p className="text-lg leading-[1.3] font-semibold">{p.lead}</p>
              <p className="text-base leading-[1.55] text-fg/70">{p.text}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------- records, sliding sideways */


/** the record's title, with owner, scope and role beneath it */
function RecordHead({ r }: { r: ProjectRecord }) {
  const lead = r.facts.filter((f) => f.term !== "Result");
  return (
    <div className="flex w-full flex-col lg:w-[calc(var(--u)*340)]">
      <h3 id={r.id} className="text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-fg lg:text-[min(calc(var(--u)*36),3.6vh)]">
        {r.title}
      </h3>
      <dl className="mt-8 flex flex-col gap-6 lg:mt-[min(calc(var(--u)*40),3.6vh)] lg:gap-[min(24px,2.4vh)]">
        {lead.map((f) => (
          <div key={f.term} className="flex flex-col gap-1">
            <dt className="text-sm text-fg/55">{f.term}</dt>
            <dd className="text-base leading-[1.5] text-fg/85">{f.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** the record's photograph, or a placeholder until one is supplied */
function RecordImage({ r }: { r: ProjectRecord }) {
  const box = "relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[4px] bg-[#e6e9ee] lg:w-[min(calc(var(--u)*400),42vh)]";
  if (r.image)
    return (
      <div className={box}>
        <Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
      </div>
    );
  return (
    <div aria-hidden className={box}>
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgb(0_6_17/0.05)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="text-sm font-semibold text-fg/55">Project image</span>
        <span className="text-xs text-fg/40">Placeholder · 4:5 photograph</span>
      </div>
    </div>
  );
}

/** the result set large, then the workstreams and the case study */
function RecordResult({ r }: { r: ProjectRecord }) {
  const result = r.facts.find((f) => f.term === "Result");
  return (
    <div className="flex w-full flex-col lg:w-[calc(var(--u)*480)]">
      <dl className="flex flex-col">
        {result && (
          <div className="flex flex-col gap-2">
            <dt className="text-sm text-fg/55">{result.term}</dt>
            <dd className="text-[20px] leading-[1.3] font-semibold tracking-[-0.015em] text-fg lg:text-[min(calc(var(--u)*24),2.5vh)]">{result.text}</dd>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-1 lg:mt-[min(24px,2.4vh)]">
          <dt className="text-sm text-fg/55">Workstreams</dt>
          <dd>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-base leading-[1.5]">
              {r.workstreams.map((w) => (
                <li key={w.href}>
                  <a href={w.href} className="text-fg/85 underline decoration-fg/35 underline-offset-4 hover:decoration-fg">
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <div className="mt-8 lg:mt-[min(calc(var(--u)*32),3vh)]">
        <a href={r.link.href} className={`${link} text-navy`}>
          {r.link.label}
          <Arrow />
        </a>
      </div>
    </div>
  );
}

// The project records along the plant's life. On desktop the section pins and
// plays in three beats as you scroll: first only the section title, large and
// centred; then the title settles into the top-left corner above the
// timeline; then the timeline draws in and the first record appears. After
// that the records slide left, a dot running along the timeline and dropping
// each record's line as it reaches its stop. Phones read a stack.
export function StoryRecords({ id, heading, records }: { id: string; heading: string[]; records: ProjectRecord[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const rail = useRef<HTMLDivElement>(null);
  const stops = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const n = records.length;

  // measurements: the horizontal run, the stops along the rail, and the title
  // at its two places (centred, and settled in the corner)
  const [m, setM] = useState({ run: 0, vh: 800, at: [] as number[], cx: 0, cy: 0, ex: 0, ey: 0, shifts: [] as number[], slack: 0 });
  const END_SCALE = 0.5;
  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      const s = stage.current;
      const h = title.current;
      const r = rail.current;
      // hidden on phones and tablets: nothing to measure
      if (!t || !s || !h || !r || !s.offsetParent) return;
      const W = s.clientWidth;
      const H = s.clientHeight;
      const w = h.offsetWidth;
      const hh = h.offsetHeight;
      const r0 = r.offsetLeft;
      const railY = r.offsetTop;
      const maxLine = Math.max(...lines.current.map((l) => l?.offsetWidth ?? 0));
      const at = stops.current.map((el) => (el?.offsetParent ? el.offsetLeft + (el.offsetParent as HTMLElement).offsetLeft - r0 : 0));
      setM({
        run: Math.max(0, t.scrollWidth - window.innerWidth),
        vh: window.innerHeight,
        at,
        // centred in the stage, each line centred over the longest
        cx: (W - maxLine) / 2,
        cy: (H - hh) / 2,
        // settled: at the rail's start, above the stage labels
        ex: r0 + (at[0] ?? 0),
        ey: railY - 32 - 36 - hh * END_SCALE,
        shifts: lines.current.map((l) => (maxLine - (l?.offsetWidth ?? 0)) / 2),
        // the stage is a screen tall; what sits under the records is taken back
        // once it unpins, so the next section follows the records, not the screen
        slack: Math.max(0, s.getBoundingClientRect().bottom - Math.max(...stops.current.map((el) => el?.getBoundingClientRect().bottom ?? 0))),
      });
      void w;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // scroll budget: the intro beats take 0.9 of a screen, then the horizontal run
  const intro = m.vh * 0.9;
  const total = intro + m.run;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const px = useTransform(scrollYProgress, (p) => p * total);
  // beat 1 a short hold, beat 2 settle (0.15 → 0.6 of the intro), beat 3 reveal (0.6 → 1)
  const settle = useTransform(px, [intro * 0.15, intro * 0.6], [0, 1], { clamp: true });
  const reveal = useTransform(px, [intro * 0.6, intro], [0, 1], { clamp: true });
  const x = useTransform(px, (v) => (reduce ? 0 : -Math.min(Math.max(v - intro, 0), m.run)));
  const tx = useTransform(settle, (s) => m.cx + (m.ex - m.cx) * s);
  const ty = useTransform(settle, (s) => m.cy + (m.ey - m.cy) * s);
  const ts = useTransform(settle, (s) => 1 + (END_SCALE - 1) * s);
  const lineShift = (k: number) => (s: number) => (m.shifts[k] ?? 0) * (1 - s);
  const lineX0 = useTransform(settle, lineShift(0));
  const lineX1 = useTransform(settle, lineShift(1));
  const lineXs = [lineX0, lineX1];
  const firstX = useTransform(reveal, [0, 1], [80, 0]);

  // the dot runs over the horizontal part, from the first stop to the last
  const last = m.at[m.at.length - 1] ?? 0;
  // the rail runs from the screen edge; the dot sets off from the first stop
  const first = m.at[0] ?? 0;
  const dot = useTransform(px, [intro, intro + m.run * 0.96], [first, last], { clamp: true });
  const [reached, setReached] = useState(0);
  const [shown, setShown] = useState(false);
  useMotionValueEvent(dot, "change", (v) => setReached(m.at.filter((p) => v >= p - 1).length));
  useMotionValueEvent(reveal, "change", (v) => setShown(v > 0.9));
  const lit = shown ? Math.max(reached, 1) : 0;

  return (
    <section data-nav-theme="light" aria-labelledby={id} className="pt-20 lg:pt-u-64">
      {/* phones and tablets: a stack */}
      <div className="shell lg:hidden">
        <h2 className="display text-[40px] text-fg sm:text-[56px]">{heading.join(" ")}</h2>
        <ol className="mt-12 flex flex-col gap-16">
          {records.map((r, i) => (
            <li key={r.id} className="flex flex-col gap-8">
              <p className="flex items-center gap-3 border-t border-sky/50 pt-4 text-sm leading-none font-semibold">
                <span className="bg-sky px-2 py-1 text-xs text-bg tabular-nums">
                  {i + 1}/{n}
                </span>
                <span className="tracking-[0.04em] uppercase">{r.stage}</span>
              </p>
              <RecordHead r={r} />
              <RecordImage r={r} />
              <RecordResult r={r} />
            </li>
          ))}
        </ol>
      </div>

      {/* desktop: pinned, in beats */}
      <div ref={wrap} className="relative hidden lg:block" style={{ height: `calc(100svh - 72px + ${Math.round(total)}px)`, marginBottom: -Math.round(m.slack) }}>
        <div
          ref={stage}
          className="sticky top-[72px] h-[calc(100svh-72px)] overflow-hidden"
          // the title, timeline and records sit as one block, centred when the screen has room
          style={{ ["--lead" as string]: "max(min(calc(var(--u) * 24), 2vh), calc((100svh - 72px - 800px) / 2))" }}
        >
          {/* the section title: centred first, then settled in the corner */}
          <motion.h2
            ref={title}
            id={id}
            className="display pointer-events-none absolute top-0 left-0 z-10 origin-top-left text-fg lg:fs-u-96"
            style={{ x: tx, y: ty, scale: ts }}
          >
            {heading.slice(0, 2).map((l, k) => (
              <motion.span
                key={l}
                ref={(el) => {
                  lines.current[k] = el;
                }}
                className="block w-max"
                style={{ x: lineXs[k] }}
              >
                {l}
              </motion.span>
            ))}
          </motion.h2>

          <motion.div
            ref={track}
            style={{ x }}
            className="relative flex h-full w-max items-start pt-[calc(var(--lead)+110px+min(calc(var(--u)*40),4vh))] pr-[calc(var(--u)*120)] pl-[calc(var(--u)*32+max(0px,(100vw-1440px)/2))]"
          >
            {/* the rail: grey with ruled ticks across the whole screen, drawing in from the left in beat three */}
            <motion.div
              ref={rail}
              aria-hidden
              className="pointer-events-none absolute right-0 left-0 origin-left"
              style={{ top: "calc(var(--lead) + 110px + min(calc(var(--u)*40),4vh) + 32px)", scaleX: reveal }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-fg/20" />
              <span className="absolute inset-x-0 top-0 h-[10px] [background-image:repeating-linear-gradient(to_right,rgb(0_6_17/0.18)_0_1px,transparent_1px_16px),repeating-linear-gradient(to_right,rgb(0_6_17/0.18)_0_1px,transparent_1px_64px)] [background-size:100%_5px,100%_10px] [background-repeat:no-repeat]" />
              <motion.span className="absolute top-0 left-0 h-px origin-left bg-sky" style={{ width: dot }} />
              <motion.span className="absolute top-[-5px] left-[-5px] size-[11px] rounded-full bg-sky shadow-[0_0_0_4px_rgb(32_137_216/0.15)]" style={{ x: dot }} />
            </motion.div>

            <div className="relative flex shrink-0 items-start gap-[calc(var(--u)*200)]">
              {records.map((r, i) => {
                const on = i < lit;
                return (
                  <article
                    key={r.id}
                    ref={(el) => {
                      stops.current[i] = el;
                    }}
                    aria-labelledby={r.id}
                    className="relative flex shrink-0 flex-col"
                  >
                    {/* the stop's count and stage, above the rail */}
                    <motion.div className="flex h-[32px] items-start gap-3" style={{ opacity: reveal }}>
                      <span
                        className={`px-2 py-1 text-xs leading-none font-semibold tabular-nums transition-colors duration-[var(--duration-base)] ${on ? "bg-sky text-bg" : "text-fg/50"}`}
                      >
                        {i + 1}/{n}
                      </span>
                      <span
                        className={`pt-[3px] text-sm leading-none font-semibold tracking-[0.04em] uppercase transition-colors duration-[var(--duration-base)] ${on ? "text-fg" : "text-fg/50"}`}
                      >
                        {r.stage}
                      </span>
                    </motion.div>
                    <motion.span
                      aria-hidden
                      style={{ opacity: reveal }}
                      className={`absolute top-[27px] left-[-5px] size-[11px] rounded-full border transition-colors duration-[var(--duration-base)] ${on ? "border-sky bg-sky" : "border-fg/35 bg-bg"}`}
                    />
                    {/* the record, its line dropping from the stop when the dot arrives */}
                    <div className="relative mt-[min(calc(var(--u)*48),4.4vh)] pl-[calc(var(--u)*40)]">
                      <motion.span
                        aria-hidden
                        className="absolute top-[calc(-1*min(calc(var(--u)*48),4.4vh))] bottom-0 left-0 w-px origin-top bg-sky"
                        initial={false}
                        animate={{ scaleY: on ? 1 : 0 }}
                        transition={{ duration: duration.slow, ease: ease.out }}
                      />
                      {/* three columns: title and facts, the drawing, the result */}
                      <motion.div
                        className="flex items-start gap-[calc(var(--u)*56)]"
                        style={i === 0 ? { opacity: reveal, x: reduce ? 0 : firstX } : undefined}
                        initial={i === 0 || reduce ? false : { opacity: 0, x: 80 }}
                        whileInView={i === 0 ? undefined : { opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: duration.slow * 1.4, ease: ease.out }}
                      >
                        <RecordHead r={r} />
                        <RecordImage r={r} />
                        <RecordResult r={r} />
                      </motion.div>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- records, one or two in place */

// For project pages with one or two records and no stages to walk through:
// the same pieces as the Power Generation timeline, held still. Each record
// gets its own ruled line across the screen with its stop and label ("Project
// Record") above; as it comes into view the line turns blue up to the stop,
// the stop fills, the line drops down the record's left edge and the record
// rises in: the timeline's beats, once, without pinning the page.
function RecordInPlace({ r, i, n }: { r: ProjectRecord; i: number; n: number }) {
  const reduce = useReducedMotion();
  const t = (delay: number) => ({ duration: duration.slow, ease: ease.out, delay: reduce ? 0 : delay });
  return (
    <motion.article
      aria-labelledby={r.id}
      className="relative"
      initial={reduce ? false : "off"}
      whileInView="on"
      viewport={{ once: true, amount: 0.12 }}
    >
      {/* the rail across the screen: grey with ruled ticks, blue up to the stop */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[32px] hidden lg:block">
        <span className="absolute inset-x-0 top-0 h-px bg-fg/20" />
        <span className="absolute inset-x-0 top-0 h-[10px] [background-image:repeating-linear-gradient(to_right,rgb(0_6_17/0.18)_0_1px,transparent_1px_16px),repeating-linear-gradient(to_right,rgb(0_6_17/0.18)_0_1px,transparent_1px_64px)] [background-size:100%_5px,100%_10px] [background-repeat:no-repeat]" />
        <motion.span
          className="absolute top-0 left-0 h-px w-[calc(var(--u)*32+max(0px,(100vw-1440px)/2))] origin-left bg-sky"
          variants={{ off: { scaleX: 0 }, on: { scaleX: 1, transition: t(0) } }}
        />
      </div>
      <div className="shell relative">
        {/* the stop's label above the rail */}
        <div className="flex h-[32px] items-start gap-3 border-t border-sky/50 pt-3 lg:border-t-0 lg:pt-0">
          {n > 1 && <span className="bg-sky px-2 py-1 text-xs leading-none font-semibold text-bg tabular-nums">{`${i + 1}/${n}`}</span>}
          <span className="pt-[3px] text-sm leading-none font-semibold tracking-[0.04em] uppercase">{r.stage}</span>
        </div>
        <motion.span
          aria-hidden
          className="absolute top-[27px] left-[calc(var(--u)*32-5px)] hidden size-[11px] rounded-full border lg:block"
          variants={{ off: { backgroundColor: "rgb(251 252 255)", borderColor: "rgb(0 6 17 / 0.35)" }, on: { backgroundColor: "#2089d8", borderColor: "#2089d8", transition: t(0.45) } }}
        />
        <div className="relative mt-8 lg:mt-[min(calc(var(--u)*48),4.4vh)] lg:pl-[calc(var(--u)*40)]">
          <motion.span
            aria-hidden
            className="absolute top-[calc(-1*min(calc(var(--u)*48),4.4vh))] bottom-0 left-0 hidden w-px origin-top bg-sky lg:block"
            variants={{ off: { scaleY: 0 }, on: { scaleY: 1, transition: { ...t(0.6), duration: duration.slow * 1.4 } } }}
          />
          {/* three columns: title and facts, the photograph, the result */}
          <motion.div
            className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[calc(var(--u)*56)]"
            variants={{ off: { opacity: 0, x: 40 }, on: { opacity: 1, x: 0, transition: { ...t(0.5), duration: duration.slow * 1.4 } } }}
          >
            <RecordHead r={r} />
            <RecordImage r={r} />
            <RecordResult r={r} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

export function StoryRecordList({ id, heading, records }: { id: string; heading?: string[]; records: ProjectRecord[] }) {
  return (
    <section data-nav-theme="light" aria-labelledby={id} className="pt-24 lg:pt-u-160">
      {heading ? (
        <div className="shell mb-12 lg:mb-u-72">
          <RevealHeading id={id} className="display text-[36px] text-fg sm:text-[48px] lg:fs-u-48">
            {heading.map((l) => (
              <Line key={l} className="block">
                {l}
              </Line>
            ))}
          </RevealHeading>
        </div>
      ) : (
        <h2 id={id} className="sr-only">
          {records.map((r) => `${r.stage}: ${r.title}`).join("; ")}
        </h2>
      )}
      <div className="flex flex-col gap-20 lg:gap-u-160">
        {records.map((r, i) => (
          <RecordInPlace key={r.id} r={r} i={i} n={records.length} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- related links */

// After the reference's share list: the section's name in the label column,
// each link a full-width hairline row with an arrow at the end.
// The page's related links, in the industry pages' services pattern: the big
// heading, the groups (Services, Industries) as tabs on the left, the open
// group's links as rows beside them.
export function StoryLinks({ lists }: { lists: { label: string; links: L[] }[] }) {
  return (
    <section data-nav-theme="light" aria-labelledby="more-heading" className="shell pt-28 text-fg lg:pt-[calc(var(--u)*208)] lg:mb-[calc(var(--u)*-40)]">
      <RevealHeading id="more-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
        <Line className="block">Related</Line>
      </RevealHeading>
      <Rise className="mt-14 lg:mt-u-104">
        <ServiceTabs fit groups={lists.map((l) => ({ label: l.label, items: l.links.map((k) => ({ lead: k.label, href: k.href })) }))} />
      </Rise>
    </section>
  );
}

/* ----------------------------------------------------------------- close */

export function StoryClose({ heading, cta }: { heading: string[]; cta: L }) {
  return (
    <section data-nav-theme="light" aria-labelledby="story-close" className="shell pt-32 pb-32 text-center text-fg lg:pt-u-240 lg:pb-u-200">
      <RevealHeading id="story-close" className="display mx-auto text-[40px] sm:text-[64px] lg:fs-u-96">
        {heading.map((l) => (
          <Line key={l} className="block">
            {l}
          </Line>
        ))}
      </RevealHeading>
      <Rise className="mt-10 flex justify-center lg:mt-u-56">
        <a
          href={cta.href}
          className="cta btn flex items-center gap-[9px] border border-navy bg-navy px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg"
        >
          {cta.label}
          <Arrow />
        </a>
      </Rise>
    </section>
  );
}
