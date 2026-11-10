"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { imageReveal } from "@/lib/motion";

type ImageRevealProps = {
  /** "load" plays on mount (hero); "view" plays once when scrolled into view. */
  trigger?: "load" | "view";
  delay?: number;
  /** "down" wipes top → bottom (default), "right" wipes left → right */
  direction?: "down" | "right";
  className?: string;
  children: React.ReactNode;
};

// Top → bottom image reveal: a curtain wipes the photo in over the primary
// navy (the frame behind it), while the photo settles from a slight zoom so
// it reads as arriving rather than just being uncovered. Reduced motion: a
// plain fade.
//
// The in-view check lives on an outer, unclipped wrapper: Chrome's
// IntersectionObserver honours the target's own clip-path, so a fully closed
// curtain would report zero area and never trigger.
export function ImageReveal({
  trigger = "view",
  delay = 0,
  direction = "down",
  className = "absolute inset-0",
  children,
}: ImageRevealProps) {
  const reduce = useReducedMotion();
  const curtain: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.4, delay } },
      }
    : {
        // the curtain opens from the top (down) or from the left (right)
        hidden: { clipPath: direction === "right" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 100% 0%)", scale: 1.06 },
        shown: {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          transition: { duration: imageReveal.duration, ease: imageReveal.ease, delay },
        },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      {...(trigger === "load"
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, amount: 0.25 } })}
    >
      <motion.div className="absolute inset-0" variants={curtain}>
        {children}
      </motion.div>
    </motion.div>
  );
}
