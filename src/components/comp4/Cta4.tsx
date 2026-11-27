"use client";

import Image from "next/image";
import { useState } from "react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { GeneratorVector } from "@/components/comp4/GeneratorVector";
import { Rise } from "@/components/motion/Rise";
import { PHOTO_QUALITY } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { NavLogoV2 } from "@/components/SiteNav";

// Comp 4 footer CTA (Figma "Project Lead Image" 639:4271, 1440×730, sky):
// "Bring us your project" + button, and the generator: line-art on the left,
// photo on the right, meeting in the middle. Hovering the generator or the
// button (or focusing the button) opens the line-art door.
export function Cta4({
  flush = false,
  heading = ["Ready for More Predictable", "Project Outcomes?"],
}: { flush?: boolean; heading?: string[] } = {}) {
  const [open, setOpen] = useState(false);
  const on = () => setOpen(true);
  const off = () => setOpen(false);

  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="cta-heading"
      // flush: sits straight under a full-bleed section (About), no gap above
      className={`relative overflow-hidden bg-sky text-bg ${flush ? "" : "mt-24 lg:mt-u-174"}`}
    >
      <div className="relative flex flex-col items-center gap-8 px-4 pt-16 text-center lg:pt-u-109">
        {/* v2 (Figma 728:1206): 56px, 918 wide, 32 above the button */}
        <RevealHeading id="cta-heading" className="display text-[40px] sm:text-[56px] lg:w-u-1000 lg:fs-u-56">
          {heading.map((l) => (
            <Line key={l} className="block">
              {l}
            </Line>
          ))}
        </RevealHeading>
        <Rise delay={0.2}>
        <a
          href="/contact"
          onPointerEnter={on}
          onPointerLeave={off}
          onFocus={on}
          onBlur={off}
          className="cta btn btn-raised flex items-center justify-center gap-[9px] bg-navy px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg [--btn-fill:var(--color-night)] [--btn-ink:var(--color-bg)]"
        >
          Scope Your Project
          <Arrow />
        </a>
        </Rise>
      </div>

      {/* "Generators" (639:4278): 730×512 artwork box, x 350 (centre −370).
          It follows the heading and button in the flow, so a longer heading
          pushes it down instead of under it; the negative bottom margin crops
          its foot as the fixed-height frame used to (92 at 1440) */}
      <div
        className="relative left-1/2 mt-4 -mb-[30px] h-[290px] w-[414px] -translate-x-[51%] sm:mt-[26px] sm:-mb-[60px] sm:h-[370px] sm:w-[528px] lg:left-[calc(50%-var(--u)*370)] lg:mt-[calc(var(--u)*14)] lg:-mb-[calc(var(--u)*92)] lg:h-u-512 lg:w-u-730 lg:translate-x-0"
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
          {/* the MWC mark on the door: the nav logo, in full colour as a decal */}
          <div
            className="absolute top-[24.2%] left-[61%] w-[33%] [&>svg]:h-auto [&>svg]:w-full"
            style={{ ["--logo-ridge" as string]: "url(#mwc-nav-ridge)", ["--logo-body" as string]: "url(#mwc-nav-body)", ["--logo-text" as string]: "#000611" }}
          >
            <NavLogoV2 />
          </div>
        </div>
      </div>
    </section>
  );
}
