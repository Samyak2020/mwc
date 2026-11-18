"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise } from "@/components/motion/Rise";
import { duration, ease, industryCards, PHOTO_QUALITY } from "@/lib/motion";

type Industry = {
  name: string;
  image: string;
  description: string;
  cta: string;
};

// Copy: "MWC Website Content 1" (home page, Depth of Experience Across Industries).
const industries: Industry[] = [
  {
    name: "Power Producers",
    image: "/comp4v3/ind-power.png",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    image: "/comp4v3/ind-utilities.png",
    description:
      "Within electric, natural gas and water utility capital delivery organizations, MWC provides project and program management, construction oversight and project controls.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Government",
    image: "/comp4v3/ind-government.png",
    description:
      "Federal, state and local projects are delivered by MWC, a certified service-disabled veteran-owned small business.",
    cta: "Contract With a Certified Veteran-Owned Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    image: "/comp4v3/ind-commercial.png",
    description:
      "Owner-side project oversight and project delivery personnel are available for commercial, industrial and on-site energy projects, with added support for contractor teams.",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    image: "/comp4v3/ind-oil.png",
    description:
      "From upstream production sites to midstream pipelines and downstream refinery turnarounds, projects are managed with contractor safety oversight from mobilization to closeout.",
    cta: "Plan Your Next Turnaround",
  },
];

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

// Comp 4 v2 "Depth of Experience Across Industries" (Figma 728:1136 / 728:1239,
// photos and bottom-left text per 814:440):
// five photo panels in a 1376×500 row, 8 apart. The open panel is 562 wide
// and shows the industry, its description and a CTA; the others share the
// rest and show only their name. Hover (or focus, or tap on touch) opens a
// panel. On phones the row becomes a column of the same panels.
export function IndustryPanels() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const resize = reduce ? { duration: 0 } : industryCards.resize;

  return (
    <section
      id="industries"
      data-nav-theme="light"
      aria-labelledby="industries-heading"
      className="shell bg-bg pt-20 pb-20 text-fg lg:pt-[calc(var(--u)*114)] lg:pb-u-153"
    >
      <RevealHeading
        id="industries-heading"
        className="display text-[40px] sm:text-[56px] lg:w-u-794 lg:fs-u-56"
      >
        <Line className="block">Depth of Experience</Line>
        <Line className="block">Across Industries</Line>
      </RevealHeading>

      {/* panels rise in one after another */}
      <ul className="mt-10 flex flex-col gap-2 lg:mt-u-30 lg:h-u-500 lg:flex-row">
        {industries.map((industry, i) => {
          const isActive = active === i;
          return (
            <motion.li
              key={industry.name}
              className="relative overflow-hidden bg-night text-bg max-lg:!basis-auto"
              // desktop: the open panel takes 562 (in design units), the rest share
              style={{ flexShrink: 1 }}
              initial={false}
              animate={{
                flexGrow: isActive ? 0 : 1,
                flexBasis: isActive
                  ? `calc(var(--u) * ${industryCards.open})`
                  : "0px",
              }}
              transition={resize}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => {
                if (!canHover()) setActive(i);
              }}
            >
              <Rise order={i} className="h-full">
                {/* mobile: the open panel is tall, the others are a labelled strip */}
                <motion.div
                  className="relative lg:!h-full"
                  initial={false}
                  animate={{ height: isActive ? 440 : 88 }}
                  transition={resize}
                >
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    quality={PHOTO_QUALITY}
                    className="object-cover"
                  />
                  {/* overlays: open = fade to 70% ink at the bottom; closed = flat 50% */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0)_0%,rgb(0_6_17/0.7)_100%)] transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[rgb(0_6_17/0.5)] transition-opacity duration-500"
                    style={{ opacity: isActive ? 0 : 1 }}
                  />
                  <Texture opacity={isActive ? 0.1 : 0.15} top="-47.11%" height="235.1%" />

                  {/* closed: name, top-left */}
                  <button
                    type="button"
                    aria-expanded={isActive}
                    className="absolute top-4 left-4 w-[calc(100%-32px)] text-left text-lg leading-none tracking-[-0.005em] transition-opacity duration-300 lg:w-[172px]"
                    style={{ opacity: isActive ? 0 : 1 }}
                    tabIndex={isActive ? -1 : 0}
                    onClick={() => setActive(i)}
                  >
                    {industry.name}
                  </button>

                  {/* open: name, description and CTA, bottom-left, 24 in from the edges */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="content"
                        className="absolute bottom-5 left-5 flex w-[calc(100%-40px)] max-w-[483px] flex-col items-start gap-[17px] text-left lg:bottom-[calc(var(--u)*24)] lg:left-u-24 lg:w-u-483 lg:max-w-none lg:gap-u-17"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: duration.slow,
                            ease: ease.out,
                            delay: reduce ? 0 : industryCards.contentDelay,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          transition: {
                            duration: duration.fast,
                            ease: ease.in,
                          },
                        }}
                      >
                        <div className="flex flex-col items-start gap-5">
                          <h3 className="text-[28px] leading-none font-bold tracking-[-0.005em] sm:text-[40px] lg:fs-u-40">
                            {industry.name}
                          </h3>
                          <p className="text-base leading-[1.5] tracking-[-0.005em] text-bg/90 lg:w-u-460">
                            {industry.description}
                          </p>
                        </div>
                        <a
                          href="#"
                          className="cta btn flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg lg:whitespace-nowrap"
                        >
                          {industry.cta}
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Rise>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
