import Image from "next/image";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { Texture } from "@/components/ui/Texture";
import { PHOTO_QUALITY } from "@/lib/motion";

const articles = [
  {
    title: "What Does an Owner’s Representative Actually Do on a Utility Project?",
    description:
      "Understand the owner’s representative’s responsibilities, how the role differs from construction management and where it can supplement your internal team.",
    image: "/comp1r/res-1.png",
    h: 400,
  },
  {
    title: "What Construction Firms Need to Know Before Entering Utility Work",
    description:
      "Review the documentation, utility coordination and scheduling requirements that affect planning and field execution.",
    image: "/comp1r/res-2.png",
    h: 231,
  },
  {
    title: "How Project Leaders Keep Construction Teams Aligned",
    description:
      "See how defined responsibilities, regular coordination and documented decisions help teams manage changing field conditions.",
    image: "/comp1r/res-3.png",
    h: 338,
  },
];

// Comp 4 "Client Resources" (Figma 639:4249 / 4250 / 4268): heading on the
// left; on the right, article rows (photo | title + summary, 32 apart, rows
// 20 apart) and a "See all resources" button.
export function ResourcesList() {
  return (
    <section aria-labelledby="resources-heading" className="shell pt-24 lg:grid lg:grid-cols-[calc(var(--u)*511)_calc(var(--u)*795)] lg:pt-u-200">
      <RevealHeading id="resources-heading" className="display text-[44px] text-fg sm:text-[64px] lg:w-u-445 lg:fs-u-64">
        <Line className="block">Client</Line>
        <Line className="block">Resources</Line>
      </RevealHeading>

      <div className="mt-10 lg:mt-0">
        <StaggerList className="flex flex-col gap-10 sm:gap-5">
          {articles.map((a) => (
            <StaggerItem key={a.title}>
              <a href="#" className="group grid gap-5 sm:grid-cols-2 sm:gap-8 lg:gap-u-32">
                <div
                  className="relative overflow-hidden bg-navy"
                  style={{ height: `max(${Math.round(a.h * 0.55)}px, calc(var(--u) * ${a.h}))` }}
                >
                  <Image src={a.image} alt="" fill sizes="(min-width: 640px) 28vw, 100vw" quality={PHOTO_QUALITY} className="object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-black/10" />
                  <Texture top="-47.11%" height="235.1%" />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-night/50 px-3 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-bg uppercase opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    Read the Article
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl leading-[1.3] font-semibold tracking-[0.005em] text-fg group-hover:text-navy">{a.title}</h3>
                  <p className="text-base leading-[1.5] tracking-[0.005em] text-fg/80">{a.description}</p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerList>
        <a
          href="#"
          className="cta mt-7 inline-flex items-center border border-fg/50 bg-white px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
        >
          See all resources
        </a>
      </div>
    </section>
  );
}
