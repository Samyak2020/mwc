"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { smoothScroll } from "@/lib/motion";

// Site-wide smooth scrolling (Lenis). Wheel/trackpad input eases toward its
// target instead of jumping in steps; touch keeps the platform's own momentum
// scrolling (native touch already feels right; don't fight it). It still
// drives the real window scroll, so sticky sections and Motion's useScroll
// keep working unchanged. Off entirely for prefers-reduced-motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: smoothScroll.lerp,
      wheelMultiplier: smoothScroll.wheelMultiplier,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
