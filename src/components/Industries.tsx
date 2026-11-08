"use client";

import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion, type MotionValue } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { barSpring, duration, ease } from "@/lib/motion";
import { FabricLayer, type FabricDir } from "@/components/motion/FabricLayer";

// Content + photos from Figma "MWC Helps - Hover Cards" (483:451).
type Industry = {
  name: string;
  image: string;
  /** Figma crop for photos that aren't a plain cover fit. */
  crop?: { top: string; height: string };
  overlay: number;
  description: string;
  cta: string;
};

const industries: Industry[] = [
  {
    name: "Independent Power Producers and Generation Developers",
    image: "/figma/industry-ipp.png",
    overlay: 0.3,
    description:
      "Owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    image: "/figma/industry-utilities.png",
    crop: { top: "0%", height: "163.39%" },
    overlay: 0.4,
    description:
      "Project and program management, construction oversight and project controls within utility capital delivery organizations.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Public Agencies",
    image: "/figma/industry-public.png",
    overlay: 0.4,
    description:
      "Federal, state and local projects delivered by a certified service-disabled veteran-owned small business.",
    cta: "Contract With a Certified Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    image: "/figma/industry-commercial.png",
    overlay: 0.4,
    description:
      "Owner-side project oversight and project delivery personnel for commercial, industrial and on-site energy projects. Contractor support",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    image: "/figma/industry-oil-gas.png",
    overlay: 0.4,
    description:
      "Turnarounds and pipeline projects managed with contractor safety oversight from mobilization to closeout.",
    cta: "Plan Your Next Turnaround",
  },
];

type Layer = { key: number; index: number; dir: FabricDir };

function IndustryPhoto({ industry }: { industry: Industry }) {
  return (
    <>
      {industry.crop ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0" style={{ top: industry.crop.top, height: industry.crop.height }}>
            <Image src={industry.image} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
      ) : (
        <Image src={industry.image} alt="" fill sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: `rgb(0 6 17 / ${industry.overlay})` }} />
      <Texture top="-47.55%" height="237.1%" />
    </>
  );
}

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

// Navy "Industries" section content (Figma 338:692) with the hover states
// from 483:451. Hovering (or focusing) an industry slides the "MWC HELPS"
// bar to it, shows its details on the right and pulls its photo in behind.
export function Industries({ contentY }: { contentY: MotionValue<number> }) {
  const [active, setActive] = useState<number | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [barTop, setBarTop] = useState(0);
  const nextKey = useRef(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  // Warm the cache so the first pull never reveals an empty frame.
  useEffect(() => {
    for (const { image } of industries) {
      const { props } = getImageProps({ src: image, alt: "", fill: true, sizes: "100vw" });
      preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "low" });
    }
  }, []);

  // The bar is centred on the active row (rows have different heights).
  const placeBar = useCallback((index: number | null) => {
    const item = itemRefs.current[index ?? 0];
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

  const activate = (index: number) => {
    if (index === active) return;
    // Pulled up from below when moving down the list (or arriving fresh),
    // pulled down from above when moving up.
    const dir: FabricDir = active === null || index > active ? 1 : -1;
    setLayers((ls) => [...ls, { key: nextKey.current++, index, dir }]);
    setActive(index);
  };
  const deactivate = () => setActive(null);
  const onLayerDone = useCallback((key: number) => {
    // everything under a fully-pulled layer is hidden: drop it
    setLayers((ls) => ls.slice(Math.max(0, ls.findIndex((l) => l.key === key))));
  }, []);

  const current = active === null ? null : industries[active];

  return (
    <section id="industries" aria-labelledby="industries-heading" className="relative text-bg">
      {/* Backdrop photos. Sits under the hero photo too, so it also shows
          through the mountain cut-out. */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-[calc(var(--hero-over)-420px)] bottom-0 overflow-hidden lg:top-[calc(var(--hero-over)-var(--u)*752)]"
        animate={{ opacity: active === null ? 0 : 1 }}
        transition={{ duration: active === null ? duration.slow : 0, ease: ease.out }}
        onAnimationComplete={() => {
          if (active === null) setLayers([]);
        }}
      >
        {layers.map((layer) => (
          <FabricLayer key={layer.key} dir={layer.dir} onDone={() => onLayerDone(layer.key)}>
            <IndustryPhoto industry={industries[layer.index]} />
          </FabricLayer>
        ))}
      </motion.div>

      <motion.div
        className="shell relative pt-[var(--hero-over)] pb-20 lg:h-[calc(var(--hero-over)+var(--u)*738)] lg:p-0"
        style={{ y: contentY }}
      >
        <h2
          id="industries-heading"
          className="display max-w-[447px] text-[40px] sm:text-[56px] lg:absolute lg:left-u-496 lg:top-[calc(var(--hero-over)-var(--u)*285)] lg:w-u-447 lg:max-w-none lg:fs-u-72"
        >
          Depth of Experience Across Industries
        </h2>

        <p className="mt-16 font-display text-[32px] leading-[0.9] font-black tracking-[-0.015em] lg:hidden">
          MWC HELPS
        </p>

        <div
          className="relative mt-6 lg:absolute lg:inset-x-0 lg:top-[calc(var(--hero-over)+var(--u)*55)] lg:mt-0"
          onPointerLeave={(e) => e.pointerType === "mouse" && deactivate()}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) deactivate();
          }}
        >
          {/* Desktop "MWC HELPS" bar: rests on the first row, glides to the
              hovered row and fills sky blue with the details on the right. */}
          <motion.div
            data-bar
            className="absolute top-0 right-[calc(-1*var(--bleed))] left-[calc(-1*var(--bleed))] hidden h-u-151 lg:flex"
            initial={false}
            animate={{ y: barTop }}
            transition={barSpring}
          >
            <div className="relative flex h-full flex-1 items-center pl-[calc(var(--bleed)+var(--u)*32)]">
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-sky"
                initial={false}
                animate={{ opacity: current ? 1 : 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
              />
              <motion.p
                className="relative font-display leading-[0.9] font-black tracking-[-0.015em] lg:fs-u-56"
                initial={false}
                animate={{ color: current ? "#001440" : "#fbfcff" }}
                transition={{ duration: duration.base, ease: ease.out }}
              >
                MWC HELPS
              </motion.p>
            </div>
            <motion.div
              className="relative h-full w-[calc(var(--u)*381+var(--bleed))] overflow-hidden bg-night"
              initial={false}
              animate={{ opacity: current ? 1 : 0 }}
              transition={{ duration: duration.base, ease: ease.out }}
              style={{ pointerEvents: current ? "auto" : "none" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {current && (
                  <motion.div
                    key={current.name}
                    className="absolute inset-0 flex flex-col justify-center gap-u-12 px-[calc(var(--u)*20)]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out, delay: 0.05 } }}
                    exit={{ opacity: 0, y: -12, transition: { duration: duration.fast, ease: ease.in } }}
                  >
                    <p className="w-u-329 text-[length:max(12px,calc(var(--u)*16))] leading-[1.1] text-bg/90">
                      {current.description}
                    </p>
                    <a
                      href="#contact"
                      className="cta flex items-center gap-[9px] py-[calc(var(--u)*16)] pr-3 text-[length:max(12px,calc(var(--u)*16))] leading-[1.1] font-bold tracking-[-0.005em]"
                    >
                      {current.cta}
                      <Arrow />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Desktop: each row is hoverable across the whole band, from the left
              edge to the details panel (Figma x 0–1059); the label keeps its
              Figma column (x 497, 447 wide) via left padding. */}
          <ul ref={listRef} className="relative flex flex-col gap-2 lg:-ml-[var(--bleed)] lg:w-[calc(var(--bleed)+var(--u)*1059)]">
            {industries.map((industry, i) => {
              const isActive = active === i;
              return (
                <li key={industry.name} ref={(el) => void (itemRefs.current[i] = el)}>
                  <a
                    href="#industries"
                    aria-expanded={isActive}
                    className={`block py-5 font-display lg:pl-[calc(var(--bleed)+var(--u)*497)] text-2xl leading-none font-semibold tracking-[0.005em] transition-colors duration-300 lg:py-[calc(var(--u)*32)] lg:fs-u-32 ${
                      isActive ? "text-bg lg:text-deep" : "text-bg/80 hover:text-bg"
                    }`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && activate(i)}
                    onFocus={() => activate(i)}
                    onClick={(e) => {
                      // touch: first tap opens the industry instead of following the link
                      if (!canHover() && !isActive) {
                        e.preventDefault();
                        activate(i);
                      }
                    }}
                  >
                    <span className="block lg:w-u-447">{industry.name}</span>
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
                        <div className="flex flex-col gap-3 bg-night p-5">
                          <p className="text-base leading-[1.1] text-bg/90">{industry.description}</p>
                          <a
                            href="#contact"
                            className="cta flex items-center gap-[9px] py-2 text-base leading-[1.1] font-bold"
                          >
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
