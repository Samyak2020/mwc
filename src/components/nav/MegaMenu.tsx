"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Texture } from "@/components/ui/Texture";
import { IndustryGraphic, type IndustryKey } from "./IndustryGraphic";
import { duration, ease, navMenu } from "@/lib/motion";

// Nav dropdowns (layout after maisa.ai): column labels in 50% ink, large
// links, and a picture on the right — a live line drawing for Industries, a
// placeholder for Services until imagery is chosen.

export type MenuKey = "industries" | "services" | "projects" | "company";

type Link = { label: string; href: string };
type Industry = Link & { key: IndustryKey; description: string };

export const industries: Industry[] = [
  {
    key: "power",
    label: "Power Producers",
    href: "/industries/power-producers",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
  },
  {
    key: "utilities",
    label: "Utilities",
    href: "/industries/utilities",
    description:
      "Within electric, natural gas and water utility capital delivery organizations, MWC provides project and program management, construction oversight and project controls.",
  },
  {
    key: "government",
    label: "Government",
    href: "/industries/government",
    description:
      "Federal, state and local projects are delivered by MWC, a certified service-disabled veteran-owned small business.",
  },
  {
    key: "commercial",
    label: "Construction",
    href: "/industries/construction",
    description:
      "Owner-side project oversight and project delivery personnel are available for commercial, industrial and on-site energy projects, with added support for contractor teams.",
  },
  {
    key: "oil",
    label: "Oil and Gas",
    href: "/industries/oil-gas",
    description:
      "From upstream production sites to midstream pipelines and downstream refinery turnarounds, projects are managed with contractor safety oversight from mobilization to closeout.",
  },
];

export const serviceGroups: { label: string; href?: string; links: Link[] }[] =
  [
    {
      label: "Workstreams",
      links: [
        {
          label: "Owner’s Representative",
          href: "/services/owners-representative",
        },
        {
          label: "Project Management",
          href: "/services/project-program-management",
        },
        {
          label: "Controls and Scheduling",
          href: "/services/project-controls-scheduling",
        },
        {
          label: "Construction Management",
          href: "/services/construction-management",
        },
        {
          label: "Safety Management",
          href: "/services/construction-safety-management",
        },
        {
          label: "Coordination and Document Control",
          href: "/services/project-coordination",
        },
        {
          label: "Engineering Services",
          href: "/services/engineering-services",
        },
        {
          label: "Technology Project Management",
          href: "/services/technology-project-management",
        },
      ],
    },
    {
      label: "Specialized Services",
      links: [
        {
          label: "Plant Outage Management",
          href: "/services/plant-outage-planning",
        },
        {
          label: "Utility Interconnection Coordination",
          href: "/services/utility-interconnection-coordination",
        },
        {
          label: "Power Plant Decommissioning",
          href: "/services/power-plant-decommissioning",
        },
      ],
    },
  ];

export const projectGroups: { label: string; href?: string; links: Link[] }[] =
  [
    {
      label: "Projects",
      href: "/projects",
      links: [
        { label: "Power Generation", href: "/projects/power-generation" },
        {
          label: "Solar and BESS",
          href: "/projects/solar-battery-storage",
        },
        {
          label: "Transmission, Distribution and Substations",
          href: "/projects/transmission-distribution",
        },
        {
          label: "EV and Demand-Side Management",
          href: "/projects/electric-vehicle-charging",
        },
        { label: "Microgrids", href: "/projects/microgrids" },
      ],
    },
  ];

export const companyGroups: { label: string; href?: string; links: Link[] }[] = [
  {
    label: "Company",
    links: [
      { label: "About MWC", href: "/about" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

// Compact dropdowns (after mistral.ai): one panel per category, opening under
// its own trigger. Small uppercase column labels, thin dividers between
// columns, and the drawing or picture on the right.
const labelCls = "text-[11px] leading-none font-medium tracking-[0.08em] text-fg/45 uppercase";
const linkCls =
  "group/link flex items-center justify-between gap-4 text-fg transition-colors duration-[var(--duration-base)] hover:text-navy focus-visible:text-navy";

function Chev() {
  return (
    <svg
      aria-hidden
      width="6"
      height="10"
      viewBox="0 0 6 10"
      className="shrink-0 opacity-40 transition-[opacity,transform] duration-[var(--duration-base)] group-hover/link:translate-x-0.5 group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
    >
      <path d="M1 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-block text-sm leading-none font-medium text-navy underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current"
    >
      {children}
    </a>
  );
}

function Column({ label, href, className = "", children }: { label: string; href?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`border-l border-fg/10 px-10 pt-7 pb-9 first:border-l-0 ${className}`}>
      {href ? (
        <a href={href} className={`${labelCls} block transition-colors hover:text-navy`}>
          {label}
        </a>
      ) : (
        <p className={labelCls}>{label}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function IndustriesPanel() {
  const [hover, setHover] = useState(0);
  const current = industries[hover];
  return (
    <div className="flex">
      <Column label="Industries" className="w-[320px]">
        <ul className="flex flex-col">
          {industries.map((ind, i) => (
            <li key={ind.key} className="border-b border-fg/10 last:border-b-0">
              <a
                href={ind.href}
                className={`${linkCls} py-3 text-[17px] leading-[1.2] tracking-[0.005em] ${hover === i ? "text-navy" : ""}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
              >
                {ind.label}
                <Chev />
              </a>
            </li>
          ))}
        </ul>
      </Column>

      {/* the hovered industry, drawn: rebuilt from scratch on every change */}
      <div className="relative m-2 ml-4 w-[460px] overflow-hidden rounded-[2px] bg-[#f2f3f8]">
        <p className="absolute top-3 left-3 z-10 flex items-center gap-2 text-[11px] leading-none font-medium tracking-[0.06em] text-fg/60 uppercase">
          <span aria-hidden className="size-1.5 bg-sky" />
          {current.label}
        </p>
        <div className="flex h-full items-center px-2 pt-6">
          <IndustryGraphic key={current.key} industry={current.key} />
        </div>
      </div>
    </div>
  );
}

type Group = { label: string; href?: string; links: Link[] };

/** Link columns plus a picture on the right (Services, Projects, Company). */
function LinksPanel({ groups, viewAll, widths }: { groups: Group[]; viewAll?: [string, string]; widths: number[] }) {
  return (
    <div className="flex">
      {groups.map((g, gi) => (
        <Column key={g.label} label={g.label} href={g.href} className="shrink-0">
          <ul className="flex flex-col gap-3" style={{ width: widths[gi] }}>
            {g.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`${linkCls} text-[15px] leading-[1.3] tracking-[0.005em]`}>
                  {l.label}
                  <Chev />
                </a>
              </li>
            ))}
          </ul>
          {viewAll && gi === groups.length - 1 && (
            <div className="mt-6">
              <ViewAll href={viewAll[0]}>{viewAll[1]}</ViewAll>
            </div>
          )}
        </Column>
      ))}
      {/* image placeholder until imagery is chosen */}
      <div aria-hidden className="relative m-2 ml-4 min-h-[240px] w-[300px] shrink-0 overflow-hidden rounded-[2px] bg-[#e3e9f2]">
        <Texture opacity={0.25} />
        <p className="absolute top-3 left-3 flex items-center gap-2 text-[11px] leading-none font-medium tracking-[0.06em] text-fg/40 uppercase">
          <span className="size-1.5 bg-fg/30" />
          Image
        </p>
      </div>
    </div>
  );
}

/** Panel contents for the open menu, cross-fading when the menu changes. */
export function MenuContent({ menu }: { menu: MenuKey }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={menu}
        className="w-max"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: navMenu.content.duration, ease: navMenu.content.ease, delay: 0.05 } }}
        exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
      >
        {menu === "industries" ? (
          <IndustriesPanel />
        ) : menu === "services" ? (
          <LinksPanel groups={serviceGroups} viewAll={["/all-services", "View all services"]} widths={[280, 280]} />
        ) : menu === "projects" ? (
          <LinksPanel groups={projectGroups} viewAll={["/projects", "View all projects"]} widths={[340]} />
        ) : (
          <LinksPanel groups={companyGroups} widths={[200]} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- mobile */

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-fg/10">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-xl leading-none"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <svg
          aria-hidden
          width="12"
          height="8"
          viewBox="0 0 12 8"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: duration.base, ease: ease.out },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: duration.fast, ease: ease.in },
            }}
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const sub = "block py-2 text-base leading-[1.3] text-fg/80";
  return (
    <ul className="flex flex-col px-5 pt-2 pb-6 text-fg">
      <Group title="Industries">
        {industries.map((i) => (
          <a key={i.key} href={i.href} className={sub} onClick={onNavigate}>
            {i.label}
          </a>
        ))}
      </Group>
      <Group title="Services">
        {serviceGroups.map((g) => (
          <div key={g.label} className="mt-3 first:mt-0">
            <p className="py-1 text-sm text-fg/50">{g.label}</p>
            {g.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={sub}
                onClick={onNavigate}
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}
        <a
          href="/all-services"
          className="mt-3 block py-2 text-base font-medium text-navy"
          onClick={onNavigate}
        >
          View all services
        </a>
      </Group>
      <Group title="Projects">
        {projectGroups[0].links.map((l) => (
          <a key={l.href} href={l.href} className={sub} onClick={onNavigate}>
            {l.label}
          </a>
        ))}
        <a
          href="/projects"
          className="mt-3 block py-2 text-base font-medium text-navy"
          onClick={onNavigate}
        >
          View all projects
        </a>
      </Group>
      {[
        ["Client Resources", "#"],
      ].map(([label, href]) => (
        <li key={label} className="border-b border-fg/10">
          <a
            href={href}
            className="block py-4 text-xl leading-none"
            onClick={onNavigate}
          >
            {label}
          </a>
        </li>
      ))}
      <Group title="Company">
        {companyGroups[0].links.map((l) => (
          <a key={l.href} href={l.href} className={sub} onClick={onNavigate}>
            {l.label}
          </a>
        ))}
      </Group>
      <li className="mt-6">
        <a
          href="#contact"
          onClick={onNavigate}
          className="flex items-center justify-center bg-navy px-5 py-4 text-base leading-[1.1] font-semibold text-bg/90"
        >
          TALK TO A PROJECT LEAD
        </a>
      </li>
    </ul>
  );
}
