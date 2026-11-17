"use client";

import Image from "next/image";
import { useRef } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/Stagger";
import { Rise, RiseEach, RiseWords } from "@/components/motion/Rise";
import { Band } from "./Band";
import { Ridge } from "@/components/ui/Ridge";
import { DisciplineIcon, type DisciplineKey } from "./DisciplineIcons";
import { TeamCarousel } from "./TeamCarousel";
import { heroSequence, PHOTO_QUALITY } from "@/lib/motion";

// About MWC (copy: "MWC Website Content 1", About Page), laid out after
// letsgrowcanada.ca/about-us in MWC's own type and colour: a big title with a
// short intro, a wide photo with a running band, statement quotes, a story
// with a portrait, a row of workstream cards, results, experience, the team
// and a full-bleed call to action.

const label = "text-sm leading-[1.3] font-medium tracking-[0.01em] text-fg/50";
const ctaCls =
  "cta inline-flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg";

/* --------------------------------------------------------------- hero */

export function AboutHero({
  id = "about-title",
  lines = ["About", "MWC"],
  intro = "Learn what sets MWC apart: experienced leadership, proven project workstreams and a commitment to representing your interests.",
  image = "/comp2/hero-v2.jpg",
  alt = "MWC field leads walking a power generation site",
  titleClassName = "text-[72px] leading-[0.85] sm:text-[120px] lg:fs-u-160",
  band,
}: {
  id?: string;
  lines?: string[];
  intro?: string;
  image?: string;
  alt?: string;
  titleClassName?: string;
  /** phrases for the running band under the photo (About's by default) */
  band?: string[];
} = {}) {
  return (
    <section data-nav-theme="light" aria-labelledby={id} className="shell pt-32 lg:pt-u-170">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <RevealHeading
          as="h1"
          id={id}
          trigger="load"
          delay={heroSequence.headlineDelay}
          className={`display ${titleClassName}`}
        >
          {lines.map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
        <FadeIn delay={heroSequence.chromeDelay} className="max-w-[420px] lg:w-u-420 lg:pb-u-12">
          <p className="text-lg leading-[1.45] tracking-[-0.005em] lg:fs-u-20">{intro}</p>
        </FadeIn>
      </div>

      <div className="relative mt-10 h-[420px] overflow-hidden rounded-[4px] bg-navy sm:h-[560px] lg:mt-u-56 lg:h-u-720">
        <ImageReveal trigger="load" delay={heroSequence.headlineDelay + 0.2}>
          <Image
            src={image}
            alt={alt}
            fill
            priority
            sizes="100vw"
            quality={PHOTO_QUALITY}
            className="object-cover object-[50%_40%]"
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <Texture opacity={0.12} />
        </ImageReveal>
        <Band phrases={band} className="absolute inset-x-0 bottom-0 h-8" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- quote */

export function AboutQuote({ quote, by, dark = false }: { quote: string; by: string; dark?: boolean }) {
  return (
    <section
      data-nav-theme={dark ? "dark" : "light"}
      className={dark ? "relative mt-24 overflow-hidden bg-navy py-24 text-bg/90 lg:mt-u-160 lg:py-u-160" : "pt-24 lg:pt-u-160"}
    >
      {/* the logo's mountain, drawn across the foot of the navy band */}
      {dark && (
        <Ridge className="absolute -right-[4%] bottom-0 w-[70%] lg:w-[52%]" />
      )}
      <figure className="shell relative">
        <blockquote>
          <RiseWords
            text={`“${quote}”`}
            className="max-w-[1100px] text-[26px] leading-[1.15] font-medium tracking-[-0.015em] sm:text-[34px] lg:w-u-1100 lg:max-w-none lg:fs-u-44"
          />
        </blockquote>
        <Rise as="div" delay={0.3} className="mt-8 flex items-center gap-3 lg:mt-u-40">
          <span aria-hidden className={`h-px w-10 ${dark ? "bg-bg/50" : "bg-fg/40"}`} />
          <figcaption className={`text-base leading-[1.3] ${dark ? "text-bg/70" : "text-fg/60"}`}>{by}</figcaption>
        </Rise>
      </figure>
    </section>
  );
}

/* -------------------------------------------------------------- story */

export function AboutStory() {
  return (
    <section
      aria-labelledby="story-heading"
      className="shell grid gap-12 pt-24 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*560)] lg:gap-u-96 lg:pt-u-160"
    >
      <div className="flex flex-col">
        <Rise as="p" className={label}>
          Our story
        </Rise>
        <RevealHeading id="story-heading" className="display mt-6 text-[40px] sm:text-[56px] lg:fs-u-64">
          <Line className="block">Driven by Your</Line>
          <Line className="block">Project’s Success</Line>
        </RevealHeading>
        <div className="mt-10 flex max-w-[640px] flex-col gap-6 text-lg leading-[1.5] tracking-[-0.005em] text-fg/85 lg:mt-u-56 lg:fs-u-20">
          <Rise as="p">
            MWC was founded by Andrew Schaaf, a commissioned military officer with nearly 30 years of service leading
            complex operations, managing high-stakes assignments and coordinating people and resources to achieve critical
            objectives.
          </Rise>
          <Rise as="p" order={1}>
            That experience shaped Andrew’s expectations for how work should be managed: with preparation, clear
            responsibilities, disciplined execution and accountability. He brought those principles to MWC, building a
            project and construction management firm focused on representing your interests and delivering results.
          </Rise>
          <Rise as="p" order={2}>
            Now, ten years into the business, those values continue to guide how MWC selects its people, approaches
            assignments and supports clients.
          </Rise>
        </div>
      </div>

      {/* portrait with the band running up its right edge */}
      <div className="relative aspect-[4/5] w-full self-start overflow-hidden rounded-[4px] bg-navy lg:mt-u-56">
        <ImageReveal>
          <Image
            src="/comp2/ind-utilities-hd.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            quality={PHOTO_QUALITY}
            className="object-cover"
          />
          <Texture opacity={0.12} />
        </ImageReveal>
        <Band vertical className="absolute inset-y-0 right-0 w-8" />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- framework */

const workstreams = [
  {
    name: "Plan and Develop",
    image: "/figma/ws-plan-hd.jpg",
    text: "Scope, schedule, budget and delivery responsibilities set before construction begins.",
  },
  {
    name: "Build and Commission",
    image: "/figma/ws-build-hd.jpg",
    text: "Field activities coordinated around your contract requirements, schedule and budget through turnover.",
  },
  {
    name: "Operate and Maintain",
    image: "/figma/ws-operate-hd.jpg",
    text: "Outages, overhauls and technology implementations planned around your operating requirements.",
  },
  {
    name: "Decommission",
    image: "/figma/ws-decom-hd.jpg",
    text: "Decommissioning within the agreed scope, with costs, progress and closeout documentation tracked.",
  },
];

function ArrowButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir < 0 ? "Previous workstream" : "Next workstream"}
      onClick={onClick}
      className="flex size-12 items-center justify-center rounded-full border border-fg/20 transition-colors hover:border-fg/60"
    >
      <Arrow width={18} className={dir < 0 ? "rotate-180" : ""} />
    </button>
  );
}

export function AboutFramework() {
  const rowWrap = useRef<HTMLDivElement>(null);
  const step = (dir: -1 | 1) => {
    const el = rowWrap.current?.querySelector("ul");
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="framework-heading" className="pt-24 lg:pt-u-200">
      <div className="shell flex flex-col gap-8 lg:gap-u-40">
        <div>
          <Rise as="p" className={label}>
            How we work
          </Rise>
          <RevealHeading id="framework-heading" className="display mt-6 text-[40px] sm:text-[56px] lg:fs-u-64">
            <Line className="block">A Consistent Framework</Line>
            <Line className="block">for Project Execution</Line>
          </RevealHeading>
        </div>
        {/* body under the title; controls on the right, their bottom on the body's last line */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Rise as="p" className="max-w-[640px] text-base leading-[1.5] tracking-[-0.005em] text-fg/80">
            MWC developed its workstreams to organize responsibilities, monitor performance and maintain accountability
            throughout a project. They establish a structured approach to project oversight, ensuring important activities
            receive attention and information reaches the people who need it.
          </Rise>
          <div className="flex items-center justify-between gap-10">
            <div className="flex gap-2">
              <ArrowButton dir={-1} onClick={() => step(-1)} />
              <ArrowButton dir={1} onClick={() => step(1)} />
            </div>
            <a href="/all-services" className="inline-flex items-center gap-2 text-base font-medium text-navy">
              View all services
              <Arrow width={18} />
            </a>
          </div>
        </div>
      </div>

      <div ref={rowWrap}>
      <RiseEach
        as="ul"
        itemAs="li"
        className="shell mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto pb-2 lg:scroll-px-[calc(var(--u)*32)] [scrollbar-width:none] lg:mt-u-64 [&::-webkit-scrollbar]:hidden"
        itemClassName="w-[300px] shrink-0 snap-start sm:w-[360px] lg:w-u-440"
      >
        {workstreams.map((w) => (
          <a key={w.name} href="/all-services" className="group flex flex-col gap-5">
            {/* the comp 1 card: photo with the jagged mountain band along the bottom (sky edge + navy) */}
            <div className="relative h-[400px] overflow-hidden rounded-[4px] bg-navy text-bg/90 lg:h-u-480">
              <Image
                src={w.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 31vw, 80vw"
                quality={PHOTO_QUALITY}
                className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
              />
              <Texture opacity={0.12} />
              <img src="/about/ws-band.svg" alt="" aria-hidden className="absolute bottom-0 left-0 h-[31%] w-full" />
              <h3 className="absolute bottom-5 left-5 w-[220px] font-display text-[28px] leading-[0.9] font-black tracking-[-0.01em] uppercase lg:bottom-u-24 lg:left-u-24 lg:fs-u-32">
                {w.name}
              </h3>
            </div>
            <p className="max-w-[380px] text-base leading-[1.5] tracking-[-0.005em] text-fg/80">{w.text}</p>
          </a>
        ))}
      </RiseEach>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ results */

export function AboutResults() {
  return (
    <section
      aria-labelledby="results-heading"
      className="shell grid gap-12 pt-24 lg:grid-cols-[calc(var(--u)*560)_minmax(0,1fr)] lg:gap-u-96 lg:pt-u-200"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-navy">
        <ImageReveal>
          <Image
            src="/figma/ws-build-detail-hd.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            quality={PHOTO_QUALITY}
            className="object-cover"
          />
          <Texture opacity={0.12} />
        </ImageReveal>
        <Band vertical className="absolute inset-y-0 left-0 w-8" />
      </div>

      <div className="flex flex-col justify-between gap-12">
        <RevealHeading id="results-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
          <Line className="block">Documented</Line>
          <Line className="block">Results</Line>
        </RevealHeading>
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-u-48">
          <Rise as="p" className={label}>
            Project history
          </Rise>
          <div className="flex flex-col items-start gap-8">
            <Rise as="p" className="text-lg leading-[1.45] tracking-[-0.005em]">
              The best measure of MWC’s experience is the work itself. Explore its project history to see how the company
              applies its people and processes.
            </Rise>
            <Rise order={1}>
              <a href="/projects" className={ctaCls}>
                Explore Projects
                <Arrow />
              </a>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- experience */

const disciplines: { name: string; icon: DisciplineKey }[] = [
  { name: "Project management", icon: "pm" },
  { name: "Engineering", icon: "engineering" },
  { name: "Construction", icon: "construction" },
  { name: "Operations", icon: "operations" },
  { name: "Project controls", icon: "controls" },
];

export function AboutExperience() {
  return (
    <section aria-labelledby="experience-heading" className="shell pt-24 lg:pt-u-200">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*560)] lg:gap-u-96">
        <RevealHeading id="experience-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
          <Line className="block">Experience That Goes</Line>
          <Line className="block">Beyond Project Management</Line>
        </RevealHeading>
        <div className="flex flex-col gap-6 text-lg leading-[1.5] tracking-[-0.005em] text-fg/85 lg:pt-u-8">
          <Rise as="p">
            Successful project management requires people who understand the work, recognize risks, anticipate challenges
            and know how decisions affect the project as a whole.
          </Rise>
          <Rise as="p" order={1}>
            MWC brings together professionals with experience across project management, engineering, construction,
            operations and project controls. Its perspective spans the full project lifecycle, helping owners make
            informed decisions and maintain oversight from planning through execution and beyond.
          </Rise>
        </div>
      </div>

      {/* the disciplines the team brings: equal boxes, evenly spaced, each with a drawing that builds in */}
      <RiseEach
        as="ul"
        itemAs="li"
        className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-u-96 lg:grid-cols-5 lg:gap-u-16"
      >
        {disciplines.map((d) => (
          <figure key={d.name} className="flex flex-col">
            <div className="aspect-[6/5] overflow-hidden rounded-[4px] bg-[#eef2f8]">
              <DisciplineIcon kind={d.icon} />
            </div>
            <figcaption className="display mt-4 text-[18px] leading-[1] lg:fs-u-20">{d.name}</figcaption>
          </figure>
        ))}
      </RiseEach>
    </section>
  );
}

/* --------------------------------------------------------------- team */


export function AboutTeam() {
  return (
    <section aria-labelledby="team-heading" className="shell pt-24 lg:pt-u-200">
      <RevealHeading id="team-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
        <Line className="block">Meet the</Line>
        <Line className="block">MWC Team</Line>
      </RevealHeading>

      {/* Andrew first, on his own: photo, name, title and his biography */}
      <div className="mt-12 grid gap-8 border-t border-fg/15 pt-10 lg:mt-u-48 lg:grid-cols-[calc(var(--u)*540)_minmax(0,1fr)] lg:gap-u-64 lg:pt-u-48">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-navy">
          <ImageReveal>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#3a3936_0%,#45433f_45%,#2c3038_70%,#1a2230_100%)]" />
            <Image
              src="/figma/leadership.png"
              alt="Andrew Schaaf"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              quality={PHOTO_QUALITY}
              className="object-cover object-bottom"
            />
          </ImageReveal>
        </div>
        <div className="flex flex-col gap-8 lg:justify-end lg:pb-u-8">
          <Rise>
            <p className={label}>Owner and President</p>
            <p className="display mt-4 text-[36px] leading-[0.9] sm:text-[48px] lg:fs-u-48">Andrew Schaaf</p>
          </Rise>
          <Rise as="p" order={1} className="max-w-[640px] text-lg leading-[1.55] tracking-[-0.005em] text-fg/85 lg:fs-u-22">
            MWC is an SBA-certified service-disabled veteran-owned small business led by Andrew Schaaf. His nearly 30 years
            of military service, combined with experience in leadership, power operations, commissioning and
            decommissioning, provide a strong foundation for the company’s approach to project execution.
          </Rise>
        </div>
      </div>

      <TeamCarousel />
    </section>
  );
}

/* ---------------------------------------------------------------- cta */

export function AboutCta() {
  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="about-cta-heading"
      className="relative overflow-hidden bg-night text-bg"
    >
      <Image src="/comp2/cta-photo.jpg" alt="" fill sizes="100vw" quality={PHOTO_QUALITY} className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-black/55" />
      <Texture opacity={0.15} />
      <div className="shell relative flex min-h-[560px] flex-col justify-between gap-12 py-16 lg:min-h-[calc(var(--u)*720)] lg:flex-row lg:items-end lg:py-[calc(var(--u)*80)]">
        <RevealHeading id="about-cta-heading" className="display text-[48px] leading-[0.9] sm:text-[72px] lg:w-u-900 lg:fs-u-104">
          <Line className="block">Ready for More</Line>
          <Line className="block">Predictable</Line>
          <Line className="block">Outcomes?</Line>
        </RevealHeading>
        <Rise delay={0.2}>
          <a href="mailto:info@mwconsultllc.com" className={ctaCls}>
            Scope Your Project
            <Arrow />
          </a>
        </Rise>
      </div>
    </section>
  );
}
