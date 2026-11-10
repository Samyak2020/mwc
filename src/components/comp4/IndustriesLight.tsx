"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { barSpring, duration, ease, PHOTO_QUALITY } from "@/lib/motion";

type Industry = { name: string; image: string; description: string; cta: string };

const industries: Industry[] = [
  {
    name: "Power Producers",
    image: "/comp2/ind-power-hd.jpg",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    image: "/comp2/ind-utilities-hd.jpg",
    description:
      "Project and program management, construction oversight and project controls within utility capital delivery organizations.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Government",
    image: "/comp2/ind-government-hd.jpg",
    description:
      "Federal, state and local projects delivered by a certified service-disabled veteran-owned small business.",
    cta: "Contract With a Certified Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    image: "/comp2/ind-commercial-hd.jpg",
    description:
      "Owner-side project oversight and project delivery personnel for commercial, industrial and on-site energy projects.",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    image: "/comp2/ind-oil-hd.jpg",
    description: "Turnarounds and pipeline projects managed with contractor safety oversight from mobilization to closeout.",
    cta: "Plan Your Next Turnaround",
  },
];

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

// Comp 4 "Depth of Experience Across Industries" (Figma 639:4144): the comp 1
// interaction on white. Hovering a row glides the sky bar to it and swaps the
// description and call to action; the photo card on the right cross-fades to
// that industry. Spacing from Figma 646:4583 (1440×882): heading top 120,
// photo card 262 (447×500 at x 963), bar 278, rows from 310, section end 882.
export function IndustriesLight() {
  const [active, setActive] = useState(0);
  const [barTop, setBarTop] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

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
  const swap = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out, delay: 0.05 } },
    exit: { opacity: 0, y: -10, transition: { duration: duration.fast, ease: ease.in } },
  };

  return (
    <section id="industries" data-nav-theme="light" aria-labelledby="industries-heading" className="relative bg-bg text-fg">
      <div className="shell relative pt-20 pb-20 lg:h-u-882 lg:p-0">
        <h2
          id="industries-heading"
          className="display text-[40px] sm:text-[56px] lg:absolute lg:top-u-120 lg:left-u-32 lg:w-u-794 lg:fs-u-64"
        >
          Depth of Experience
          <br />
          Across Industries
        </h2>

        {/* photo card, cross-fading to the active industry */}
        <div className="relative mt-8 hidden aspect-[447/500] overflow-hidden border border-bg/10 bg-[#d9d9d9] lg:absolute lg:top-u-262 lg:left-u-963 lg:mt-0 lg:block lg:w-u-447">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: duration.slow, ease: ease.out } }}
              exit={{ opacity: 0, transition: { duration: duration.slow, ease: ease.out } }}
            >
              <Image src={current.image} alt="" fill sizes="32vw" quality={PHOTO_QUALITY} className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mt-10 lg:absolute lg:inset-x-0 lg:top-u-278 lg:mt-0">
          {/* bar (639:4146 / 639:4158): sky band to x 963 with the description,
              then a translucent navy panel over the photo with the CTA */}
          <motion.div
            data-bar
            className="absolute top-0 right-[calc(-1*var(--bleed))] left-[calc(-1*var(--bleed))] hidden h-u-130 lg:flex"
            initial={false}
            animate={{ y: barTop }}
            transition={barSpring}
          >
            <div className="relative h-full flex-1 bg-sky text-bg">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={current.name}
                  {...swap}
                  className="absolute top-u-30 left-[calc(var(--bleed)+var(--u)*453)] w-u-412 text-[length:max(13px,calc(var(--u)*18))] leading-[1.3] font-medium"
                >
                  {current.description}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="relative flex h-full w-[calc(var(--u)*477+var(--bleed))] items-center bg-navy/80 pr-[var(--bleed)] text-bg backdrop-blur-[2px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.a
                  key={current.name}
                  {...swap}
                  href="#contact"
                  className="cta absolute left-u-24 flex items-center gap-[9px] py-[calc(var(--u)*16)] pr-3 text-[length:max(13px,calc(var(--u)*18))] leading-[1.1] font-bold tracking-[-0.005em] whitespace-nowrap uppercase"
                >
                  {current.cta}
                  <Arrow />
                </motion.a>
              </AnimatePresence>
            </div>
          </motion.div>

          <ul ref={listRef} className="relative flex flex-col gap-1 lg:-ml-[var(--bleed)] lg:w-[calc(var(--bleed)+var(--u)*963)] lg:gap-u-12 lg:pt-[calc(var(--u)*32.5)] [&>li:nth-child(2)]:lg:mt-u-24">
            {industries.map((industry, i) => {
              const isActive = active === i;
              return (
                <li key={industry.name} ref={(el) => void (itemRefs.current[i] = el)}>
                  <a
                    href="#industries"
                    aria-expanded={isActive}
                    className={`block py-4 text-2xl leading-none tracking-[0.005em] transition-colors duration-300 lg:py-[calc(var(--u)*20.5)] lg:pl-[calc(var(--bleed)+var(--u)*32)] lg:fs-u-24 ${
                      isActive ? "font-sans font-medium text-fg lg:text-bg" : "font-display font-semibold text-fg/50 hover:text-fg"
                    }`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
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
                        <div className="flex flex-col gap-3 bg-sky p-5 text-bg">
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
      </div>
    </section>
  );
}
