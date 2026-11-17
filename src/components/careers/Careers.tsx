"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise, RiseEach, RiseWords } from "@/components/motion/Rise";
import { PHOTO_QUALITY } from "@/lib/motion";

// Careers (copy: "MWC Website Content 1", Careers Page), laid out after
// afternow.co/careers in MWC's type and colour. The hero and the quote reuse
// the About page's; this file holds the rest: a pinned photo strip that slides
// sideways as you scroll, a profile of who we hire, the open positions and a
// closing customer quote.

const label = "text-sm leading-[1.3] font-medium tracking-[0.01em]";
// eyebrow on the left (3 of 12 columns), content on the right
const grid = "grid gap-6 lg:grid-cols-[calc(var(--u)*400)_minmax(0,1fr)] lg:gap-0";

/* ------------------------------------------------------- photo strip */

const photos = [
  { src: "/figma/industry-utilities-hd.jpg", wide: false },
  { src: "/figma/ws-build-detail-hd.jpg", wide: true },
  { src: "/comp2/ind-power-hd.jpg", wide: false },
  { src: "/figma/metric-bg-2-hd.jpg", wide: true },
  { src: "/figma/ws-plan-detail-hd.jpg", wide: false },
  { src: "/comp2/ind-government-hd.jpg", wide: false },
  { src: "/figma/metric-bg-3-hd.jpg", wide: true },
  { src: "/figma/ws-operate-detail-hd.jpg", wide: true },
];

/**
 * After afternow.co/careers: the strip scrolls up with the page like any
 * other block until the photos are centred on screen, then holds there while
 * further scrolling slides them sideways; once the last photo is in, the strip
 * lets go and the page carries on. The content around it never jumps: the
 * section is just the strip's height plus the sideways distance.
 */
export function CareersPhotos() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ height: 0, travel: 0, top: 0 });
  const start = useMotionValue(0); // page scroll where the hold begins
  const travel = useMotionValue(0);
  const { scrollY } = useScroll();
  const x = useTransform(() => -Math.min(travel.get(), Math.max(0, scrollY.get() - start.get())));

  useEffect(() => {
    const el = track.current;
    const sec = section.current;
    if (!el || !sec) return;
    const measure = () => {
      const height = el.offsetHeight;
      const dist = Math.max(0, el.scrollWidth - window.innerWidth);
      const top = Math.max(0, (window.innerHeight - height) / 2); // centred
      travel.set(dist);
      start.set(sec.getBoundingClientRect().top + window.scrollY - top);
      setBox((b) => (b.height === height && b.travel === dist && b.top === top ? b : { height, travel: dist, top }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.documentElement); // viewport and page height change too
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [start, travel]);

  return (
    <section
      ref={section}
      aria-label="Life at MWC"
      className="relative mt-24 lg:mt-u-160"
      style={box.height ? { height: box.height + box.travel } : undefined}
    >
      <div className="sticky overflow-x-clip" style={{ top: box.top }}>
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max gap-2 px-4 will-change-transform lg:gap-u-16 lg:px-[calc(var(--u)*32)]"
        >
          {photos.map((p) => (
            <div
              key={p.src}
              className={`relative h-[300px] shrink-0 overflow-hidden rounded-[4px] bg-navy sm:h-[380px] lg:h-u-480 ${
                p.wide ? "aspect-[5/4]" : "aspect-[4/5]"
              }`}
            >
              {/* eager: off-screen to the right, they'd otherwise pop in mid-slide */}
              <Image src={p.src} alt="" fill loading="eager" sizes="(min-width: 1024px) 40vw, 80vw" quality={PHOTO_QUALITY} className="object-cover" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- profile */

export function CareersProfile() {
  return (
    <section aria-labelledby="profile-heading" className="shell pt-24 lg:pt-u-160">
      <hr className="border-fg/15" />
      <div className={`${grid} pt-6 lg:pt-u-24`}>
        <Rise as="p" className={`${label} text-fg/50`}>
          Who we look for
        </Rise>
        <div>
          <h2 id="profile-heading" className="sr-only">
            Who we look for
          </h2>
          <RiseWords
            text="MWC brings together experienced professionals who understand the demands of complex, mission-critical projects. We value technical knowledge, sound judgment, accountability and people who take pride in the quality of their work."
            className="max-w-[880px] text-[26px] leading-[1.15] font-medium tracking-[-0.015em] sm:text-[34px] lg:w-u-880 lg:max-w-none lg:fs-u-40"
          />
          <Rise
            as="p"
            delay={0.2}
            className="mt-10 max-w-[560px] text-lg leading-[1.5] tracking-[-0.005em] text-fg/80 lg:mt-u-64 lg:w-u-560 lg:max-w-none lg:fs-u-20"
          >
            Our team supports projects where experience, coordination and attention to detail matter. We&apos;re looking
            for professionals who want to take on responsibility, contribute their expertise and work alongside people who
            know their field.
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------- positions + application */

type Role = { title: string; tags: string[]; href: string };

// Placeholders until MWC lists its openings (the content doc has A, B, C).
const positions: Role[] = ["Position A", "Position B", "Position C"].map((title) => ({
  title,
  tags: ["[Location]", "[Type]"],
  href: `mailto:info@mwconsultllc.com?subject=${encodeURIComponent(`Application: ${title}`)}`,
}));

/** One row: the title slides right and the tags slide left on hover. */
function RoleRow({ role }: { role: Role }) {
  return (
    <a
      href={role.href}
      className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-bg/15 py-6 text-[20px] leading-[1.3] tracking-[-0.01em] transition-colors duration-[var(--duration-base)] hover:bg-bg/[0.06] focus-visible:bg-bg/[0.06] lg:fs-u-22"
    >
      <span className="transition-transform duration-[var(--duration-base)] ease-out group-hover:translate-x-3 group-focus-visible:translate-x-3">
        {role.title}
      </span>
      <span className="flex gap-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:-translate-x-3 group-focus-visible:-translate-x-3">
        {role.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-bg/10 px-3 py-1.5 text-xs leading-none tracking-[0.04em] text-bg/80 uppercase transition-colors duration-[var(--duration-base)] group-hover:bg-bg/15"
          >
            {t}
          </span>
        ))}
      </span>
    </a>
  );
}

export function CareersPositions() {
  return (
    <section data-nav-theme="dark" className="mt-24 bg-navy pb-24 text-bg/90 lg:mt-u-160 lg:pb-u-160">
      {/* open positions */}
      <section aria-labelledby="positions-heading" className="shell pt-16 lg:pt-u-88">
        <div className={grid}>
          <Rise as="p" className={`${label} text-bg/50`}>
            Open positions
          </Rise>
          <div>
            <RevealHeading id="positions-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
              <Line className="block">Be a part of MWC</Line>
            </RevealHeading>
            <RiseEach className="mt-10 border-t border-bg/15 lg:mt-u-64">
              {positions.map((r) => (
                <RoleRow key={r.title} role={r} />
              ))}
            </RiseEach>
          </div>
        </div>
      </section>

      {/* open application */}
      <section id="apply" aria-labelledby="apply-heading" className="shell pt-24 lg:pt-u-160">
        <hr className="border-bg/15" />
        <div className={`${grid} pt-6 lg:pt-u-24`}>
          <Rise as="p" className={`${label} text-bg/50`}>
            Customer
          </Rise>
          <div>
            <h2 id="apply-heading" className="sr-only">
              Apply
            </h2>
            <figure>
              <blockquote>
                <RiseWords
                  text="“A professional team that delivers on their promises.”"
                  className="max-w-[880px] text-[26px] leading-[1.15] font-medium tracking-[-0.015em] sm:text-[34px] lg:w-u-880 lg:max-w-none lg:fs-u-40"
                />
              </blockquote>
            </figure>
          </div>
        </div>
      </section>
    </section>
  );
}
