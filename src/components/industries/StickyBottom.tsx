"use client";

import { useEffect, useRef } from "react";

// Sticks once its bottom edge reaches the bottom of the screen (less a gap):
// it scrolls in with its neighbours, then holds there while they move on.
// CSS sticky only offers a top offset, so the offset is measured.
export function StickyBottom({ gap = 64, className = "", children }: { gap?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => {
      el.style.top = `${Math.round(window.innerHeight - el.offsetHeight - gap)}px`;
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, [gap]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
