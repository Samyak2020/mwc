"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Rise } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease, PHOTO_QUALITY } from "@/lib/motion";
import { categories, resources, type Category, type Resource } from "./resourcesData";

// Client Resources, laid out as a document register: one quiet filter row
// (category tabs, the count, search) over a lead item and a calm grid. No
// boxes around anything: each item is its photograph, its title, a two-line
// summary and one register line (type, date, format) in tabular figures. The
// colour on the page comes from the field photographs, nothing else.

/** "Case study" repeats "Case Studies", so the format only shows when it adds something */
function register(r: Resource) {
  const singular = r.category.replace(/ies$/, "y").replace(/s$/, "").toLowerCase();
  const fmt = r.meta.toLowerCase() === singular ? null : r.meta;
  return [r.category, r.date, fmt].filter(Boolean) as string[];
}

function RegisterLine({ r, className = "" }: { r: Resource; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-sm leading-[1.4] text-fg/55 tabular-nums ${className}`}>
      {register(r).map((part, i) => (
        <span key={part} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-fg/30" />}
          <span className={i === 0 ? "font-medium text-fg/75" : ""}>{part}</span>
        </span>
      ))}
    </p>
  );
}

function Photo({ r, sizes, priority }: { r: Resource; sizes: string; priority?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[4px] bg-[#e6e9ee]">
      <Image
        src={r.image}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        quality={PHOTO_QUALITY}
        className="object-cover transition-[transform,filter] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
      />
    </div>
  );
}

/** the lead item: photograph on the left, its title and summary beside it */
function Lead({ r }: { r: Resource }) {
  return (
    <a href="#" className="group grid gap-8 outline-none lg:grid-cols-12 lg:items-center lg:gap-x-[calc(var(--u)*32)]">
      <div className="lg:col-span-7 [&>div]:aspect-[16/10]">
        <Photo r={r} sizes="(min-width: 1024px) 58vw, 100vw" priority />
      </div>
      <div className="flex flex-col gap-5 lg:col-span-5 lg:pr-u-32">
        <RegisterLine r={r} />
        <h2 className="text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-balance transition-colors duration-[var(--duration-fast)] group-hover:text-navy group-focus-visible:text-navy lg:fs-u-44">
          {r.title}
        </h2>
        <p className="max-w-[46ch] text-lg leading-[1.55] text-pretty text-fg/70">{r.summary}</p>
        <span className="mt-2 inline-flex w-fit items-center gap-2 text-base font-semibold text-navy">
          <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] group-hover:decoration-current">
            {r.meta.startsWith("PDF") ? "Download" : "Read"}
          </span>
          <Arrow width={16} />
        </span>
      </div>
    </a>
  );
}

function Item({ r }: { r: Resource }) {
  return (
    <a href="#" className="group flex h-full flex-col outline-none">
      <div className="[&>div]:aspect-[3/2]">
        <Photo r={r} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
      </div>
      <RegisterLine r={r} className="mt-5" />
      <h3 className="mt-3 text-xl leading-[1.25] font-semibold tracking-[-0.01em] text-balance transition-colors duration-[var(--duration-fast)] group-hover:text-navy group-focus-visible:text-navy">
        {r.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-base leading-[1.55] text-pretty text-fg/65">{r.summary}</p>
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
  const [lead, ...rest] = shown;
  const tabs: (Category | null)[] = [null, ...categories];

  return (
    <section data-nav-theme="light" data-nav-solid="" aria-labelledby="resources-title" className="bg-bg pb-24 text-fg lg:pb-u-160">
      <div className="shell pt-32 pb-10 lg:pt-[calc(var(--u)*180)] lg:pb-u-56">
        <Rise>
          <h1 id="resources-title" className="display text-[48px] sm:text-[72px] lg:fs-u-96">
            Client Resources
          </h1>
        </Rise>
      </div>

      {/* filter row: category tabs on the left, count and search on the right */}
      <div className="z-20 border-b border-fg/10 bg-bg/95 backdrop-blur-sm md:sticky md:top-16 xl:top-[72px]">
        <div className="shell flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="no-scrollbar -mx-4 flex overflow-x-auto overflow-y-hidden px-4 md:mx-0 md:px-0" role="group" aria-label="Filter by category">
            {tabs.map((c) => {
              const on = active === c;
              return (
                <button
                  key={c ?? "all"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(c)}
                  className={`relative shrink-0 px-3 py-4 text-[15px] leading-none whitespace-nowrap transition-colors duration-[var(--duration-fast)] first:pl-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy ${
                    on ? "font-semibold text-fg" : "text-fg/55 hover:text-fg"
                  }`}
                >
                  {c ?? "All"}
                  <span
                    aria-hidden
                    className={`absolute right-3 bottom-[-1px] h-[2px] bg-navy transition-opacity duration-[var(--duration-fast)] ${c === null ? "left-0" : "left-3"} ${on ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-6 pb-3 lg:pb-2.5">
            <p className="shrink-0 text-sm text-fg/55 tabular-nums" aria-live="polite">
              {shown.length} {shown.length === 1 ? "resource" : "resources"}
            </p>
            <div className="relative w-full lg:w-[240px]">
              <label htmlFor={searchId} className="sr-only">
                Search resources
              </label>
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-fg/45">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full border-b border-fg/20 bg-transparent py-2 pl-7 text-[15px] text-fg caret-navy outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-fg/45 hover:border-fg/40 focus-visible:border-navy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shell mt-12 lg:mt-u-64">
        <h2 className="sr-only">Resources</h2>
        {shown.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border-t border-fg/10 py-16">
            <p className="text-lg text-fg/70">Nothing matches that search in this category.</p>
            <button
              type="button"
              onClick={() => {
                setActive(null);
                setQuery("");
              }}
              className="text-base font-semibold text-navy underline underline-offset-4"
            >
              Show all resources
            </button>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={lead.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
              >
                <Lead r={lead} />
              </motion.div>
            </AnimatePresence>
            {rest.length > 0 && (
              <motion.ul layout className="mt-16 grid gap-x-8 gap-y-14 border-t border-fg/10 pt-14 md:grid-cols-2 lg:mt-u-96 lg:grid-cols-3 lg:gap-x-[calc(var(--u)*32)] lg:gap-y-u-72 lg:pt-u-72">
                <AnimatePresence mode="popLayout">
                  {rest.map((r) => (
                    <motion.li
                      key={r.title}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                      exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                    >
                      <Item r={r} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
