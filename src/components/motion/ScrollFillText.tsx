"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { scrollFill } from "@/lib/motion";

// Text that "fills in" from faded to full ink, character by character, as it
// scrolls through the viewport, and empties again when scrolled back up.
// (Figma shows a frame of this: dark up to "de|livery", faded after.)

function Char({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  // each character ramps over a short window so the fill reads as a soft edge
  const start = (index / total) * (1 - scrollFill.softness);
  const opacity = useTransform(progress, [start, start + scrollFill.softness], [scrollFill.from, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

export function ScrollFillText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: [...scrollFill.offset] });

  if (reduce)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );

  const words = text.split(" ");
  const total = text.length;
  let i = 0;

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => {
        const start = i;
        i += word.length + 1;
        return (
          <span key={w} aria-hidden>
            {/* keep each word unbreakable so wrapping matches plain text */}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((c, k) => (
                <Char key={k} char={c} index={start + k} total={total} progress={scrollYProgress} />
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}
