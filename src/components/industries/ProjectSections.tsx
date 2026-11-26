"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Arrow } from "@/components/ui/Arrow";
import { CaseScene, Terrain } from "./CaseScene";
import type { IconKey } from "./LineIcons";
import { layerStack } from "@/lib/motion";

// Project pages (copy: "MWC Website Content 2"). The project records are the
// case cards of the industry pages turned into spec sheets: the record's
// facts as a title-block table on the left, its own drawing on the terrain
// ground on the right.

type L = { label: string; href: string };

export type ProjectRecord = {
  id: string;
  /** the stage on the timeline (the doc's designer note: Operate, Upgrade, Close, Demolish) */
  stage: string;
  title: string;
  facts: { term: string; text: string }[];
  workstreams: L[];
  link: L;
  icon: IconKey;
  /** a photograph for the record (from the MWC field library, not necessarily this project) */
  image?: { src: string; alt: string };
};

const textLink =
  "cta group inline-flex items-center gap-2 text-base leading-[1.3] font-semibold tracking-[-0.005em] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current";

// the plant's life read left to right, the ground darkening with it
const GROUNDS = ["#2089d8", "#0a48a6", "#072871", "#001440"];

/** one record: title, the facts as a title block, workstreams, the case study */
function RecordBody({ r, headingLevel = "h3" }: { r: ProjectRecord; headingLevel?: "h3" }) {
  const H = headingLevel;
  return (
    <div className="flex flex-col">
      <H id={r.id} className="display text-[30px] text-bg sm:text-[40px] lg:fs-u-40">
        {r.title}
      </H>
      <dl className="mt-8 border-t border-bg/25 lg:mt-[min(calc(var(--u)*40),3vh)]">
        {r.facts.map((f) => (
          <div key={f.term} className="grid gap-1 border-b border-bg/25 py-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[calc(var(--u)*150)_minmax(0,1fr)] lg:py-[min(calc(var(--u)*16),1.2vh)]">
            <dt className="text-sm leading-[1.5] text-bg/65">{f.term}</dt>
            <dd className="text-base leading-[1.5] text-bg/95">{f.text}</dd>
          </div>
        ))}
        <div className="grid gap-1 py-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[calc(var(--u)*150)_minmax(0,1fr)] lg:py-[min(calc(var(--u)*16),1.2vh)]">
          <dt className="text-sm leading-[1.5] text-bg/65">Workstreams</dt>
          <dd>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-base leading-[1.5]">
              {r.workstreams.map((w) => (
                <li key={w.href}>
                  <a href={w.href} className="underline decoration-bg/40 underline-offset-4 transition-colors duration-[var(--duration-base)] hover:decoration-bg">
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <div className="mt-8 lg:mt-[min(calc(var(--u)*32),2.5vh)]">
        <a href={r.link.href} className={`${textLink} text-bg`}>
          {r.link.label}
          <Arrow />
        </a>
      </div>
    </div>
  );
}

// After the doc's designer note: the four records along a horizontal
// timeline, Operate, Upgrade, Close, Demolish. On desktop the section pins
// and the records slide past sideways as you scroll, each holding a moment
// at full screen, with a rail along the top that fills as the plant's life
// goes on. Phones and tablets read them as a stack.
export function ProjectTimeline({ id, heading, records }: { id: string; heading: string[]; records: ProjectRecord[] }) {
  const n = records.length;
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  // hold on each record, slide between them
  const holds = records.flatMap((_, i) => {
    const a = i / n + 0.06;
    const b = (i + 1) / n - 0.06;
    return [Math.max(0, i === 0 ? 0 : a), Math.min(1, i === n - 1 ? 1 : b)];
  });
  const stops = records.flatMap((_, i) => [i, i]);
  const pos = useTransform(scrollYProgress, holds, stops);
  const x = useTransform(pos, (v) => `${(-v * 100) / n}%`);
  const fill = useTransform(pos, (v) => v / (n - 1));
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.round(v)));

  const go = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    const y = top + ((i + 0.5) / n) * run;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: layerStack.jump });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby={id} className="pt-24 lg:pt-u-200">
      <div className="shell">
        <RevealHeading id={id} className="display text-[40px] sm:text-[56px] lg:fs-u-64">
          {heading.map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
      </div>

      {/* phones and tablets: the records as a stack */}
      <ol className="mt-12 flex flex-col lg:hidden">
        {records.map((r, i) => (
          <li key={r.id} aria-labelledby={r.id} className="relative overflow-hidden text-bg" style={{ backgroundColor: GROUNDS[i % GROUNDS.length] }}>
            <Terrain />
            <div className="shell relative py-14">
              <p className="text-sm font-semibold tracking-[0.02em] text-bg/70">
                {String(i + 1).padStart(2, "0")} {r.stage}
              </p>
              <CaseScene icon={r.icon} ground={GROUNDS[i % GROUNDS.length]} tight className="mt-6 aspect-[4/3] w-full" />
              <div className="mt-6">
                <RecordBody r={r} />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* desktop: pinned, sliding sideways */}
      <div ref={wrap} className="relative mt-u-72 hidden lg:block" style={{ height: `${n * 100}vh` }}>
        <div className="sticky top-[72px] h-[calc(100svh-72px)] overflow-hidden text-bg">
          <motion.ol className="flex h-full" style={{ width: `${n * 100}%`, x: reduce ? undefined : x }}>
            {records.map((r, i) => (
              <li
                key={r.id}
                aria-labelledby={r.id}
                className="relative h-full overflow-hidden"
                style={{ width: `${100 / n}%`, backgroundColor: GROUNDS[i % GROUNDS.length] }}
              >
                <Terrain />
                <CaseScene icon={r.icon} ground={GROUNDS[i % GROUNDS.length]} className="absolute inset-y-0 right-0 h-full w-[54%]" />
                <div className="shell relative flex h-full flex-col justify-center pt-[min(calc(var(--u)*120),13vh)] pb-u-32">
                  <div className="w-[calc(var(--u)*660)]">
                    <RecordBody r={r} />
                  </div>
                </div>
              </li>
            ))}
          </motion.ol>

          {/* the timeline rail over the records: a stop per stage, filling as the plant's life goes on */}
          <div className="pointer-events-none absolute inset-x-0 top-0">
            <div className="shell pt-u-40">
              <div className="relative">
                <span aria-hidden className="absolute inset-x-0 top-[5px] h-px bg-bg/30" />
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 top-[5px] h-px origin-left bg-bg"
                  style={{ scaleX: reduce ? active / (n - 1) : fill }}
                />
                <ol className="relative flex justify-between">
                  {records.map((r, i) => (
                    <li key={r.id} className={i === 0 ? "" : i === n - 1 ? "text-right" : "text-center"}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-current={i === active ? "step" : undefined}
                        className={`pointer-events-auto flex flex-col gap-3 ${i === 0 ? "items-start" : i === n - 1 ? "items-end" : "items-center"}`}
                      >
                        <span
                          aria-hidden
                          className={`block size-[11px] border transition-colors duration-[var(--duration-base)] ${i <= active ? "border-bg bg-bg" : "border-bg/60 bg-transparent"}`}
                        />
                        <span
                          className={`text-sm leading-none font-semibold tabular-nums transition-opacity duration-[var(--duration-base)] ${i === active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                        >
                          {String(i + 1).padStart(2, "0")} {r.stage}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** the page's closing links: services and industries, as quiet lines */
export function RelatedLinks({ lists }: { lists: { label: string; links: L[] }[] }) {
  return (
    <section aria-label="Related services and industries" className="shell pt-24 lg:pt-u-160">
      {lists.map((list) => (
        <div key={list.label} className="flex flex-col gap-4 border-t border-fg/15 py-5 last:border-b md:flex-row md:items-baseline md:gap-8">
          <p className="shrink-0 text-sm leading-none text-fg/50 md:w-[200px]">{list.label}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {list.links.map((k) => (
              <li key={k.href}>
                <a href={k.href} className={`${textLink} text-navy`}>
                  {k.label}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
