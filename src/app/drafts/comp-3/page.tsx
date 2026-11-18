import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Hero2 } from "@/components/comp2/Hero2";
import { IndustryCards } from "@/components/comp3/IndustryCards";
import { WorkstreamTimeline } from "@/components/comp3/WorkstreamTimeline";
import { Metrics3 } from "@/components/comp3/Metrics3";
import { TrustedBy } from "@/components/TrustedBy";
import { ClientResources } from "@/components/ClientResources";
import { Leadership } from "@/components/Leadership";
import { TeamRow } from "@/components/TeamRow";
import { Cta2 } from "@/components/comp2/Cta2";
import { Footer2 } from "@/components/comp2/Footer2";

export const metadata: Metadata = { title: "MWC | Comp 3" };

// Design comp 3 (Figma "Homepage" 583:2219). Hero is comp 2's; client
// resources, leadership, team, CTA and footer are shared with comps 1 and 2.
export default function Comp3() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero2 fullHeight description="The experience to run complex capital projects." />
        <IndustryCards />
        <WorkstreamTimeline />
        <Metrics3 />
        <TrustedBy label={false} className="mt-6 lg:mt-u-24" />
        <ClientResources />
        <Leadership />
        <TeamRow className="pt-24 lg:pt-u-160" />
        <Cta2 />
      </main>
      <Footer2 />
    </>
  );
}
