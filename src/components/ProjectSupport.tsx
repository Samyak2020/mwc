import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { ScrollFillText } from "@/components/motion/ScrollFillText";

// Figma y=2138–3037: "Project Support, Built Around Your Scope" and the
// Workstreams statement. The pinned workstream cards follow (Workstreams.tsx).
export function ProjectSupport() {
  return (
    <section id="workstreams" aria-labelledby="support-heading" className="shell pt-16 lg:pt-u-64">
      <RevealHeading
        id="support-heading"
        className="display relative text-[40px] text-fg sm:text-[56px] lg:h-u-128 lg:fs-u-80 lg:whitespace-nowrap"
      >
        <span className="block lg:contents">
          <Line className="lg:absolute lg:left-0 lg:top-0">Project</Line>{" "}
          <Line className="lg:absolute lg:left-u-384 lg:top-0">Support,</Line>
        </span>
        <span className="block text-right lg:contents">
          <Line className="lg:absolute lg:left-u-302 lg:top-u-74">Built Around</Line>{" "}
          <Line className="lg:absolute lg:left-u-885 lg:top-u-74">Your Scope</Line>
        </span>
      </RevealHeading>

      <p className="mt-8 max-w-[678px] text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90 lg:mt-u-64 lg:ml-[calc(var(--u)*465)] lg:w-u-678">
        Whether you are planning a new facility, managing construction, preparing for an outage or retiring a
        plant, you need to know how that work will be managed and who is accountable.
      </p>

      <ScrollFillText
        className="mt-24 mb-16 font-display text-[28px] leading-none font-semibold tracking-[-0.02em] text-fg sm:text-[40px] lg:mt-u-395 lg:mb-0 lg:fs-u-48"
        text="MWC’s Workstreams provide that structure. Our codified delivery system establishes how project management, field oversight, scheduling, safety, documentation and reporting work together."
      />
    </section>
  );
}
