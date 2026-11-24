"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Cropped } from "@/components/ui/Cropped";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { comp2Hero, heroSequence, scrollSpring } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";

// Comp 2 hero (updated Figma "Hero Image" 573:451, 1440×1014): full-bleed
// photo fading to ink at the bottom, 10% grain, centred headline + intro + CTA.
// The photo drifts down slower than the page as the hero scrolls away.
export function Hero2({
  description = "Veteran-led field teams, your crews and leadership trust.",
  fullHeight = false,
  flatOverlay = false,
  v2 = false,
}: {
  /** Comp 4 v2 (Figma 728:1110): wider 3-line headline (1159), 24px intro */
  v2?: boolean;
  description?: string;
  /** Comp 3: the hero fills the viewport at any size, content centred in it
   *  (Figma 583:2220) instead of the fixed 1440×1014 frame. */
  fullHeight?: boolean;
  /** Comp 4: the photo plain (no layer or grain), type lifted by a text shadow */
  flatOverlay?: boolean;
} = {}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, scrollSpring);

  // 1 Figma px at the current width (the photo travels in design units)
  const unit = useMotionValue(1);
  useEffect(() => {
    const update = () => unit.set(Math.min(document.documentElement.clientWidth, 1440) / 1440);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [unit]);
  const photoY = useTransform(() => (reduce ? 0 : p.get() * comp2Hero.depth.sky * unit.get()));

  if (fullHeight)
    return (
      <header
        ref={ref}
        data-hero
        // the darker comp 4 photo takes the white nav (Figma 646:4472)
        data-nav-theme={flatOverlay ? "dark" : "light"}
        className="relative isolate flex h-svh min-h-[560px] flex-col overflow-hidden bg-night text-bg"
      >
        <div aria-hidden className="absolute inset-0">
          <motion.div className="absolute inset-x-0 -top-[4%] -bottom-[4%]" style={{ y: photoY }}>
            <Cropped src="/comp2/hero-v2.jpg" left="-30.75%" top="-16.38%" width="152.98%" height="144.86%" sizes="153vw" priority />
          </motion.div>
          {/* comp 4: the photo in full colour under a light 10% layer, no grain, and
              a soft edgeless shade behind the centred type so it stays readable */}
          {flatOverlay ? (
            <>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_50%,rgb(0_6_17/0.42)_0%,rgb(0_6_17/0.22)_45%,rgb(0_6_17/0)_100%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0)_0%,#000611_100%)]" />
              <Texture opacity={0.1} top="-45.29%" height="240.37%" />
            </>
          )}
        </div>

        {/* headline, intro and CTA centred in the viewport, clear of the nav */}
        <div
          className={`relative flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-10 text-center ${
            // a tight shadow crisps the letter edges; the shade behind does the rest
            flatOverlay ? "[text-shadow:0_1px_2px_rgb(0_6_17/0.45)]" : ""
          }`}
        >
          {v2 ? (
            <RevealHeading
              as="h1"
              trigger="load"
              delay={heroSequence.headlineDelay}
              className="display max-w-[1159px] text-[40px] sm:text-[56px] lg:w-u-1159 lg:fs-u-80 lg:tracking-[-0.015em]"
            >
              <Line className="block">Predictable Outcomes for</Line>
              <Line className="block">High-Risk Capital</Line>
              <Line className="block">Projects</Line>
            </RevealHeading>
          ) : (
            <RevealHeading
              as="h1"
              trigger="load"
              delay={heroSequence.headlineDelay}
              className="display max-w-[878px] text-[40px] sm:text-[56px] lg:w-u-878 lg:fs-u-80 lg:tracking-[-0.015em]"
            >
              <Line className="block">Predictable</Line>
              <Line className="block">Outcomes for</Line>
              <Line className="block">High-Risk Capital</Line>
              <Line className="block">Projects</Line>
            </RevealHeading>
          )}
          <FadeIn
            delay={heroSequence.chromeDelay}
            className={
              v2
                ? "mt-12 flex flex-col items-center gap-6 lg:mt-[min(calc(var(--u)*190),16svh)]"
                : "mt-12 flex flex-col items-center gap-6 lg:mt-[min(calc(var(--u)*170),12svh)]"
            }
          >
            <p
              className={
                v2
                  ? "w-[300px] text-xl leading-[1.1] font-semibold sm:w-[350px] sm:text-2xl lg:w-u-350 lg:fs-u-24"
                  : "w-[281px] text-lg leading-[1.1] font-medium lg:w-u-281"
              }
            >
              {description}
            </p>
            <a
              href="/contact"
              className="cta btn flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-fg [text-shadow:none]"
            >
              Talk to a Project Lead
              <Arrow />
            </a>
          </FadeIn>
        </div>
      </header>
    );

  return (
    <header
      ref={ref}
      data-hero
      // bright sky under the nav (Figma: dark nav text)
      data-nav-theme="light"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-night text-bg lg:block lg:h-u-1014 lg:min-h-0"
    >
      <div aria-hidden className="absolute inset-0">
        <motion.div className="absolute inset-x-0 -top-[4%] -bottom-[4%]" style={{ y: photoY }}>
          <Cropped src="/comp2/hero-v2.jpg" left="-30.75%" top="-16.38%" width="152.98%" height="144.86%" sizes="153vw" priority />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0)_0%,#000611_100%)]" />
        <Texture opacity={0.1} top="-45.29%" height="240.37%" />
      </div>

      {/* Headline (573:452): 980 wide, centred 28 right of centre, top 265 */}
      <div className="relative mt-auto flex flex-col items-center gap-8 px-4 pb-20 text-center lg:absolute lg:inset-0 lg:m-0 lg:block lg:p-0">
        <RevealHeading
          as="h1"
          trigger="load"
          delay={heroSequence.headlineDelay}
          className="display text-[40px] sm:text-[56px] lg:absolute lg:top-u-265 lg:left-[calc(50%+var(--u)*28)] lg:w-u-980 lg:-translate-x-1/2 lg:fs-u-80 lg:tracking-[-0.015em]"
        >
          <Line className="block">Predictable</Line>
          <Line className="block">Outcomes for High-</Line>
          <Line className="block">Risk Capital Projects</Line>
        </RevealHeading>

        {/* Intro (top 669) + CTA (top 741) */}
        <FadeIn
          delay={heroSequence.chromeDelay}
          className="flex flex-col items-center gap-8 lg:absolute lg:top-u-669 lg:left-1/2 lg:-translate-x-1/2"
        >
          <p className="w-[281px] text-lg leading-[1.1] font-medium lg:w-u-281">
            {description}
          </p>
          <a
            href="/contact"
            className="cta btn flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-fg"
          >
            Talk to a Project Lead
            <Arrow />
          </a>
        </FadeIn>
      </div>
    </header>
  );
}
