import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Hero2 } from "@/components/comp2/Hero2";
import { IndustriesLight } from "@/components/comp4/IndustriesLight";
import { FieldJourney } from "@/components/field/FieldJourney";
import { Metrics4 } from "@/components/comp4/Metrics4";
import { TrustedBy } from "@/components/TrustedBy";
import { ResourcesList } from "@/components/comp4/ResourcesList";
import { Leadership } from "@/components/Leadership";
import { TeamRow } from "@/components/TeamRow";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";

export const metadata: Metadata = { title: "MWC | Comp 4" };

// Design comp 4 (Figma "Homepage" 639:4144, section 2 per 646:4583). Hero is
// comp 3's full-height hero with a flat 45% overlay; industries is comp 1's
// interaction on white; project support is the field journey (white
// version); leadership, team and footer are shared.
export default function Comp4() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero2 fullHeight flatOverlay description="The experience to run complex capital projects." />
        <IndustriesLight />
        <FieldJourney light />
        <Metrics4 />
        <TrustedBy label={false} className="mt-16 lg:mt-u-108" />
        <ResourcesList />
        <Leadership />
        <TeamRow className="pt-24 lg:pt-u-160" />
        <Cta4 />
      </main>
      <Footer2 />
    </>
  );
}
