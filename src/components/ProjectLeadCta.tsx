import { Arrow } from "@/components/ui/Arrow";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Cropped } from "@/components/ui/Cropped";
import { Texture } from "@/components/ui/Texture";

// Figma "Project Lead Image" (y=7605, 1440×436).
export function ProjectLeadCta() {
  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="cta-heading"
      className="relative mt-24 h-[420px] overflow-hidden text-bg lg:mt-u-120 lg:h-u-436"
    >
      <div aria-hidden className="absolute inset-0">
        <Cropped src="/figma/project-lead.png" left="-27.23%" top="-128.63%" width="158.87%" height="349.85%" />
        <div className="absolute inset-0 bg-black/25" />
        <Texture opacity={0.2} top="-15.11%" height="69.16%" />
      </div>

      <div className="shell relative flex h-full flex-col justify-center gap-6 lg:block">
        <RevealHeading id="cta-heading" className="display text-[44px] sm:text-[64px] lg:h-full lg:fs-u-92 lg:whitespace-nowrap">
          <Line className="block lg:absolute lg:left-u-149 lg:top-u-100">Talk to a</Line>
          <Line className="block text-right lg:absolute lg:left-u-746 lg:top-u-201 lg:text-left">Project Lead</Line>
        </RevealHeading>
        <a
          href="mailto:info@mwconsultllc.com"
          className="cta flex items-center justify-center gap-[9px] self-end border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg lg:absolute lg:left-u-746 lg:top-u-282"
        >
          Talk to a Project Lead
          <Arrow />
        </a>
      </div>
    </section>
  );
}
