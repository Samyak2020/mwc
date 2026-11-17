"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pageTransition as t, ridge } from "@/lib/motion";
import { Ridge } from "@/components/ui/Ridge";

// Names shown on the panel for each page that has the transition.
const pageNames: Record<string, string> = {
  "/comp-4": "Home",
  "/about": "About Us",
};

type Phase = "cover" | "hold" | "reveal";

// Site-wide page transition. Any same-site link to a page listed above is
// intercepted: a navy panel wipes up from the bottom (0.4s) carrying the MWC
// mark 150px from the top and the destination's name in the middle; the logo's
// mountain then draws in (body, then ridge) while the next page loads, and
// once both are done the panel wipes off the top (0.4s).
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ label: string; phase: Phase; arrived: boolean; drawn: boolean } | null>(null);
  const target = useRef<{ href: string; path: string } | null>(null);

  // intercept link clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      const label = pageNames[url.pathname];
      if (!label) return;
      e.preventDefault();
      if (reduce) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      target.current = { href: url.pathname + url.search + url.hash, path: url.pathname };
      setState({ label, phase: "cover", arrived: false, drawn: false });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce, router]);

  // the new page has rendered underneath
  useEffect(() => {
    if (state?.phase === "hold" && pathname === target.current?.path && !state.arrived)
      setState((s) => (s ? { ...s, arrived: true } : s));
  }, [pathname, state]);

  // lift the panel once the page is in AND the mountain has finished drawing
  useEffect(() => {
    if (state?.phase !== "hold" || !state.arrived || !state.drawn) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setState((s) => (s ? { ...s, phase: "reveal" } : s)));
    return () => cancelAnimationFrame(id);
  }, [state]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key="page-transition"
          aria-hidden
          className="fixed inset-0 z-[100] bg-navy text-bg/90"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: state.phase === "reveal" ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
          transition={{ duration: state.phase === "reveal" ? t.reveal : t.cover, ease: t.ease }}
          onAnimationComplete={() => {
            if (state.phase === "cover" && target.current) {
              // covered: load the next page underneath while the mountain draws
              router.push(target.current.href);
              setState((s) => (s ? { ...s, phase: "hold" } : s));
            } else if (state.phase === "reveal") {
              setState(null);
            }
          }}
        >
          {/* MWC mark, centred, 150px from the top */}
          <motion.img
            src="/comp4v2/footer-logo.svg"
            alt=""
            width={82}
            height={48}
            className="absolute top-[150px] left-1/2 z-10 -translate-x-1/2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: t.cover, ease: t.ease, delay: t.cover * 0.35 }}
          />
          {/* destination name, centred */}
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden px-6">
            <motion.p
              className="display text-center text-[48px] sm:text-[72px] lg:text-[96px]"
              initial={{ y: "60%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: t.cover, ease: t.ease, delay: t.cover * 0.25 }}
            >
              {state.label}
            </motion.p>
          </div>
          {/* the logo's mountain draws in under the name (body, then ridge);
              the panel lifts when it's done */}
          {state.phase !== "cover" && (
            <Ridge
              trigger="mount"
              duration={ridge.transitionDraw}
              body="rgb(251 252 255 / 0.18)"
              line="rgb(32 137 216 / 0.7)"
              strokeWidth={1.5}
              // full screen: sized by height so the two peaks fill the panel
              // (sides run off the edges), base on the bottom edge, behind the text
              className="absolute bottom-0 left-1/2 h-[86vh] w-auto max-w-none -translate-x-1/2"
              onDrawn={() => setState((s) => (s ? { ...s, drawn: true } : s))}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
