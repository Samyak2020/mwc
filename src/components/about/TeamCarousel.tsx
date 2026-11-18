"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Ridge } from "@/components/ui/Ridge";
import { PHOTO_QUALITY, teamCarousel } from "@/lib/motion";

// Team carousel (layout after the reference's "Leadership" row): the names on
// the left with a dot for the one in view and arrows under them; on the right
// a row of tall cards. The current card shows its photo full bleed; the
// others show it smaller on a pale panel, dimmed. Clicking a name, an arrow or a card
// brings it forward. Hovering a card shows "Bio"; clicking it wipes sky then navy up
// over the card (0.5s) to the same details plus the biography.

type Member = { name: string; role: string; years: string; image: string; portrait?: boolean };

const team: Member[] = [
  { name: "John B. Doe", role: "Project Manager", years: "8+ yrs of exp", image: "/about-v2/team-1.png" },
  { name: "Samantha Campbell", role: "Project Manager", years: "8+ yrs of exp", image: "/about-v2/team-2.png" },
  { name: "Jason Todd", role: "Project Manager", years: "8+ yrs of exp", image: "/about-v2/team-3.png" },
  { name: "Frank Schaffer", role: "Project Manager", years: "8+ yrs of exp", image: "/about-v2/team-4.png" },
];

const BIO =
  "Biography to come. This is a placeholder for the approved bio: background, the kinds of projects led, certifications, and what this person brings to an MWC engagement in the field and with your team.";

function Card({
  ref,
  style,
  m,
  active,
  flipped,
  onSelect,
  onFlip,
}: {
  ref?: React.Ref<HTMLLIElement>;
  style?: React.CSSProperties;
  m: Member;
  active: boolean;
  flipped: boolean;
  onSelect: () => void;
  onFlip: () => void;
}) {
  const reduce = useReducedMotion();
  const { step, text, ease: wipeEase } = teamCarousel.wipe;
  // open: sky rises from its bar to the top, then navy follows; close reverses
  const wipe = (order: 0 | 1) => ({
    initial: false as const,
    animate: { clipPath: flipped ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" },
    transition: reduce
      ? { duration: 0 }
      : { duration: step, ease: wipeEase, delay: flipped ? order * step : (1 - order) * step },
  });
  return (
    <li
      ref={ref}
      style={style}
      // cards out of the main frame are dimmed; the current one is full strength
      className={`h-[420px] w-[280px] shrink-0 transition-opacity duration-700 sm:h-[480px] sm:w-[340px] lg:h-u-520 lg:w-u-440 ${
        active ? "opacity-100" : "opacity-40 hover:opacity-70"
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[4px]">
        {/* front: the team card (as on the homepage) */}
        <button
          type="button"
          aria-label={`${m.name}, ${m.role}: show bio`}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          onClick={() => {
            onSelect();
            onFlip();
          }}
          className="group absolute inset-0 flex flex-col text-left"
        >
          <span className="relative block min-h-0 flex-1 overflow-hidden bg-navy">
            {m.portrait && (
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#3a3936_0%,#45433f_45%,#2c3038_70%,#1a2230_100%)]" />
            )}
            <Image
              src={m.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 31vw, 300px"
              quality={PHOTO_QUALITY}
              className={m.portrait ? "object-cover object-bottom" : "object-cover object-top"}
            />
            {/* hover: the photo darkens and "Bio" appears (as on Client Resources) */}
            <span
              aria-hidden
              className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-night/50 px-4 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg uppercase opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Bio
            </span>
          </span>
          <span className="flex h-14 shrink-0 items-center bg-sky px-5 text-xl leading-[1.3] font-bold tracking-[-0.005em] text-bg lg:h-u-56 lg:px-u-24">
            {m.name}
          </span>
          <span className="flex h-12 shrink-0 items-center justify-between bg-navy px-5 text-base leading-[1.5] tracking-[0.005em] text-bg/90 lg:h-u-56 lg:px-u-24">
            <span>{m.role}</span>
            <span>{m.years}</span>
          </span>
        </button>

        {/* the bio: sky wipes up over the card, navy follows, then the text appears */}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-sky" {...wipe(0)} />
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-navy" {...wipe(1)} />
        <motion.button
          type="button"
          aria-label={`${m.name}: back to photo`}
          aria-hidden={!flipped}
          tabIndex={flipped ? 0 : -1}
          onClick={onFlip}
          className={`absolute inset-0 flex flex-col justify-between p-6 text-left text-bg/90 lg:p-u-40 ${flipped ? "" : "pointer-events-none"}`}
          initial={false}
          animate={{ opacity: flipped ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : text, ease: wipeEase, delay: flipped && !reduce ? step * 2 - text : 0 }}
        >
          {/* the logo's mountain draws in along the foot each time the bio opens */}
          {flipped && <Ridge trigger="mount" duration={0.9} className="absolute right-0 bottom-0 w-[85%]" />}
          <span className="relative flex flex-col gap-1">
            <span className="display text-[28px] leading-[0.95] lg:fs-u-40">{m.name}</span>
            <span className="mt-2 text-base text-bg/75">{m.role}</span>
            <span className="text-sm text-bg/55">{m.years}</span>
          </span>
          <span className="relative text-base leading-[1.55] text-bg/90 lg:fs-u-18">{BIO}</span>
          <span className="relative inline-flex items-center gap-2 text-sm font-semibold uppercase">
            <Arrow width={18} className="rotate-180" />
            Back
          </span>
        </motion.button>
      </div>
    </li>
  );
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function TeamCarousel() {
  // an endless row: `pos` counts cards travelled and never wraps, so going past
  // the last member simply carries on to the first (no slide back to the start)
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const probe = useRef<HTMLLIElement>(null);
  const [step, setStep] = useState(0);
  const N = team.length;
  const active = mod(pos, N);

  // one card + gap, measured (card widths change with the breakpoint)
  useEffect(() => {
    const measure = () => probe.current && setStep(probe.current.getBoundingClientRect().width + 8);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const move = (delta: number) => {
    setFlipped(null);
    setPos((p) => p + delta);
  };
  // a name: travel the short way round to it
  const goTo = (i: number) => {
    const fwd = mod(i - active, N);
    move(fwd <= N / 2 ? fwd : fwd - N);
  };

  // cards on screen plus one either side, keyed by their place in the endless row
  const slots: number[] = [];
  for (let k = pos - 2; k <= pos + 5; k++) slots.push(k);

  return (
    <div className="mt-14 grid gap-8 lg:mt-u-96 lg:grid-cols-[calc(var(--u)*300)_minmax(0,1fr)] lg:gap-u-32">
      {/* names, with the current one marked, and the arrows under them */}
      <div className="flex flex-col gap-8">
        <ul className="hidden flex-col gap-3 lg:flex">
          {team.map((m, i) => (
            <li key={m.name}>
              <button
                type="button"
                aria-current={i === active}
                onClick={() => goTo(i)}
                className={`flex items-center gap-4 text-lg leading-[1.3] transition-colors ${i === active ? "text-fg" : "text-fg/45 hover:text-fg/75"}`}
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full border transition-colors ${i === active ? "border-fg bg-fg" : "border-fg/40"}`}
                />
                {m.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous team member" : "Next team member"}
              onClick={() => move(d)}
              className="flex size-12 items-center justify-center rounded-full border border-fg/20 transition-colors hover:border-fg/60"
            >
              <Arrow width={18} className={d < 0 ? "rotate-180" : ""} />
            </button>
          ))}
        </div>
      </div>

      {/* cards run off the right edge of the page */}
      <div className="-mr-4 overflow-hidden lg:mr-[calc(-1*(var(--u)*32+var(--bleed)))]">
        <motion.ul
          className="relative h-[420px] sm:h-[480px] lg:h-u-520"
          initial={false}
          animate={{ x: -pos * step }}
          transition={reduce ? { duration: 0 } : teamCarousel.slide}
        >
          {slots.map((k) => {
            const i = mod(k, N);
            return (
              <Card
                key={k}
                ref={k === pos ? probe : undefined}
                style={{ position: "absolute", top: 0, left: k * step }}
                m={team[i]}
                active={k === pos}
                flipped={flipped === k}
                onSelect={() => {
                  if (k !== pos) move(k - pos);
                }}
                onFlip={() => setFlipped((f) => (f === k ? null : k))}
              />
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
