"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease, generatorDoor } from "@/lib/motion";

// The line-art half of the CTA generator (Figma "Generator-vector" 639:4279),
// redrawn as SVG in a 1000×747 box that matches the original artwork. The
// control-panel door is its own layer: when `open`, it swings out on its
// left hinges (a real 3D turn) to show a minimal engine bay behind it.

const S = { stroke: "#fbfcff", strokeWidth: 1.6, fill: "none", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// door cavity in artwork units
const DOOR = { x: 143, y: 208, w: 300, h: 345 };

function Hinge({ x, y, w = 26, h = 26 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g {...S} strokeWidth={1.2}>
      <rect x={x} y={y} width={w} height={h} rx={2} />
      <rect x={x + w * 0.38} y={y + 3} width={w * 0.24} height={h - 6} rx={1} />
      <circle cx={x + 5} cy={y + 5} r={1.6} />
      <circle cx={x + w - 5} cy={y + 5} r={1.6} />
      <circle cx={x + 5} cy={y + h - 5} r={1.6} />
      <circle cx={x + w - 5} cy={y + h - 5} r={1.6} />
    </g>
  );
}

/** Everything except the swinging door. */
function Body() {
  const slats = [];
  for (const [y0, n] of [
    [220, 9],
    [392, 10],
  ] as const)
    for (let i = 0; i < n; i++) {
      const y = y0 + i * 15.5;
      slats.push(<path key={`${y0}-${i}`} d={`M51 ${y + 6} L82 ${y} M51 ${y + 10} L82 ${y + 4}`} />);
    }
  return (
    <g {...S}>
      {/* exhaust: flange, elbow, muffler on two brackets */}
      <path d="M388 153 V146 H441 V153" />
      <path d="M398 146 V118 C398 92 414 80 440 80 H478 M430 146 V120 C430 106 438 100 450 100 H478" />
      <rect x={478} y={77} width={30} height={34} rx={4} />
      <path d="M508 66 C500 66 500 132 508 132 M508 66 H730 C742 66 742 132 730 132 H508" />
      <path d="M520 52 C510 52 510 138 520 138 M520 52 H728 C744 52 744 138 728 138 H520" />
      <path d="M540 122 L532 153 M560 122 L552 153 M532 153 H562 M690 122 L684 153 M714 122 L720 153 M682 153 H722" />
      {/* roof slab, with the slanted cap over the louvres */}
      <path d="M42 157 L88 153 H958 V180 H88 L42 183 Z M88 153 V180" />
      {/* frame */}
      <path d="M88 180 V590 M958 180 V590 M143 180 V590 M443 180 V590 M497 180 V590 M762 180 V590 M88 180 H958" />
      {/* louvre column */}
      <path d="M42 183 V586 L88 590 M48 214 H86 V552 H48 Z" />
      <g strokeWidth={1.1}>{slats}</g>
      {/* right door (mostly hidden under the photo half) */}
      <rect x={497} y={180} width={265} height={373} />
      <rect x={501} y={184} width={257} height={365} />
      <Hinge x={465} y={233} w={31} h={27} />
      <Hinge x={465} y={480} w={31} h={27} />
      <Hinge x={748} y={209} />
      <Hinge x={748} y={505} />
      {/* base skid with its bays, and feet */}
      <path d="M42 588 H958 V632 L930 660 H118 L42 634 Z" />
      <path d="M93 598 H950 V626 L926 654 H123 L93 640 Z" />
      <path d="M235 598 V654 M402 598 V654 M560 598 V654 M746 598 V654 M840 598 V654" />
      <path d="M104 662 V684 L146 692 H204 V662 M146 668 V692 M803 662 V684 L845 692 H903 V662 M845 668 V692" />
      <path d="M160 662 V655 H190 V662 M858 662 V655 H888 V662" />
    </g>
  );
}

/** Minimal engine bay revealed behind the door. */
function Internals() {
  return (
    <g>
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="rgb(0 20 64 / 0.45)" />
      <g {...S} strokeWidth={1.4}>
        {/* cooling fan near the louvres */}
        <circle cx={196} cy={300} r={36} />
        <circle cx={196} cy={300} r={6} />
        <path d="M196 294 C188 276 204 268 210 282 M202 302 C220 302 222 318 208 318 M190 302 C176 314 166 300 178 292" />
        {/* engine block with four cylinder heads */}
        <rect x={180} y={402} width={150} height={112} rx={4} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={186 + i * 36} y={378} width={30} height={24} rx={2} />
        ))}
        <path d="M188 430 H322 M188 456 H322 M188 482 H322" opacity={0.6} />
        {/* coupling and alternator */}
        <rect x={330} y={434} width={16} height={48} />
        <rect x={346} y={408} width={84} height={100} rx={10} />
        <path d="M358 408 V508 M372 408 V508 M386 408 V508 M400 408 V508 M414 408 V508" opacity={0.55} />
        {/* cable run up to the control panel */}
        <path d="M388 408 V346 C388 330 376 322 360 322 H262" strokeDasharray="5 5" />
      </g>
    </g>
  );
}

/** The control-panel door, drawn in its own 300×345 box (origin = hinge corner). */
function DoorFace() {
  return (
    <svg viewBox={`${DOOR.x} ${DOOR.y} ${DOOR.w} ${DOOR.h}`} className="block h-full w-full" aria-hidden>
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="#2089d8" />
      <g {...S}>
        <rect x={DOOR.x + 1} y={DOOR.y + 1} width={DOOR.w - 2} height={DOOR.h - 2} />
        <rect x={146} y={211} width={294} height={339} />
        {/* controller housing */}
        <rect x={160} y={235} width={185} height={130} rx={22} />
        <rect x={168} y={243} width={169} height={114} rx={16} />
        <rect x={196} y={258} width={107} height={84} rx={4} />
        <rect x={201} y={263} width={97} height={74} rx={3} />
        <rect x={228} y={270} width={42} height={26} rx={2} />
        <path d="M211 280 L216 272 L221 280 Z M281 280 L286 272 L291 280 Z M212 287 L219 292 M281 291 L285 295 L291 287" strokeWidth={1.1} />
        <path d="M212 304 H220 M281 304 H289 M231 306 L236 302 L236 310 Z M244 304 H252 M262 302 L267 306 L262 310 Z" strokeWidth={1.1} />
        {[215, 232, 249, 266, 284].map((x) => (
          <circle key={x} cx={x} cy={326} r={4} strokeWidth={1.1} />
        ))}
        <circle cx={181} cy={300} r={6} />
        <path d="M181 294 V300" />
        <circle cx={320} cy={300} r={8} />
        <circle cx={320} cy={300} r={4.5} />
        <circle cx={181} cy={324} r={2} />
        <circle cx={320} cy={324} r={2} />
        {/* latch handle */}
        <rect x={380} y={327} width={57} height={43} rx={4} />
        <rect x={388} y={335} width={41} height={27} rx={3} />
        <rect x={400} y={339} width={28} height={21} rx={2} />
        <circle cx={414} cy={349} r={4} />
        <circle cx={384} cy={331} r={1.5} />
        <circle cx={433} cy={331} r={1.5} />
        <circle cx={384} cy={366} r={1.5} />
        <circle cx={433} cy={366} r={1.5} />
      </g>
    </svg>
  );
}

export function GeneratorVector({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 1000 747" className="absolute inset-0 block h-full w-full" aria-hidden>
        <Internals />
        <Body />
        {/* hinges on the door's frame side stay put */}
        <Hinge x={130} y={240} />
        <Hinge x={130} y={481} />
      </svg>

      {/* the door: swings out on its left edge */}
      <div
        className="absolute [perspective:900px]"
        style={{ left: pct(DOOR.x, 1000), top: pct(DOOR.y, 747), width: pct(DOOR.w, 1000), height: pct(DOOR.h, 747) }}
      >
        <motion.div
          className="h-full w-full origin-left [transform-style:preserve-3d]"
          initial={false}
          animate={{ rotateY: open && !reduce ? generatorDoor.angle : 0, opacity: open && reduce ? 0 : 1 }}
          transition={open ? { ...generatorDoor.spring } : { duration: duration.base, ease: ease.inOut }}
        >
          {/* outer face (control panel) */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <DoorFace />
          </div>
          {/* inner face: a plain stiffened panel, seen once the door is open */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <svg viewBox="0 0 300 345" preserveAspectRatio="none" className="block h-full w-full" aria-hidden>
              <rect x={0} y={0} width={300} height={345} fill="#1c7cc6" />
              <g {...S}>
                <rect x={1} y={1} width={298} height={343} />
                <rect x={18} y={18} width={264} height={309} rx={6} opacity={0.7} />
                <path d="M18 120 H282 M18 225 H282" opacity={0.45} />
              </g>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
