"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease, heroSequence } from "@/lib/motion";

type StickyCtaProps = {
  /** The in-flow hero CTA. Its spot is where the sticky copy starts. */
  anchorRef: RefObject<HTMLElement | null>;
  onReady: (ready: boolean) => void;
};

// Desktop only. A fixed copy of "Talk to a Project Lead" that scrolls up with
// the page from its hero position until it lands in its slot at the end of
// the nav bar (Figma 490:925), then stays there. Its colour follows the nav
// theme (white on dark sections, ink on light) via the .cta-sticky CSS.
// Portalled to <body> so no section's stacking context can cover it.
export function StickyCta(props: StickyCtaProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(<StickyCtaButton {...props} />, document.body) : null;
}

function StickyCtaButton({ anchorRef, onReady }: StickyCtaProps) {
  const self = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();
  const startTop = useMotionValue(0); // anchor's document top
  const parkTop = useMotionValue(0); // the nav slot (fixed, so a viewport top)
  const [right, setRight] = useState(0);

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const anchor = anchorRef.current;
      const slot = document.querySelector<HTMLElement>("[data-cta-slot]");
      if (!anchor || !self.current || !slot || !desktop.matches) {
        onReady(false);
        return;
      }
      const a = anchor.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      startTop.set(a.top + window.scrollY);
      parkTop.set(s.top);
      setRight(document.documentElement.clientWidth - s.right);
      onReady(true);
    };
    measure();
    document.fonts?.ready.then(measure); // intro copy reflows once Inter loads
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      onReady(false);
    };
  }, [anchorRef, onReady, parkTop, startTop]);

  // Moves with the page until it reaches the nav slot, then stays there.
  const y = useTransform(() => Math.max(parkTop.get(), startTop.get() - scrollY.get()));

  return (
    <motion.a
      ref={self}
      href="#contact"
      // no `.cta` here: its CSS transform transition would make the scroll tracking lag
      className="cta-sticky fixed top-0 z-50 hidden items-center justify-center gap-[9px] px-3 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] lg:flex"
      style={{ y, right }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: duration.slow, ease: ease.out, delay: heroSequence.chromeDelay } }}
      whileTap={{ scale: 0.97, transition: { duration: duration.fast, ease: ease.out } }}
    >
      TALK TO A PROJECT LEAD
      <Arrow width={50} />
    </motion.a>
  );
}
