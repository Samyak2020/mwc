import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { RiseEach } from "@/components/motion/Rise";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// Comp 4 "Project Experience and Performance" (Figma 639:4387–4406): white,
// heading + a 2×2 metric grid
// with ruled rows on the right (x 500, 908 wide).
export function Metrics4() {
  return (
    <section aria-labelledby="experience-heading" className="shell pt-24 text-fg lg:pt-u-110">
      {/* heading and metrics share the page's right-hand column */}
      <div className="lg:ml-[calc(var(--u)*468)]">
        <RevealHeading id="experience-heading" className="display text-[40px] sm:text-[56px] lg:w-u-911 lg:fs-u-56">
          <Line className="block">Project Experience and</Line>
          <Line className="block">Performance</Line>
        </RevealHeading>

        <RiseEach as="ul" itemAs="li" className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:mt-u-92 lg:w-u-908">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`flex flex-col gap-8 border-t border-fg/20 pt-10 pb-12 pl-5 lg:gap-u-40 lg:pt-u-40 lg:pb-u-48 ${i % 2 ? "sm:pl-[calc(var(--u)*31)]" : ""}`}
            >
              <p className="display text-[48px] lg:fs-u-56">{m.value}</p>
              <p className="max-w-[329px] text-lg leading-[1.5] tracking-[0.005em]">{m.label}</p>
            </div>
          ))}
        </RiseEach>
      </div>
    </section>
  );
}
