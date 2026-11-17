"use client";

import { motion, useReducedMotion } from "motion/react";
import { ridge as t } from "@/lib/motion";

// The mountain from the MWC logo as a subtle outline pattern: the logo's own
// two shapes (the shaded mountain body, then the ridge line above it, right
// peak a touch taller than the left), stroked, never filled, scaled evenly.
// It draws itself: the body first, then the ridge. `onDrawn` fires when the
// ridge line finishes (the page transition waits for it).

// From the logo (102.7 × 30): "mountain-dark" and "mountain-light".
const BODY =
  "M96.7104 29.801L69.2204 5.08423L49.5879 19.2144L40.564 12.4134L29.4271 20.3149L24.2108 21.2833L8.51802 29.845L27.6223 29.889L23.5946 26.8297L27.8864 24.1005L35.8759 25.6852L33.1907 22.0096L41.4663 14.9005L47.8051 20.8211L37.5046 29.2727L49.4558 24.1225L57.5333 28.0622L52.8233 23.2201L53.9898 19.3464L60.6367 23.1541L65.0386 26.2354L60.8788 16.4412L64.9065 13.3598L68.4941 11.0488L73.2922 13.9541L96.7104 29.801Z";
const LINE =
  "M102.697 29.845L69.9684 0.220096L69.4622 0L49.7416 14.1522L48.9053 13.734L41.1579 7.65933L40.6076 7.46124L28.0182 16.4191L22.912 17.3876L0 29.933L6.38277 29.911L24.1665 20.2488L29.0966 19.4344L40.6076 11.2909L49.1474 17.9158L49.6536 18.0699L69.1981 3.98373L98.1627 29.933L102.366 29.999L102.697 29.845Z";

type RidgeProps = {
  /** size/position classes; the box keeps the logo's 103:30 proportion */
  className?: string;
  /** stroke colour of the shaded body (drawn first) */
  body?: string;
  /** stroke colour of the ridge line (drawn second) */
  line?: string;
  strokeWidth?: number;
  /** "view": draw once when scrolled into view; "mount": draw on mount */
  trigger?: "view" | "mount";
  /** seconds for each of the two strokes */
  duration?: number;
  onDrawn?: () => void;
};

export function Ridge({
  className = "",
  body = "rgb(251 252 255 / 0.12)",
  line = "rgb(32 137 216 / 0.45)",
  strokeWidth = 1,
  trigger = "view",
  duration = t.draw,
  onDrawn,
}: RidgeProps) {
  const reduce = useReducedMotion();
  const play = trigger === "mount" ? { animate: "drawn" } : { whileInView: "drawn", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  const stroke = (d: string, color: string, delay: number, last: boolean) => (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        drawn: { pathLength: 1, opacity: 1, transition: { pathLength: { duration, ease: t.ease, delay }, opacity: { duration: 0.01, delay } } },
      }}
      onAnimationComplete={last && onDrawn ? (def) => def === "drawn" && onDrawn() : undefined}
    />
  );
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 102.7 30"
      className={`pointer-events-none block aspect-[103/30] ${className}`}
      initial={reduce ? "drawn" : "hidden"}
      {...play}
    >
      {stroke(BODY, body, 0, false)}
      {stroke(LINE, line, duration * t.overlap, true)}
    </motion.svg>
  );
}
