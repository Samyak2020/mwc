"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// A tinted panel that opens out to the full width of the screen as it scrolls
// in: the content keeps its column while the grey ground behind it widens from
// the column's edges to the screen's. Only clip-path animates.
export function ExpandPanel({ max = 1120, className = "", children }: { max?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 10%"] });
  // side inset: half the gap between the screen and the column, shrinking to 0
  const clipPath = useTransform(scrollYProgress, (p) => {
    const k = reduce ? 0 : (1 - p) / 2;
    return `inset(0 calc((100% - min(100%, ${max}px)) * ${k.toFixed(4)}))`;
  });
  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-[#f1f3f6]"
        // the body is the container, so 100cqw is the screen less its scrollbar
        style={{ width: "100cqw", clipPath }}
      />
      <div className={`relative mx-auto ${className}`} style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  );
}
