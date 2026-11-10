"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useId, useRef } from "react";
import { metricsBolt } from "@/lib/motion";

// Figma "Hero Graphic" (597:3919): 1688×735 filled bolt, #072466.
const SHAPE =
  "M503.783 212.806L0 735C81.5903 735 406.547 515.267 526.682 461.626L688.612 604.042L986.861 305.211L1205.48 477.996C1223.47 494.365 1537.52 694.646 1688 735C1641.76 716.118 1395.73 454.692 1280.14 333.105L986.861 0L688.612 373.229L503.783 212.806Z";

// Centreline of the band (midpoints of its top and bottom edges), from the
// bottom-left foot over both peaks to the right foot. A thick stroke along it,
// drawn progressively, is the mask that reveals the shape, so the bolt
// appears to be drawn following its own path.
const SPINE = "M-40 760 L515 337 L688.6 488.6 L986.9 152.6 L1243 405 L1730 760";

/** Absolutely positioned; place inside a relative, overflow-hidden parent. */
export function DrawnBolt({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const maskId = "bolt-draw-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { scrollYProgress } = useScroll({ target: ref, offset: [...metricsBolt.offset] });
  const drawn = useSpring(scrollYProgress, metricsBolt.spring);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute ${className}`}>
    <svg viewBox="0 0 1688 735" preserveAspectRatio="none" className="block h-full w-full">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1888" height="935">
          <motion.path
            d={SPINE}
            fill="none"
            stroke="white"
            strokeWidth={360}
            strokeLinejoin="round"
            style={reduce ? undefined : { pathLength: drawn }}
          />
        </mask>
      </defs>
      <path d={SHAPE} fill="#072466" mask={`url(#${maskId})`} />
    </svg>
    </div>
  );
}
