"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user" makes every animation respect the visitor's
// "reduce motion" OS setting automatically.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
