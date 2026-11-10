import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// Comp 4 "Project Experience and Performance" (Figma 639:4387–4406): white,
// "Impact over the years" eyebrow on the left, heading + a 2×2 metric grid
// with ruled rows on the right (x 500, 908 wide).
export function Metrics4() {
  return (
    <section aria-labelledby="experience-heading" className="shell pt-24 text-fg lg:grid lg:grid-cols-[calc(var(--u)*468)_1fr] lg:pt-u-110">
      <p className="flex items-center gap-2.5 self-start text-sm leading-[1.5] font-bold tracking-[0.05em] uppercase">
        <span aria-hidden className="flex gap-0.5">
          <span className="size-2 bg-sky" />
          <span className="size-2 bg-[#033192]" />
          <span className="size-2 bg-[#001b56]" />
        </span>
        Impact over the years
      </p>

      <div className="mt-6 lg:mt-0">
        <RevealHeading id="experience-heading" className="display text-[40px] sm:text-[56px] lg:ml-[calc(var(--u)*20)] lg:w-u-911 lg:fs-u-64">
          <Line className="block">Project Experience and</Line>
          <Line className="block">Performance</Line>
        </RevealHeading>

        <StaggerList className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:mt-u-92 lg:w-u-908">
          {metrics.map((m, i) => (
            <StaggerItem
              key={m.label}
              className={`flex flex-col gap-8 border-t border-fg/20 pt-10 pb-12 pl-5 lg:gap-u-40 lg:pt-u-40 lg:pb-u-48 ${i % 2 ? "sm:pl-[calc(var(--u)*31)]" : ""}`}
            >
              <p className="display text-[48px] lg:fs-u-56">{m.value}</p>
              <p className="max-w-[329px] text-lg leading-[1.5] tracking-[0.005em]">{m.label}</p>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
