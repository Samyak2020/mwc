import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Cta4 } from "@/components/comp4/Cta4";
import { Footer2 } from "@/components/comp2/Footer2";
import { StoryHero, StoryIntro, StoryLinks, StoryPoints, StoryRecords } from "@/components/industries/StorySections";
import { POWER_GEN_RECORDS } from "@/components/industries/powerGenerationData";

export const metadata: Metadata = {
  title: "Power Plant Project Management and Outage Management | MWC",
  description: "Power plant project management, outage management and decommissioning oversight for coal, gas and combined cycle plants.",
};

// Projects: Power Generation (copy: "MWC Website Content 2"), laid out as an
// editorial story after letsgrowcanada.ca's story pages.
// Copy is the doc's, word for word and in its order. Photographs are from
// MWC's field library (an SRP Phoenix West plant visit), not these projects.
export default function PowerGenerationPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <StoryHero
          title={["Power Plant Project Management", "for Coal, Gas and Combined", "Cycle Plants"]}
          image={{ src: "/projects/power-generation/hero.jpg", alt: "Two MWC leads on site at a combined cycle plant" }}
          band={["Power generation", "Outage management", "Turbine overhauls", "Combined cycle upgrades", "Coal ash closure", "Plant demolition"]}
        />

        <StoryIntro text="Plant projects run best when plant staff, the manufacturer and contractors work from one schedule, one scope and one set of facts. MWC project managers, schedulers and construction managers work beside your plant staff every day to make that happen, from the first outage scope through final site restoration." />

        <StoryPoints
          id="plant-heading"
          label="Plant Projects"
          points={[
            {
              lead: "Scope and change review",
              text: "Daily time and material sheets and change requests are reviewed with the contractor against the contracted scope, so questions are settled while the work is fresh.",
            },
            {
              lead: "Parts planning",
              text: "Prior outage reports and inspection findings are reviewed so long-lead parts are ordered well before the unit comes down.",
            },
            {
              lead: "Schedule integration",
              text: "Each contractor schedule is built in Primavera P6 and integrated with the plant’s master outage and capital schedule.",
            },
            {
              lead: "Approval thresholds",
              text: "Reauthorization limits are tracked by site, since one co-owned plant may require approval at 10% over and another at 20%.",
            },
          ]}
        />

        <StoryRecords id="records-heading" heading={["From Turbine Overhaul", "to Final Grade"]} records={POWER_GEN_RECORDS} />

        <StoryLinks
          lists={[
            {
              label: "Services",
              links: [
                { label: "Plant Outage Planning and Management", href: "/services/plant-outage-planning" },
                { label: "Power Plant Decommissioning", href: "/services/power-plant-decommissioning" },
                { label: "See All Services", href: "/all-services" },
              ],
            },
            {
              label: "Industries",
              links: [
                { label: "Power Producers", href: "/industries/power-producers" },
                { label: "Utilities", href: "/industries/utilities" },
              ],
            },
          ]}
        />

        <Cta4 heading={["Planning an Outage,", "Upgrade or Retirement?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
