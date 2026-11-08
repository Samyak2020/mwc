"use client";

import { motion, type Variants } from "motion/react";
import { duration, ease, stagger } from "@/lib/motion";

// Masked line reveal for the big display headlines: each line rises out of
// its own clipping box, lines staggered. Used once on load (hero) and on view
// for the section headings so the page shares one motion idea.

const group: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({ transition: { staggerChildren: stagger, delayChildren: delay } }),
};

const line: Variants = {
  // opacity keeps a gentle fade under reduced motion (MotionConfig drops transforms)
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

type Tag = "h1" | "h2";

type RevealHeadingProps = {
  as?: Tag;
  /** "load" plays on mount (hero); "view" plays once when scrolled into view. */
  trigger?: "load" | "view";
  delay?: number;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function RevealHeading({ as = "h2", trigger = "view", delay = 0, id, className, children }: RevealHeadingProps) {
  const Component = as === "h1" ? motion.h1 : motion.h2;
  const play =
    trigger === "load"
      ? { animate: "show" }
      : { whileInView: "show", viewport: { once: true, margin: "0px 0px -15% 0px" } };

  return (
    <Component id={id} className={className} variants={group} initial="hidden" custom={delay} {...play}>
      {children}
    </Component>
  );
}

type LineProps = {
  /** Positioning classes for the line (kept off the animated element so
   *  layout transforms like -translate-x-full don't fight Motion's transform). */
  className?: string;
  children: React.ReactNode;
};

export function Line({ className = "", children }: LineProps) {
  return (
    <span className={className}>
      {/* the mask: a little bottom padding so commas aren't clipped */}
      <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
        <motion.span className="inline-block will-change-transform" variants={line}>
          {children}
        </motion.span>
      </span>
    </span>
  );
}
