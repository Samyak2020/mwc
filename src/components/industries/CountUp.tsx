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
  const numeric = !!m;
  const [pre, num, post] = m ? [m[1], m[2], m[3]] : ["", "0", value];
  const target = parseFloat(num.replace(/,/g, ""));
  const decimals = (num.split(".")[1] ?? "").length;
  const mv = useMotionValue(reduce ? target : 0);
  const shown = useTransform(mv, (v) => `${pre}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`);

  useEffect(() => {
    if (!on || reduce || !numeric) return;
    const c = animate(mv, target, { duration: duration.slow * 3, ease: ease.out });
    return () => c.stop();
  }, [on, reduce, numeric, mv, target]);

  return (
    <div ref={ref} className="border-t border-fg/15 pt-6 pb-16 last:pb-0 lg:pb-u-96 lg:last:pb-0">
      <p className="sr-only">{value}</p>
      <motion.p
        aria-hidden
        className={`display leading-none tabular-nums ${numeric ? "text-[64px] sm:text-[88px] lg:fs-u-120" : "text-[48px] sm:text-[64px] lg:fs-u-80"}`}
        initial={reduce ? false : { color: "rgb(0 6 17 / 0.18)" }}
        animate={on ? { color: "rgb(0 6 17 / 1)" } : undefined}
        transition={{ duration: duration.slow * 2, ease: ease.out }}
      >
        {numeric ? shown : value}
      </motion.p>
      <p className="mt-4 max-w-[420px] text-base leading-[1.45] text-fg/70">{text}</p>
    </div>
  );
}
