"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Cropped } from "@/components/ui/Cropped";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { comp2Hero, heroSequence, scrollSpring } from "@/lib/motion";

// Comp 2 hero (updated Figma "Hero Image" 573:451, 1440×1014): full-bleed
// photo fading to ink at the bottom, 10% grain, centred headline + intro + CTA.
// The photo drifts down slower than the page as the hero scrolls away.
export function Hero2() {
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
            Veteran-led field teams, your crews and leadership trust.
          </p>
          <a
            href="#contact"
            className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-fg"
          >
            Talk to a Project Lead
            <Arrow />
          </a>
        </FadeIn>
      </div>
    </header>
  );
}
