"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pageTransition as t } from "@/lib/motion";

// Pages that use the transition; other links navigate normally.
const pages = new Set(["/", "/about", "/careers", "/contact", "/client-resources", "/privacy", "/terms"]);

type Phase = "cover" | "hold" | "reveal";

// The two layers, in the team cards' colours: sky (as on the name bar) then
// navy (as on the role bar, carrying a faint drafting grid). They stack in
// this order, so navy ends up on top.
const layers = ["bg-sky", "bg-navy transition-grid"] as const;

// Site-wide page transition (after podiumautomation.com). On a same-site link
// the layers slide up from the bottom one after another and cover the screen;
// the next page loads underneath; then the navy layer slides off the top while
// the new page rises into place.
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase | null>(null);
  const [arrived, setArrived] = useState(false);
  const target = useRef<{ href: string; path: string } | null>(null);

  // intercept link clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (!pages.has(url.pathname)) return;
      e.preventDefault();
      // between the two legal pages: switch straight across, no transition
      const legal = (path: string) => path === "/privacy" || path === "/terms";
      if (reduce || (legal(url.pathname) && legal(window.location.pathname))) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      target.current = { href: url.pathname + url.search + url.hash, path: url.pathname };
      setArrived(false);
      setPhase("cover");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce, router]);

  // the new page has rendered underneath
  useEffect(() => {
    if (phase === "hold" && pathname === target.current?.path) setArrived(true);
  }, [pathname, phase]);

  // page is in: jump to the top, then lift the navy layer while the page rises
  useEffect(() => {
    if (phase !== "hold" || !arrived) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => {
      document.querySelector("main")?.animate([{ transform: `translateY(${t.rise}px)` }, { transform: "none" }], {
        duration: t.reveal * 1000,
        delay: t.revealDelay * 1000,
        easing: `cubic-bezier(${t.revealEase.join(",")})`,
      });
      setPhase("reveal");
    });
    return () => cancelAnimationFrame(id);
  }, [phase, arrived]);

  const last = layers.length - 1;
  return (
    <AnimatePresence>
      {phase && (
        <div key="page-transition" aria-hidden className="pointer-events-auto fixed inset-0 z-[100] overflow-hidden">
          {layers.map((cls, i) => {
            // on the way out only the top layer is left showing; it slides off
            if (phase === "reveal" && i !== last) return null;
            return (
              <motion.div
                key={cls}
                className={`absolute inset-0 ${cls}`}
                initial={{ y: "101%" }}
                animate={{ y: phase === "reveal" ? "-101%" : "0%" }}
                transition={
                  phase === "reveal"
                    ? { duration: t.reveal, ease: t.revealEase, delay: t.revealDelay }
                    : { duration: t.cover, ease: t.coverEase, delay: i * t.stagger }
                }
                onAnimationComplete={() => {
                  if (i !== last) return;
                  if (phase === "cover" && target.current) {
                    // covered: load the next page underneath
                    router.push(target.current.href);
                    setPhase("hold");
                  } else if (phase === "reveal") {
                    setPhase(null);
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
