"use client";

import Image from "next/image";
import { AnimatePresence, motion, type MotionValue } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { barSpring, duration, ease, PHOTO_QUALITY } from "@/lib/motion";

// Revised Figma "Industries Section" (594:3311).
type Industry = { name: string; description: string; cta: string };

const industries: Industry[] = [
  {
    name: "Power Producers",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    description:
      "Project and program management, construction oversight and project controls within utility capital delivery organizations.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Government",
    description:
      "Federal, state and local projects delivered by a certified service-disabled veteran-owned small business.",
    cta: "Contract With a Certified Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    description:
      "Owner-side project oversight and project delivery personnel for commercial, industrial and on-site energy projects.",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    description: "Turnarounds and pipeline projects managed with contractor safety oversight from mobilization to closeout.",
    cta: "Plan Your Next Turnaround",
  },
];

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

// One photo behind the whole section (it also shows through the hero's
// mountain cut-out). Hovering or focusing an industry glides the sky-blue bar
// to it and swaps the description and call to action; the photo stays put.
//
// Positions are Figma px from the hero-over origin (page y 1400 at 1440×900):
// section top −880, heading +80, bar +239 (130 tall), section end +796.
export function Industries({ contentY }: { contentY: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  const [barTop, setBarTop] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  // The bar is centred on the active row (rows have different heights).
  const placeBar = useCallback((index: number) => {
    const item = itemRefs.current[index];
    const list = listRef.current;
    const bar = list?.parentElement?.querySelector<HTMLElement>("[data-bar]");
    if (!item || !list || !bar) return;
    setBarTop(list.offsetTop + item.offsetTop + item.offsetHeight / 2 - bar.offsetHeight / 2);
  }, []);

  useLayoutEffect(() => {
    placeBar(active);
    const onResize = () => placeBar(active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, placeBar]);

  const current = industries[active];

  return (
    <section id="industries" aria-labelledby="industries-heading" className="relative text-bg">
      {/* Backdrop: one photo, 25% ink, 15% grain */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[calc(var(--hero-over)-420px)] bottom-0 overflow-hidden lg:top-[calc(var(--hero-over)-var(--u)*880)]"
      >
        <Image
          src="/comp1r/industries-bg.png"
          alt=""
          fill
          sizes="100vw"
          quality={PHOTO_QUALITY}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-night/25" />
        <Texture top="-22.46%" height="213.55%" />
      </div>

      <motion.div
        className="shell relative pt-[var(--hero-over)] pb-20 lg:h-[calc(var(--hero-over)+var(--u)*796)] lg:p-0"
        style={{ y: contentY }}
      >
        <h2
          id="industries-heading"
          className="display text-[40px] sm:text-[56px] lg:absolute lg:top-[calc(var(--hero-over)+var(--u)*80)] lg:left-1/2 lg:w-u-707 lg:-translate-x-1/2 lg:fs-u-64"
        >
          Depth of Experience
          <br />
          Across Industries
        </h2>

        <div className="relative mt-10 lg:absolute lg:inset-x-0 lg:top-[calc(var(--hero-over)+var(--u)*239)] lg:mt-0">
          {/* Desktop bar (Figma 594:3312/3314): sky band 0–1059 holding the
              description, ink panel 1059–1440 with the call to action. */}
          <motion.div
            data-bar
            className="absolute top-0 right-[calc(-1*var(--bleed))] left-[calc(-1*var(--bleed))] hidden h-u-130 lg:flex"
            initial={false}
            animate={{ y: barTop }}
            transition={barSpring}
          >
            <div className="relative h-full flex-1 bg-sky">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={current.name}
                  className="absolute top-u-19 left-[calc(var(--bleed)+var(--u)*547)] w-u-397 text-[length:max(13px,calc(var(--u)*18))] leading-[1.3] font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out, delay: 0.05 } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: duration.fast, ease: ease.in } }}
                >
                  {current.description}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="relative flex h-full w-[calc(var(--u)*381+var(--bleed))] items-center pr-[var(--bleed)] bg-night">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.a
                  key={current.name}
                  href="#contact"
                  className="cta absolute left-u-26 flex items-center gap-[9px] py-[calc(var(--u)*16)] pr-3 text-[length:max(13px,calc(var(--u)*18))] leading-[1.1] font-bold tracking-[-0.005em] whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out, delay: 0.08 } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: duration.fast, ease: ease.in } }}
                >
                  {current.cta}
                  <Arrow />
                </motion.a>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Rows: hoverable across the whole sky band (x 0–1059); labels keep
              their Figma column (x 148). */}
          <ul
            ref={listRef}
            className="relative flex flex-col gap-1 lg:pt-u-27 lg:-ml-[var(--bleed)] lg:w-[calc(var(--bleed)+var(--u)*1059)] lg:gap-0"
          >
            {industries.map((industry, i) => {
              const isActive = active === i;
              return (
                <li key={industry.name} ref={(el) => void (itemRefs.current[i] = el)}>
                  <a
                    href="#industries"
                    aria-expanded={isActive}
                    className={`block py-4 text-2xl leading-none tracking-[0.005em] transition-colors duration-300 lg:py-[calc(var(--u)*26)] lg:pl-[calc(var(--bleed)+var(--u)*148)] lg:fs-u-24 ${
                      isActive ? "font-sans font-medium text-bg" : "font-display font-semibold text-bg/85 hover:text-bg"
                    }`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
                      // touch: first tap opens the industry instead of following the link
                      if (!canHover() && !isActive) {
                        e.preventDefault();
                        setActive(i);
                      }
                    }}
                  >
                    <span className="block lg:w-u-329">{industry.name}</span>
                  </a>

                  {/* Mobile: details open under the row */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        className="overflow-hidden lg:hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                      >
                        <div className="flex flex-col gap-3 bg-sky p-5">
                          <p className="text-base leading-[1.3] font-medium">{industry.description}</p>
                          <a href="#contact" className="cta flex items-center gap-[9px] py-2 text-base leading-[1.1] font-bold">
                            {industry.cta}
                            <Arrow />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
