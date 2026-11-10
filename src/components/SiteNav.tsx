"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease, heroScroll, heroSequence } from "@/lib/motion";
import { useHeroProgress } from "@/components/motion/useHeroProgress";

// Figma "Nav Colors" (490:925): 7 items, 4px apart.
const links = ["Organizations", "Services", "Projects", "Toolkit", "Blogs", "Company", "Contact"];

// Which section is under the nav? Sections declare data-nav-theme="dark" |
// "light"; the answer goes on <html data-nav-theme> and CSS recolours the nav
// and the sticky CTA (white on dark, ink on light).
function useNavTheme(bar: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = bar.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      let theme = "light";
      for (const s of document.querySelectorAll<HTMLElement>("body [data-nav-theme]")) {
        const b = s.getBoundingClientRect();
        if (b.top <= y && b.bottom > y) theme = s.dataset.navTheme ?? theme;
      }
      if (document.documentElement.dataset.navTheme !== theme) document.documentElement.dataset.navTheme = theme;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [bar]);
}

// Fixed site header (Figma "Frame 1618873061", 1400×66 at x 20; raised 20px
// from Figma's y 12 to y −8 per client): logo + pill
// nav 72px apart, "Talk to a Project Lead" at the far end. Transparent over
// the hero; fills with translucent ink once the hero scrolls away.
export function SiteNav({ solidCta = false }: { solidCta?: boolean }) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useHeroProgress();
  const fill = useTransform(progress, [...heroScroll.ctaMorph], [0, 1]);
  useNavTheme(barRef);

  return (
    <motion.div
      // comp 2: 12px down from the top of the screen; comp 1 stays raised to −8
      className={`nav-fg fixed right-3 left-3 z-40 lg:right-[calc(var(--bleed)+var(--u)*20)] lg:left-[calc(var(--bleed)+var(--u)*20)] ${
        solidCta ? "top-3" : "-top-2 lg:top-[calc(var(--u)*-8)]"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.slow, ease: ease.out, delay: heroSequence.chromeDelay }}
    >
      <div ref={barRef} className="relative rounded-[4px]">
        <motion.div aria-hidden className="nav-fill absolute inset-0 rounded-[4px]" style={{ opacity: fill }} />
        <nav
          aria-label="Primary"
          className="relative flex min-h-[58px] items-center justify-between px-3 py-2 lg:min-h-[calc(var(--u)*66)]"
        >
          <div className="flex items-center gap-u-72">
            <a href="#" aria-label="MWC home" className="block shrink-0">
              {/* logo drawn in currentColor so it follows the nav theme */}
              <span
                aria-hidden
                className="block h-[30px] w-[148px] bg-current [mask:url(/figma/site-logo.svg)_center/contain_no-repeat]"
              />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="block rounded-[40px] px-4 py-1 text-base leading-[1.5] tracking-[0.005em] whitespace-nowrap transition-colors hover:bg-current/10"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {solidCta ? (
            // Comp 2: a permanent navy button (Figma "Workstreams CTA")
            <a
              href="#contact"
              className="cta hidden items-center justify-center gap-[9px] bg-navy px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg lg:flex"
            >
              TALK TO A PROJECT LEAD
              <Arrow />
            </a>
          ) : (
            // Where the sticky "Talk to a Project Lead" parks (see StickyCta).
            // An invisible copy reserves the exact size.
            <div data-cta-slot aria-hidden className="invisible hidden items-center gap-[9px] px-3 py-4 text-base leading-[1.1] font-semibold lg:flex">
              TALK TO A PROJECT LEAD
              <Arrow width={50} />
            </div>
          )}

          {/* Mobile menu (not in the desktop Figma frame) */}
          <button
            type="button"
            className="rounded-[40px] border border-current/40 px-4 py-1 text-base lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul
                id="mobile-menu"
                className="absolute top-full right-0 z-10 mt-3 flex w-56 flex-col bg-navy p-2 text-bg shadow-lg lg:hidden"
                // grows out of the Menu button (top-right) and returns to it
                style={{ transformOrigin: "top right" }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.out } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: duration.fast, ease: ease.in } }}
              >
                {links.map((label) => (
                  <li key={label}>
                    <a href="#" className="block px-4 py-2 text-base hover:bg-bg/10" onClick={() => setOpen(false)}>
                      {label}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.div>
  );
}
