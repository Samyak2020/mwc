import Image from "next/image";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

type Article = {
  title: string;
  description: string;
  /** Card photo (placeholder navy panel until the client provides images). */
  image?: string;
};

const articles: Article[] = [
  {
    title: "What Does an Owner’s Representative Actually Do on a Utility Project?",
    description:
      "Understand the owner’s representative’s responsibilities, how the role differs from construction management and where it can supplement your internal team.",
  },
  {
    title: "What Construction Firms Need to Know Before Entering Utility Work",
    description:
      "Review the documentation, utility coordination and scheduling requirements that affect planning and field execution.",
  },
  {
    title: "How Project Leaders Keep Construction Teams Aligned",
    description:
      "See how defined responsibilities, regular coordination and documented decisions help teams manage changing field conditions.",
  },
];

// Figma y=5076–5804: "Project Resources" heading + three article cards.
// Comp 2 reuses it with a one-line "Client Resources" heading (Figma 578:1757).
export function Resources({
  lines = ["Project", "Resources"],
  sectionClass = "pt-24 lg:pt-u-200",
  headingClass = "text-[44px] sm:text-[64px] lg:fs-u-80",
  listClass = "lg:mt-u-31",
}: {
  lines?: string[];
  sectionClass?: string;
  headingClass?: string;
  listClass?: string;
} = {}) {
  return (
    <section aria-labelledby="resources-heading" className={`shell ${sectionClass}`}>
      <RevealHeading id="resources-heading" className={`display text-fg ${headingClass}`}>
        {lines.map((l) => (
          <Line key={l} className="block">
            {l}
          </Line>
        ))}
      </RevealHeading>

      <StaggerList className={`mt-10 grid gap-12 md:grid-cols-3 md:gap-5 lg:gap-u-20 ${listClass}`}>
        {articles.map((a) => (
          <StaggerItem key={a.title}>
            <a href="#" className="group flex flex-col gap-8">
              {/* Hover (Figma 504:146): image darkens to 50% and "Read the
                  Article" rises into the centre. */}
              <div className="relative aspect-[446/400] w-full overflow-hidden bg-navy">
                {a.image ? (
                  <Image src={a.image} alt="" fill sizes="(min-width: 768px) 31vw, 100vw" className="object-cover" />
                ) : null}
                <Texture />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex translate-y-2 items-center justify-center gap-[9px] text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg opacity-0 transition-[opacity,translate] duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0"
                >
                  Read the Article
                  <Arrow width={50} />
                </span>
              </div>
              <div className="flex flex-col gap-5">
                <h3 className="text-xl leading-[1.3] font-semibold tracking-[0.005em] text-fg group-hover:text-navy">
                  {a.title}
                </h3>
                <p className="text-base leading-[1.5] tracking-[0.005em] text-fg/80">{a.description}</p>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerList>
    </section>
  );
}
