import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise, RiseEach } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { LineIcon, type IconKey } from "./LineIcons";
import { LayerStack } from "./LayerStack";
import { CountUpMetric } from "./CountUp";
import { StickyBottom } from "./StickyBottom";
import { ServiceTabs } from "./ServiceTabs";
import { ExpandPanel } from "./ExpandPanel";
import { Band } from "@/components/about/Band";
import Image from "next/image";

// Building blocks for the Industries pages (copy: "MWC Website Content 2").
// Each page passes its own copy; the layouts stay the same across industries.

export type Item = {
  lead: string;
  text: string;
  link?: { label: string; href: string };
  icon?: IconKey;
};

const textLink =
  "cta group inline-flex items-center gap-2 text-base leading-[1.3] font-semibold tracking-[-0.005em] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current";

function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`${textLink} ${className}`}>
      {children}
      <Arrow width={18} />
    </a>
  );
}

/* ---------------------------------------------------------------- hero */

// Styled exactly like the homepage's Project Support section: a full-screen
// blueprint-blue ground with the industry's drawing across it and the title in
// white at the top left. The nav stays transparent over it.
export function IndustryHero({
  title,
  scene,
}: {
  title: string;
  scene: React.ReactNode;
}) {
  return (
    <header
      data-hero
      data-nav-theme="dark"
      data-nav-clear=""
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-[#0a48a6] text-bg"
    >
      <div className="absolute inset-0">{scene}</div>
      {/* the title sits centred, a little above the middle; the scene is
          composed around it */}
      <div className="shell relative flex h-full flex-col items-center justify-center pt-16 pb-[14svh] text-center">
        <RevealHeading
          as="h1"
          trigger="load"
          className="display text-[36px] leading-[0.95] sm:text-[52px] lg:fs-u-64"
        >
          {splitTitle(title).map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
      </div>
    </header>
  );
}

// Version 2 (after cantor8.io/partners): a quiet blue field, the title at the
// top left, a short intro and one button in the right half lower down, and
// the drawing kept to a single object in fine linework.
export function IndustryHeroMinimal({
  title,
  intro,
  scene,
  band,
}: {
  title: string;
  intro: string;
  scene: React.ReactNode;
  /** phrases for the scrolling sky band along the foot of the hero */
  band?: string[];
}) {
  return (
    <header
      data-hero
      data-nav-theme="dark"
      data-nav-clear=""
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-[#0a48a6] text-bg"
    >
      <div className="absolute inset-0">{scene}</div>
      <div className={`shell relative flex h-full flex-col pt-28 lg:pt-[calc(var(--u)*170)] ${band ? "pb-20" : "pb-12"}`}>
        <RevealHeading
          as="h1"
          trigger="load"
          className="display text-[34px] leading-[0.95] sm:text-[52px] lg:fs-u-64"
        >
          {splitTitle(title, 27).map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
        <Rise
          delay={0.5}
          className="mt-auto flex flex-col items-start gap-6 lg:mt-[calc(var(--u)*150)]"
        >
          <p className="max-w-[400px] text-lg leading-[1.3] font-medium">
            {intro}
          </p>
          <a
            href="/contact"
            className="cta btn flex items-center justify-center gap-[9px] bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-fg"
          >
            Talk to a Project Lead
            <Arrow />
          </a>
        </Rise>
      </div>
      {band && <Band phrases={band} className="absolute inset-x-0 bottom-0 h-8" />}
    </header>
  );
}

// break a title into balanced lines for the line-by-line reveal: the fewest
// lines of at most ~22 characters, then even them out
export function splitTitle(t: string, max = 22) {
  const words = t.split(" ");
  const fit = (w: number) => {
    const out: string[] = [];
    for (const word of words) {
      const last = out[out.length - 1];
      if (last && (last + " " + word).length <= w)
        out[out.length - 1] = last + " " + word;
      else out.push(word);
    }
    return out;
  };
  const n = fit(max).length;
  let w = Math.max(...words.map((x) => x.length));
  while (fit(w).length > n) w++;
  return fit(w);
}

/* --------------------------------------------- heading + copy + 3 points */

export function ProblemSection({
  id,
  heading,
  body,
  lead,
  items,
  stack = false,
}: {
  id: string;
  heading: string[];
  body: string[];
  lead: string;
  items: Item[];
  /** desktop: show the points as the scroll-driven layer stack */
  stack?: boolean;
}) {
  const intro = (withId: boolean) => (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*640)] lg:gap-u-96">
      <RevealHeading
        id={withId ? id : undefined}
        className="display text-[40px] sm:text-[56px] lg:fs-u-64"
      >
        {heading.map((l) => (
          <Line key={l} className="block">
            {l}
          </Line>
        ))}
      </RevealHeading>
      <div className="flex flex-col gap-6 text-lg leading-[1.5] tracking-[-0.005em] text-fg/85">
        {body.map((p) => (
          <Rise as="p" key={p}>
            {p}
          </Rise>
        ))}
        <Rise as="p" className="font-semibold text-fg">
          {lead}
        </Rise>
      </div>
    </div>
  );
  const cards = (
    // the points as drawing cards (after zettafleet.com): hairline above and
    // below, index and title, a line drawing, then the detail
    <RiseEach
      as="ul"
      itemAs="li"
      className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-u-72"
    >
      {items.map((it, i) => (
        <div
          key={it.lead}
          className="flex h-full flex-col border-y border-fg/15 pt-5 pb-7"
        >
          <p className="text-sm leading-none text-fg/45 tabular-nums">
            [{String(i + 1).padStart(2, "0")}]
          </p>
          <p className="mt-3 text-xl leading-[1.25] font-semibold tracking-[-0.01em]">
            {it.lead}
          </p>
          {it.icon && (
            <div className="flex h-[200px] items-center justify-center py-6 lg:h-[240px]">
              <LineIcon icon={it.icon} />
            </div>
          )}
          <p className="mt-auto text-base leading-[1.5] text-fg/70">
            {it.text}
          </p>
        </div>
      ))}
    </RiseEach>
  );
  if (!stack)
    return (
      <section aria-labelledby={id} className="shell pt-28 lg:pt-u-200">
        {intro(true)}
        {cards}
      </section>
    );
  // desktop: the whole section pins and steps through the layer stack;
  // phones and tablets keep the cards
  return (
    <section aria-labelledby={id} className="shell pt-28 lg:pt-u-152">
      <div className="lg:hidden">
        {intro(true)}
        {cards}
      </div>
      <div className="hidden lg:block">
        <LayerStack items={items} header={intro(false)} />
      </div>
    </section>
  );
}

/* --------------------------------------------- capabilities-style rows */

// After zettafleet.com's capabilities: a pale panel with a centred heading;
// each row pairs a line drawing in a corner-marked frame with an "01 / 05"
// count over a hairline, the title, the detail and an optional link.
export function RowsSection({
  id,
  heading,
  items,
}: {
  id: string;
  heading: string[];
  items: Item[];
}) {
  const total = String(items.length).padStart(2, "0");
  return (
    <section aria-labelledby={id} className="shell pt-24 lg:pt-u-160">
      <ExpandPanel className="px-5 py-16 sm:px-10 lg:px-u-96 lg:py-u-120">
        <div className="flex flex-col items-center text-center">
          <RevealHeading
            id={id}
            className="display text-[40px] sm:text-[56px] lg:fs-u-64"
          >
            {heading.map((l) => (
              <Line key={l} className="block">
                {l}
              </Line>
            ))}
          </RevealHeading>
          <span aria-hidden className="mt-8 block h-px w-14 bg-fg/20" />
        </div>
        <RiseEach
          as="ul"
          itemAs="li"
          className="mt-14 flex flex-col gap-14 lg:mt-u-96 lg:gap-u-80"
        >
          {items.map((it, i) => (
            <div
              key={it.lead}
              className="grid items-center gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-14"
            >
              <Frame>{it.icon && <LineIcon icon={it.icon} />}</Frame>
              <div>
                <p className="border-b border-fg/15 pb-2 text-right text-sm leading-none tabular-nums">
                  <span className="text-fg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-fg/40"> / {total}</span>
                </p>
                <p className="mt-5 text-xl leading-[1.25] font-semibold tracking-[-0.01em]">
                  {it.lead}
                </p>
                <p className="mt-3 max-w-[480px] text-base leading-[1.55] text-fg/70 lg:text-lg">
                  {it.text}
                </p>
                {it.link && (
                  <TextLink href={it.link.href} className="mt-5 text-navy">
                    {it.link.label}
                  </TextLink>
                )}
              </div>
            </div>
          ))}
        </RiseEach>
      </ExpandPanel>
    </section>
  );
}

// square cell holding a row's drawing
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center p-10">
      <div className="h-full w-full [&_svg]:mx-auto [&_svg]:h-full">
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- case study */

export type Metric = { value: string; text: string };

// Pinned split (after the reference recording): on the left a small photo
// and the title, its last line in full ink, held in place while on the right
// the story and the link lead into large metrics that count up and darken
// from grey as each reaches the middle of the screen.
export function CaseStudy({
  id,
  heading,
  body,
  metrics,
  link,
  photo = "/comp2/ind-utilities-hd.jpg",
  band,
}: {
  id: string;
  heading: string[];
  body: string[];
  metrics: Metric[];
  link: { label: string; href: string };
  photo?: string;
  /** phrases for a scrolling band up the photo's edge */
  band?: string[];
}) {
  const last = heading.length - 1;
  return (
    <section
      aria-labelledby={id}
      className="shell mt-32 grid gap-12 lg:mt-u-240 lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*560)] lg:gap-u-96"
    >
      {/* enters level with the story, then holds at the foot of the screen */}
      <div>
        <StickyBottom gap={72} className="lg:sticky">
          <Rise className="relative mb-8 aspect-[3/2] w-[180px] overflow-hidden lg:mb-u-40 lg:w-u-220">
            <Image
              src={photo}
              alt=""
              fill
              sizes="220px"
              className="object-cover object-[50%_25%]"
            />
            {band && <Band vertical phrases={band} className="absolute inset-y-0 right-0 w-6" />}
          </Rise>
          <RevealHeading
            id={id}
            className="display text-[40px] leading-[0.95] sm:text-[56px] lg:fs-u-64"
          >
            {heading.map((l, i) => (
              <Line
                key={l}
                className={`block ${i === last ? "text-fg" : "text-fg/45"}`}
              >
                {/* keep each number with its word when the line wraps */}
                {l.replace(/(\d) /g, "$1\u00a0")}
              </Line>
            ))}
          </RevealHeading>
        </StickyBottom>
      </div>

      <div>
        <div className="flex flex-col gap-5 text-lg leading-[1.5] font-medium tracking-[-0.005em] text-fg/85">
          {body.map((p) => (
            <Rise as="p" key={p}>
              {p}
            </Rise>
          ))}
        </div>
        <Rise className="mt-8">
          <a
            href={link.href}
            className="cta btn inline-flex items-center gap-[9px] border border-fg/30 px-5 py-3 text-sm leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
          >
            {link.label}
            <Arrow width={16} />
          </a>
        </Rise>
        <div className="mt-24 lg:mt-u-160">
          {metrics.map((m) => (
            <CountUpMetric key={m.value} value={m.value} text={m.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- services */

export type ServiceGroup = {
  label: string;
  items: (Item & { href: string })[];
};

export function ServicesSection({
  id,
  heading,
  groups,
  more,
}: {
  id: string;
  heading: string[];
  groups: ServiceGroup[];
  more: { label: string; href: string };
}) {
  return (
    <section aria-labelledby={id} className="shell pt-32 lg:pt-u-240">
      <RevealHeading
        id={id}
        className="display text-[40px] sm:text-[56px] lg:fs-u-64"
      >
        {heading.map((l) => (
          <Line key={l} className="block">
            {l}
          </Line>
        ))}
      </RevealHeading>
      <Rise className="mt-14 lg:mt-u-104">
        <ServiceTabs
          groups={groups}
          footer={
            <TextLink href={more.href} className="text-navy">
              {more.label}
            </TextLink>
          }
        />
      </Rise>
    </section>
  );
}
