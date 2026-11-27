import Image from "next/image";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { Rise } from "@/components/motion/Rise";
import { CountUpMetric } from "@/components/industries/CountUp";
import { StickyBottom } from "@/components/industries/StickyBottom";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// "Project Experience and Performance", laid out as the industry pages' case
// study ("17 Projects, 2 Acquired Plants, 1 Owner's Representative"): a field
// photograph and the heading on the left, entering level with the figures and
// then holding at the foot of the screen; the figures count up on the right,
// one ruled row each.
export function Metrics4() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="shell grid gap-12 pt-24 text-fg lg:grid-cols-[minmax(0,1fr)_calc(var(--u)*560)] lg:gap-u-96 lg:pt-u-160"
    >
      <div>
        <StickyBottom gap={72} className="lg:sticky">
          <Rise className="relative mb-8 aspect-[3/2] w-[180px] overflow-hidden rounded-[4px] lg:mb-u-40 lg:w-u-220">
            <Image src="/resources/field-oversight.jpg" alt="" fill sizes="220px" className="object-cover object-[50%_30%]" />
          </Rise>
          <RevealHeading id="experience-heading" className="display text-[40px] sm:text-[56px] lg:fs-u-64">
            <Line className="block text-fg/45">Project Experience and</Line>
            <Line className="block text-fg">Performance</Line>
          </RevealHeading>
        </StickyBottom>
      </div>

      <div>
        {metrics.map((m) => (
          <CountUpMetric key={m.label} value={m.value} text={m.label} />
        ))}
      </div>
    </section>
  );
}
