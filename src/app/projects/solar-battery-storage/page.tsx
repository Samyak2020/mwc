import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";
import { StoryHero, StoryIntro, StoryLinks, StoryPoints, StoryRecordList } from "@/components/industries/StorySections";
import { SOLAR_RECORDS } from "@/components/industries/projectPagesData";

export const metadata: Metadata = {
  title: "Solar Construction Management and BESS Construction | MWC",
  description: "Solar construction management and BESS construction: owner’s representation, project controls and commissioning support.",
};

// Projects (copy: "MWC Website Content 2", word for word and in its order), on
// the Power Generation template. With two records and no stages, the records sit
// in place (StoryRecordList) rather than on the pinned timeline. Photographs
// are placeholders until project images are supplied.
export default function SolarBatteryStoragePage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <StoryHero
          title={["Solar Construction Management","and BESS Construction"]}
          band={["Solar construction","Battery energy storage","Notice to proceed","Interconnection","Commercial operation"]}
        />

        <StoryIntro text="Every solar or storage project is approved with a budget, a schedule and an interconnection date, and many of the decisions that affect all three are made during construction. MWC places a senior construction manager or owner’s representative on site from notice to proceed through commercial operation. They work with your engineering, procurement and construction contractor to verify progress before each payment, review changes against the contract and close turnover documentation." />

        <StoryPoints
          id="spec-heading"
          label="Built to Spec From Notice to Proceed to Commercial Operation"
          points={[
            { lead: "Constructability", text: "Designs are reviewed before work is sequenced." },
            { lead: "Long-lead equipment", text: "Module, inverter and transformer deliveries are tracked against the schedule." },
            { lead: "Installed work", text: "Work is inspected as it goes in, and milestones are verified before payment." },
            { lead: "Interconnection", text: "The utility’s milestones and the contractor’s sit on one calendar, with one-lines, protection schemes and controls reviewed before construction." },
            { lead: "Turnover", text: "Punch lists, warranties and as-built documentation are closed before handover." },
          ]}
        />

        <StoryRecordList id="records-heading" heading={["Solar and Storage","Experience"]} records={SOLAR_RECORDS} />

        <StoryLinks
          lists={[
            {
              label: "Services",
              links: [
                { label: "Owner’s Representative", href: "/services/owners-representative" },
                { label: "Construction Management", href: "/services/construction-management" },
                { label: "Utility and Interconnection Coordination", href: "/services/utility-interconnection-coordination" },
                { label: "See All Services", href: "/all-services" },
              ],
            },
            {
              label: "Industries",
              links: [
                { label: "Power Producers", href: "/industries/power-producers" },
                { label: "Commercial, Industrial and General Contractors", href: "/industries/commercial-industrial" },
              ],
            },
          ]}
        />

        <Cta4 heading={["Planning a Solar","or Storage Build?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
