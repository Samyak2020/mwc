import { Arrow } from "@/components/ui/Arrow";
import { Cropped } from "@/components/ui/Cropped";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";

// Figma "Project Lead Image" (594:3197, 1440×436): photo, navy bolt on the
// left, centred "Bring us your project" + CTA.
export function Cta2() {
  return (
    <section
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="cta-heading"
      className="relative mt-24 h-[420px] overflow-hidden text-bg lg:mt-u-120 lg:h-u-436"
    >
      <div aria-hidden className="absolute inset-0">
        <Cropped src="/comp2/cta-photo.jpg" left="-2.58%" top="-128.63%" width="158.87%" height="349.85%" />
        <div className="absolute inset-0 bg-black/25" />
        <Texture opacity={0.2} top="-15.11%" height="69.16%" />
        {/* 1021×445 bolt, x −105 */}
        <img
          src="/comp2/cta-bolt.svg"
          alt=""
          className="absolute top-0 left-[-7.29%] h-full w-[70.9%] max-w-none lg:left-[calc(var(--u)*-105)] lg:h-u-445 lg:w-u-1021"
        />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-4 text-center">
        <RevealHeading id="cta-heading" className="display text-[44px] sm:text-[64px] lg:fs-u-72">
          <Line className="block">Bring us your</Line>
          <Line className="block">project</Line>
        </RevealHeading>
        <a
          href="mailto:info@mwconsultllc.com"
          className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
        >
          Talk to a Project Lead
          <Arrow />
        </a>
      </div>
    </section>
  );
}
