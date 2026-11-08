"use client";

import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { HeroPhoto } from "@/components/HeroPhoto";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { StickyCta } from "@/components/StickyCta";
import { Industries } from "@/components/Industries";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { heroScroll, heroSequence, imageReveal, scrollSpring } from "@/lib/motion";

// Hero + navy "Industries" section (Figma 338:692 now starts at y=0, so the
// navy runs behind the whole hero and nothing white can show through).
// The hero fills the viewport; the photo runs past it so its mountain
// cut-out sits at the fold. As the hero scrolls away the peaks rise while the
// industries content (layered beneath the photo) drifts in more slowly.
export function Hero() {
  const headerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [stickyReady, setStickyReady] = useState(false);
  const onStickyReady = useCallback((ready: boolean) => setStickyReady(ready), []);
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
        <div className="shell flex min-h-[var(--hero-h)] flex-col pt-6 pb-10 lg:block lg:h-[var(--hero-h)] lg:min-h-0 lg:p-0">
          {/* room for the fixed nav on mobile (desktop positions absolutely) */}
          <div aria-hidden className="h-[34px] shrink-0 lg:hidden" />

          {/* Intro + CTA (Figma y=197) */}
          <FadeIn
            delay={heroSequence.chromeDelay}
            className="mt-16 flex flex-col gap-4 lg:absolute lg:left-u-32 lg:top-u-197 lg:mt-0 lg:w-u-1376"
          >
            <p className="w-full max-w-[324px] text-base font-medium leading-[1.1]">
              Experienced project and construction managers, schedulers and safety leaders for complex,
              high-risk projects.
            </p>
            <div className="flex flex-col items-end">
              <span aria-hidden className="block h-px w-full bg-bg/50" />
              {/* On desktop the sticky copy takes over from here once measured */}
              <a
                ref={ctaRef}
                href="#contact"
                className={`cta flex items-center justify-center gap-[9px] px-3 py-4 text-base font-semibold leading-[1.1] tracking-[-0.005em] ${
                  stickyReady ? "lg:invisible" : ""
                }`}
              >
                TALK TO A PROJECT LEAD
                <Arrow width={50} />
              </a>
            </div>
            <StickyCta anchorRef={ctaRef} onReady={onStickyReady} />
          </FadeIn>

          {/* Headline (Figma y=579–824), anchored to the bottom of the viewport
              with the same 76px gap the 900px-tall frame has. */}
          <RevealHeading
            as="h1"
            trigger="load"
            delay={heroSequence.headlineDelay}
            className="display relative mt-auto pt-16 text-[44px] sm:text-[64px] lg:absolute lg:inset-x-0 lg:bottom-[calc(var(--u)*76)] lg:m-0 lg:h-u-245 lg:p-0 lg:fs-u-104"
          >
            <Line className="block lg:absolute lg:left-u-32 lg:top-0">Capital</Line>
            <Line className="block pl-[0.6em] lg:absolute lg:left-u-92 lg:top-u-87 lg:p-0">Projects,</Line>
            <span className="block text-right lg:contents">
              <Line className="lg:absolute lg:left-u-672 lg:top-u-87">Delivered</Line>{" "}
              <Line className="lg:absolute lg:left-u-1386 lg:top-u-79 lg:-translate-x-full">As</Line>
            </span>
            <Line className="block text-right lg:absolute lg:left-u-853 lg:top-u-174 lg:text-left">Approved</Line>
          </RevealHeading>
        </div>
      </header>

      <Industries contentY={contentY} />
    </div>
  );
}
