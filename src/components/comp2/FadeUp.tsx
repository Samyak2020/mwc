"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";

// A block that fades up once when scrolled into view.
export function FadeUp({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
