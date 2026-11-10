import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { ImageReveal } from "@/components/motion/ImageReveal";
import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/motion";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeUp } from "@/components/comp2/FadeUp";

// Revised Figma y=5497–6636: heading; left column (about, then the
// certification block at the bottom), right column (overview + portrait).
export function Leadership() {
  return (
    <section aria-labelledby="leadership-heading" className="shell pt-24 lg:pt-u-200">
      <RevealHeading id="leadership-heading" className="display text-[44px] text-fg sm:text-[64px] lg:fs-u-64">
        <Line className="block">Veteran Leadership</Line>
        <Line className="block">and Field Experience</Line>
      </RevealHeading>

      <div className="mt-12 grid gap-12 lg:mt-u-110 lg:grid-cols-[calc(var(--u)*445)_calc(var(--u)*796)] lg:justify-between lg:gap-0">
        {/* left: about at the top, certification block at the bottom */}
        <div className="flex flex-col justify-between gap-12">
          <FadeUp className="flex flex-col">
            <p className="text-sm leading-[1.5] font-bold tracking-[0.095em] text-fg/50">ABOUT</p>
            <p className="mt-4 font-display text-[32px] leading-[0.9] font-black tracking-[-0.015em] text-fg uppercase lg:fs-u-40">
              Andrew Schaaf
            </p>
            <p className="mt-3 text-lg leading-[1.5] tracking-[-0.005em] text-fg/50">Owner and President of MWC</p>
          </FadeUp>

          <FadeUp className="flex flex-col gap-16">
            <p className="text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">
              Work awarded to MWC counts toward federal service-disabled veteran-owned contracting goals and utility
              supplier diversity spend.
            </p>
            {/* Certification badge (627:530) */}
            <div className="flex items-center justify-between gap-2">
              <img src="/comp2/laurel-left.svg" alt="" aria-hidden width={56} height={97} className="shrink-0" />
              <div className="flex max-w-[329px] flex-col items-center gap-2 text-center lg:w-u-329 lg:max-w-none lg:shrink-0">
                <p className="text-xl leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">
                  Service-Disabled Veteran-Owned Small Business
                </p>
                <p className="w-[228px] text-sm leading-[1.3] tracking-[-0.015em]">
                  <span className="block text-fg/40">certified by the</span>
                  <span className="block text-fg/70">U.S. Small Business Administration</span>
                </p>
              </div>
              <img src="/comp2/laurel-right.svg" alt="" aria-hidden width={57} height={101} className="shrink-0" />
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm leading-[1.3] tracking-[-0.005em] text-fg/50">
                Unique Entity Identifier U9WJDCH3V369
                <br />
                Commercial and Government Entity code 96A46
              </p>
              <a
                href="#"
                className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
              >
                Download A Capability Statement
                <Arrow />
              </a>
            </div>
          </FadeUp>
        </div>

        {/* right: overview + portrait (796×650, crop top −23.52%) */}
        <div className="flex flex-col gap-8 lg:mt-u-151 lg:gap-u-33">
          <FadeUp>
            <p className="text-xl leading-[1.3] font-medium tracking-[-0.005em] text-fg/90 lg:fs-u-24">
              MWC is led by <strong className="font-bold">Andrew Schaaf</strong>, a commissioned officer with nearly 30
              years of military service and a career in power plant operations, commissioning and decommissioning.
            </p>
          </FadeUp>
          {/* The portrait is upright and the frame is wide: fit it to the frame's
              height so he sits centred, head to chest, with a soft blur of the
              same studio backdrop filling the sides. */}
          <div className="relative aspect-[796/650] w-full overflow-hidden bg-navy">
            <ImageReveal>
              {/* the studio backdrop's own greys (sampled from the photo's edges),
                  darkening towards the bottom like the suit */}
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#3a3936_0%,#45433f_45%,#2c3038_70%,#1a2230_100%)]" />
              <Image
                src="/figma/leadership.png"
                alt="Andrew Schaaf"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={PHOTO_QUALITY}
                // feather the photo's side edges (it spans 23–77% of the frame) into the backdrop
                className="object-contain object-bottom [mask-image:linear-gradient(90deg,transparent_22%,black_29%,black_71%,transparent_78%)]"
              />
              <Texture />
            </ImageReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
