"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease, PHOTO_QUALITY, teamCarousel } from "@/lib/motion";

// Team carousel (layout after the reference's "Leadership" row): the names on
// the left with a dot for the one in view and arrows under them; on the right
// a row of tall cards. The current card shows its photo full bleed; the
// others show it smaller on a pale panel, dimmed. Clicking a name, an arrow or a card
// brings it forward. Hovering a card shows "Bio"; clicking it turns the card
// over to the same details plus the biography.

type Member = { name: string; role: string; years: string; image: string; portrait?: boolean };

const team: Member[] = [
  { name: "John B. Doe", role: "Project Manager", years: "8+ years in the field", image: "/comp1r/team-1.png" },
  { name: "Samantha Campbell", role: "Project Manager", years: "8+ years in the field", image: "/comp1r/team-2.png" },
  { name: "Jason Todd", role: "Project Manager", years: "8+ years in the field", image: "/comp1r/team-3.png" },
  { name: "Frank Schaffer", role: "Project Manager", years: "8+ years in the field", image: "/comp1r/team-4.png" },
];

const BIO =
  "Biography to come. This is a placeholder for the approved bio: background, the kinds of projects led, certifications, and what this person brings to an MWC engagement in the field and with your team.";

function Card({
  m,
  active,
  flipped,
  onSelect,
  onFlip,
}: {
  m: Member;
  active: boolean;
  flipped: boolean;
  onSelect: () => void;
  onFlip: () => void;
}) {
  const reduce = useReducedMotion();
  const inset = active ? "0%" : "16%";
  return (
    <li
      // cards out of the main frame are dimmed; the current one is full strength
      className={`h-[420px] w-[280px] shrink-0 transition-opacity duration-700 [perspective:1600px] sm:h-[480px] sm:w-[340px] lg:h-u-520 lg:w-u-440 ${
        active ? "opacity-100" : "opacity-40 hover:opacity-70"
      }`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: flipped && !reduce ? 180 : 0 }}
        transition={teamCarousel.flip}
      >
        {/* front */}
        <button
          type="button"
          aria-label={`${m.name}, ${m.role}: show bio`}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          onClick={() => {
            onSelect();
            onFlip();
          }}
          className={`group absolute inset-0 overflow-hidden rounded-[4px] text-left [backface-visibility:hidden] ${
            reduce && flipped ? "invisible" : ""
          } bg-[#eef2f8]`}
        >
          {/* photo: full bleed when current, inset on the pale panel otherwise */}
          <motion.div
            className="absolute overflow-hidden bg-navy"
            initial={false}
            animate={{ top: active ? "0%" : "14%", left: inset, right: inset, bottom: active ? "0%" : "22%" }}
            transition={{ duration: duration.slow, ease: ease.inOut }}
          >
            {m.portrait && (
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#3a3936_0%,#45433f_45%,#2c3038_70%,#1a2230_100%)]" />
            )}
            <Image
              src={m.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 38vw, 300px"
              quality={PHOTO_QUALITY}
              className={m.portrait ? "object-cover object-bottom" : "object-cover object-top"}
            />
            {/* legibility under the name when current */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0)_55%,rgb(0_6_17/0.7)_100%)] transition-opacity duration-500"
              style={{ opacity: active ? 1 : 0 }}
            />
          </motion.div>

          {/* hover: the photo darkens and "Bio" appears (as on Client Resources) */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-night/50 px-4 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg uppercase opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Bio
          </span>

          <span
            className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 transition-colors duration-500 ${active ? "text-bg" : "text-fg"}`}
          >
            <span className="text-xl leading-[1.2] font-semibold tracking-[-0.005em]">{m.name}</span>
            <span className={`text-base ${active ? "text-bg/75" : "text-fg/55"}`}>{m.role}</span>
          </span>
        </button>

        {/* back: the same details and the biography */}
        <button
          type="button"
          aria-label={`${m.name}: back to photo`}
          aria-hidden={!flipped}
          tabIndex={flipped ? 0 : -1}
          onClick={onFlip}
          className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[4px] bg-navy p-6 text-left text-bg [backface-visibility:hidden] lg:p-u-40 ${reduce ? "" : "[transform:rotateY(180deg)]"} ${
            reduce && !flipped ? "invisible" : ""
          }`}
        >
          <span className="flex flex-col gap-1">
            <span className="display text-[28px] leading-[0.95] lg:fs-u-40">{m.name}</span>
            <span className="mt-2 text-base text-bg/75">{m.role}</span>
            <span className="text-sm text-bg/55">{m.years}</span>
          </span>
          <span className="text-base leading-[1.55] text-bg/90 lg:fs-u-18">{BIO}</span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase">
            <Arrow width={18} className="rotate-180" />
            Back
          </span>
        </button>
      </motion.div>
    </li>
  );
}

export function TeamCarousel() {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [offset, setOffset] = useState(0);

  // slide so the current card sits at the start of the row
  useEffect(() => {
    const measure = () => {
      const row = track.current;
      const el = row?.children[active] as HTMLElement | undefined;
      // on-screen positions: the row's own slide cancels out of the difference
      if (row && el) setOffset(el.getBoundingClientRect().left - row.getBoundingClientRect().left);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const go = (i: number) => {
    setFlipped(null);
    setActive((i + team.length) % team.length);
  };

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
                onClick={() => go(i)}
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
              onClick={() => go(active + d)}
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
          ref={track}
          className="flex gap-2"
          animate={{ x: -offset }}
          transition={reduce ? { duration: 0 } : teamCarousel.slide}
        >
          {team.map((m, i) => (
            <Card
              key={m.name}
              m={m}
              active={i === active}
              flipped={flipped === i}
              onSelect={() => {
                if (i !== active) setActive(i);
              }}
              onFlip={() => setFlipped((f) => (f === i ? null : i))}
            />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
