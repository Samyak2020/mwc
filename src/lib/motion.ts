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
  // Portion of the hero scroll over which the nav fills in.
  ctaMorph: [0.72, 1] as const,
  // Photo darkening: the image ships with a 35% ink overlay (Figma); while
  // the hero scrolls away it deepens to 75%. `over` is the share of the hero
  // scroll it takes to get there.
  darken: { from: 0.35, to: 0.75, over: 0.6 },
} as const;

// The "MWC HELPS" bar gliding to the hovered industry.
export const barSpring: Transition = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };

// Workstreams: pinned while the row of cards scrolls sideways.
export const workstreamsScroll = {
  // extra vertical scroll per px of horizontal travel (>1 = slower sideways)
  ratio: 1,
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

// Comp 4 v2 industry cards (Figma 728:1239): the hovered card widens to the
// open size while the others share the rest; its copy fades up once the card
// is mostly open.
export const industryCards = {
  open: 562, // open card width on the 1440 frame
  resize: { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const },
  contentDelay: 0.25,
} as const;

// Scroll reveals (comp 4 v2, after sereinwealth.com): content rises a short
// way, fades in and comes into focus from a slight blur as it enters the
// viewport. Elements in a group follow one another a step apart.
export const scrollReveal = {
  y: 22,
  blur: 6,
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
  step: 0.12, // between elements of a group (cards, columns)
  wordStep: 0.035, // between words of a split paragraph
  // how far into the viewport an element must be before it plays
  margin: "0px 0px -12% 0px",
} as const;

// Nav dropdown (after maisa.ai): a white panel drops from the bar, the page
// behind blurs; the industry drawings build up step by step.
export const navMenu = {
  openDelay: 0.08, // hover intent before opening (s)
  closeDelay: 0.18, // grace period when the pointer leaves (s)
  panel: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  content: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  build: { stepDelay: 0.07, draw: 0.45, fill: 0.3 },
} as const;

// Page transition: a navy panel wipes up over the page with the MWC mark
// (150px from the top) and the destination's name, then wipes away upward
// off the new page. Cover + reveal = 0.8s.
export const pageTransition = {
  cover: 0.4,
  reveal: 0.4,
  ease: [0.76, 0, 0.24, 1] as const,
} as const;

// About page team carousel: the row slides to the chosen card; a card turns
// over to show its bio.
export const teamCarousel = {
  slide: { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const },
  // bio reveal: sky wipes up, then navy (step each); the text fades in over
  // the last `text` seconds, so everything lands at 2 × step = 0.5s
  wipe: { step: 0.25, text: 0.1, ease: [0.65, 0, 0.35, 1] as const },
} as const;

// Logo mountain motif: the shaded body draws first, then the ridge line above
// it starts when the body is `overlap` of the way through.
export const ridge = {
  draw: 1.4, // per stroke, on scroll
  transitionDraw: 0.45, // per stroke, inside the page transition
  ease: [0.65, 0, 0.35, 1] as const,
  overlap: 0.7,
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

// ── Comp 2 ─────────────────────────────────────────────────────────────

// Hero: the photo drifts down slower than the page as the hero scrolls
// away (Figma px travelled by the time the hero has left the screen).
export const comp2Hero = {
  depth: { sky: 260 },
} as const;

// Wavy accordion (Industries): panel widths follow an under-damped spring;
// each panel edge bows out in proportion to how fast it is moving.
export const wavyAccordion = {
  stiffness: 170, // per s² (unit mass)
  damping: 19,
  // bow (px of edge bulge at mid-height) per px/s of edge speed …
  bowPerVelocity: 0.045,
  // … capped here, as a fraction of the panel height
  maxBow: 0.09,
  // panel content fades in once the panel is this open (0–1)
  contentFrom: 0.65,
} as const;

// Metrics backdrop bolt: drawn left → right along its centreline as the
// section scrolls in (scroll-linked, spring-smoothed).
export const metricsBolt = {
  offset: ["start 85%", "end end"] as const,
  spring: { stiffness: 120, damping: 30, mass: 0.6 },
} as const;

// Field journey (workstreams as one isometric site): the section pins and
// scroll flies the camera overview → plan → build → operate → overview.
export const fieldJourney = {
  // pinned scroll length, in viewport heights
  length: 4.5,
  // follow-through on the scroll position (no overshoot)
  spring: { stiffness: 170, damping: 28, mass: 0.4 },
  // [start, end] of each camera move, as a share of the pinned scroll;
  // between moves the camera holds on a zone
  moves: {
    enter: [0.02, 0.14],
    planToBuild: [0.28, 0.45],
    buildToOperate: [0.57, 0.72],
    exit: [0.83, 0.95],
  },
  // mid-flight the camera pulls back to this multiple of the overview scale
  midZoom: 1.2,
  // brightness of the zones that aren't in focus
  dim: 0.4,
  // the plant comes apart over this stretch (Decommission)
  decommission: [0.86, 0.99],
  // wind-turbine rotor turns over the whole journey
  bladeTurns: 5,
} as const;

// Comp 3 workstream timeline: the centre line draws down with the scroll;
// its tip sits at this fraction of the viewport height, and a card turns
// solid once the tip reaches it.
export const timeline = {
  tipAt: 0.55,
  spring: { stiffness: 220, damping: 32, mass: 0.4 },
  inactiveOpacity: 0.5,
  // card photos open from 200×300 to 280×400 (Figma px) as they come up to
  // the screen centre and stay open after; `reach` is how far before the
  // centre (share of the card's travel through the viewport) it starts
  widen: { from: { w: 200, h: 300 }, to: { w: 280, h: 400 }, reach: 0.22 },
} as const;

// Comp 4 CTA generator: the line-art control-panel door swings out on its
// hinges (degrees) with a soft spring when the generator or button is hovered.
export const generatorDoor = {
  angle: -112,
  spring: { type: "spring", stiffness: 140, damping: 18, mass: 0.9 } as Transition,
} as const;

// CSS mirrors of these tokens (--duration-*, --ease-*) live in globals.css
// for hover/press states that are pure CSS.
