"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { parallax, PHOTO_QUALITY } from "@/lib/motion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

// A cover image that drifts vertically inside its (clipped) frame while the
// frame crosses the viewport, moving a little slower than the page. Apple-
// style: the drift follows scroll through a critically damped spring (no
// overshoot, reversals never jerk) and the image "settles into focus",
// easing from a slight zoom to its resting scale as it reaches the centre.
// Static under reduced motion.
export function ParallaxImage({ src, alt, sizes, className = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // −1 entering at the bottom … 0 centred … 1 leaving at the top
  const offset = useTransform(scrollYProgress, (p) => Math.max(-1, Math.min(1, p * 2 - 1)));
  const driftPct = useSpring(useTransform(offset, (d) => -d * parallax.travel), parallax.spring);
  const y = useTransform(driftPct, (v) => `${v.toFixed(3)}%`);
  const scale = useSpring(
    useTransform(offset, (d) => parallax.scaleCentre + (parallax.scaleEdge - parallax.scaleCentre) * Math.abs(d)),
    parallax.spring,
  );

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { y, scale }}>
        <Image src={src} alt={alt} fill sizes={sizes} quality={PHOTO_QUALITY} className="object-cover" />
      </motion.div>
    </div>
  );
}
