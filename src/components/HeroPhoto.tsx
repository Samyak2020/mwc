"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";
import { preload } from "react-dom";
import { heroScroll } from "@/lib/motion";

// The hero photo drawn inside an SVG so its mountain cut-out can be animated.
// hero-v3.png (Figma "Vector 4", 1440×1400, 35% ink overlay baked in) has the
// two-peak silhouette punched out; the mask repeats it (traced from the PNG's
// alpha) as two independent black shapes. Raising them cuts the photo further,
// so the navy section underneath "pops up" through it in a jagged form.

// Optimised copy of the 2880×2800 PNG via Next's image endpoint, requested at
// full resolution (it is never upscaled past 2880) so it stays sharp on retina.
const SRC = "/_next/image?url=%2Ffigma%2Fhero-v3.png&w=3840&q=90";

// Peaks in frame units (viewBox 1440×1400). Each shape continues well below
// the frame so it still fills the bottom after it has risen.
const LEFT_PEAK = "0,1400 440,1172.5 737,1400 737,2800 0,2800";
const RIGHT_PEAK = "480,1400 844,1015.5 1440,1400 1440,2800 480,2800";

// Extra ink layered over the baked-in overlay so the total goes from
// `darken.from` to `darken.to`: (1 − from)(1 − extra) = 1 − to.
const { from, to, over } = heroScroll.darken;
const EXTRA_DARKEN = 1 - (1 - to) / (1 - from);

export function HeroPhoto({ progress }: { progress: MotionValue<number> }) {
  const maskId = "hero-mask-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduce = useReducedMotion();
  preload(SRC, { as: "image", fetchPriority: "high" });

  const leftY = useTransform(progress, (p) => (reduce ? 0 : -p * heroScroll.peakRise.left));
  const rightY = useTransform(progress, (p) => (reduce ? 0 : -p * heroScroll.peakRise.right));
  // Deepens the photo from 35% to 75% ink as the hero scrolls away (a colour
  // change, not movement, so it stays on under reduced motion).
  const darken = useTransform(progress, [0, over], [0, EXTRA_DARKEN]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 1400"
      // same framing as object-fit: cover + object-position: bottom
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 block h-full w-full"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="1400">
          <rect width="1440" height="1400" fill="white" />
          <motion.polygon points={LEFT_PEAK} fill="black" style={{ y: leftY }} />
          <motion.polygon points={RIGHT_PEAK} fill="black" style={{ y: rightY }} />
        </mask>
      </defs>
      <image href={SRC} width="1440" height="1400" preserveAspectRatio="none" mask={`url(#${maskId})`} />
      {/* scroll darkening, clipped to the same mountain mask */}
      <motion.rect width="1440" height="1400" fill="#000611" mask={`url(#${maskId})`} style={{ opacity: darken }} />
    </svg>
  );
}
