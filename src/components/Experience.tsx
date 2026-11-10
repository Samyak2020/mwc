import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { Texture } from "@/components/ui/Texture";
import { DrawnBolt } from "@/components/comp2/DrawnBolt";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// Revised Figma "Project Experience and Performance" (548:1072): navy band,
// 1440×698, staggered heading, four metrics, and the bolt (drawn left → right
// as the section scrolls in) behind them.
export function Experience() {
  return (
    <section
      data-nav-theme="dark"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-navy text-bg lg:h-u-698"
    >
      <Texture opacity={0.2} top="-72.34%" height="331.19%" />
      {/* 1688×735 at (0, 0) */}
      <DrawnBolt fill="#001440" className="top-0 left-0 aspect-[1688/735] w-[117%] lg:left-[var(--bleed)] lg:h-u-735 lg:w-u-1688" />

      <div className="shell relative py-20 lg:h-full lg:p-0">
        <RevealHeading
          id="experience-heading"
          className="display text-[40px] sm:text-[56px] lg:absolute lg:inset-x-0 lg:top-u-156 lg:h-u-174 lg:fs-u-64 lg:whitespace-nowrap"
        >
          <Line className="block lg:absolute lg:top-0 lg:left-[calc(50%-var(--u)*333)]">Project</Line>
          <Line className="block lg:absolute lg:top-u-60 lg:left-[calc(50%-var(--u)*219)]">Experience</Line>
          <span className="block lg:contents">
            <Line className="lg:absolute lg:top-u-120 lg:left-[calc(50%-var(--u)*281)]">and</Line>{" "}
            <Line className="lg:absolute lg:top-u-120 lg:left-[calc(50%-var(--u)*120)]">Performance</Line>
          </span>
        </RevealHeading>

        <StaggerList className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:absolute lg:top-u-452 lg:left-1/2 lg:mt-0 lg:flex lg:-translate-x-1/2 lg:items-center lg:gap-u-20">
          {metrics.map((m) => (
            <StaggerItem key={m.label} className="flex flex-col gap-10 border-l border-bg/20 py-2 pl-5 lg:w-u-329 lg:gap-u-64">
              <p className="display text-[56px] lg:fs-u-64">{m.value}</p>
              <p className="text-xl leading-[1.2] tracking-[0.005em] text-bg/90">{m.label}</p>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
