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
import { Arrow } from "@/components/ui/Arrow";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Texture } from "@/components/ui/Texture";
import { parallax, PHOTO_QUALITY, workstreamsScroll } from "@/lib/motion";

type Workstream = {
  title: string;
  image: string;
  imagePosition?: string;
  /** Title box on the tall image (Figma: bottom-left, above the band). */
  titleClass: string;
  description: string;
  services: string[];
  detail?: {
    image: string;
    position: "top" | "bottom";
    w: number;
    h: number;
    objectPosition?: string;
  };
};

const workstreams: Workstream[] = [
  {
    title: "Plan and Develop",
    image: "/figma/ws-plan-hd.jpg",
    titleClass: "lg:left-u-24 lg:top-u-544 lg:w-u-320",
    description:
      "MWC helps you establish your scope, schedule, budget and delivery responsibilities before construction begins. We coordinate technical reviews, identify dependencies and establish the controls you need to track decisions and project performance.",
    services: ["Engineering and Design Review", "Project and Program Management", "Project Controls and Scheduling"],
    detail: { image: "/figma/ws-plan-detail-hd.jpg", position: "top", w: 329, h: 219 },
  },
  {
    title: "Build and Commission",
    image: "/figma/ws-build-hd.jpg",
    imagePosition: "36% 50%",
    titleClass: "lg:left-u-24 lg:top-u-544 lg:w-u-320",
    description:
      "During construction, we coordinate field activities around your contract requirements, schedule and budget. Our team monitors contractor progress, reviews proposed changes, provides safety oversight and tracks inspections and documentation through turnover.",
    services: [
      "Construction Management",
      "Construction Safety Management",
      "Owner’s Representative",
      "Project Coordination and Document Control",
      "Utility and Interconnection Coordination",
    ],
    detail: { image: "/figma/ws-build-detail-hd.jpg", position: "bottom", w: 146, h: 219 },
  },
  {
    title: "Operate and Maintain",
    image: "/figma/ws-operate-hd.jpg",
    titleClass: "lg:left-u-24 lg:top-u-544 lg:w-u-320",
    description:
      "Your operating requirements guide how we plan outages, equipment overhauls and technology implementations. MWC coordinates scope, contractors and schedules, with reporting tied to completion milestones and, for outage work, your planned return-to-service date.",
    services: ["Plant Outage Planning and Management", "Technology Project Management"],
    detail: { image: "/figma/ws-operate-detail-hd.jpg", position: "top", w: 329, h: 349, objectPosition: "60% 50%" },
  },
  {
    title: "Decommission",
    image: "/figma/ws-decom-hd.jpg",
    titleClass: "lg:left-u-24 lg:top-u-564 lg:w-u-346",
    description:
      "Within the agreed scope, MWC coordinates decommissioning activities, oversees demolition contractors and tracks costs, progress and closeout documentation.",
    services: ["Power Plant Decommissioning"],
    detail: { image: "/figma/ws-decom-detail-hd.jpg", position: "bottom", w: 192, h: 219 },
  },
];

function Photo({
  src,
  objectPosition,
  sizes,
  motionStyle,
}: {
  src: string;
  objectPosition?: string;
  sizes: string;
  /** Parallax motion for the photo layer (drift, focus scale, speed
   *  stretch). The overlay + grain stay put, so it reads as a photo moving
   *  behind a window. */
  motionStyle?: { x: MotionValue<string>; scale: MotionValue<number>; scaleX: MotionValue<number> };
}) {
  return (
    <>
      <motion.div className="absolute inset-0 will-change-transform" style={motionStyle}>
        <Image src={src} alt="" fill sizes={sizes} quality={PHOTO_QUALITY} className="object-cover" style={{ objectPosition }} />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-night/15" />
      <Texture />
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

  const detail = ws.detail && (
    <div
      className="relative hidden shrink-0 overflow-hidden bg-navy lg:block"
      style={{ width: `calc(var(--u) * ${ws.detail.w})`, height: `calc(var(--u) * ${ws.detail.h})` }}
    >
      <ImageReveal>
        <Photo src={ws.detail.image} objectPosition={ws.detail.objectPosition} sizes="(min-width: 1024px) 30vw, 1px" motionStyle={motionStyle} />
      </ImageReveal>
    </div>
  );

  return (
    <article ref={cardRef} className="flex w-[300px] shrink-0 snap-start flex-col gap-5 lg:gap-u-40 lg:w-auto lg:flex-row lg:items-stretch">
      <div className="relative h-[440px] w-[300px] shrink-0 overflow-hidden bg-navy lg:h-u-654 lg:w-u-445">
        {/* photo wipes in top → bottom over the navy as the card arrives */}
        <ImageReveal>
          <Photo src={ws.image} objectPosition={ws.imagePosition} sizes="(min-width: 1024px) 40vw, 360px" motionStyle={motionStyle} />
        </ImageReveal>

        {/* Brand cut-out band along the bottom (Figma rotates it 180°):
            white edge + navy fill */}
        <img
          src="/figma/ws-shape-a.svg"
          alt=""
          aria-hidden
          className="absolute bottom-0 left-0 h-[25.38%] w-full rotate-180"
        />
        <img
          src="/figma/ws-shape-b.svg"
          alt=""
          aria-hidden
          className="absolute bottom-0 left-0 h-[24.46%] w-full rotate-180"
        />
        {/* MWC mountain mark, 55×24, centred 24px from the top */}
        <img
          src="/figma/ws-mark.svg"
          alt=""
          aria-hidden
          width={55}
          height={24}
          className="absolute top-[3.67%] left-1/2 h-[3.67%] w-[12.36%] -translate-x-1/2"
        />

        <h3
          className={`absolute bottom-6 left-5 w-[220px] font-display text-[36px] leading-[0.9] font-black tracking-[-0.01em] text-sky lg:bottom-auto lg:fs-u-48 ${ws.titleClass}`}
        >
          {ws.title}
        </h3>
      </div>

      <div className="flex w-[300px] flex-col justify-between gap-6 lg:w-u-329">
        {ws.detail?.position === "top" && detail}
        <div className="flex flex-col gap-8">
          <p className="text-base leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">{ws.description}</p>
          <ul className="flex flex-col gap-3 pb-3">
            {ws.services.map((s, i) => (
              <li key={s}>
                <a
                  href="#"
                  className={`block pb-2 text-base leading-[1.3] font-medium tracking-[-0.005em] text-fg/90 hover:text-navy ${
                    i < ws.services.length - 1 ? "border-b border-fg/10" : ""
                  }`}
                >
                  {s} →
                </a>
              </li>
            ))}
          </ul>
        </div>
        {ws.detail?.position === "bottom" && detail}
      </div>
    </article>
  );
}

// Figma "Workstream Section" (347:1531): intro + 4 cards in one 3830px row.
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
      className="relative pb-20 lg:pb-0"
      style={distance ? { height: `calc(100svh + ${distance * workstreamsScroll.ratio}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden lg:pt-[calc(var(--u)*84)]">
        <motion.div
          ref={rowRef}
          style={{ x }}
          onFocusCapture={onFocusCapture}
          className="flex flex-col gap-10 px-4 lg:w-max lg:flex-row lg:items-start lg:gap-u-137 lg:pr-[calc(var(--bleed)+var(--u)*32)] lg:pl-[calc(var(--bleed)+var(--u)*32)]"
        >
          <div className="flex w-full max-w-[445px] shrink-0 flex-col items-start gap-6 lg:w-u-445 lg:max-w-none">
            <p className="text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">
              Your scope determines which disciplines are applied, how responsibilities are assigned and what
              information your team receives. Whether you need one specialist or an integrated project team, you get a
              defined approach to managing the work.
            </p>
            <a
              href="#contact"
              className="cta flex items-center justify-center gap-[9px] bg-navy px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg"
            >
              Keep Your Projects on Schedule
              <Arrow />
            </a>
          </div>

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
