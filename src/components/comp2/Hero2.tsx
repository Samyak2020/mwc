"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Cropped } from "@/components/ui/Cropped";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { comp2Hero, duration, ease, heroSequence, PHOTO_QUALITY, scrollSpring } from "@/lib/motion";

// Comp 2 hero (Figma "Hero Image" 573:441, 1440×1014). Three layers: the sky
// photo, the MWC "bolt" (white, 80%), and the scaffolding photo with its sky
// cut out. The bolt sits between them, so it can rise into frame from behind
// the scaffolding on load; on scroll the layers drift at different speeds.
export function Hero2() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, scrollSpring);

  // 1 Figma px at the current width (layers travel in design units)
  const unit = useMotionValue(1);
  useEffect(() => {
    const update = () => unit.set(Math.min(document.documentElement.clientWidth, 1440) / 1440);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [unit]);

  const depth = (d: number) => () => (reduce ? 0 : p.get() * d * unit.get());
  const skyY = useTransform(depth(comp2Hero.depth.sky));
  const boltY = useTransform(depth(comp2Hero.depth.bolt));
  const scaffoldY = useTransform(depth(comp2Hero.depth.scaffold));

  return (
    <header
      ref={ref}
      data-hero
      // light sky under the nav at the top of the page
      data-nav-theme="light"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-night text-bg lg:block lg:h-u-1014 lg:min-h-0"
    >
      <div aria-hidden className="absolute inset-0">
        {/* sky */}
        <motion.div className="absolute -inset-x-0 -top-[4%] -bottom-[4%]" style={{ y: skyY }}>
          <Image
            src="/comp2/hero-bg-hd.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={PHOTO_QUALITY}
            className="object-cover"
          />
        </motion.div>

        {/* bolt: 1167×508 at (371, −28), i.e. its centre 234.5 right of the
            frame centre; anchored to the centre so it stays put on wide screens */}
        <motion.div
          className="absolute top-[-2.76%] left-[25.76%] w-[81.04%] lg:top-[calc(var(--u)*-28)] lg:left-[calc(50%-var(--u)*349)] lg:h-u-508 lg:w-u-1167"
          style={{ y: boltY }}
        >
          <motion.img
            src="/comp2/hero-bolt.svg"
            alt=""
            width={1167}
            height={508}
            className="block h-auto w-full lg:h-full"
            initial={{ y: `${(comp2Hero.boltFrom / 508) * 100}%`, opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              y: { ...comp2Hero.boltSpring, delay: comp2Hero.boltDelay },
              opacity: { duration: duration.slow, ease: ease.out, delay: comp2Hero.boltDelay },
            }}
          />
        </motion.div>

        {/* scaffolding (sky cut out), with the fade to ink over everything */}
        <motion.div className="absolute inset-x-0 -top-[2%] -bottom-[2%]" style={{ y: scaffoldY }}>
          <Cropped src="/comp2/hero-fg-hd.png" left="-2.81%" top="0%" width="105.62%" height="100%" sizes="106vw" priority />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0)_0%,#000611_109.71%)]" />
      </div>

      {/* Hero content (Figma 581:1940): centred, top 530 */}
      {/* (no .shell here: its position: relative would override lg:absolute) */}
      <div className="relative mt-auto flex flex-col items-center gap-8 px-4 pb-20 text-center lg:absolute lg:top-u-530 lg:left-1/2 lg:mt-0 lg:w-u-918 lg:-translate-x-1/2 lg:p-0">
        <RevealHeading
          as="h1"
          trigger="load"
          delay={heroSequence.headlineDelay}
          className="display text-[40px] sm:text-[56px] lg:fs-u-72 lg:tracking-[-0.015em]"
        >
          <Line className="block">Capital Projects,</Line>
          <Line className="block">Delivered as Approved</Line>
        </RevealHeading>
        <FadeIn delay={heroSequence.chromeDelay} className="flex flex-col items-center gap-8">
          <p className="w-[281px] text-lg leading-[1.1] font-medium">Veteran-led project and construction management.</p>
          <a
            href="#contact"
            className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
          >
            Talk to a Project Lead
            <Arrow />
          </a>
        </FadeIn>
      </div>
    </header>
  );
}
