"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { workstreamsScroll } from "@/lib/motion";

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
    image: "/figma/ws-plan.png",
    titleClass: "lg:left-u-24 lg:top-u-544 lg:w-u-320",
    description:
      "MWC helps you establish your scope, schedule, budget and delivery responsibilities before construction begins. We coordinate technical reviews, identify dependencies and establish the controls you need to track decisions and project performance.",
    services: ["Engineering and Design Review", "Project and Program Management", "Project Controls and Scheduling"],
    detail: { image: "/figma/ws-plan-detail.png", position: "top", w: 329, h: 219 },
  },
  {
    title: "Build and Commission",
    image: "/figma/ws-build.png",
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
    detail: { image: "/figma/ws-build-detail.png", position: "bottom", w: 146, h: 219 },
  },
  {
    title: "Operate and Maintain",
    image: "/figma/ws-operate.png",
    titleClass: "lg:left-u-24 lg:top-u-544 lg:w-u-320",
    description:
      "Your operating requirements guide how we plan outages, equipment overhauls and technology implementations. MWC coordinates scope, contractors and schedules, with reporting tied to completion milestones and, for outage work, your planned return-to-service date.",
    services: ["Plant Outage Planning and Management", "Technology Project Management"],
    detail: { image: "/figma/ws-operate-detail.png", position: "top", w: 329, h: 349, objectPosition: "60% 50%" },
  },
  {
    title: "Decommission",
    image: "/figma/ws-decom.png",
    titleClass: "lg:left-u-24 lg:top-u-564 lg:w-u-346",
    description:
      "Within the agreed scope, MWC coordinates decommissioning activities, oversees demolition contractors and tracks costs, progress and closeout documentation.",
    services: ["Power Plant Decommissioning"],
    detail: { image: "/figma/ws-decom-detail.png", position: "bottom", w: 192, h: 219 },
  },
];

function Photo({ src, objectPosition, sizes }: { src: string; objectPosition?: string; sizes: string }) {
  return (
    <>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" style={{ objectPosition }} />
      <div aria-hidden className="absolute inset-0 bg-night/15" />
      <Texture />
    </>
  );
}

function WorkstreamCard({ ws }: { ws: Workstream }) {

  const detail = ws.detail && (
    <div
      className="relative hidden shrink-0 overflow-hidden lg:block"
      style={{ width: `calc(var(--u) * ${ws.detail.w})`, height: `calc(var(--u) * ${ws.detail.h})` }}
    >
      <Photo src={ws.detail.image} objectPosition={ws.detail.objectPosition} sizes="25vw" />
    </div>
  );

  return (
    <article className="flex w-[300px] shrink-0 snap-start flex-col gap-5 lg:gap-u-40 lg:w-auto lg:flex-row lg:items-stretch">
      <div className="relative h-[440px] w-[300px] shrink-0 overflow-hidden lg:h-u-654 lg:w-u-445">
        <Photo src={ws.image} objectPosition={ws.imagePosition} sizes="(min-width: 1024px) 31vw, 300px" />

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
              <WorkstreamCard key={ws.title} ws={ws} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
