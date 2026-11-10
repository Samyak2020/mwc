import Image from "next/image";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { PHOTO_QUALITY } from "@/lib/motion";

type Industry = {
  name: string;
  image: string;
  /** vertical focus of the cover crop (Figma crops) */
  focus?: string;
  /** strength of the bottom fade (Figma: 0.25 on the first card, 0.8 after) */
  fade: number;
  description: string;
  cta: string;
};

// Comp 3 Figma "Industry Cards" (583:2851): five full-width cards, 24 apart.
const industries: Industry[] = [
  {
    name: "Power Producers",
    image: "/comp2/ind-power-hd.jpg",
    fade: 0.25,
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    image: "/comp2/ind-utilities-hd.jpg",
    focus: "50% 16%",
    fade: 0.8,
    description:
      "Within electric, natural gas and water utility capital delivery organizations, MWC provides project and program management, construction oversight and project controls.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Government",
    image: "/comp2/ind-government-hd.jpg",
    focus: "50% 33%",
    fade: 0.8,
    description:
      "Federal, state and local projects are delivered by MWC, a certified service-disabled veteran-owned small business",
    cta: "Contract With a Certified Veteran-Owned Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    image: "/comp2/ind-commercial-hd.jpg",
    focus: "50% 41%",
    fade: 0.8,
    description:
      "Owner-side project oversight and project delivery personnel are available for commercial, industrial and on-site energy projects, with added support for contractor teams.",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    image: "/comp2/ind-oil-hd.jpg",
    fade: 0.8,
    description:
      "From upstream production sites to midstream pipelines and downstream refinery turnarounds, projects are managed with contractor safety oversight from mobilization to closeout.",
    cta: "Contract With a Certified Veteran-Owned Firm",
  },
];

// "Depth of Experience Across Industries" (comp 3): each card's photo wipes
// in left → right over navy as the card scrolls into view.
export function IndustryCards() {
  return (
    <section id="industries" aria-labelledby="industries-heading" className="shell pt-24 lg:pt-u-120">
      <RevealHeading id="industries-heading" className="display text-[40px] text-fg sm:text-[56px] lg:fs-u-64">
        <Line className="block">Depth of Experience</Line>
        <Line className="block">Across Industries</Line>
      </RevealHeading>

      <ul className="mt-10 flex flex-col gap-4 lg:mt-u-40 lg:gap-u-24">
        {industries.map((it) => (
          <li key={it.name} className="relative flex min-h-[460px] flex-col justify-between overflow-hidden bg-navy p-6 text-bg lg:h-u-500 lg:min-h-0 lg:p-u-32">
            <ImageReveal direction="right">
              <Image
                src={it.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 96vw, 100vw"
                quality={PHOTO_QUALITY}
                className="object-cover"
                style={it.focus ? { objectPosition: it.focus } : undefined}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, rgb(0 6 17 / 0.2), rgb(0 6 17 / 0.2)), linear-gradient(180deg, rgb(0 6 17 / 0) 0%, rgb(0 6 17 / ${it.fade}) 100%)`,
                }}
              />
              <Texture top="0%" height="100%" />
            </ImageReveal>

            <h3 className="relative max-w-[488px] text-[32px] leading-none font-bold tracking-[-0.005em] lg:w-u-488 lg:fs-u-40">
              {it.name}
            </h3>
            <div className="relative flex max-w-[460px] flex-col items-start gap-6 lg:w-u-460">
              <p className="text-base leading-[1.5] tracking-[-0.005em]">{it.description}</p>
              <a
                href="#contact"
                className="cta flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
              >
                {it.cta}
                <Arrow />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
