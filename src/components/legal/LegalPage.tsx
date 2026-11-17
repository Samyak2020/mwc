"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { duration, ease, heroSequence, scrollSpring } from "@/lib/motion";
import { RidgeBands } from "@/components/ui/RidgeBands";

// Legal pages (layout after wisprflow.ai/terms-of-service, in MWC's type and
// colour): a navy hero with the title centred and the effective date; then a
// paper panel with large rounded top corners laid over it, holding a sticky
// contents list on the left (current section highlighted, a thin progress
// line beside it) and the document on the right.

export type Block = string | { lead: string; text: string } | { list: string[] };
export type Section = { title: string; blocks: Block[] };

const docs = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const slug = (i: number) => `section-${i + 1}`;

function Body({ block }: { block: Block }) {
  if (typeof block === "string") return <p className="whitespace-pre-line">{block}</p>;
  if ("lead" in block)
    return (
      <p>
        <strong className="font-semibold text-fg">{block.lead}</strong> {block.text}
      </p>
    );
  return (
    <ul className="flex flex-col gap-2.5">
      {block.list.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-sky" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The section whose heading was last passed (scroll-spy). */
function useCurrent(count: number) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      let c = 0;
      for (let i = 0; i < count; i++) {
        const el = document.getElementById(slug(i));
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) c = i;
      }
      setCurrent(c);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [count]);
  return current;
}

export function LegalPage({
  current,
  title,
  effective,
  intro,
  sections,
}: {
  current: "/privacy" | "/terms";
  title: string;
  effective: string;
  intro: string;
  sections: Section[];
}) {
  const active = useCurrent(sections.length);
  const doc = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: doc, offset: ["start 35%", "end 65%"] });
  const progress = useSpring(scrollYProgress, scrollSpring);
  const [open, setOpen] = useState(false);

  const jump = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(slug(i));
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const contents = (
    <ul className="flex flex-col gap-1">
      {sections.map((s, i) => (
        <li key={s.title}>
          <a
            href={`#${slug(i)}`}
            onClick={jump(i)}
            aria-current={i === active ? "location" : undefined}
            className={`block rounded-[4px] px-4 py-2 text-base leading-[1.35] transition-colors duration-[var(--duration-base)] ${
              i === active ? "bg-sky/12 text-navy" : "text-fg/60 hover:text-fg"
            }`}
          >
            {i + 1}. {s.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-navy">
      {/* hero */}
      {/* hero: stays put while the document panel scrolls up over it */}
      <div className="sticky top-0 z-0 overflow-hidden">
        {/* the footer pattern (Figma 781:6530): stacked logo ridge bands,
            tone-on-tone, oversized and cropped, breathing very slowly */}
        <RidgeBands drift className="absolute top-[18%] left-[-18.24%] w-[181.67%]" />
      <section data-nav-theme="dark" aria-labelledby="legal-title" className="shell pt-32 pb-24 text-center text-bg/90 lg:pt-u-176 lg:pb-u-144">
        <FadeIn delay={heroSequence.headlineDelay}>
          <nav aria-label="Legal" className="flex justify-center gap-1">
            {docs.map((d) => (
              <a
                key={d.href}
                href={d.href}
                aria-current={d.href === current ? "page" : undefined}
                className={`rounded-[40px] px-4 py-1 text-sm leading-[1.5] tracking-[0.04em] uppercase transition-colors ${
                  d.href === current ? "bg-bg/10 text-bg/90" : "text-bg/50 hover:text-bg/80"
                }`}
              >
                {d.label}
              </a>
            ))}
          </nav>
        </FadeIn>
        <RevealHeading
          as="h1"
          id="legal-title"
          trigger="load"
          delay={heroSequence.headlineDelay}
          className="display mt-8 text-[48px] leading-[0.9] sm:text-[72px] lg:mt-u-40 lg:fs-u-96"
        >
          <Line className="block">{title}</Line>
        </RevealHeading>
        <FadeIn delay={heroSequence.chromeDelay}>
          <p className="mt-5 text-base text-bg/60 lg:mt-u-24 lg:fs-u-18">Effective date: {effective}</p>
        </FadeIn>
      </section>
      </div>

      {/* the document, on a paper panel that slides up over the hero */}
      <section data-nav-theme="light" className="relative z-10 rounded-t-[12px] bg-bg">
        <div className="shell grid gap-10 pt-14 pb-28 lg:grid-cols-[calc(var(--u)*400)_minmax(0,1fr)] lg:gap-u-176 lg:pt-u-112 lg:pb-u-160">
          {/* contents: sticky list with a progress line (desktop); a toggle (mobile) */}
          <aside className="lg:sticky lg:top-[136px] lg:self-start">
            <div className="hidden lg:flex lg:gap-6">
              <nav aria-label="Contents" className="min-w-0 flex-1">
                {contents}
              </nav>
              <div aria-hidden className="relative w-[3px] shrink-0 overflow-hidden rounded-full bg-fg/10">
                <motion.div className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-sky" style={{ scaleY: progress }} />
              </div>
            </div>
            <div className="border-y border-fg/10 lg:hidden">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between py-4 text-left text-base font-semibold"
              >
                Contents
                <svg aria-hidden width="12" height="8" viewBox="0 0 12 8" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                  <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.nav
                    aria-label="Contents"
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                  >
                    <div className="pb-4">{contents}</div>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* the text */}
          <div ref={doc} className="max-w-[680px] text-base leading-[1.6] tracking-[-0.005em] text-fg/80 lg:fs-u-17">
            <p className="text-lg leading-[1.55] text-fg lg:fs-u-20">{intro}</p>
            {sections.map((s, i) => (
              <section key={s.title} id={slug(i)} aria-labelledby={`${slug(i)}-h`} className="scroll-mt-32 pt-12 lg:pt-u-64">
                <h2 id={`${slug(i)}-h`} className="font-display text-[24px] leading-[1.1] font-bold tracking-[-0.012em] text-fg sm:text-[28px] lg:fs-u-32">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4 lg:mt-u-24">
                  {s.blocks.map((b, j) => (
                    <Body key={j} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
