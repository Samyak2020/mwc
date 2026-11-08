import Image from "next/image";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Texture } from "@/components/ui/Texture";

// Figma y=6004–6744: "Veteran Leadership and Field Experience".
export function Leadership() {
  return (
    <section aria-labelledby="leadership-heading" className="shell pt-24 lg:pt-u-200">
      <div className="relative flex flex-col gap-10 lg:min-h-[calc(var(--u)*740)] lg:gap-0">
        <RevealHeading
          id="leadership-heading"
          className="display text-[40px] text-fg sm:text-[64px] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:h-u-212 lg:fs-u-80 lg:whitespace-nowrap"
        >
          <Line className="block lg:absolute lg:left-0 lg:top-0">Veteran Leadership</Line>
          <Line className="block text-right lg:absolute lg:left-u-582 lg:top-u-70 lg:text-left">And Field</Line>
          <Line className="block text-right lg:absolute lg:left-u-698 lg:top-u-140 lg:text-left">Experience</Line>
        </RevealHeading>

        <div className="relative aspect-[562/670] w-full max-w-[562px] overflow-hidden bg-navy lg:absolute lg:left-0 lg:top-u-70 lg:h-u-670 lg:w-u-562 lg:max-w-none">
          <Texture />
          <Image
            src="/figma/leadership.png"
            alt="Andrew Schaaf, MWC"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-10 lg:ml-[calc(var(--u)*931)] lg:gap-0 lg:pt-[calc(var(--u)*221.5)] lg:w-u-445">
        <p className="max-w-[445px] text-base leading-[1.51] tracking-[-0.005em] text-fg/80">
          Service-Disabled Veteran-Owned Small Business, certified by the U.S. Small Business Administration
        </p>

        <div className="flex max-w-[445px] flex-col gap-5 text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90 lg:mt-[calc(var(--u)*137)]">
          <p>
            MWC is led by Andrew Schaaf, a commissioned officer with nearly 30 years of military service and a career
            in power plant operations, commissioning and decommissioning.
          </p>
          <p>
            Work awarded to MWC counts toward federal service-disabled veteran-owned contracting goals and utility
            supplier diversity spend.
          </p>
        </div>
        </div>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-3 text-sm leading-[1.3] tracking-[-0.005em] lg:mt-auto lg:ml-[calc(var(--u)*582)] lg:pt-8 lg:gap-x-[calc(var(--u)*33)]">
          <div className="text-muted">
            <p>Unique Entity Identifier U9WJDCH3V369</p>
            <p>Commercial and Government Entity code 96A46</p>
          </div>
          <a href="#" className="whitespace-nowrap text-black underline hover:text-navy">
            Download A Capability Statement
          </a>
        </div>
      </div>
    </section>
  );
}
