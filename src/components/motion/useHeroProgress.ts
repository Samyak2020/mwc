"use client";

import { useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect } from "react";

/**
 * 0 at the top of the page → 1 once the hero (`header[data-hero]`) has
 * scrolled fully out of view. Shared by the hero scene, the fixed site header
 * and the sticky CTA so they all change together.
 */
export function useHeroProgress() {
  const { scrollY } = useScroll();
  const heroHeight = useMotionValue(1);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("header[data-hero]");
    if (!hero) return;
    const measure = () => heroHeight.set(Math.max(1, hero.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    return () => ro.disconnect();
  }, [heroHeight]);

  return useTransform(() => Math.min(1, Math.max(0, scrollY.get() / heroHeight.get())));
}
