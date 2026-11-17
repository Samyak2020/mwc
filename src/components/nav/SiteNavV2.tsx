"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { NavLogoV2, useNavTheme } from "@/components/SiteNav";
import { MenuContent, MobileMenu, type MenuKey } from "./MegaMenu";
import { duration, ease, heroSequence, navMenu } from "@/lib/motion";

type Item = { label: string; href: string; menu?: MenuKey };
const items: Item[] = [
  { label: "Industries", href: "#", menu: "industries" },
  { label: "Services", href: "/all-services", menu: "services" },
  { label: "Projects", href: "/projects", menu: "projects" },
  { label: "Client Resources", href: "#" },
  { label: "Blogs", href: "#" },
  { label: "Company", href: "/about", menu: "company" },
];

// Comp 4 v2 nav (Figma 729:1484 / 729:1483) with dropdowns after maisa.ai:
// hovering (or clicking) Industries or Services turns the bar white and drops
// a panel from it; the page behind blurs. Moving between the two triggers
// swaps the panel contents in place. Esc, a click outside or leaving the nav
// closes it.
export function SiteNavV2() {
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useNavTheme(barRef);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const openSoon = (m: MenuKey) => {
    clear();
    // already open: switch straight away; closed: wait a beat (hover intent)
    if (menu) setMenu(m);
    else timer.current = setTimeout(() => setMenu(m), navMenu.openDelay * 1000);
  };
  const closeSoon = () => {
    clear();
    timer.current = setTimeout(() => setMenu(null), navMenu.closeDelay * 1000);
  };
  const close = useCallback(() => {
    clear();
    setMenu(null);
  }, []);

  useEffect(() => {
    if (!menu && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, mobile]);
  useEffect(() => clear, []);

  // the panel's height follows its contents (Industries and Services differ)
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    setHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [menu]);

  const raised = menu !== null || mobile;

  return (
    <>
      {/* page blur behind the open menu */}
      <AnimatePresence>
        {raised && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-30 bg-[rgb(0_6_17/0.08)] backdrop-blur-[5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: duration.base, ease: ease.in } }}
            onClick={() => {
              close();
              setMobile(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`nav-fg fixed top-3 right-3 left-3 z-40 lg:right-[calc(var(--bleed)+var(--u)*20)] lg:left-[calc(var(--bleed)+var(--u)*20)] ${raised ? "nav-open" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.slow, ease: ease.out, delay: heroSequence.chromeDelay }}
        onPointerLeave={(e) => e.pointerType === "mouse" && menu && closeSoon()}
        onPointerEnter={(e) => e.pointerType === "mouse" && menu && clear()}
      >
        <div ref={barRef} className="relative">
          <div
            aria-hidden
            className={`nav-fill-v2 absolute inset-0 transition-[border-radius] duration-200 ${raised ? "rounded-t-[4px]" : "rounded-[4px]"}`}
          />
          <nav
            aria-label="Primary"
            className="relative flex min-h-[58px] items-center justify-between px-3 py-2 lg:min-h-[calc(var(--u)*66)]"
          >
            <div className="flex items-center gap-u-48">
              <a href="/comp-4" aria-label="MWC home" className="block shrink-0">
                <NavLogoV2 />
              </a>

              <ul className="hidden items-center gap-0.5 lg:flex">
                {items.map((it) => (
                  <li key={it.label}>
                    {it.menu ? (
                      <button
                        type="button"
                        aria-expanded={menu === it.menu}
                        aria-controls="nav-panel"
                        className={`flex items-center gap-1.5 rounded-[40px] px-4 py-1 text-base leading-[1.5] tracking-[0.005em] whitespace-nowrap transition-colors hover:bg-current/10 ${
                          menu === it.menu ? "bg-current/10" : ""
                        }`}
                        onPointerEnter={(e) => e.pointerType === "mouse" && openSoon(it.menu!)}
                        onClick={() => {
                          clear();
                          setMenu((m) => (m === it.menu ? null : it.menu!));
                        }}
                      >
                        {it.label}
                        <svg
                          aria-hidden
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          className={`transition-transform duration-300 ${menu === it.menu ? "rotate-180" : ""}`}
                        >
                          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={it.href}
                        className="block rounded-[40px] px-4 py-1 text-base leading-[1.5] tracking-[0.005em] whitespace-nowrap transition-colors hover:bg-current/10"
                        onPointerEnter={(e) => e.pointerType === "mouse" && menu && closeSoon()}
                      >
                        {it.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#contact"
              className="cta hidden items-center justify-center gap-[9px] bg-navy px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg lg:flex"
            >
              TALK TO A PROJECT LEAD
              <Arrow />
            </a>

            <button
              type="button"
              className="rounded-[40px] border border-current/40 px-4 py-1 text-base lg:hidden"
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              onClick={() => setMobile((v) => !v)}
            >
              {mobile ? "Close" : "Menu"}
            </button>
          </nav>
        </div>

        {/* desktop dropdown panel, attached under the bar */}
        <AnimatePresence>
          {menu && (
            <motion.div
              id="nav-panel"
              className="absolute inset-x-0 top-full hidden overflow-hidden rounded-b-[4px] bg-bg text-fg shadow-[0_24px_48px_-24px_rgb(0_6_17/0.25)] lg:block"
              initial={{ height: 0 }}
              animate={{ height, transition: navMenu.panel }}
              exit={{ height: 0, transition: { duration: duration.base, ease: ease.in } }}
            >
              <div ref={contentRef} className="border-t border-fg/10">
                <MenuContent menu={menu} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* mobile menu */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              id="mobile-menu"
              className="absolute inset-x-0 top-full max-h-[calc(100svh-90px)] overflow-y-auto rounded-b-[4px] bg-bg lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
              exit={{ opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } }}
            >
              <MobileMenu onNavigate={() => setMobile(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
