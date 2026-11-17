"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease, heroScroll, heroSequence } from "@/lib/motion";
import { useHeroProgress } from "@/components/motion/useHeroProgress";
import { SiteNavV2 } from "@/components/nav/SiteNavV2";

// Figma "Nav Colors" (490:925): 7 items, 4px apart.
const linksV1 = ["Organizations", "Services", "Projects", "Toolkit", "Blogs", "Company", "Contact"];
// Comp 4 v2 nav (Figma component 729:1484 / 729:1483): 6 items, 2px apart.
const linksV2 = ["Industries", "Services", "Projects", "Client Resources", "Blogs", "Company"];

/** Comp 4 v2 logo (Figma "Component 2" 729:1409, 191×30): two-tone mountain
 *  and wordmark. Fills come from CSS variables so it follows the nav theme. */
export function NavLogoV2() {
  return (
    <svg viewBox="0 0 191.016 29.999" className="block h-[30px] w-[191px]" aria-hidden>
      <path
        fill="var(--logo-peak)"
        fillRule="evenodd"
        d="M102.697 29.845L69.9684 0.220096L69.4622 0L49.7416 14.1522L48.9053 13.734L41.1579 7.65933L40.6076 7.46124L28.0182 16.4191L22.912 17.3876L0 29.933L6.38277 29.911L24.1665 20.2488L29.0966 19.4344L40.6076 11.2909L49.1474 17.9158L49.6536 18.0699L69.1981 3.98373L98.1627 29.933L102.366 29.999L102.697 29.845Z"
      />
      <path
        fill="var(--logo-shade)"
        fillRule="evenodd"
        d="M96.7104 29.801L69.2204 5.08423L49.5879 19.2144L40.564 12.4134L29.4271 20.3149L24.2108 21.2833L8.51802 29.845L27.6223 29.889L23.5946 26.8297L27.8864 24.1005L35.8759 25.6852L33.1907 22.0096L41.4663 14.9005L47.8051 20.8211L37.5046 29.2727L49.4558 24.1225L57.5333 28.0622L52.8233 23.2201L53.9898 19.3464L60.6367 23.1541L65.0386 26.2354L60.8788 16.4412L64.9065 13.3598L68.4941 11.0488L73.2922 13.9541L96.7104 29.801Z"
      />
      <g fill="var(--logo-text)">
        <path d="M108.858 29.3722V6.93894H117.547L121.167 18.1556L122.286 22.3453L123.404 18.1556L127.025 6.93894H135.515V29.3722H128.802L129.229 14.4937L127.485 20.5969L124.622 29.3722H119.752L116.823 20.4649L115.144 14.5597L115.572 29.3722H108.858Z" />
        <path d="M156.747 29.3722L153.851 18.7824L153.292 16.0772L152.732 18.7824L149.869 29.3722H142.497L136.179 6.93894H143.353L145.854 19.8711L146.512 23.2031L147.236 19.8711L150.757 6.93894H156.22L159.709 19.8711L160.433 23.2031L161.091 19.8711L163.625 6.93894H170.405L164.086 29.3722H156.747Z" />
        <path d="M191.016 14.5927H184.006C183.512 12.7122 182.36 11.7555 180.518 11.7555C177.786 11.7555 176.272 14.1638 176.272 18.1886C176.272 22.2134 177.753 24.5557 180.518 24.5557C182.229 24.5557 183.479 23.6319 183.94 21.9165H191.016C189.963 27.2939 185.783 29.999 180.682 29.999C173.705 29.999 169.394 25.5124 169.394 18.1886C169.394 10.8648 173.705 6.31213 180.682 6.31213C185.816 6.31213 190.127 9.0833 191.016 14.5927Z" />
      </g>
    </svg>
  );
}

// Which section is under the nav? Sections declare data-nav-theme="dark" |
// "light"; the answer goes on <html data-nav-theme> and CSS recolours the nav
// and the sticky CTA (white on dark, ink on light).
export function useNavTheme(bar: React.RefObject<HTMLElement | null>) {
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

// Fixed site header (Figma "On lighter bg", 1400×66 at x 20): logo + pill nav
// 72px apart, the navy "Talk to a Project Lead" button at the far end.
// Transparent over the hero; fills with translucent ink once it scrolls away.
export function SiteNav({ v2 = false }: { v2?: boolean } = {}) {
  return v2 ? <SiteNavV2 /> : <SiteNavV1 />;
}

function SiteNavV1({ v2 = false }: { v2?: boolean } = {}) {
  const links = v2 ? linksV2 : linksV1;
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useHeroProgress();
  const fill = useTransform(progress, [...heroScroll.ctaMorph], [0, 1]);
  useNavTheme(barRef);

  return (
    <motion.div
      // 12px down from the top of the screen
      className="nav-fg fixed top-3 right-3 left-3 z-40 lg:right-[calc(var(--bleed)+var(--u)*20)] lg:left-[calc(var(--bleed)+var(--u)*20)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.slow, ease: ease.out, delay: heroSequence.chromeDelay }}
    >
      <div ref={barRef} className="relative rounded-[4px]">
        {/* v2 (Figma 729:1484): the bar is always tinted, even over the hero */}
        <motion.div
          aria-hidden
          className={`absolute inset-0 rounded-[4px] ${v2 ? "nav-fill-v2" : "nav-fill"}`}
          style={v2 ? undefined : { opacity: fill }}
        />
        <nav
          aria-label="Primary"
          className="relative flex min-h-[58px] items-center justify-between px-3 py-2 lg:min-h-[calc(var(--u)*66)]"
        >
          <div className={`flex items-center ${v2 ? "gap-u-48" : "gap-u-72"}`}>
            <a href="#" aria-label="MWC home" className="block shrink-0">
              {v2 ? (
                <NavLogoV2 />
              ) : (
                // logo drawn in currentColor so it follows the nav theme
                <span
                  aria-hidden
                  className="block h-[30px] w-[148px] bg-current [mask:url(/figma/site-logo.svg)_center/contain_no-repeat]"
                />
              )}
            </a>

            <ul className={`hidden items-center lg:flex ${v2 ? "gap-0.5" : "gap-1"}`}>
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

          {/* "Talk to a Project Lead": a permanent navy button (Figma "Workstreams CTA") */}
          <a
            href="#contact"
            className="cta hidden items-center justify-center gap-[9px] bg-navy px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg lg:flex"
          >
            TALK TO A PROJECT LEAD
            <Arrow />
          </a>

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
