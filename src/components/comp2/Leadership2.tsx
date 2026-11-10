import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeUp } from "@/components/comp2/FadeUp";

// Figma (539:161) y=4549–5123: heading | portrait | overview, badge, CTA.
export function Leadership2() {
  return (
    <section
      aria-labelledby="leadership-heading"
      className="shell grid gap-10 pt-24 lg:grid-cols-[calc(var(--u)*446)_calc(var(--u)*446)_1fr] lg:items-start lg:gap-x-[calc(var(--u)*4)] lg:pt-u-200"
    >
      <RevealHeading id="leadership-heading" className="display text-[44px] text-fg sm:text-[60px] lg:fs-u-60">
        <Line className="block">Veteran</Line>
        <Line className="block">Leadership</Line>
        <Line className="block">and Field</Line>
        <Line className="block">Experience</Line>
      </RevealHeading>

      {/* Portrait: 446×550 frame, photo inset 16 on navy + grain */}
      <div className="p-4 lg:mt-u-24">
        <div className="relative aspect-[414/518] w-full overflow-hidden bg-navy">
          <Texture />
          <ImageReveal>
            <ParallaxImage src="/figma/leadership.png" alt="Andrew Schaaf" sizes="(min-width: 1024px) 30vw, 100vw" />
          </ImageReveal>
        </div>
      </div>

      <FadeUp className="flex flex-col gap-16 lg:mt-u-40 lg:ml-[calc(var(--u)*32)] lg:w-u-445 lg:gap-u-64">
        <div className="flex flex-col gap-5 text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">
          <p>
            MWC is led by Andrew Schaaf, a commissioned officer with nearly 30 years of military service and a career in
            power plant operations, commissioning and decommissioning.
          </p>
          <p>
            Work awarded to MWC counts toward federal service-disabled veteran-owned contracting goals and utility
            supplier diversity spend.
          </p>
        </div>

        {/* Certification badge (583:2043) */}
        <div className="flex items-center">
          <img src="/comp2/laurel-left.svg" alt="" aria-hidden width={56} height={97} className="shrink-0" />
          <div className="flex w-[329px] flex-col items-center gap-2 text-center lg:w-u-329">
            <p className="text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">
              Service-Disabled Veteran-Owned Small Business
            </p>
            <p className="w-[228px] text-sm leading-[1.3] tracking-[-0.015em]">
              <span className="block text-fg/40">certified by the</span>
              <span className="block text-fg/70">U.S. Small Business Administration</span>
            </p>
          </div>
          <img src="/comp2/laurel-right.svg" alt="" aria-hidden width={57} height={101} className="shrink-0" />
        </div>

        <div className="flex flex-col items-start gap-5">
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
    </section>
  );
}
