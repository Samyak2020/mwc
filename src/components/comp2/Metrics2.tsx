import Image from "next/image";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { StaggerList, StaggerItem } from "@/components/motion/Stagger";
import { DrawnBolt } from "@/components/comp2/DrawnBolt";

const metrics = [
  { value: "$220M", label: "Capital project value supported" },
  { value: "132", label: "Project assignments completed" },
  { value: "15", label: "Facilities supported" },
  { value: "120+", label: "Combined years of relevant field experience" },
];

// white client logos (Figma "Trusted Companies" 578:1341)
const logos = [
  { src: "/comp2/logo-0.png", w: 165, h: 22.5 },
  { src: "/comp2/logo-1.png", w: 154, h: 23.5 },
  { src: "/comp2/logo-0.png", w: 165, h: 22.5 },
  { src: "/comp2/logo-2.png", w: 113, h: 23.5 },
  { src: "/comp2/logo-3.png", w: 101, h: 22.5 },
  { src: "/comp2/logo-4.png", w: 107, h: 35.5 },
  { src: "/comp2/logo-0.png", w: 165, h: 22.5 },
  { src: "/comp2/logo-5.png", w: 124, h: 27.5 },
  { src: "/comp2/logo-0.png", w: 165, h: 22.5 },
];

function LogoSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {logos.map((l, i) => (
        <li key={i} className="shrink-0">
          <Image src={l.src} alt={hidden ? "" : "Client logo"} width={l.w} height={l.h} style={{ width: l.w, height: l.h }} />
        </li>
      ))}
    </ul>
  );
}

// "Project Experience and Performance" + metrics + logo marquee
// (content frame y=1882–2533).
export function Metrics2() {
  return (
    // Figma's ink → navy (#062568) gradient, started from pure ink at the top
    // of this section so it joins the pinned section above without a seam.
    <section
      aria-labelledby="metrics-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#000611_0%,#062568_100%)]"
    >
      {/* Bolt backdrop (Figma 597:3919: 1688×735 at x 2, bottom flush with the
          content frame), drawn left → right as the section scrolls in */}
      <DrawnBolt className="bottom-0 left-0 aspect-[1688/735] w-[117%] lg:bottom-[calc(var(--u)*-3)] lg:left-[calc(var(--bleed)+var(--u)*2)] lg:h-u-735 lg:w-u-1688" />
      <div className="shell pt-24 pb-20 lg:pt-u-133 lg:pb-u-120">
      <RevealHeading id="metrics-heading" className="display text-[40px] text-bg sm:text-[56px] lg:w-u-794 lg:fs-u-64">
        <Line className="block">Project Experience</Line>
        <Line className="block">and Performance</Line>
      </RevealHeading>

      <StaggerList className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-u-104 lg:flex lg:items-center lg:gap-u-20">
        {metrics.map((m, i) => (
          <StaggerItem key={i} className="flex flex-col gap-10 border-l border-bg/20 py-2 pl-5 lg:w-u-329 lg:gap-u-64">
            <p className="display text-[56px] text-bg lg:fs-u-72">{m.value}</p>
            <p className="text-xl leading-[1.2] tracking-[0.005em] text-bg/90">{m.label}</p>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="marquee mt-20 h-[37px] w-full overflow-hidden opacity-80 lg:mt-u-120">
        <div className="marquee-track flex h-full w-max items-center opacity-50">
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
      </div>
    </section>
  );
}
