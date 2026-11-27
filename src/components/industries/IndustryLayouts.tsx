"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { RegMarks } from "@/components/ui/RegMarks";
import { type IconKey } from "./LineIcons";
import { CaseScene, Terrain } from "./CaseScene";
import { duration, ease, scrollSpring } from "@/lib/motion";

// Page-specific layouts for the Government, Commercial and Oil and Gas pages,
// built from the site's own parts: blueprint-blue panels with registration
// marks (Contact), drafting-sheet frames (Client Resources), ruled lists and
// count-up figures (case studies), quiet grey link lines (results rows).

type L = { label: string; href: string };

const textLink =
  "cta group inline-flex items-center gap-2 text-base leading-[1.3] font-semibold tracking-[-0.005em] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current";
function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={`${textLink} ${className}`}>
      {children}
      <Arrow width={18} />
    </a>
  );
}
const outlineBtn =
  "cta btn inline-flex items-center gap-[9px] btn-dark bg-navy px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg";
function Heading({ id, lines, className = "" }: { id?: string; lines: string[]; className?: string }) {
  return (
    <RevealHeading id={id} className={`display text-[36px] sm:text-[48px] ${className}`}>
      {lines.map((l) => (
        <Line key={l} className="block">
          {l}
        </Line>
      ))}
    </RevealHeading>
  );
}
function LinkLine({ list }: { list: { label: string; links: L[] } }) {
  return (
    <div className="flex flex-col gap-4 border-t border-fg/15 py-5 md:flex-row md:items-baseline md:gap-8">
      <p className="shrink-0 text-sm leading-[1.3] font-medium text-fg/65 md:w-[248px]">{list.label}</p>
      <ul className="flex flex-wrap gap-x-8 gap-y-3">
        {list.links.map((k) => (
          <li key={k.href}>
            <TextLink href={k.href} className="text-navy">
              {k.label}
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------ government: credentials */

// Contracting facts first, in a blueprint panel: procurement officers come to
// an SDVOSB page for the UEI, CAGE code and capability statement.
export function CredentialPanel({ facts, link }: { facts: { label?: string; value: string }[]; link: L }) {
  return (
    <section aria-labelledby="contracting-heading" className="shell pt-16 lg:pt-u-96">
      <Rise className="relative grid gap-10 bg-[#0a48a6] p-6 text-bg sm:p-10 lg:grid-cols-[calc(var(--u)*360)_minmax(0,1fr)] lg:gap-u-72 lg:p-u-56">
        <RegMarks />
        <div className="flex flex-col items-start gap-6">
          <h2 id="contracting-heading" className="display text-[32px] sm:text-[40px] lg:fs-u-40">
            Contracting Information
          </h2>
          <a
            href={link.href}
            className="cta btn flex items-center gap-[9px] bg-sky px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg"
          >
            {link.label}
            <Arrow />
          </a>
        </div>
        <dl className="grid gap-px bg-bg/20 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.value} className="flex flex-col justify-end gap-3 bg-[#0a48a6] py-5 sm:px-6 sm:first:pl-0 sm:[&:nth-child(3)]:pl-0">
              {f.label && <dt className="text-sm leading-none text-bg/65">{f.label}</dt>}
              <dd className="text-lg leading-[1.35] font-medium tracking-[-0.005em] tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Rise>
    </section>
  );
}

/* ---------------------------------------------- government: case records */

type Record = {
  id: string;
  heading: string[];
  body: string;
  figures?: { value: string; text: string }[];
  /** a decade-long programme schedule drawn as bars, for records without figures */
  schedule?: boolean;
  link: L;
};

// Two public programmes as drafting sheets side by side: the demolition record
// with its tracked quantities, the federal record with its ten-year schedule.
export function CaseRecords({ records }: { records: Record[] }) {
  if (records.length === 1) return <WideRecord r={records[0]} />;
  return (
    <section className="shell pt-24 lg:pt-u-200">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-u-24">
        {records.map((r, i) => (
          <Rise key={r.id} order={i} className="relative flex flex-col border border-fg/15 p-6 sm:p-10 lg:p-u-48">
            <RegMarks size={14} className="text-fg/70" />
            <article aria-labelledby={r.id} className="flex h-full flex-col">
              <Heading id={r.id} lines={r.heading} className="lg:fs-u-40" />
              <p className="mt-6 text-base leading-[1.6] text-fg/75 lg:mt-u-32 lg:text-lg">{r.body}</p>
              {r.figures && (
                <dl className="mt-8 grid grid-cols-2 gap-px bg-fg/12 lg:mt-u-40">
                  {r.figures.map((f) => (
                    <div key={f.text} className="flex flex-col gap-2 bg-bg py-5 pr-4 [&:nth-child(even)]:pl-5">
                      <dt className="sr-only">{f.text}</dt>
                      <dd className="display text-[32px] leading-none sm:text-[40px] lg:fs-u-48">{f.value}</dd>
                      <dd className="text-sm leading-[1.4] text-fg/65">{f.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {r.schedule && <ScheduleBars />}
              <div className="mt-auto pt-8 lg:pt-u-40">
                <a href={r.link.href} className={outlineBtn}>
                  {r.link.label}
                  <Arrow />
                </a>
              </div>
            </article>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/** one record across the row: heading and copy left, figures or schedule right */
function WideRecord({ r }: { r: Record }) {
  return (
    <section className="shell pt-24 lg:pt-u-200">
      <Rise className="relative border border-fg/15 p-6 sm:p-10 lg:p-u-56">
        <RegMarks size={14} className="text-fg/70" />
        <article aria-labelledby={r.id} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-u-96">
          <div className="flex flex-col items-start">
            <Heading id={r.id} lines={r.heading} className="lg:fs-u-48" />
            <p className="mt-6 text-base leading-[1.6] text-fg/75 lg:mt-u-32 lg:text-lg">{r.body}</p>
            <a href={r.link.href} className={`${outlineBtn} mt-8 lg:mt-u-40`}>
              {r.link.label}
              <Arrow />
            </a>
          </div>
          <div className="flex flex-col justify-end">{r.schedule && <ScheduleBars />}</div>
        </article>
      </Rise>
    </section>
  );
}

/** a ten-year programme schedule: three programmes, bars that grow in */
function ScheduleBars() {
  const reduce = useReducedMotion();
  const rows = [
    { x: 0, w: 46, k: 0 },
    { x: 18, w: 58, k: 1 },
    { x: 34, w: 66, k: 2 },
  ];
  return (
    <svg viewBox="0 0 100 26" className="mt-8 w-full lg:mt-u-40" aria-hidden>
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={i * 10} y1={0} x2={i * 10} y2={23} stroke="currentColor" strokeOpacity={i % 5 === 0 ? 0.25 : 0.1} strokeWidth={0.2} />
      ))}
      {rows.map((r) => (
        <motion.rect
          key={r.k}
          x={r.x}
          y={3 + r.k * 7}
          height={3.6}
          width={r.w}
          rx={0.6}
          fill={r.k === 2 ? "#2089d8" : "#c5cbd8"}
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duration.slow * 2, ease: ease.out, delay: 0.2 + r.k * 0.15 }}
          style={{ transformBox: "fill-box", transformOrigin: "left" }}
        />
      ))}
      <line x1={0} y1={24.5} x2={100} y2={24.5} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.25} />
    </svg>
  );
}

/* ---------------------------------------------- commercial: two audiences */

// The page serves two readers; it says so up front and lets each jump to
// their part, like the menu panels: the audience, what we do for them, a way in.
export function AudienceRouter({ audiences }: { audiences: { title: string; text: string; href: string }[] }) {
  return (
    <section aria-label="Who this page is for" className="shell pt-16 lg:pt-u-96">
      <div className="grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-u-32">
        {audiences.map((a, i) => (
          <Rise key={a.href} order={i}>
            {/* each reader's way in: a ruled column with who it's for, the
                section it jumps to, and an arrow pointing down the page */}
            <a href={a.href} className="group flex h-full flex-col gap-4 border-t-2 border-fg pt-6 lg:gap-u-16 lg:pt-u-24">
              <span className="text-2xl leading-[1.2] font-semibold tracking-[-0.01em] transition-colors duration-[var(--duration-base)] group-hover:text-navy lg:text-[28px]">{a.title}</span>
              <span className="flex items-start justify-between gap-6">
                <span className="max-w-[420px] text-lg leading-[1.45] text-fg/75">{a.text}</span>
                <span className="mt-1 shrink-0 text-fg/60 transition-[color,transform] duration-[var(--duration-base)] group-hover:translate-y-1 group-hover:text-navy">
                  <svg aria-hidden width="18" height="18" viewBox="0 0 20 20" className="rotate-90">
                    <path
                      d="M17.7 10.7a1 1 0 0 0 0-1.4l-5-5a1 1 0 1 0-1.4 1.4L14.6 9H3a1 1 0 1 0 0 2h11.6l-3.3 3.3a1 1 0 1 0 1.4 1.4l5-5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </span>
            </a>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/** the facility-owner proof: the microgrid example and the owners' links, in a sheet */
export function ProofSheet({ body, link, lists }: { body: string; link: L; lists: { label: string; links: L[] }[] }) {
  return (
    <section className="shell pt-16 lg:pt-u-120">
      <Rise className="relative grid gap-8 rounded-[4px] bg-[#f1f3f6] p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-u-72 lg:p-u-56">
        <div className="flex flex-col items-start gap-6">
          <p className="text-xl leading-[1.45] font-medium tracking-[-0.01em] lg:text-2xl">{body}</p>
          <a href={link.href} className={outlineBtn}>
            {link.label}
            <Arrow />
          </a>
        </div>
        <div className="self-end">
          {lists.map((l) => (
            <LinkLine key={l.label} list={l} />
          ))}
        </div>
      </Rise>
    </section>
  );
}

/* ------------------------------------------- commercial: owner checklist */

// What owners write into the contract, as the checklist a deliverable has to
// pass; each item is ticked as it comes into view.
export function OwnerChecklist({
  id,
  heading,
  intro,
  checks,
  body,
  list,
}: {
  id: string;
  heading: string[];
  intro?: string;
  checks?: string[];
  body: string[];
  list: { label: string; links: L[] };
}) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby={id} className="shell pt-24 lg:pt-u-200">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*640)] lg:gap-u-96">
        <div>
          <div className="lg:sticky lg:top-28">
            <Heading id={id} lines={heading} className="lg:fs-u-64" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {intro && (
            <Rise as="p" className="text-lg leading-[1.5] font-semibold tracking-[-0.005em] text-fg">
              {intro}
            </Rise>
          )}
          {checks && (
          <ul className="border-t border-fg/15">
            {checks.map((c, i) => (
              <Rise as="li" key={c} order={i} className="flex items-center gap-4 border-b border-fg/15 py-4 text-lg leading-[1.35]">
                <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" className="shrink-0">
                  <rect x="0.75" y="0.75" width="20.5" height="20.5" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
                  <motion.path
                    d="M6 11.5l3.4 3.4L16 7.6"
                    fill="none"
                    stroke="#1f78d1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                    transition={{ duration: duration.base, ease: ease.out, delay: 0.25 + i * 0.12 }}
                  />
                </svg>
                {c}
              </Rise>
            ))}
          </ul>
          )}
          {body.map((p) => (
            <Rise as="p" key={p} className="text-lg leading-[1.5] tracking-[-0.005em] text-fg/85">
              {p}
            </Rise>
          ))}
        </div>
      </div>
      <div className="mt-10 lg:mt-u-56">
        <LinkLine list={list} />
      </div>
    </section>
  );
}

/* ---------------------------------------------- oil and gas: the window */

// The five commitments placed on the shutdown they serve: before the unit
// comes down, through the fixed window (shaded), and at startup.
export function ShutdownTimeline({
  phases,
}: {
  phases: { name?: string; span: 1 | 3; items: { lead: string; text: string }[] }[];
}) {
  return (
    <div className="mt-12 lg:mt-u-96">
      {/* the window: a rule with a marker at each phase, the shutdown shaded */}
      <div aria-hidden className="relative hidden h-10 lg:grid lg:grid-cols-5">
        {phases.map((p, pi) => (
          <div key={pi} className={`relative ${p.span === 3 ? "col-span-3 bg-sky/10" : ""}`}>
            <span className="absolute inset-x-0 top-1/2 h-px bg-fg/25" />
            <span className={`absolute top-1/2 left-0 size-2.5 -translate-y-1/2 ${p.span === 3 ? "bg-sky" : "bg-fg/60"}`} />
          </div>
        ))}
        <span className="absolute top-1/2 right-0 size-2.5 -translate-y-1/2 bg-fg/60" />
      </div>
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-0">
        {phases.map((p, pi) => (
          <div key={pi} className={`flex flex-col gap-6 lg:pt-6 ${p.span === 3 ? "lg:col-span-3 lg:bg-sky/10 lg:px-u-24" : "lg:pr-u-32"}`}>
            {p.name && (
              <Rise order={pi}>
                <p className="text-sm leading-none text-fg/50">{p.name}</p>
              </Rise>
            )}
            <div className={`grid gap-8 pb-8 ${p.span === 3 ? "md:grid-cols-3 lg:gap-u-24" : ""}`}>
              {p.items.map((it, i) => (
                <Rise key={it.lead} order={pi + i} className="flex flex-col gap-3 border-t border-fg/15 pt-4">
                  <p className="text-xl leading-[1.25] font-semibold tracking-[-0.01em]">{it.lead}</p>
                  <p className="text-base leading-[1.5] text-fg/70">{it.text}</p>
                </Rise>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineSection({
  id,
  heading,
  body,
  phases,
}: {
  id: string;
  heading: string[];
  body: string;
  phases: { name?: string; span: 1 | 3; items: { lead: string; text: string }[] }[];
}) {
  return (
    <section aria-labelledby={id} className="shell pt-24 lg:pt-u-200">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*640)] lg:items-end lg:gap-u-96">
        <Heading id={id} lines={heading} className="lg:fs-u-64" />
        <Rise as="p" className="text-lg leading-[1.5] tracking-[-0.005em] text-fg/85">
          {body}
        </Rise>
      </div>
      <RailedRows items={phases.flatMap((p) => p.items)} />
    </section>
  );
}

// The commitments as ruled rows (title beside its line, in shutdown order),
// in the same columns as the project pages' points, with the records' rail
// down the left: ruled ticks, a longer tick at each row, and a dot that
// travels down with the scroll, turning the rail and each row's tick blue.
function RailedRows({ items }: { items: { lead: string; text: string }[] }) {
  const list = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [stops, setStops] = useState<number[]>([]);
  const [lit, setLit] = useState(0);

  // each row's tick sits level with its title
  useLayoutEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const measure = () => {
      const h = ul.offsetHeight || 1;
      setStops(
        [...ul.children].map((li) => {
          const el = li as HTMLElement;
          const t = el.querySelector("p");
          return (el.offsetTop + (t ? t.offsetTop + t.offsetHeight / 2 : 0)) / h;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: list, offset: ["start 60%", "end 60%"] });
  const smooth = useSpring(scrollYProgress, scrollSpring);
  const at = reduce ? scrollYProgress : smooth;
  const dotTop = useTransform(at, (v) => Math.min(1, Math.max(0, v)) * 100 + "%");
  useMotionValueEvent(at, "change", (v) => setLit(stops.filter((st) => v >= st).length));

  return (
    <div className="mt-16 grid gap-6 lg:mt-u-120 lg:grid-cols-12 lg:gap-x-[calc(var(--u)*24)]">
      <div className="relative lg:col-span-8 lg:col-start-4">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[calc(var(--u)*-128)] hidden w-6 lg:block">
          {/* grey rule with ticks every 16 and 64 */}
          <span className="absolute inset-y-0 left-3 w-px bg-fg/20" />
          <span className="absolute inset-y-0 left-3 w-[10px] [background-image:repeating-linear-gradient(to_bottom,rgb(0_6_17/0.18)_0_1px,transparent_1px_16px),repeating-linear-gradient(to_bottom,rgb(0_6_17/0.18)_0_1px,transparent_1px_64px)] [background-size:5px_100%,10px_100%] [background-repeat:no-repeat]" />
          {/* blue behind the dot */}
          <motion.span className="absolute top-0 left-3 h-full w-px origin-top bg-sky" style={{ scaleY: at }} />
          {/* a longer tick level with each row's title */}
          {stops.map((st, i) => (
            <span
              key={i}
              className={"absolute left-1 h-px w-[17px] transition-colors duration-[var(--duration-base)] " + (i < lit ? "bg-sky" : "bg-fg/40")}
              style={{ top: st * 100 + "%" }}
            />
          ))}
          <motion.span
            className="absolute left-[7px] size-[11px] -translate-y-1/2 rounded-full bg-sky shadow-[0_0_0_4px_rgb(32_137_216/0.15)]"
            style={{ top: dotTop }}
          />
        </div>
        <ul ref={list}>
          {items.map((it, i) => (
            <Rise
              as="li"
              key={it.lead}
              order={i}
              className="relative grid gap-2 border-t border-fg/20 py-6 last:border-b sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-8 lg:py-u-28"
            >
              <p className="text-lg leading-[1.3] font-semibold">{it.lead}</p>
              <p className="text-base leading-[1.55] text-fg/70">{it.text}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------------- oil and gas: safety and mobilization */

// On navy, as the site's dark quote bands: safety with the training figure
// that backs it, mobilization with the team growing and shrinking.
/** the 24-hour shift ruler: day and night shift bands over the hours, and
 *  MWC's coverage drawn across both in accent blue */
function ShiftRuler() {
  const reduce = useReducedMotion();
  const hours = Array.from({ length: 25 }, (_, h) => h);
  const x = (h: number) => (h / 24) * 100;
  return (
    <div aria-hidden className="relative w-full select-none">
      {/* the two shifts: day 06–18, night 18–06 (wraps the ends) */}
      <div className="relative h-14">
        <div className="absolute inset-y-0 flex items-center gap-2 rounded-[4px] bg-bg/[0.12] px-3" style={{ left: x(6) + "%", width: x(12) + "%" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-bg/80">
            <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute inset-y-0 left-0 rounded-[4px] bg-bg/[0.05]" style={{ width: x(6) + "%" }} />
        <div className="absolute inset-y-0 flex items-center rounded-[4px] bg-bg/[0.05] px-3" style={{ left: x(18) + "%", right: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-bg/80">
            <path d="M12.5 10.2A5.5 5.5 0 0 1 5.8 3.5a5.5 5.5 0 1 0 6.7 6.7Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* coverage: one unbroken line across the day */}
      <div className="relative mt-4 h-[3px]">
        <span className="absolute inset-0 bg-bg/15" />
        <motion.span
          className="absolute inset-0 origin-left bg-sky"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: duration.slow * 2, ease: ease.out, delay: 0.2 }}
        />
      </div>
      {/* the hours */}
      <div className="relative mt-3 h-8">
        {hours.map((h) => (
          <span
            key={h}
            className={"absolute top-0 w-px " + (h % 6 === 0 ? "h-3 bg-bg/60" : "h-1.5 bg-bg/30")}
            style={{ left: "calc(" + x(h) + "% - " + (h === 24 ? 1 : 0) + "px)" }}
          />
        ))}
        {[0, 6, 12, 18, 24].map((h) => (
          <span
            key={h}
            className={"absolute top-4 text-xs leading-none text-bg/55 tabular-nums " + (h === 0 ? "" : h === 24 ? "-translate-x-full" : "-translate-x-1/2")}
            style={{ left: x(h) + "%" }}
          >
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>
    </div>
  );
}

/** the crew over a turnaround: one person, up to the full team at the
 *  shutdown, and back down at startup; the peak in accent blue */
function CrewCurve() {
  const reduce = useReducedMotion();
  const crew = [1, 2, 3, 5, 8, 11, 12, 12, 11, 7, 4, 2, 1];
  const top = Math.max(...crew);
  return (
    <div aria-hidden className="w-full select-none">
      <div className="flex h-[176px] items-end gap-[6px] border-b border-bg/30 pb-[6px]">
        {crew.map((n, i) => (
          <motion.div
            key={i}
            className="flex flex-1 flex-col-reverse gap-[4px]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.15 + i * 0.06 }}
          >
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className={"h-[10px] rounded-[1px] " + (n >= top - 1 ? "bg-sky" : "bg-bg/45")} />
            ))}
          </motion.div>
        ))}
      </div>
      {/* the same ruled ticks as the site's rails */}
      <div className="mt-2 h-2 [background-image:repeating-linear-gradient(to_right,rgb(251_252_255/0.3)_0_1px,transparent_1px_16px)] [background-size:100%_6px] [background-repeat:no-repeat]" />
    </div>
  );
}

export function SafetyMobilizeBand({
  safety,
  mobilize,
}: {
  safety: { id: string; heading: string[]; body: string; figure?: { value: string; text: string }; link: L };
  mobilize: { id: string; heading: string[]; body: string; from?: string; to?: string };
}) {
  // two rows, each its text beside a drawing of what it says: the shift
  // coverage for safety, the crew rising and falling for mobilization;
  // the second mirrors the first
  return (
    <section data-nav-theme="dark" className="mt-24 bg-navy py-24 text-bg lg:mt-u-200 lg:py-u-160">
      <div className="shell flex flex-col">
        <article
          aria-labelledby={safety.id}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-u-120"
        >
          <div className="flex flex-col gap-6">
            <Heading id={safety.id} lines={safety.heading} className="text-bg lg:fs-u-48" />
            <Rise as="p" className="max-w-[560px] text-lg leading-[1.5] text-bg/80">
              {safety.body}
            </Rise>
            {safety.figure && (
              <Rise className="flex items-baseline gap-5 border-t border-bg/20 pt-6">
                <span className="display shrink-0 text-[48px] leading-none text-bg lg:fs-u-64">{safety.figure.value}</span>
                <span className="text-base leading-[1.45] text-bg/70">{safety.figure.text}</span>
              </Rise>
            )}
            <Rise>
              <TextLink href={safety.link.href} className="text-bg">
                {safety.link.label}
              </TextLink>
            </Rise>
          </div>
          <Rise>
            <ShiftRuler />
          </Rise>
        </article>

        <div aria-hidden className="my-20 h-px bg-bg/15 lg:my-u-120" />

        <article
          aria-labelledby={mobilize.id}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-u-120"
        >
          <div className="flex flex-col gap-6 lg:order-2">
            <Heading id={mobilize.id} lines={mobilize.heading} className="text-bg lg:fs-u-48" />
            <Rise as="p" className="max-w-[560px] text-lg leading-[1.5] text-bg/80">
              {mobilize.body}
            </Rise>
          </div>
          <div className="lg:order-1">
            <CrewCurve />
            {mobilize.from && mobilize.to && (
              <div className="mt-3 flex justify-between text-sm text-bg/60">
                <span>{mobilize.from}</span>
                <span>{mobilize.to}</span>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}


/* --------------------------------------- government: stacked case panels */

type CasePanel = {
  id: string;
  heading: string[];
  /** the doc's result lines, each with its figure picked out */
  figures?: { value: string; text: string }[];
  body: string;
  icon: IconKey;
  link: L;
};

// After podiumautomation.com's service cards: full-width panels that pin as
// they reach the top, each later panel sliding up over the one before until
// only its title strip shows. Title top left with its facts beneath, the
// drawing in a gridded drafting frame top right, a rule, then the story and
// the link. Each panel a step darker than the last.
export function CaseStack({ cases }: { cases: CasePanel[] }) {
  // sky first, then the primary navy
  const grounds = ["#2089d8", "#072871"];
  const list = useRef<HTMLDivElement>(null);
  // A pinned card lets go when the stack ends below it. If a later card is
  // taller than the screen left under the earlier titles (short laptop
  // screens), it would let go first and slide over those titles; a bottom
  // margin on each earlier card makes it let go no sooner than the cards after.
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const cards = [...el.querySelectorAll(":scope > article")] as HTMLElement[];
    const fit = () => {
      cards.forEach((c) => (c.style.marginBottom = ""));
      if (getComputedStyle(cards[0]).position !== "sticky") return;
      let below = -Infinity;
      for (let k = cards.length - 1; k >= 0; k--) {
        const bottom = parseFloat(getComputedStyle(cards[k]).top) + cards[k].offsetHeight;
        const gap = Math.max(0, below - bottom);
        cards[k].style.marginBottom = gap ? `${gap}px` : "";
        below = bottom + gap;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  return (
    <section aria-label="Case studies" className="pt-28 lg:pt-u-240">
      <div ref={list} className="flex flex-col">
        {cases.map((c, i) => (
          <CaseCard key={c.id} c={c} i={i} ground={grounds[i % grounds.length]} />
        ))}
      </div>
    </section>
  );
}

// One case: it pins below the title strips of the cards before it, and its
// ground opens out from the page column to the full screen as it scrolls in,
// as the ownership panel does on Power Producers. Only clip-path animates.
function CaseCard({ c, i, ground }: { c: CasePanel; i: number; ground: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 35%"] });
  const clipPath = useTransform(scrollYProgress, (p) => {
    const k = reduce ? 0 : (1 - p) / 2;
    return `inset(0 calc((100% - min(100%, var(--u) * 1376)) * ${k.toFixed(4)}))`;
  });
  return (
    <article
      ref={ref}
      aria-labelledby={c.id}
      data-nav-theme="dark"
      // each card fills the screen: on phones the screen under the nav, pinned
      // on desktop the screen left below the title strips above it. Later
      // cards wait half a screen of scroll, so the one before holds full-screen.
      className={`case-card relative flex min-h-[calc(100svh-64px)] flex-col text-bg lg:sticky lg:min-h-[var(--fill)] ${i > 0 ? "lg:mt-[50svh]" : ""}`}
      style={{
        top: `calc(72px + ${i} * var(--strip))`,
        ["--fill" as string]: `calc(100svh - 72px - ${i} * var(--strip))`,
      }}
    >
      {/* the ground and its drawing, opening out together */}
      <motion.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ backgroundColor: ground, clipPath }}>
        <Terrain />
        <CaseScene icon={c.icon} ground={ground} className="absolute inset-y-0 right-0 hidden h-full w-[52%] lg:block" />
      </motion.div>
      <div className="shell relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col pt-20 pb-20 lg:w-[calc(var(--u)*760)] lg:pt-[var(--pad)] lg:pb-[var(--pad)]">
          <Heading id={c.id} lines={c.heading} className="text-bg lg:fs-u-48" />
          <CaseScene icon={c.icon} ground={ground} tight className="mt-8 aspect-[4/3] w-full lg:hidden" />
          {c.figures && (
            <dl className="mt-12 flex flex-col gap-10 lg:mt-u-72 lg:gap-u-64">
              {c.figures.map((f) => (
                // one figure per row: the number, then its line beside it
                <div key={f.text} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[calc(var(--u)*176)_minmax(0,1fr)] lg:gap-u-16">
                  <dd aria-hidden className="display text-[34px] leading-none lg:fs-u-48">
                    {f.value}
                  </dd>
                  <dt className="max-w-[360px] text-base leading-[1.4] text-bg/80">{f.text}</dt>
                </div>
              ))}
            </dl>
          )}
          {/* a minimum gap, then the story and link sit at the foot of the card */}
          <div aria-hidden className="h-12 shrink-0 lg:h-u-64" />
          <div className="mt-auto border-t border-bg/25 pt-10 lg:pt-u-56">
            <p className="text-lg leading-[1.55] font-medium tracking-[-0.005em] text-bg/90 lg:text-xl">{c.body}</p>
            <div className="mt-8 lg:mt-u-40">
              <TextLink href={c.link.href} className="text-bg">
                {c.link.label}
              </TextLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
