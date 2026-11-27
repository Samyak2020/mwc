import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Hero2 } from "@/components/comp2/Hero2";
import { IndustryPanels } from "@/components/comp4/IndustryPanels";
import { FieldJourney } from "@/components/field/FieldJourney";
import { Metrics4 } from "@/components/comp4/Metrics4";
import { TrustedBy } from "@/components/TrustedBy";
import { Rise } from "@/components/motion/Rise";
import { ResourcesList } from "@/components/comp4/ResourcesList";
import { Leadership } from "@/components/Leadership";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";

export const metadata: Metadata = {
  title: "Owner’s Representative & Project Management | MWC",
  description:
    "Owner’s representative and project management for power producers, utilities, government, industrial and oil and gas projects. Veteran-led.",
};

// Design comp 4, accepted; v2 per Figma "Homepage comp 4 - v2" (728:1109) with
// the nav and logos from 733:1623. Hero is the full-height hero with a flat 45%
// overlay; industries are expanding photo panels; project support is the field
// journey (dark, as at /lab/field). The team row is gone in v2.
export default function Home() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <Hero2 left description="The experience to run complex capital projects." />
        <IndustryPanels />
        <FieldJourney soft intro />
        <Metrics4 />
        <Rise>
          <TrustedBy label={false} className="mt-16 lg:mt-u-108" />
        </Rise>
        <ResourcesList />
        <Leadership />
        <Cta4 />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
