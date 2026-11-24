"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

// A case study metric: the figure counts up and darkens from grey to ink the
// first time it reaches the middle of the screen.
export function CountUpMetric({ value, text }: { value: string; text: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "0px 0px -40% 0px" });
  const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const [pre, num, post] = m ? [m[1], m[2], m[3]] : ["", "0", value];
  const target = parseFloat(num.replace(/,/g, ""));
  const decimals = (num.split(".")[1] ?? "").length;
  const mv = useMotionValue(reduce ? target : 0);
  const shown = useTransform(mv, (v) => `${pre}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`);

  useEffect(() => {
    if (!on || reduce) return;
    const c = animate(mv, target, { duration: duration.slow * 3, ease: ease.out });
    return () => c.stop();
  }, [on, reduce, mv, target]);

  return (
    <div ref={ref} className="border-t border-fg/15 pt-6 pb-16 last:pb-0 lg:pb-u-96 lg:last:pb-0">
      <motion.p
        aria-label={value}
        className="display text-[64px] leading-none tabular-nums sm:text-[88px] lg:fs-u-120"
        initial={reduce ? false : { color: "rgb(0 6 17 / 0.18)" }}
        animate={on ? { color: "rgb(0 6 17 / 1)" } : undefined}
        transition={{ duration: duration.slow * 2, ease: ease.out }}
      >
        {shown}
      </motion.p>
      <p className="mt-4 max-w-[420px] text-base leading-[1.45] text-fg/65">{text}</p>
    </div>
  );
}
