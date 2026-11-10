"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { duration, ease, PHOTO_QUALITY, timeline } from "@/lib/motion";

type Workstream = { title: string; image: string; description: string; services: string[] };

// Comp 3 Figma (583:2219 y=3782–6285).
const workstreams: Workstream[] = [
  {
    title: "Plan and Develop",
    image: "/figma/ws-plan-hd.jpg",
    description:
      "MWC helps you establish your scope, schedule, budget and delivery responsibilities before construction begins. We coordinate technical reviews, identify dependencies and set up the controls you need to track decisions and project performance.",
    services: [
      "Owner’s Representative",
      "Engineering Services",
      "Project/Program Management",
      "Project Scheduling",
      "Project Coordination",
    ],
  },
  {
    title: "Build and Commission",
    image: "/comp2/ws-build-hd.jpg",
    description:
      "During construction, we coordinate field activities around your contract requirements, schedule and budget. Our team monitors contractor progress, reviews proposed changes, provides safety oversight and tracks inspections and documentation through turnover.",
    services: [
      "Owner’s Representative",
      "Engineering Services",
      "Construction Management",
      "Project/Program Management",
      "Project Scheduling",
      "Safety Management",
      "Utility Service Coordination",
      "Project Coordination",
    ],
  },
  {
    title: "Operate and Maintain",
    image: "/figma/ws-operate-hd.jpg",
    description:
      "During construction, we coordinate field activities around your contract requirements, schedule and budget. Our team monitors contractor progress, reviews proposed changes, provides safety oversight and tracks inspections and documentation through turnover.",
    services: [
      "Owner’s Representative",
      "Engineering Services",
      "Construction Management",
      "Project/Program Management",
      "Project Scheduling",
      "Safety Management",
      "Technology Implementation",
      "Project Coordination",
    ],
  },
  {
    title: "Decommission",
    image: "/comp1r/ws-decom-hd.jpg",
    description:
      "MWC coordinates decommissioning activities within the agreed scope, oversees demolition contractors and tracks costs, progress and closeout documentation.",
    services: [
      "Decommissioning",
      "Owner’s Representative",
      "Construction Management",
      "Project/Program Management",
      "Project Scheduling",
      "Safety Management",
    ],
  },
];

/** The card photo: 200×300, opening out to 280×400 as the card comes up to
 *  the middle of the screen, and staying open once it has passed. The frame
 *  is 280×400 and clipped on all sides, so only clip-path animates and the
 *  photo never stretches. */
function CardPhoto({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const { from, to, reach } = timeline.widen;
  // 0 until the card nears the centre → 1 at the centre, and 1 from then on
  const near = useTransform(scrollYProgress, (p) => (p >= 0.5 ? 1 : Math.max(0, 1 - (0.5 - p) / reach)));
  const open = useSpring(near, timeline.spring);
  const sideX = (1 - from.w / to.w) * 50; // % clipped left/right when closed
  const sideY = (1 - from.h / to.h) * 50; // % clipped top/bottom when closed
  const clipPath = useTransform(open, (t) => {
    const k = reduce ? 0 : 1 - t;
    const x = (sideX * k).toFixed(2);
    const y = (sideY * k).toFixed(2);
    return `inset(${y}% ${x}% ${y}% ${x}%)`;
  });
  return (
    <motion.div
      ref={ref}
      className="relative h-[352px] w-[246px] overflow-hidden lg:h-u-400 lg:w-u-280"
      style={{ clipPath }}
    >
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 20vw, 250px" quality={PHOTO_QUALITY} className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-night/15" />
      <Texture top="-70.29%" height="280.21%" />
    </motion.div>
  );
}

/**
 * "Project Support Built Around Your Scope Across Industries" (comp 3).
 * The title sticks at the top left while the workstreams scroll past. A line
 * runs down the centre of the card column; its white part draws down with the
 * scroll (tip held at `timeline.tipAt` of the viewport, with a diamond tip),
 * and each card + its details turn solid once the tip reaches them.
 */
export function WorkstreamTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [reached, setReached] = useState(1); // cards the line has reached
  const reduce = useReducedMotion();

  // 0 when the track's top hits the tip line, 1 when its bottom does
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${timeline.tipAt * 100}%`, `end ${timeline.tipAt * 100}%`],
  });
  const drawn = useSpring(scrollYProgress, timeline.spring);
  const lineScale = useTransform(drawn, (p) => (reduce ? 1 : Math.max(0, Math.min(1, p))));
  const tipTop = useTransform(lineScale, (p) => `${p * 100}%`);

  useMotionValueEvent(scrollYProgress, "change", () => {
    const track = trackRef.current;
    if (!track) return;
    const tip = window.innerHeight * timeline.tipAt;
    let n = 1; // the first card is active as soon as the section starts
    cardRefs.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= tip) n = Math.max(n, i + 1);
    });
    setReached(n);
  });

  return (
    <section aria-labelledby="timeline-heading" className="shell pt-16 pb-24 lg:pt-u-64 lg:pb-u-120">
      {/* top rule the line hangs from (Figma 594:3351: ink 20%) */}
      <div aria-hidden className="h-px bg-fg/20" />

      <div className="relative mt-10 lg:mt-0 lg:grid lg:grid-cols-[calc(var(--u)*445)_1fr]">
        {/* sticky title (Figma 594:3350: 64px, 445 wide, 65 below the rule) */}
        <div className="lg:relative">
          <RevealHeading
            id="timeline-heading"
            className="display text-[40px] text-fg sm:text-[56px] lg:sticky lg:top-[calc(var(--u)*120)] lg:pt-u-65 lg:fs-u-64"
          >
            <Line className="block">Project Support</Line>
            <Line className="block">Built Around</Line>
            <Line className="block">Your Scope</Line>
            <Line className="block">Across Industries</Line>
          </RevealHeading>
        </div>

        <div ref={trackRef} className="relative mt-12 lg:mt-0 lg:pt-u-307">
          {/* The centre line (card centre = Figma x 720, i.e. 243 into this
              column). Under the cards: the full-length guide, 2px ink at 10%
              (594:3352). Over them: the line that follows the scroll, 1.5px
              white with a filled diamond tip and a soft shadow so it reads on
              both the page and the navy cards (594:3353). */}
          <div aria-hidden className="pointer-events-none absolute top-0 bottom-0 left-[186px] hidden w-0.5 -translate-x-1/2 bg-fg/10 lg:left-u-243 lg:block" />
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 left-[186px] z-10 hidden w-[1.5px] -translate-x-1/2 [filter:drop-shadow(0_0_1px_rgb(0_6_17/0.45))] lg:left-u-243 lg:block"
          >
            <motion.div className="absolute inset-0 origin-top bg-bg" style={{ scaleY: lineScale }} />
            <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: tipTop }}>
              <svg width="9" height="9" viewBox="0 0 8.66 8.66" className="block">
                <path d="M4.33 0 8.66 4.33 4.33 8.66 0 4.33Z" fill="#fbfcff" />
              </svg>
            </motion.div>
          </div>

          <ol className="relative flex flex-col gap-16 lg:gap-u-64">
            {workstreams.map((ws, i) => {
              const active = i < reached || !!reduce;
              const fade = { duration: duration.slow, ease: ease.out };
              return (
                <li
                  key={ws.title}
                  ref={(el) => void (cardRefs.current[i] = el)}
                  className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-u-56"
                >
                  {/* card (Figma 594:3588): 373×500 navy, photo 198×300, title over it */}
                  <motion.div
                    className="relative flex h-[440px] w-full max-w-[373px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-navy lg:ml-[calc(var(--u)*57)] lg:h-u-500 lg:w-u-373"
                    animate={{ opacity: active ? 1 : timeline.inactiveOpacity }}
                    transition={fade}
                  >
                    <CardPhoto src={ws.image} />
                    <h3 className="absolute top-[calc(50%-32px)] left-1/2 w-[300px] -translate-x-1/2 text-center font-display text-[28px] leading-none font-black tracking-[-0.015em] text-bg uppercase lg:w-u-330 lg:fs-u-32">
                      {ws.title}
                    </h3>
                  </motion.div>

                  {/* details (Figma 594:3585): 445 wide, 52 below the card top */}
                  <motion.div
                    className="flex max-w-[445px] flex-col gap-8 lg:mt-u-52 lg:w-u-445"
                    animate={{ opacity: active ? 1 : timeline.inactiveOpacity }}
                    transition={fade}
                  >
                    <p className="text-base leading-[1.5] font-medium tracking-[-0.005em] text-fg/80">{ws.description}</p>
                    <ul className="flex flex-col gap-2">
                      {ws.services.map((s) => (
                        <li key={s}>
                          <a href="#" className="block pb-2 text-base leading-[1.3] font-bold tracking-[-0.005em] text-fg/80 hover:text-navy">
                            {s}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
