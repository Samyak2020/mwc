import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { Texture } from "@/components/ui/Texture";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// Comp 3 "Project Experience and Performance" (608:4343): flat navy band
// (#062568, 20% grain), heading top-left, metrics along the bottom.
export function Metrics3() {
  return (
    <section
      data-nav-theme="dark"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-[#062568] text-bg lg:h-u-609"
    >
      <Texture opacity={0.2} top="-82.91%" height="379.6%" />
      <div className="shell relative py-20 lg:h-full lg:p-0">
        <RevealHeading
          id="experience-heading"
          className="display text-[40px] sm:text-[56px] lg:absolute lg:top-u-81 lg:left-u-52 lg:w-u-794 lg:fs-u-64"
        >
          <Line className="block">Project Experience</Line>
          <Line className="block">and Performance</Line>
        </RevealHeading>

        <StaggerList className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:absolute lg:top-u-376 lg:left-u-32 lg:mt-0 lg:flex lg:items-center lg:gap-u-20">
          {metrics.map((m) => (
            <StaggerItem key={m.label} className="flex flex-col gap-10 border-l border-bg/20 py-2 pl-5 lg:w-u-329 lg:gap-u-64">
              <p className="display text-[56px] lg:fs-u-72">{m.value}</p>
              <p className="text-xl leading-[1.2] tracking-[0.005em] text-bg/90">{m.label}</p>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
