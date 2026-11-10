"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Texture } from "@/components/ui/Texture";
import { parallax, PHOTO_QUALITY, workstreamsScroll } from "@/lib/motion";

type Workstream = {
  title: string;
  image: string;
  /** Figma crop of the photo inside its 445×600 frame */
  crop?: { left: string; width: string };
  titleClass: string;
  description: string;
  services: string[];
};

// Figma "Workstream Cards" (575:1227)
export const workstreams: Workstream[] = [
  {
    title: "Plan and Develop",
    image: "/figma/ws-plan-hd.jpg",
    titleClass: "lg:top-u-498 lg:w-u-320",
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
    titleClass: "lg:top-u-498 lg:w-u-320",
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
    titleClass: "lg:top-u-498 lg:w-u-320",
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
    image: "/figma/ws-decom-hd.jpg",
    crop: { left: "-53.69%", width: "188.76%" },
    titleClass: "lg:top-u-518 lg:w-u-346",
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

function Card({ ws, rowX, enabled }: { ws: Workstream; rowX: MotionValue<number>; enabled: boolean }) {
  // Photo drifts against the row's movement, by how far the card is from centre.
  const ref = useRef<HTMLElement>(null);
  const centre = useRef(0);
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) centre.current = el.offsetLeft + el.offsetWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const offset = useTransform(() => {
    if (!enabled) return 0;
    const vw = document.documentElement.clientWidth;
    return Math.max(-1, Math.min(1, (centre.current + rowX.get() - vw / 2) / vw));
  });
  const drift = useSpring(useTransform(offset, (d) => -d * parallax.travel), parallax.spring);
  const x = useTransform(drift, (v) => `${v.toFixed(3)}%`);
  const scale = useSpring(
    useTransform(offset, (d) => (enabled ? parallax.scaleCentre + (parallax.scaleEdge - parallax.scaleCentre) * Math.abs(d) : 1)),
    parallax.spring,
  );

  return (
    <article ref={ref} className="flex w-[300px] shrink-0 snap-start flex-col gap-6 lg:w-auto lg:flex-row lg:items-stretch lg:gap-u-40">
      <div className="relative h-[420px] w-[300px] shrink-0 overflow-hidden bg-navy lg:h-u-600 lg:w-u-445">
        <ImageReveal>
          <motion.div className="absolute inset-0 will-change-transform" style={{ x, scale }}>
            {ws.crop ? (
              <div className="absolute top-0 h-full" style={{ left: ws.crop.left, width: ws.crop.width }}>
                <Image src={ws.image} alt="" fill sizes="(min-width: 1024px) 60vw, 600px" quality={PHOTO_QUALITY} className="object-cover" />
              </div>
            ) : (
              <Image src={ws.image} alt="" fill sizes="(min-width: 1024px) 32vw, 300px" quality={PHOTO_QUALITY} className="object-cover" />
            )}
          </motion.div>
          <div aria-hidden className="absolute inset-0 bg-night/15" />
          <Texture top="-70.29%" height="280.21%" />
        </ImageReveal>

        {/* jagged band along the bottom: sky edge + white fill (Figma 624:428) */}
        <img src="/comp2/ws-band-v2.svg" alt="" aria-hidden className="absolute bottom-0 left-0 h-[29.17%] w-full" />

        <h3
          className={`absolute bottom-5 left-5 w-[240px] font-display text-[32px] leading-[0.9] font-black tracking-[-0.01em] text-fg lg:bottom-auto lg:left-u-24 lg:fs-u-40 ${ws.titleClass}`}
        >
          {ws.title}
        </h3>
      </div>

      <div className="flex w-[300px] flex-col pt-3 lg:w-u-329">
        <div className="flex flex-col gap-12 pb-3">
          <p className="text-base leading-[1.5] font-medium tracking-[-0.005em] text-bg">{ws.description}</p>
          <ul className="flex flex-col gap-3">
            {ws.services.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  className="block border-b border-bg/10 pb-2 text-base leading-[1.3] font-bold tracking-[-0.005em] text-bg transition-colors hover:text-sky"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

// "Project Support Built Around Your Scope" (Figma y=916–1682 of the content
// frame). Desktop: pins to the viewport and vertical scroll slides the row
// (intro copy + 4 cards) sideways until the last card is in view, as in comp 1.
export function Workstreams2() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const travel = useMotionValue(0);

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const row = rowRef.current;
      if (!row) return;
      const d = desktop.matches ? Math.max(0, row.scrollWidth - document.documentElement.clientWidth) : 0;
      travel.set(d);
      setDistance(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, [travel]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * travel.get());
  const reduce = useReducedMotion();

  // keyboard: tabbing to an off-screen card scrolls the page to where it's in view
  const onFocusCapture = (e: React.FocusEvent) => {
    const section = sectionRef.current;
    const card = (e.target as HTMLElement).closest("article");
    if (!section || !card || distance === 0) return;
    const r = card.getBoundingClientRect();
    if (r.left >= 0 && r.right <= document.documentElement.clientWidth) return;
    const shift = Math.min(distance, Math.max(0, card.offsetLeft - parseFloat(getComputedStyle(rowRef.current!).paddingLeft)));
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + shift * workstreamsScroll.ratio, behavior: "instant" });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="support-heading"
      className="relative pt-24 lg:pt-0"
      style={distance ? { height: `calc(100svh + ${distance * workstreamsScroll.ratio}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden lg:pt-[calc(var(--u)*40)]">
        <div className="shell">
          <RevealHeading id="support-heading" className="display text-[40px] text-bg sm:text-[56px] lg:w-u-794 lg:fs-u-64">
            <Line className="block">Project Support Built</Line>
            <Line className="block">Around Your Scope</Line>
          </RevealHeading>
        </div>

        <motion.div
          ref={rowRef}
          style={{ x }}
          onFocusCapture={onFocusCapture}
          className="mt-10 flex flex-col gap-10 px-4 lg:mt-u-64 lg:w-max lg:flex-row lg:items-start lg:gap-u-136 lg:pr-[calc(var(--bleed)+var(--u)*32)] lg:pl-[calc(var(--bleed)+var(--u)*32)]"
        >
          <div className="flex max-w-[329px] shrink-0 flex-col gap-5 pt-3 text-base leading-[1.5] font-medium text-bg/90 lg:w-u-329">
            <p>
              MWC’s Workstreams are codified delivery systems that establish how project management, field oversight,
              scheduling, safety, documentation and reporting work together.
            </p>
            <p>
              Your scope determines which disciplines are applied, how responsibilities are assigned and what
              information your team receives. Whether you need one specialist or an integrated project team, you get a
              defined approach to managing the work.
            </p>
          </div>

          <div
            role="region"
            aria-label="Workstream cards"
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 lg:mx-0 lg:snap-none lg:gap-u-80 lg:overflow-visible lg:px-0"
          >
            {workstreams.map((ws) => (
              <Card key={ws.title} ws={ws} rowX={x} enabled={distance > 0 && !reduce} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
