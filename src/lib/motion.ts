// Motion tokens: the single source of truth for timing and easing.
// Tune these once and every animation on the site stays consistent.
import type { Transition } from "motion/react";

export const duration = {
  fast: 0.15, // hover, press, small state changes
  base: 0.3, // menus, toggles, most UI responses
  slow: 0.6, // section reveals, hero sequence
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1], // things entering
  inOut: [0.65, 0, 0.35, 1], // things moving on screen
  in: [0.55, 0, 1, 0.45], // things leaving
} as const;

export const spring: Transition = { type: "spring", stiffness: 400, damping: 32 };

export const stagger = 0.08;

// Hero load sequence: headline lines start after a short beat, then the
// nav/intro fade in as the last line lands.
export const heroSequence = {
  headlineDelay: 0.15,
  chromeDelay: 0.15 + stagger * 4 + duration.slow * 0.5,
} as const;

// Smoothing for scroll-linked motion. Slightly under-damped so the
// mountains "pop" a touch past their mark before settling.
export const scrollSpring = { stiffness: 220, damping: 22, mass: 0.6 } as const;

// Hero scroll scene (values in Figma px on the 1440 frame).
export const heroScroll = {
  // How far each mountain peak rises while the hero scrolls away.
  peakRise: { left: 260, right: 400 },
  // Industries content starts this far up, hidden under the hero photo,
  // and settles as the hero leaves: it moves slower than the page.
  parallax: 240,
  // Portion of the hero scroll over which the sticky CTA becomes a button.
  ctaMorph: [0.72, 1] as const,
  // Photo darkening: the image ships with a 35% ink overlay (Figma); while
  // the hero scrolls away it deepens to 75%. `over` is the share of the hero
  // scroll it takes to get there.
  darken: { from: 0.35, to: 0.75, over: 0.6 },
} as const;

// Industries hover: the backdrop photo is "tugged" in like fabric from the
// side the pointer came from, with a rippling leading edge.
export const fabric = {
  duration: 1.1,
  ease: ease.inOut,
  ripple: 0.07, // wave amplitude at mid-pull, as a fraction of the height
  tug: 10, // % the incoming photo travels while it settles
  stretch: 0.12, // extra scaleY at the start of the pull
} as const;

// The "MWC HELPS" bar gliding to the hovered industry.
export const barSpring: Transition = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };

// Workstreams paragraph: faded → full ink while it crosses the viewport.
export const scrollFill = {
  from: 0.4, // Figma's faded tone (ink at 40%)
  softness: 0.08, // portion of the scroll each character takes to fill
  offset: ["start 85%", "end 40%"] as const,
} as const;

// Workstreams: pinned while the row of cards scrolls sideways.
export const workstreamsScroll = {
  // extra vertical scroll per px of horizontal travel (>1 = slower sideways)
  ratio: 1,
} as const;

// Experience metrics: pinned while the cards step through the centre.
export const metricsScroll = {
  // scroll per card move, as a fraction of the viewport height
  step: 0.6,
  // pause with each card centred, as a fraction of one move
  hold: 0.35,
  // metric value is fully shown within `sharp` px of centre, gone by `fade` px
  valueWindow: { sharp: 24, fade: 110 },
} as const;

// Controlled image parallax: photos drift inside fixed frames (Apple-style:
// spring-smoothed, no overshoot, settles into focus at the screen centre).
export const parallax = {
  // max drift either way, as % of the image box
  travel: 6,
  // over-scale: at the edges of the travel (must exceed 1 + 2·travel%) …
  scaleEdge: 1.16,
  // … easing to this as the image reaches the centre ("settles into focus")
  scaleCentre: 1.1,
  // critically damped follow (Apple: damping 1.0, response ~0.3–0.4 s)
  spring: { bounce: 0, visualDuration: 0.35 },
  // workstreams only: horizontal stretch at speed, encodes momentum
  stretch: { max: 0.02, atVelocity: 6000 }, // up to +2% scaleX at ≥6000 px/s
} as const;

// Smooth scrolling (Lenis): fraction of the remaining distance covered per
// frame. Lower = silkier but laggier; 0.1 keeps it responsive.
export const smoothScroll = {
  lerp: 0.1,
  wheelMultiplier: 1,
} as const;

// next/image quality for photography (allow-listed in next.config.ts).
export const PHOTO_QUALITY = 90;

// Image reveal: photos wipe in top → bottom over the primary navy.
export const imageReveal = {
  duration: 1.1,
  ease: [0.76, 0, 0.24, 1] as const, // strong in-out: a deliberate curtain
  // hero starts with the load sequence, just ahead of the headline
  heroDelay: 0,
} as const;

// CSS mirrors of these tokens (--duration-*, --ease-*) live in globals.css
// for hover/press states that are pure CSS.
