"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Rise } from "@/components/motion/Rise";
import { duration, ease, PHOTO_QUALITY } from "@/lib/motion";

// Client Resources (layout after mistral.ai/news): a large title, then a bar
// to filter by category (with a result count and a search), a featured
// resource across two columns and the rest in a three-column grid.
// Titles, summaries, dates and images are placeholders for now.

const categories = [
  "Brochure",
  "Case Studies",
  "Capability Statements",
  "Service Descriptions",
  "Workflows",
  "Articles",
] as const;
type Category = (typeof categories)[number];

type Resource = {
  title: string;
  summary: string;
  category: Category;
  date: string;
  meta: string;
  image: string;
};

const resources: Resource[] = [
  {
    title: "MWC Company Brochure 2026",
    summary:
      "Who we are, the industries we serve and how our project leads support capital programs from planning to closeout.",
    category: "Brochure",
    date: "November 4, 2026",
    meta: "PDF · 12 pages",
    image: "/about-v2/hero.png",
  },
  {
    title: "Delivering a 230 kV Substation Upgrade on Schedule",
    summary:
      "How owner’s representation kept a utility substation upgrade on track through outages and design changes.",
    category: "Case Studies",
    date: "October 28, 2026",
    meta: "Case study",
    image: "/comp4v2/ind-utilities.png",
  },
  {
    title:
      "What Does an Owner’s Representative Actually Do on a Utility Project?",
    summary:
      "The responsibilities of the role, how it differs from construction management and where it can supplement your team.",
    category: "Articles",
    date: "October 21, 2026",
    meta: "6 min read",
    image: "/comp1r/res-1.png",
  },
  {
    title: "Capability Statement: Power Generation",
    summary:
      "Our experience, certifications and past performance across gas, solar and storage generation projects.",
    category: "Capability Statements",
    date: "October 14, 2026",
    meta: "PDF · 2 pages",
    image: "/comp4v2/ind-power.png",
  },
  {
    title: "Project Controls and Scheduling",
    summary:
      "Schedule development, cost forecasting and reporting that give owners a clear view of where a project stands.",
    category: "Service Descriptions",
    date: "October 7, 2026",
    meta: "PDF · 4 pages",
    image: "/about-v2/ws-plan.png",
  },
  {
    title: "From Kickoff to Closeout: Our Project Workflow",
    summary:
      "The stages, handoffs and checkpoints we follow on every project, and what owners can expect at each one.",
    category: "Workflows",
    date: "September 30, 2026",
    meta: "Workflow",
    image: "/about-v2/ws-build-a.png",
  },
  {
    title: "Restoring a Government Dam’s Spillway Gates",
    summary:
      "Coordinating contractors, regulators and outage windows on a multi-year federal infrastructure project.",
    category: "Case Studies",
    date: "September 23, 2026",
    meta: "Case study",
    image: "/comp4v2/ind-government.png",
  },
  {
    title: "What Construction Firms Need to Know Before Entering Utility Work",
    summary:
      "Documentation, utility coordination and scheduling requirements that affect planning and field execution.",
    category: "Articles",
    date: "September 16, 2026",
    meta: "5 min read",
    image: "/comp1r/res-2.png",
  },
  {
    title: "Capability Statement: Oil & Gas",
    summary:
      "Midstream and downstream project support, from front-end planning through commissioning.",
    category: "Capability Statements",
    date: "September 9, 2026",
    meta: "PDF · 2 pages",
    image: "/comp4v2/ind-oil.png",
  },
  {
    title: "Construction Management and Field Oversight",
    summary:
      "Daily site presence, quality and safety oversight, and documented decisions that protect the owner.",
    category: "Service Descriptions",
    date: "September 2, 2026",
    meta: "PDF · 4 pages",
    image: "/about-v2/ws-operate.png",
  },
  {
    title: "Change Order Review Workflow",
    summary:
      "How we review, negotiate and document change orders so scope and cost stay under control.",
    category: "Workflows",
    date: "August 26, 2026",
    meta: "Workflow",
    image: "/about-v2/ws-decom.png",
  },
  {
    title: "How Project Leaders Keep Construction Teams Aligned",
    summary:
      "Defined responsibilities, regular coordination and documented decisions help teams manage changing field conditions.",
    category: "Articles",
    date: "August 19, 2026",
    meta: "4 min read",
    image: "/comp1r/res-3.png",
  },
  {
    title: "Industrial Services Brochure",
    summary:
      "An overview of our support for industrial and commercial facilities, expansions and shutdowns.",
    category: "Brochure",
    date: "August 12, 2026",
    meta: "PDF · 8 pages",
    image: "/comp4v2/ind-commercial.png",
  },
];

const chip =
  "rounded-full px-3.5 py-2 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)]";

function Arrow() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-1"
    >
      <path
        d="M1 7h11M8 3l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({ r, featured }: { r: Resource; featured?: boolean }) {
  return (
    <a
      href="#"
      className={`group flex h-full flex-col overflow-hidden rounded-[10px] bg-[#eef1f6] text-fg ${
        featured ? "md:grid md:grid-cols-2 md:grid-rows-[1fr_auto]" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-navy ${featured ? "aspect-[4/3] md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-auto md:min-h-[440px]" : "aspect-[16/10]"}`}
      >
        <Image
          src={r.image}
          alt=""
          fill
          sizes={
            featured
              ? "(min-width: 768px) 33vw, 100vw"
              : "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          }
          quality={PHOTO_QUALITY}
          className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
      </div>
      <div
        className={`flex flex-1 flex-col gap-4 p-6 lg:p-7 ${featured ? "md:col-start-1 md:row-start-1 lg:p-10" : ""}`}
      >
        <span className="self-start rounded-full bg-bg px-3 py-1.5 text-[12px] leading-none font-medium text-fg/70">
          {r.category}
        </span>
        <h3
          className={`leading-[1.2] font-semibold tracking-[-0.005em] group-hover:text-navy ${featured ? "text-[26px] lg:text-[32px]" : "text-xl"}`}
        >
          {r.title}
        </h3>
        <p
          className={`leading-[1.5] text-fg/70 ${featured ? "max-w-[440px] text-lg" : "text-base"}`}
        >
          {r.summary}
        </p>
      </div>
      <div
        className={`mt-auto grid grid-cols-[1fr_1fr_auto] ${featured ? "md:col-start-1 md:row-start-2" : ""} items-center border-t border-fg/10 text-[13px] text-fg/60`}
      >
        <span className="px-6 py-4 lg:px-7">{r.date}</span>
        <span className="border-l border-fg/10 px-6 py-4">{r.meta}</span>
        <span className="flex h-full items-center border-l border-fg/10 px-5 text-fg">
          <Arrow />
        </span>
      </div>
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
      (r) =>
        (!active || r.category === active) &&
        (!q ||
          `${r.title} ${r.summary} ${r.category}`.toLowerCase().includes(q)),
    );
  }, [active, query]);

  return (
    <>
      {/* title */}
      <section
        data-nav-theme="light"
        data-nav-solid=""
        className="bg-bg text-fg"
      >
        <div className="shell pt-32 pb-14 lg:pt-[calc(var(--u)*200)] lg:pb-u-80">
          <Rise>
            <h1 className="display text-[56px] leading-[0.9] sm:text-[88px] lg:fs-u-128">
              Client Resources
            </h1>
          </Rise>
        </div>
      </section>

      <section
        data-nav-theme="light"
        data-nav-solid=""
        aria-label="Resources"
        className="bg-bg pb-24 text-fg lg:pb-u-160"
      >
        {/* filter bar */}
        <div className="sticky top-16 z-20 border-y border-fg/10 bg-bg xl:top-[72px]">
          <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <div className="flex items-baseline gap-3 whitespace-nowrap">
                <p className="text-[15px] font-semibold">Filter by category</p>
                <p className="text-[15px] text-fg/50" aria-live="polite">
                  {shown.length} {shown.length === 1 ? "result" : "results"}
                </p>
              </div>
              <div
                className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
                role="group"
                aria-label="Categories"
              >
                <button
                  type="button"
                  aria-pressed={!active}
                  onClick={() => setActive(null)}
                  className={`${chip} ${!active ? "bg-navy text-bg" : "bg-[#eef1f6] text-fg/60 hover:text-fg"}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active === c}
                    onClick={() => setActive((a) => (a === c ? null : c))}
                    className={`${chip} ${active === c ? "bg-navy text-bg" : "bg-[#eef1f6] text-fg/60 hover:text-fg"}`}
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
              <svg
                aria-hidden
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg/50"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.5 9.5L13 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-full bg-[#eef1f6] py-2.5 pr-4 pl-10 text-[15px] text-fg outline-none placeholder:text-fg/40 focus-visible:ring-2 focus-visible:ring-sky"
              />
            </div>
          </div>
        </div>

        {/* grid: the first match is featured across two columns */}
        <div className="shell mt-8 lg:mt-u-40">
          {shown.length === 0 ? (
            <p className="py-20 text-center text-fg/60">
              No resources match. Try another category or search.
            </p>
          ) : (
            <motion.ul
              layout
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {shown.map((r, i) => (
                  <motion.li
                    key={r.title}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: duration.base, ease: ease.out },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: duration.fast, ease: ease.in },
                    }}
                    className={i === 0 ? "md:col-span-2" : ""}
                  >
                    <Card r={r} featured={i === 0} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>
    </>
  );
}
