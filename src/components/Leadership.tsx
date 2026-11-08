import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Texture } from "@/components/ui/Texture";

// Figma Homepage y=6210–6880 (updated): portrait on the left (562×670); on the
// right a 64px three-line heading, then two text columns: certification
// (329 wide) and the overview (445 wide, starting lower), with the entity
// identifiers + capability link along the bottom, level with the portrait.
// The right side is a real grid rather than absolute positions, so its text
// can never collide at smaller desktop widths.
export function Leadership() {
  return (
    <section aria-labelledby="leadership-heading" className="shell pt-24 lg:pt-u-215 lg:pb-u-55">
      <div className="flex flex-col gap-10 lg:min-h-[calc(var(--u)*670)] lg:flex-row lg:items-stretch lg:gap-u-20">
        {/* Portrait (Figma x 32, 562×670) */}
        <div className="relative order-2 aspect-[562/670] w-full max-w-[562px] shrink-0 overflow-hidden bg-navy lg:order-none lg:aspect-auto lg:h-auto lg:w-u-562 lg:max-w-none">
          <Texture />
          <ImageReveal>
            <ParallaxImage
              src="/figma/leadership.png"
              alt="Andrew Schaaf, MWC"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </ImageReveal>
        </div>

        {/* Right side (Figma x 614–1408): 329 | 20 | 445 columns */}
        <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col">
          <RevealHeading
            id="leadership-heading"
            className="display order-1 text-[40px] text-fg sm:text-[56px] lg:order-none lg:w-u-678 lg:fs-u-64"
          >
            <Line className="block">Veteran</Line>
            <Line className="block">Leadership and</Line>
            <Line className="block">Field Experience</Line>
          </RevealHeading>

          <div className="order-3 flex flex-col gap-8 lg:order-none lg:mt-u-14 lg:grid lg:grid-cols-[calc(var(--u)*329)_calc(var(--u)*445)] lg:items-start lg:gap-x-[calc(var(--u)*20)] lg:gap-y-0">
            <p className="max-w-[329px] text-sm leading-[1.51] tracking-[-0.005em] text-fg/80 lg:max-w-none">
              Service-Disabled Veteran-Owned Small Business, certified by the U.S. Small Business Administration
            </p>

            <div className="flex max-w-[445px] flex-col gap-5 text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90 lg:mt-u-151 lg:max-w-none">
              <p>
                MWC is led by Andrew Schaaf, a commissioned officer with nearly 30 years of military service and a
                career in power plant operations, commissioning and decommissioning.
              </p>
              <p>
                Work awarded to MWC counts toward federal service-disabled veteran-owned contracting goals and utility
                supplier diversity spend.
              </p>
            </div>
          </div>

          {/* Bottom row, level with the portrait's bottom edge */}
          <div className="order-4 flex flex-wrap items-end gap-x-8 gap-y-3 text-sm leading-[1.3] tracking-[-0.005em] lg:order-none lg:mt-auto lg:grid lg:grid-cols-[calc(var(--u)*329)_calc(var(--u)*445)] lg:gap-x-[calc(var(--u)*20)] lg:pt-8">
            <div className="text-muted">
              <p>Unique Entity Identifier U9WJDCH3V369</p>
              <p>Commercial and Government Entity code 96A46</p>
            </div>
            <a href="#" className="justify-self-start whitespace-nowrap text-black underline hover:text-navy">
              Download A Capability Statement
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
