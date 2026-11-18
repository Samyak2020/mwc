"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLogoV2, useNavTheme } from "@/components/SiteNav";
import { MenuContent, MobileMenu, type MenuKey } from "./MegaMenu";
import { duration, ease, heroSequence, navMenu } from "@/lib/motion";

type Item = { label: string; href: string; menu?: MenuKey };
const items: Item[] = [
  { label: "Industries", href: "#", menu: "industries" },
  { label: "Services", href: "/all-services", menu: "services" },
  { label: "Projects", href: "/projects", menu: "projects" },
  { label: "Client Resources", href: "#" },
  { label: "Company", href: "/about", menu: "company" },
];

// Site header, after bayshore.ai: a full-width bar fixed to the top of the
// screen, logo on the left, the links centred, the CTA on the right. Over
// the top of the page it is transparent and takes its text colour
// from the section beneath (white on dark heroes, ink on light ones); once the
// page scrolls it turns solid paper with ink text and a hairline underneath.
//
// Industries, Services, Projects and Company open dropdowns (after maisa.ai):
// hovering or clicking drops a panel from the bar and blurs the page behind.
// Moving between triggers swaps the contents in place; Esc, a click outside
// or leaving the header closes it. Below 1280px the links fold into a menu.
export function SiteNavV2() {
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useNavTheme(barRef);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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

  // the panel's height follows its contents (each menu differs)
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
  const solid = raised || scrolled;
  const pill =
    "flex h-[30px] items-center gap-1.5 px-3 text-sm leading-none font-medium tracking-[0.005em] whitespace-nowrap transition-colors duration-[var(--duration-fast)] hover:bg-current/10 focus-visible:bg-current/10";

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

      <motion.header
        className={`nav-fg fixed inset-x-0 top-0 z-40 ${solid ? "nav-open" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.slow, ease: ease.out, delay: heroSequence.chromeDelay }}
        onPointerLeave={(e) => e.pointerType === "mouse" && menu && closeSoon()}
        onPointerEnter={(e) => e.pointerType === "mouse" && menu && clear()}
      >
        <div ref={barRef} className="relative">
          <div aria-hidden className={`nav-bar absolute inset-0 ${solid ? "is-solid" : ""}`} />
          <nav
            aria-label="Primary"
            className="relative mx-auto grid h-16 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-4 xl:h-[72px] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:px-[calc(var(--u)*32)]"
          >
            <a href="/comp-4" aria-label="MWC home" className="block shrink-0 justify-self-start">
              <NavLogoV2 />
            </a>

            {/* centred links */}
            <ul className="hidden items-center gap-1 xl:flex">
              {items.map((it) => (
                <li key={it.label}>
                  {it.menu ? (
                    <button
                      type="button"
                      aria-expanded={menu === it.menu}
                      aria-controls="nav-panel"
                      className={`${pill} ${menu === it.menu ? "bg-current/10" : ""}`}
                      onPointerEnter={(e) => e.pointerType === "mouse" && openSoon(it.menu!)}
                      onClick={() => {
                        clear();
                        setMenu((m) => (m === it.menu ? null : it.menu!));
                      }}
                    >
                      {it.label}
                      <svg
                        aria-hidden
                        width="9"
                        height="5"
                        viewBox="0 0 10 6"
                        className={`opacity-60 transition-transform duration-[var(--duration-base)] ${menu === it.menu ? "rotate-180" : ""}`}
                      >
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={it.href}
                      className={pill}
                      onPointerEnter={(e) => e.pointerType === "mouse" && menu && closeSoon()}
                    >
                      {it.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* right: the CTA */}
            <div className="hidden items-center gap-2 justify-self-end xl:flex">
              <a
                href="#contact"
                className="nav-cta cta btn btn-dark flex h-[38px] items-center justify-center px-4 text-[13px] leading-none font-semibold tracking-[0.02em] whitespace-nowrap"
              >
                TALK TO A PROJECT LEAD
              </a>
            </div>

            {/* mobile / tablet: two lines that cross into an X */}
            <button
              type="button"
              className="relative -mr-2 size-10 justify-self-end xl:hidden"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              onClick={() => setMobile((v) => !v)}
            >
              <span
                aria-hidden
                className={`absolute top-1/2 left-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-current transition-[translate,rotate] duration-[var(--duration-base)] ease-out ${
                  mobile ? "-translate-y-1/2 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                aria-hidden
                className={`absolute top-1/2 left-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-current transition-[translate,rotate] duration-[var(--duration-base)] ease-out ${
                  mobile ? "-translate-y-1/2 -rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </nav>
        </div>

        {/* desktop dropdown panel, full width under the bar */}
        <AnimatePresence>
          {menu && (
            <motion.div
              id="nav-panel"
              className="absolute inset-x-0 top-full hidden overflow-hidden bg-bg text-fg shadow-[0_24px_48px_-24px_rgb(0_6_17/0.25)] xl:block"
              initial={{ height: 0 }}
              animate={{ height, transition: navMenu.panel }}
              exit={{ height: 0, transition: { duration: duration.base, ease: ease.in } }}
            >
              <div ref={contentRef} className="mx-auto max-w-[1440px] px-[calc(var(--u)*32)]">
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
              className="absolute inset-x-0 top-full max-h-[calc(100svh-64px)] overflow-y-auto bg-bg xl:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
              exit={{ opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } }}
            >
              <div className="mx-auto max-w-[720px]">
                <MobileMenu onNavigate={() => setMobile(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
