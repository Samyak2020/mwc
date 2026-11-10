"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { GeneratorVector } from "@/components/comp4/GeneratorVector";
import { PHOTO_QUALITY } from "@/lib/motion";

// Comp 4 footer CTA (Figma "Project Lead Image" 639:4271, 1440×730, sky):
// "Bring us your project" + button, and the generator: line-art on the left,
// photo on the right, meeting in the middle. Hovering the generator or the
// button (or focusing the button) opens the line-art door.
export function Cta4() {
  const [open, setOpen] = useState(false);
  const on = () => setOpen(true);
  const off = () => setOpen(false);

  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="cta-heading"
      className="relative mt-24 h-[560px] overflow-hidden bg-sky text-bg sm:h-[640px] lg:mt-u-120 lg:h-u-730"
    >
      <div className="relative flex flex-col items-center gap-8 px-4 pt-16 text-center lg:pt-u-69">
        <RevealHeading id="cta-heading" className="display text-[44px] sm:text-[64px] lg:fs-u-72">
          <Line className="block">Bring us your</Line>
          <Line className="block">project</Line>
        </RevealHeading>
        <a
          href="mailto:info@mwconsultllc.com"
          onPointerEnter={on}
          onPointerLeave={off}
          onFocus={on}
          onBlur={off}
          className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
        >
          Talk to a Project Lead
          <Arrow />
        </a>
      </div>

      {/* "Generators" (639:4278): 730×512 artwork box at x 350 (centre −370),
          y 311; the photo half covers x 711–1089 */}
      <div
        className="absolute top-[300px] left-1/2 h-[290px] w-[414px] -translate-x-[51%] sm:top-[330px] sm:h-[370px] sm:w-[528px] lg:top-u-311 lg:left-[calc(50%-var(--u)*370)] lg:h-u-512 lg:w-u-730 lg:translate-x-0"
        onPointerEnter={on}
        onPointerLeave={off}
      >
        {/* line-art: image box offset (−4.45%, −7.7%), 108.89% × 115.91% */}
        <div className="absolute top-[-7.7%] left-[-4.45%] h-[115.91%] w-[108.89%]">
          <GeneratorVector open={open} />
        </div>
        {/* photo half: x 361.3–739.5 of the box, cropped to the right half of the photo */}
        <div className="absolute top-0 left-[49.5%] h-full w-[51.81%] overflow-hidden">
          <div className="absolute top-[-10.83%] left-[-121.92%] h-[122.29%] w-[246.77%]">
            <Image src="/comp4/gen-photo.png" alt="" fill sizes="(min-width: 1024px) 65vw, 100vw" quality={PHOTO_QUALITY} className="object-fill" />
          </div>
          {/* MWC mark on the door (1025, 435.5 → 38.6×29.3) */}
          <img
            src="/comp4/logo-white.svg"
            alt=""
            aria-hidden
            className="absolute top-[24.2%] left-[82.98%] w-[10.22%]"
          />
        </div>
      </div>
    </section>
  );
}
