import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { WavyAccordion, type AccordionItem } from "@/components/comp2/WavyAccordion";

// Figma "Industry Card" (573:642) panels, in order.
const industries: AccordionItem[] = [
  {
    name: "Power Producers",
    image: "/comp2/ind-power-hd.jpg",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
    cta: "Keep Your Projects on Schedule",
  },
  {
    name: "Utilities",
    image: "/comp2/ind-utilities-hd.jpg",
    description:
      "Project and program management, construction oversight and project controls within utility capital delivery organizations.",
    cta: "Add Capacity to Your Capital Program",
  },
  {
    name: "Government",
    image: "/comp2/ind-government-hd.jpg",
    description:
      "Federal, state and local projects delivered by a certified service-disabled veteran-owned small business.",
    cta: "Contract With a Certified Firm",
  },
  {
    name: "Commercial, Industrial and General Contractors",
    image: "/comp2/ind-commercial-hd.jpg",
    description:
      "Owner-side project oversight and project delivery personnel for commercial, industrial and on-site energy projects.",
    cta: "Build Without Disrupting Operations",
  },
  {
    name: "Oil and Gas",
    image: "/comp2/ind-oil-hd.jpg",
    description: "Turnarounds and pipeline projects managed with contractor safety oversight from mobilization to closeout.",
    cta: "Plan Your Next Turnaround",
  },
];

// "Depth of Experience Across Industries" (content frame y=80–716).
export function Industries2() {
  return (
    <section aria-labelledby="industries-heading" className="shell pt-20 pb-8 lg:pt-u-163 lg:pb-u-120">
      <RevealHeading id="industries-heading" className="display text-[36px] text-bg sm:text-[48px] lg:fs-u-56">
        <Line className="block">Depth of Experience</Line>
        <Line className="block">Across Industries</Line>
      </RevealHeading>
      <div className="mt-8 lg:mt-u-36">
        <WavyAccordion items={industries} />
      </div>
    </section>
  );
}
