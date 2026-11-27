import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";
import { StoryHero, StoryIntro, StoryLinks, StoryPoints, StoryRecordList } from "@/components/industries/StorySections";
import { EV_RECORDS } from "@/components/industries/projectPagesData";

export const metadata: Metadata = {
  title: "Electric Vehicle Charging Project Management | MWC",
  description: "Program management, permitting and construction oversight for utility electric vehicle charging and demand-side programs.",
};

// Projects (copy: "MWC Website Content 2", word for word and in its order), on
// the Power Generation template. With one record and no stages, the records sit
// in place (StoryRecordList) rather than on the pinned timeline. Photographs
// are placeholders until project images are supplied.
export default function ElectricVehicleChargingPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <StoryHero
          title={["Electric Vehicle Charging and","Demand-Side Management","Program Delivery"]}
          band={["Electric Vehicle Charging","Demand-Side Management","Program Delivery","Permitting","Field Verification"]}
        />

        <StoryIntro text="A charging program is hundreds of small construction projects, each with its own permit, customer and utility review. MWC runs them as one program, with an electrical designer who has worked inside utility service coordination and construction managers who confirm each site before closeout." />

        <StoryPoints
          id="sites-heading"
          label="Hundreds of Sites Run as One Program"
          points={[
            { lead: "Participant Engagement", text: "An escalation path built within the utility’s outreach rules keeps customers moving toward installation." },
            { lead: "Electrical Design", text: "Site designs are prepared to the utility’s own review standards." },
            { lead: "Field Verification", text: "Construction managers log daily progress in Procore and confirm installations before closeout." },
            { lead: "Long-Range Planning", text: "Equipment replacement is built into the forecast years ahead, including a request for proposal for fast charger replacement." },
          ]}
        />

        <StoryRecordList id="records-heading" records={EV_RECORDS} />

        <StoryLinks
          lists={[
            {
              label: "Services",
              links: [
                { label: "See All Services", href: "/all-services" },
              ],
            },
            {
              label: "Industries",
              links: [
                { label: "Utilities", href: "/industries/utilities" },
              ],
            },
          ]}
        />

        <Cta4 heading={["Planning Your Next","Program Filing?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
