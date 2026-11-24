"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Rise } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { RegMarks } from "@/components/ui/RegMarks";
import { duration, ease, PHOTO_QUALITY } from "@/lib/motion";
import { categories, resources, type Category, type Resource } from "./resourcesData";

// Client Resources (layout after mistral.ai/news), drafting-sheet style: the site's paper ground, with the
// resources laid out as cells of one ruled grid (shared hairlines, corner
// registration marks), each with a title block (issued / format) along its
// foot. Square outlined chips and search, with the result count beside them. Content is the live page's placeholder set.

const chip =
  "border px-3.5 py-2 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
const chipOn = "border-navy bg-navy text-bg";
const chipOff = "border-fg/25 text-fg/75 hover:border-fg/60 hover:text-fg";

function Cell({ r, featured }: { r: Resource; featured?: boolean }) {
  return (
    <a
      href="#"
      className={`group relative flex h-full flex-col bg-bg text-fg outline-none focus-visible:bg-[#eef1f6] ${
        featured ? "md:grid md:grid-cols-2 md:grid-rows-[1fr_auto]" : ""
      }`}
    >
      <div
        className={`relative m-4 overflow-hidden bg-night ${
          featured
            ? "aspect-[4/3] md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-auto md:min-h-[420px]"
            : "aspect-[16/10]"
        }`}
      >
        <Image
          src={r.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"}
          quality={PHOTO_QUALITY}
          className="object-cover transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
        <RegMarks className="text-bg/90" />
      </div>

      <div className={`flex flex-1 flex-col gap-4 px-6 pt-2 pb-7 ${featured ? "md:col-start-1 md:row-start-1 md:justify-end md:p-10" : ""}`}>
        <span className="self-start border border-fg/25 px-2.5 py-1.5 text-[12px] leading-none font-medium text-fg/75">
          {r.category}
        </span>
        <h3
          className={`leading-[1.15] font-semibold tracking-[-0.01em] text-balance group-hover:text-navy ${
            featured ? "text-[28px] lg:text-[36px]" : "text-xl"
          }`}
        >
          {r.title}
        </h3>
        <p className={`leading-[1.5] text-pretty text-fg/70 ${featured ? "max-w-[440px] text-lg" : "text-base"}`}>
          {r.summary}
        </p>
      </div>

      {/* title block */}
      <dl
        className={`mt-auto grid grid-cols-[1fr_1fr_auto] border-t border-fg/15 text-fg ${
          featured ? "md:col-start-1 md:row-start-2" : ""
        }`}
      >
        <div className="px-6 py-3.5">
          <dt className="text-[11px] leading-none text-fg/60">Issued</dt>
          <dd className="mt-1.5 text-[13px] leading-none">{r.date}</dd>
        </div>
        <div className="border-l border-fg/15 px-6 py-3.5">
          <dt className="text-[11px] leading-none text-fg/60">Format</dt>
          <dd className="mt-1.5 text-[13px] leading-none">{r.meta}</dd>
        </div>
        <div className="flex items-center border-l border-fg/15 px-5">
          <Arrow
            width={18}
            className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-1"
          />
        </div>
      </dl>
    </a>
  );
}

export function ResourcesPage() {
  const searchId = useId();
  const [active, setActive] = useState<Category | null>(null);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter(
      (r) => (!active || r.category === active) && (!q || `${r.title} ${r.summary} ${r.category}`.toLowerCase().includes(q)),
    );
  }, [active, query]);

  return (
    <section data-nav-theme="light" data-nav-solid="" aria-labelledby="resources-title" className="bg-bg pb-24 text-fg lg:pb-u-160">
      {/* title */}
      <div className="shell pt-32 pb-12 lg:pt-[calc(var(--u)*200)] lg:pb-u-64">
        <Rise>
          <h1 id="resources-title" className="display text-[56px] leading-[0.9] sm:text-[88px] lg:fs-u-128">
            Client Resources
          </h1>
        </Rise>
      </div>

      {/* filter bar */}
      <div className="z-20 border-y border-fg/10 bg-bg md:sticky md:top-16 xl:top-[72px]">
        <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex items-baseline gap-3 whitespace-nowrap">
              <p className="text-[15px] font-semibold">Filter by category</p>
              <p className="text-[15px] text-fg/60" aria-live="polite">
                {shown.length} {shown.length === 1 ? "result" : "results"}
              </p>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Categories">
              <button type="button" aria-pressed={!active} onClick={() => setActive(null)} className={`${chip} ${!active ? chipOn : chipOff}`}>
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active === c}
                  onClick={() => setActive((a) => (a === c ? null : c))}
                  className={`${chip} ${active === c ? chipOn : chipOff}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="relative lg:w-[260px]">
            <label htmlFor={searchId} className="sr-only">
              Search resources
            </label>
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg/50">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full border border-fg/25 bg-transparent py-2.5 pr-4 pl-10 text-[15px] text-fg outline-none placeholder:text-fg/60 focus-visible:border-navy"
            />
          </div>
        </div>
      </div>

      {/* one ruled grid: each cell's 1px outline sits in the 1px gap, so shared
          edges draw a single rule */}
      <div className="shell mt-10 lg:mt-u-48">
        <h2 className="sr-only">Resources</h2>
        {shown.length === 0 ? (
          <p className="border border-fg/15 py-20 text-center text-fg/60">No resources match. Try another category or search.</p>
        ) : (
          <div className="relative">
            <RegMarks size={14} className="text-fg/70" />
            <motion.ul layout className="grid gap-px md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((r, i) => (
                  <motion.li
                    key={r.title}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                    exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                    className={`outline outline-1 outline-fg/15 ${i === 0 ? "md:col-span-2" : ""}`}
                  >
                    <Cell r={r} featured={i === 0} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        )}
      </div>
    </section>
  );
}
