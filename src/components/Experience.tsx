"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FabricLayer, type FabricDir } from "@/components/motion/FabricLayer";
import { Cropped } from "@/components/ui/Cropped";
import { Texture } from "@/components/ui/Texture";
import { metricsScroll, PHOTO_QUALITY } from "@/lib/motion";

type Metric = {
  label: string;
  value: string;
  card: string;
  /** Background shown while this card is centred (Figma 483:452). */
  background: { image: string; overlay: number; crop?: { left: string; top: string; width: string; height: string } };
};

const metrics: Metric[] = [
  {
    label: "Capital project value supported",
    value: "$220M",
    card: "var(--color-sky)",
    background: { image: "/figma/metric-bg-1-hd.jpg", overlay: 0.25 },
  },
  {
    label: "Project assignments completed",
    value: "132",
    card: "var(--color-navy)",
    background: {
      image: "/figma/metric-bg-2-hd.jpg",
      overlay: 0.3,
      crop: { left: "-7.75%", top: "0%", width: "127.95%", height: "100%" },
    },
  },
  {
    label: "Facilities supported",
    value: "15",
    card: "var(--color-deep)",
    background: {
      image: "/figma/metric-bg-3-hd.jpg",
      overlay: 0.3,
      crop: { left: "0%", top: "-20.71%", width: "100%", height: "208.5%" },
    },
  },
  {
    label: "Combined years of relevant field experience",
    value: "120+",
    card: "var(--color-night)",
    background: { image: "/figma/metric-bg-4-hd.jpg", overlay: 0.3 },
  },
];

const N = metrics.length;
const { step, hold, valueWindow } = metricsScroll;
// Scroll timeline in "moves": move to card 0, hold, move to card 1, hold, …
const UNITS = N * (1 + hold);
// Breakpoints (0–1) where each move starts / each card is centred.
const moveStart = metrics.map((_, i) => (i * (1 + hold)) / UNITS);
const centred = metrics.map((_, i) => (i * (1 + hold) + 1) / UNITS);

function SectionPhoto() {
  return (
    <>
      <Cropped src="/figma/experience.png" left="-17.07%" top="-10.33%" width="126.21%" height="140.91%" />
      <div className="absolute inset-0 bg-black/60" />
      <Texture opacity={0.2} />
    </>
  );
}

function MetricPhoto({ metric }: { metric: Metric }) {
  return (
    <>
      {metric.background.crop ? (
        <Cropped src={metric.background.image} {...metric.background.crop} />
      ) : (
        <Image src={metric.background.image} alt="" fill sizes="100vw" quality={PHOTO_QUALITY} className="object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: `rgb(0 0 0 / ${metric.background.overlay})` }} />
      <Texture opacity={0.15} top="-48.7%" height="223.2%" />
    </>
  );
}

function MetricCard({
  metric,
  index,
  columnY,
  stops,
}: {
  metric: Metric;
  index: number;
  columnY: MotionValue<number>;
  stops: MotionValue<number[]>;
}) {
  // The value only shows once this card has reached the centre.
  const valueOpacity = useTransform(() => {
    const target = stops.get()[index + 1];
    if (target === undefined) return 0;
    const d = Math.abs(columnY.get() - target);
    return Math.min(1, Math.max(0, 1 - (d - valueWindow.sharp) / (valueWindow.fade - valueWindow.sharp)));
  });
  const valueY = useTransform(valueOpacity, [0, 1], [16, 0]);

  return (
    <li className="relative h-[445px] overflow-hidden lg:h-u-445" style={{ background: metric.card }}>
      <Texture />
      <p className="absolute top-6 left-6 w-[273px] font-display text-xl leading-[1.2] font-semibold tracking-[0.005em] text-bg/90">
        {metric.label}
      </p>
      <motion.p
        className="display absolute top-[calc(50%-26.5px)] left-6 text-[72px] lg:fs-u-92"
        style={{
          opacity: valueOpacity,
          y: valueY,
        }}
      >
        {metric.value}
      </motion.p>
      <Image
        src="/figma/metric-mark.svg"
        alt=""
        width={51}
        height={22}
        className="absolute top-[403px] left-[198px] lg:top-u-403"
      />
    </li>
  );
}

type Layer = { key: number; index: number; dir: FabricDir }; // index -1 = section photo

// Figma "Experience Image" (385:48). Once the section fills the viewport it
// pins; scrolling then steps the metric cards up through the centre one at a
// time. As a card heads for the centre its background is tugged in (the same
// fabric reveal as the Industries hover); its figure appears once centred.
// Scrolling resumes after the last card.
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Column translateY at rest (0) and with each card centred, in px.
  const stops = useMotionValue<number[]>([0]);
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const list = listRef.current;
      if (!stage || !list) return;
      const centre = stage.clientHeight / 2;
      const cards = [...list.children] as HTMLElement[];
      stops.set([0, ...cards.map((c) => centre - (list.offsetTop + c.offsetTop + c.offsetHeight / 2))]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [stops]);

  // Moves with holds: [rest → c0] hold [c0 → c1] hold …
  const columnY = useTransform(() => {
    const s = stops.get();
    const p = scrollYProgress.get();
    if (s.length < N + 1) return 0;
    for (let i = 0; i < N; i++) {
      if (p < moveStart[i]) return s[i];
      if (p < centred[i]) {
        const t = (p - moveStart[i]) / (centred[i] - moveStart[i]);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
        return s[i] + (s[i + 1] - s[i]) * e;
      }
    }
    return s[N];
  });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, centred[0]], [1, 0.5]);

  // Background: the card currently moving to (or sitting at) the centre.
  const [layers, setLayers] = useState<Layer[]>([]);
  const active = useRef(-1);
  const nextKey = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let index = -1;
    for (let i = 0; i < N; i++) if (p >= moveStart[i] + 0.0001) index = i;
    if (index === active.current) return;
    const dir: FabricDir = index > active.current ? 1 : -1;
    active.current = index;
    setLayers((ls) => [...ls, { key: nextKey.current++, index, dir }]);
  });
  const onLayerDone = (key: number) =>
    setLayers((ls) => ls.slice(Math.max(0, ls.findIndex((l) => l.key === key))));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="experience-heading"
      data-nav-theme="dark"
      className="relative text-bg"
      style={{ height: `calc(100svh * ${1 + UNITS * step})` }}
    >
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <SectionPhoto />
          {layers.map((l) => (
            <FabricLayer key={l.key} dir={l.dir} onDone={() => onLayerDone(l.key)}>
              {l.index < 0 ? <SectionPhoto /> : <MetricPhoto metric={metrics[l.index]} />}
            </FabricLayer>
          ))}
        </div>

        <div className="shell relative h-full">
          <motion.div style={{ opacity: headingOpacity }}>
          <RevealHeading
            id="experience-heading"
            className="display relative pt-24 text-[44px] sm:text-[72px] lg:absolute lg:inset-0 lg:p-0 lg:fs-u-120 lg:whitespace-nowrap"
          >
            <Line className="block lg:absolute lg:left-u-33 lg:top-u-81">Project</Line>
            <Line className="block text-right lg:absolute lg:left-u-380 lg:top-u-179 lg:text-left">Experience</Line>
            <span className="block text-right lg:contents">
              <Line className="lg:absolute lg:left-u-241 lg:top-u-277">And</Line>{" "}
              <Line className="lg:absolute lg:left-u-521 lg:top-u-277">Performance</Line>
            </span>
          </RevealHeading>
          </motion.div>

          {/* Scroll cue, gone as soon as the cards start to move */}
          <motion.div
            className="absolute top-[calc(50%+3.5px)] left-1/2 hidden w-[142px] -translate-1/2 flex-col items-center gap-2 lg:flex"
            style={{ opacity: cueOpacity }}
          >
            <div className="flex size-10 items-center justify-center rounded-[27.78px] border-[0.8px] border-dashed border-bg/20 bg-bg/10">
              <Image src="/figma/scroll-chevron.svg" alt="" width={18} height={18} className="rotate-180 opacity-80" />
            </div>
            <p className="text-[10px] tracking-[0.05em] text-bg/90">KEEP SCROLLING</p>
          </motion.div>

          {/* Metric stack (Figma "Metrics Stack": 446 wide, 32 gap). At rest
              the first card peeks in from the bottom by the same 504px the
              1036px-tall frame shows. */}
          <motion.ul
            ref={listRef}
            style={{ y: columnY }}
            className="absolute top-[calc(100%-300px)] left-1/2 flex w-[min(446px,calc(100%-32px))] -translate-x-1/2 flex-col gap-8 lg:top-[calc(100%-var(--u)*504)] lg:w-u-446 lg:gap-u-32"
          >
            {metrics.map((m, i) => (
              <MetricCard key={m.value} metric={m} index={i} columnY={columnY} stops={stops} />
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
