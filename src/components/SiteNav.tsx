"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { duration, ease, heroScroll, heroSequence } from "@/lib/motion";
import { useHeroProgress } from "@/components/motion/useHeroProgress";
import { SiteNavV2 } from "@/components/nav/SiteNavV2";

// Figma "Nav Colors" (490:925): 7 items, 4px apart.
const linksV1 = ["Organizations", "Services", "Projects", "Toolkit", "Blogs", "Company", "Contact"];
// Comp 4 v2 nav (Figma component 729:1484 / 729:1483): 6 items, 2px apart.
const linksV2 = ["Industries", "Services", "Projects", "Client Resources", "Blogs", "Company"];

export function NavLogoV2() {
  // Figma 775:6364 / 775:6375 (191.4×30): the gradient mountain is the same on
  // both themes; only the wordmark changes colour (var --logo-text).
  return (
    <svg viewBox="0 0 191.382 30.0566" className="block h-[30px] w-[191px]" aria-hidden>
      <defs>
        <linearGradient id="mwc-nav-ridge" x1="0.286673" y1="29.9243" x2="102.607" y2="29.9243" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2EC0DA" />
          <stop offset="0.28" stopColor="#28A7D3" />
          <stop offset="0.5" stopColor="#1E82DC" />
          <stop offset="0.72" stopColor="#2290D4" />
          <stop offset="1" stopColor="#2EC2DD" />
        </linearGradient>
        <linearGradient id="mwc-nav-body" x1="41.7443" y1="6.10837" x2="73.4989" y2="27.2781" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34466C" />
          <stop offset="0.45" stopColor="#101A3A" />
          <stop offset="1" stopColor="#000714" />
        </linearGradient>
      </defs>
      <path fill="url(#mwc-nav-ridge)" fillRule="evenodd" d="M102.894 29.9022L70.1026 0.220518L69.5954 0L49.837 14.1793L48.9991 13.7603L41.2368 7.67402L40.6855 7.47555L28.0719 16.4506L22.9559 17.4209L0 29.9904L6.39502 29.9684L24.2129 20.2876L29.1525 19.4717L40.6855 11.3126L49.2416 17.9501L49.7488 18.1045L69.3308 3.99137L98.3509 29.9904L102.563 30.0566L102.894 29.9022Z" />
      <path fill="url(#mwc-nav-body)" fillRule="evenodd" d="M96.8959 29.8581L69.3532 5.09399L49.683 19.2512L40.6418 12.4372L29.4836 20.3538L24.2573 21.3241L8.53436 29.9022L27.6753 29.9463L23.6398 26.8811L27.9399 24.1467L35.9447 25.7345L33.2544 22.0518L41.5459 14.9291L47.8968 20.861L37.5766 29.3289L49.5507 24.1688L57.6437 28.116L52.9246 23.2647L54.0933 19.3835L60.753 23.1985L65.1633 26.2857L60.9956 16.4727L65.031 13.3855L68.6255 11.07L73.4328 13.9809L96.8959 29.8581Z" />
      <g fill="var(--logo-text)">
        <path d="M109.067 29.4286V6.95225H117.772L121.399 18.1904L122.52 22.3882L123.641 18.1904L127.268 6.95225H135.775V29.4286H129.049L129.477 14.5215L127.73 20.6364L124.861 29.4286H119.981L117.047 20.5041L115.365 14.5876L115.794 29.4286H109.067Z" />
        <path d="M157.048 29.4286L154.146 18.8184L153.586 16.108L153.025 18.8184L150.156 29.4286H142.771L136.44 6.95225H143.628L146.134 19.9092L146.793 23.2476L147.519 19.9092L151.047 6.95225H156.52L160.015 19.9092L160.741 23.2476L161.4 19.9092L163.939 6.95225H170.731L164.401 29.4286H157.048Z" />
        <path d="M191.382 14.6206H184.359C183.864 12.7366 182.71 11.778 180.864 11.778C178.127 11.778 176.61 14.1909 176.61 18.2235C176.61 22.256 178.094 24.6028 180.864 24.6028C182.578 24.6028 183.831 23.6773 184.293 21.9585H191.382C190.327 27.3462 186.139 30.0566 181.029 30.0566C174.038 30.0566 169.719 25.5613 169.719 18.2235C169.719 10.8856 174.038 6.32424 181.029 6.32424C186.172 6.32424 190.492 9.10072 191.382 14.6206Z" />
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
            className="cta btn btn-dark hidden items-center justify-center gap-[9px] bg-navy px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg lg:flex"
          >
            TALK TO A PROJECT LEAD
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
