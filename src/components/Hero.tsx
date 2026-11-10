"use client";

import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { HeroPhoto } from "@/components/HeroPhoto";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Industries } from "@/components/Industries";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { heroScroll, heroSequence, imageReveal, scrollSpring } from "@/lib/motion";

// Hero + "Industries" (revised Figma 548:1071). The hero fills the viewport;
// the photo runs past it so its mountain cut-out sits at the fold. As the hero
// scrolls away the peaks rise and the photo darkens, while the industries
// section (layered beneath the photo) drifts in more slowly.
export function Hero() {
  const headerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // 0 at the top of the page → 1 once the hero has scrolled out.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const rise = useSpring(scrollYProgress, scrollSpring);

  // Design unit in px (1 Figma px at the current width), for the parallax offset.
  const unit = useMotionValue(1);
  useEffect(() => {
    const update = () => unit.set(Math.min(document.documentElement.clientWidth, 1440) / 1440);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [unit]);

  const contentY = useTransform(() =>
    reduce ? 0 : -(1 - scrollYProgress.get()) * heroScroll.parallax * unit.get(),
  );

  return (
    <div data-nav-theme="dark" className="hero-scene relative isolate bg-navy">
      {/* Hero photo with the animated mountain cut-out */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[calc(var(--hero-h)+var(--hero-over))]"
      >
        {/* wipes in top → bottom over the navy on load */}
        <ImageReveal trigger="load" delay={imageReveal.heroDelay}>
          <HeroPhoto progress={rise} />
        </ImageReveal>
      </div>

      <header ref={headerRef} data-hero className="relative z-[2] text-bg">
        <div className="shell flex min-h-[var(--hero-h)] flex-col items-center justify-center gap-12 pt-24 pb-24 text-center lg:block lg:h-[var(--hero-h)] lg:min-h-0 lg:p-0">
          {/* Headline (Figma 614:4895): centred, 1028 wide, top 307 */}
          <RevealHeading
            as="h1"
            trigger="load"
            delay={heroSequence.headlineDelay}
            className="display text-[40px] [text-shadow:0_2px_20px_rgb(0_0_0/0.1)] sm:text-[56px] lg:absolute lg:top-u-307 lg:left-1/2 lg:w-u-1028 lg:-translate-x-1/2 lg:fs-u-80 lg:tracking-[-0.015em]"
          >
            <Line className="block">Predictable Outcomes</Line>
            <Line className="block">for High-Risk Capital</Line>
            <Line className="block">Projects</Line>
          </RevealHeading>

          {/* Intro + CTA (Figma 629:958): centred, top 665 */}
          <FadeIn
            delay={heroSequence.chromeDelay}
            className="flex flex-col items-center gap-7 lg:absolute lg:top-u-665 lg:left-1/2 lg:w-u-281 lg:-translate-x-1/2"
          >
            <p className="w-[281px] text-xl leading-[1.1] font-medium lg:w-u-281">
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

      <Industries contentY={contentY} />
    </div>
  );
}
