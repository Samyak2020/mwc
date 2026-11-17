"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pageTransition as t } from "@/lib/motion";

// Names shown on the panel for each page that has the transition.
const pageNames: Record<string, string> = {
  "/comp-4": "Home",
  "/about": "About Us",
};

type Phase = "cover" | "reveal";

// Site-wide page transition. Any same-site link to a page listed above is
// intercepted: a navy panel wipes up from the bottom (0.4s) carrying the MWC
// mark 150px from the top and the destination's name in the middle; once the
// new page has rendered underneath, the panel wipes off the top (0.4s).
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ label: string; phase: Phase } | null>(null);
  const target = useRef<string | null>(null);

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
      target.current = url.pathname + url.search + url.hash;
      setState({ label, phase: "cover" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce, router]);

  // the new page is in: start at its top, then lift the panel
  useEffect(() => {
    if (!state || state.phase !== "cover" || target.current) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setState((s) => (s ? { ...s, phase: "reveal" } : s)));
    return () => cancelAnimationFrame(id);
  }, [pathname, state]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key="page-transition"
          aria-hidden
          className="fixed inset-0 z-[100] bg-navy text-bg"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: state.phase === "cover" ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
          transition={{ duration: state.phase === "cover" ? t.cover : t.reveal, ease: t.ease }}
          onAnimationComplete={() => {
            if (state.phase === "cover" && target.current) {
              const href = target.current;
              target.current = null;
              router.push(href);
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
            className="absolute top-[150px] left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: t.cover, ease: t.ease, delay: t.cover * 0.35 }}
          />
          {/* destination name, centred */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-6">
            <motion.p
              className="display text-center text-[48px] sm:text-[72px] lg:text-[96px]"
              initial={{ y: "60%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: t.cover, ease: t.ease, delay: t.cover * 0.25 }}
            >
              {state.label}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
