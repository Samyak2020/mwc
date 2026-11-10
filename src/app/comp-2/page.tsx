import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Hero2 } from "@/components/comp2/Hero2";
import { Industries2 } from "@/components/comp2/Industries2";
import { Workstreams2 } from "@/components/comp2/Workstreams2";
import { Metrics2 } from "@/components/comp2/Metrics2";
import { Resources } from "@/components/Resources";
import { Leadership2 } from "@/components/comp2/Leadership2";
import { Team } from "@/components/Team";
import { Cta2 } from "@/components/comp2/Cta2";
import { Footer2 } from "@/components/comp2/Footer2";

export const metadata: Metadata = { title: "MWC | Comp 2" };

// Design comp 2 (Figma "Homepage" 539:161).
export default function Comp2() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero2 />
        {/* Figma "Homepage Content": ink behind industries + workstreams; the
            ink → navy gradient (from 53.4% of the frame) lives on Metrics2 so
            the pinned section's extra height doesn't stretch it */}
        <div data-nav-theme="dark" className="bg-night">
          <Industries2 />
          <Workstreams2 />
          <Metrics2 />
        </div>
        <Resources
          lines={["Client Resources"]}
          sectionClass="pt-24 lg:pt-u-160"
          headingClass="text-[44px] sm:text-[60px] lg:fs-u-60"
          listClass="lg:mt-u-48"
        />
        <Leadership2 />
        <Team variant="comp2" />
        <Cta2 />
      </main>
      <Footer2 />
    </>
  );
}
