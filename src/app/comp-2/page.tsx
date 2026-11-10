import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Hero2 } from "@/components/comp2/Hero2";
import { Industries2 } from "@/components/comp2/Industries2";
import { Workstreams2 } from "@/components/comp2/Workstreams2";
import { Metrics2 } from "@/components/comp2/Metrics2";
import { ClientResources } from "@/components/ClientResources";
import { Leadership } from "@/components/Leadership";
import { TeamRow } from "@/components/TeamRow";
import { Cta2 } from "@/components/comp2/Cta2";
import { Footer2 } from "@/components/comp2/Footer2";

export const metadata: Metadata = { title: "MWC | Comp 2" };

// Design comp 2 (updated Figma "Homepage" 539:161). Client resources,
// leadership and team are the same sections as comp 1.
export default function Comp2() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero2 />
        {/* Figma "Homepage Content": ink behind industries + workstreams; the
            ink → navy gradient lives on Metrics2 so the pinned section's extra
            height doesn't stretch it */}
        <div data-nav-theme="dark" className="bg-night">
          <Industries2 />
          <Workstreams2 />
          <Metrics2 />
        </div>
        <ClientResources className="pt-24 lg:pt-u-160" />
        <Leadership />
        <TeamRow className="pt-24 lg:pt-u-173" />
        <Cta2 />
      </main>
      <Footer2 />
    </>
  );
}
