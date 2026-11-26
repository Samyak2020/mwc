import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";
import { StoryHero, StoryIntro, StoryLinks, StoryPoints, StoryRecordList } from "@/components/industries/StorySections";
import { MICROGRID_RECORDS } from "@/components/industries/projectPagesData";

export const metadata: Metadata = {
  title: "Microgrid Project Management and Construction | MWC",
  description: "Microgrid project management for critical facilities: switchgear, backup generation, utility coordination and commissioning.",
};

// Projects (copy: "MWC Website Content 2", word for word and in its order), on
// the Power Generation template. With one record and no stages, the records sit
// in place (StoryRecordList) rather than on the pinned timeline. Photographs
// are placeholders until project images are supplied.
export default function MicrogridsPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <StoryHero
          title={["Microgrid Project Management","for Critical Facilities"]}
          band={["Microgrids","Critical facilities","Switchgear tie-ins","Backup generation","Utility coordination"]}
        />

        <StoryIntro text="The most demanding part of a microgrid is the cutover: connecting new switchgear and generation while the facility keeps running. MWC plans each tie-in with your operations team and coordinates the dual-feed design and energization with the serving utility." />

        <StoryPoints
          id="cutover-heading"
          label="Critical Loads Energized Through Every Cutover"
          points={[
            { lead: "Switchgear tie-ins", text: "Cutovers are sequenced with facility operations so critical loads stay energized." },
            { lead: "Backup fuel selection", text: "Fuel is chosen for permitted run hours. Natural gas can often be permitted for more hours than diesel." },
            { lead: "Utility coordination", text: "Dual-feed design and energization are coordinated with the serving utility’s requirements." },
          ]}
        />

        <StoryRecordList id="records-heading" records={MICROGRID_RECORDS} />

        <StoryLinks
          lists={[
            {
              label: "Services",
              links: [
                { label: "Owner’s Representative", href: "/services/owners-representative" },
                { label: "Utility and Interconnection Coordination", href: "/services/utility-interconnection-coordination" },
                { label: "See All Services", href: "/all-services" },
              ],
            },
            {
              label: "Industries",
              links: [
                { label: "Commercial, Industrial and General Contractors", href: "/industries/commercial-industrial" },
                { label: "Utilities", href: "/industries/utilities" },
              ],
            },
          ]}
        />

        <Cta4 heading={["Planning Backup Power for","a Critical Facility?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
