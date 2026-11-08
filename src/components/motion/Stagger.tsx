"use client";

import { motion, type Variants } from "motion/react";
import { forwardRef } from "react";
import { duration, ease, stagger } from "@/lib/motion";

// Group entrance for card grids: items fade up in order the first time the
// group scrolls into view. Purely decorative; never blocks interaction.

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

export const StaggerList = forwardRef<HTMLUListElement, { className?: string; children: React.ReactNode }>(
  function StaggerList({ className, children }, ref) {
    return (
      <motion.ul
        ref={ref}
        className={className}
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {children}
      </motion.ul>
    );
  },
);

export function StaggerItem({
  className,
  children,
  ...rest
}: { className?: string; children: React.ReactNode } & Omit<React.ComponentProps<typeof motion.li>, "variants">) {
  return (
    <motion.li className={className} variants={item} {...rest}>
      {children}
    </motion.li>
  );
}

// Opacity-only fade used for the hero chrome (nav + intro) after the headline.
// No transform, so absolutely-positioned children keep their containing block.
export function FadeIn({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
