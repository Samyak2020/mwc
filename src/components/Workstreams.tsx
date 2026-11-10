"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Texture } from "@/components/ui/Texture";
import { parallax, PHOTO_QUALITY, workstreamsScroll } from "@/lib/motion";

type Workstream = {
  title: string;
  image: string;
  /** Figma crop of the photo inside its 445×600 frame */
  crop?: { left: string; width: string };
  /** Title box on the image (Figma: bottom-left, on the band). */
  titleClass: string;
  description: string;
  services: string[];
};

// Revised Figma "Workstream Cards" (629:844).
const workstreams: Workstream[] = [
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
      "Engineering Service",
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

function Photo({
  src,
  crop,
  sizes,
  motionStyle,
}: {
  src: string;
  crop?: Workstream["crop"];
  sizes: string;
  /** Parallax motion for the photo layer (drift, focus scale, speed
   *  stretch). The overlay + grain stay put, so it reads as a photo moving
   *  behind a window. */
  motionStyle?: { x: MotionValue<string>; scale: MotionValue<number>; scaleX: MotionValue<number> };
}) {
  return (
    <>
      <motion.div className="absolute inset-0 will-change-transform" style={motionStyle}>
        {crop ? (
          <div className="absolute top-0 h-full" style={{ left: crop.left, width: crop.width }}>
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 60vw, 600px" quality={PHOTO_QUALITY} className="object-cover" />
          </div>
        ) : (
          <Image src={src} alt="" fill sizes={sizes} quality={PHOTO_QUALITY} className="object-cover" />
        )}
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-night/15" />
      <Texture top="-70.29%" height="280.21%" />
    </>
  );
}

function WorkstreamCard({ ws, rowX, enabled }: { ws: Workstream; rowX: MotionValue<number>; enabled: boolean }) {
  // Controlled parallax: as the pinned row slides, each photo drifts against
  // the movement in proportion to how far its card is from the screen centre.
  const cardRef = useRef<HTMLElement>(null);
  const centre = useRef(0); // card centre within the (unscrolled) row, px
  useLayoutEffect(() => {
    const measure = () => {
      const el = cardRef.current;
      if (el) centre.current = el.offsetLeft + el.offsetWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  // d: −1 … 1, how far this card is from the screen centre (0 = centred).
  const offset = useTransform(() => {
    if (!enabled) return 0;
    const vw = document.documentElement.clientWidth;
    return Math.max(-1, Math.min(1, (centre.current + rowX.get() - vw / 2) / vw));
  });
  // Apple-style: follow through a critically damped spring (no overshoot,
  // always continues from the on-screen value, so reversals never jerk).
  const driftPct = useSpring(useTransform(offset, (d) => -d * parallax.travel), parallax.spring);
  const x = useTransform(driftPct, (v) => `${v.toFixed(3)}%`);
  // Settles into focus: zooms out slightly as the card reaches the centre.
  const scale = useSpring(
    useTransform(offset, (d) => (enabled ? parallax.scaleCentre + (parallax.scaleEdge - parallax.scaleCentre) * Math.abs(d) : 1)),
    parallax.spring,
  );
  // Speed encoding: a whisper of horizontal stretch while the row moves fast.
  const rowSpeed = useVelocity(rowX);
  const scaleX = useSpring(
    useTransform(rowSpeed, (v) =>
      enabled ? 1 + parallax.stretch.max * Math.min(1, Math.abs(v) / parallax.stretch.atVelocity) : 1,
    ),
    parallax.spring,
  );
  const motionStyle = { x, scale, scaleX };

  return (
    <article ref={cardRef} className="flex w-[300px] shrink-0 snap-start flex-col gap-6 lg:w-auto lg:flex-row lg:items-stretch lg:gap-u-40">
      <div className="relative h-[420px] w-[300px] shrink-0 overflow-hidden bg-navy lg:h-u-600 lg:w-u-445">
        {/* photo wipes in top → bottom over the navy as the card arrives */}
        <ImageReveal>
          <Photo src={ws.image} crop={ws.crop} sizes="(min-width: 1024px) 32vw, 300px" motionStyle={motionStyle} />
        </ImageReveal>

        {/* jagged band along the bottom: sky edge + navy fill (Figma 629:847) */}
        <img src="/comp1r/ws-band.svg" alt="" aria-hidden className="absolute bottom-0 left-0 h-[29.17%] w-full" />

        <h3
          className={`absolute bottom-5 left-5 w-[240px] font-display text-[32px] leading-[0.9] font-black tracking-[-0.01em] text-bg lg:bottom-auto lg:left-u-24 lg:fs-u-40 ${ws.titleClass}`}
        >
          {ws.title}
        </h3>
      </div>

      <div className="flex w-[300px] flex-col pt-3 lg:w-u-329">
        <div className="flex flex-col gap-12 pb-3">
          <p className="text-base leading-[1.5] font-medium tracking-[-0.005em] text-fg/80">{ws.description}</p>
          <ul className="flex flex-col gap-3">
            {ws.services.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  className="block border-b border-fg/10 pb-2 text-base leading-[1.3] font-bold tracking-[-0.005em] text-fg/80 transition-colors hover:text-navy"
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

// Revised Figma "Workstream Cards" (629:844): 4 cards in one row.
// Desktop: the section pins to the viewport and vertical scrolling moves the
// whole row sideways until the last card is in view, then the page carries
// on. Mobile: a plain swipeable carousel.
export function WorkstreamsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0); // horizontal travel in px
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

  // 0 when the section's top reaches the top of the viewport, 1 when its
  // bottom reaches the bottom: exactly the pinned stretch.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * travel.get());
  const reduce = useReducedMotion();

  // Keyboard: tabbing to a card that is off to the side scrolls the page to
  // the point where that card has slid into view.
  const onFocusCapture = (e: React.FocusEvent) => {
    const section = sectionRef.current;
    const card = (e.target as HTMLElement).closest("article");
    if (!section || !card || distance === 0) return;
    const r = card.getBoundingClientRect();
    if (r.left >= 0 && r.right <= document.documentElement.clientWidth) return;
    const shift = Math.min(distance, Math.max(0, card.offsetLeft - parseFloat(getComputedStyle(rowRef.current!).paddingLeft)));
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (shift / distance) * distance * workstreamsScroll.ratio, behavior: "instant" });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Workstreams"
      // cards sit 120 below the top while pinned; pulled up 40 so they start
      // 80 below the intro (Figma)
      className="relative pt-12 pb-20 lg:-mt-[calc(var(--u)*40)] lg:pt-0 lg:pb-0"
      style={distance ? { height: `calc(100svh + ${distance * workstreamsScroll.ratio}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-start lg:overflow-hidden lg:pt-u-120">
        <motion.div
          ref={rowRef}
          style={{ x }}
          onFocusCapture={onFocusCapture}
          className="flex flex-col gap-10 px-4 lg:w-max lg:flex-row lg:items-start lg:pr-[calc(var(--bleed)+var(--u)*32)] lg:pl-[calc(var(--bleed)+var(--u)*32)]"
        >
          <div
            role="region"
            aria-label="Workstream cards"
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 lg:mx-0 lg:snap-none lg:gap-u-80 lg:overflow-visible lg:px-0"
          >
            {workstreams.map((ws) => (
              <WorkstreamCard key={ws.title} ws={ws} rowX={x} enabled={distance > 0 && !reduce} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
