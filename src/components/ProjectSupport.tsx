import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { FadeUp } from "@/components/comp2/FadeUp";

// Revised Figma y=2316–2721: staggered "Project Support, Built Around Your
// Scope" heading and the Workstreams intro. The pinned cards follow
// (Workstreams.tsx).
export function ProjectSupport() {
  return (
    <section id="workstreams" aria-labelledby="support-heading" className="shell pt-20 lg:pt-u-120">
      <RevealHeading
        id="support-heading"
        className="display relative text-[40px] text-fg sm:text-[56px] lg:h-u-104 lg:fs-u-64 lg:whitespace-nowrap"
      >
        <span className="block lg:contents">
          <Line className="lg:absolute lg:top-0 lg:left-0">Project</Line>{" "}
          <Line className="lg:absolute lg:top-0 lg:left-u-306">Support,</Line>
        </span>
        <span className="block pl-[0.6em] lg:contents">
          <Line className="lg:absolute lg:top-u-60 lg:left-u-116">Built Around</Line>{" "}
          <Line className="lg:absolute lg:top-u-60 lg:left-u-582">Your Scope</Line>
        </span>
      </RevealHeading>

      <FadeUp className="mt-10 flex max-w-[562px] flex-col gap-8 text-lg leading-[1.5] font-medium tracking-[-0.005em] text-fg/90 lg:mt-u-80 lg:ml-[calc(var(--u)*116)] lg:w-u-562">
        <p>
          <strong className="font-bold">MWC’s Workstreams</strong> are codified delivery systems that establish how
          project management, field oversight, scheduling, safety, documentation and reporting work together.
        </p>
        <p>
          Your scope determines which disciplines are applied, how responsibilities are assigned and what information
          your team receives. Whether you need one specialist or an integrated project team, you get a defined approach
          to managing the work.
        </p>
      </FadeUp>
    </section>
  );
}
