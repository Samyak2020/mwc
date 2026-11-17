"use client";

import { motion, useReducedMotion } from "motion/react";
import { ridgeBands as t } from "@/lib/motion";

// The logo's ridge repeated as three stacked bands, tone-on-tone (Figma
// 781:6530, also the footer). In 2616 × 908 artwork units. With `drift`,
// each band rises and settles very slowly, a beat after the one above, so
// the range seems to breathe.

const BANDS = [
  "M2616.08 628.968L1782.36 4.63841L1769.47 0L1267.11 298.25L1245.8 289.437L1048.45 161.416L1034.43 157.242L713.73 346.024L583.656 366.435L7.30753e-05 630.823L162.593 630.359L615.612 426.733L741.201 409.57L1034.43 237.95L1251.97 377.566L1264.87 380.814L1762.74 83.955L2500.58 630.823L2607.65 632.213L2616.08 628.968Z",
  "M2616.08 768.852L1782.36 144.523L1769.47 139.884L1267.11 438.135L1245.8 429.321L1048.45 301.301L1034.43 297.126L713.73 485.908L583.656 506.319L7.30753e-05 770.707L162.593 770.243L615.612 566.617L741.201 549.454L1034.43 377.834L1251.97 517.451L1264.87 520.698L1762.74 223.84L2500.58 770.707L2607.65 772.098L2616.08 768.852Z",
  "M2616.08 905.111L1782.36 280.781L1769.47 276.143L1267.11 574.393L1245.8 565.58L1048.45 437.559L1034.43 433.385L713.73 622.167L583.656 642.578L7.30753e-05 906.965L162.593 906.502L615.612 702.876L741.201 685.713L1034.43 514.093L1251.97 653.709L1264.87 656.957L1762.74 360.098L2500.58 906.965L2607.65 908.356L2616.08 905.111Z"
];

export function RidgeBands({ className = "", drift = false }: { className?: string; drift?: boolean }) {
  const reduce = useReducedMotion();
  const move = drift && !reduce;
  return (
    <svg aria-hidden viewBox="0 0 2616.08 908.356" className={`pointer-events-none block h-auto max-w-none ${className}`}>
      <g opacity={0.15}>
        {BANDS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fillRule="evenodd"
            fill="#000611"
            fillOpacity={0.6}
            animate={move ? { y: [0, -t.rise, 0] } : undefined}
            transition={move ? { duration: t.period, ease: "easeInOut", repeat: Infinity, delay: i * t.stagger } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
