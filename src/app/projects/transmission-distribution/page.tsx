import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";
import { StoryHero, StoryIntro, StoryLinks, StoryPoints, StoryRecordList } from "@/components/industries/StorySections";
import { TD_RECORDS } from "@/components/industries/projectPagesData";

export const metadata: Metadata = {
  title: "Transmission and Distribution Project Management | MWC",
  description: "Distribution service coordination, substation and transmission project support with field-trained coordinators and project controls.",
};

// Projects (copy: "MWC Website Content 2", word for word and in its order), on
// the Power Generation template. With one record and no stages, the records sit
// in place (StoryRecordList) rather than on the pinned timeline. Photographs
// are placeholders until project images are supplied.
export default function TransmissionDistributionPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <StoryHero
          title={["Transmission, Distribution and","Substation Project Management"]}
          band={["Transmission","Distribution","Substations","Service coordination","Field verification"]}
        />

        <StoryIntro text="Service coordination is skilled field work: sizing transformers, deciding on underground conversions and scheduling line crews around builders and inspectors. MWC’s program is led by a manager who came up through utility service coordination. New coordinators follow a 90-day training plan with quality review, so they work to your standards and processes from the start." />

        <StoryPoints
          id="service-requests-heading"
          label="Service Requests Sized, Scheduled and Energized"
          points={[
            { lead: "Field verification", text: "Coordinators complete 10 to 12 field walks a day and carry 60 to 120 active work orders each." },
            { lead: "Technical sizing", text: "The serving transformer is located, conductors and transformers are sized for new load, and overhead-to-underground conversions are decided in the field." },
            { lead: "Crew coordination", text: "Electricians, builders, designers, inspectors and line crews are scheduled around each request." },
            { lead: "Quality review", text: "Supervision and quality checks take that load off utility supervisors." },
          ]}
        />

        <StoryRecordList id="records-heading" records={TD_RECORDS} />

        <StoryLinks
          lists={[
            {
              label: "Services",
              links: [
                { label: "Utility and Interconnection Coordination", href: "/services/utility-interconnection-coordination" },
                { label: "Construction Management", href: "/services/construction-management" },
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

        <Cta4 heading={["Facing a Service Backlog","or Substation Deadline?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
