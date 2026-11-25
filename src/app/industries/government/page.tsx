import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { AboutQuote } from "@/components/about/About";
import { Cta4 } from "@/components/comp4/Cta4";
import { IndustryHeroMinimal, ProblemSection, ServicesSection } from "@/components/industries/IndustrySections";
import { CaseStack, CredentialPanel } from "@/components/industries/IndustryLayouts";
import { GovernmentSceneMinimal } from "@/components/industries/IndustryScenes";

export const metadata: Metadata = {
  title: "SDVOSB Project Management for Government | MWC",
  description: "SDVOSB project management and independent oversight for federal, state, local and tribal infrastructure projects.",
};

// Industries: Government (copy: "MWC Website Content 2"). Laid out for a
// procurement reader: the oversight method as the pinned stack, then the two
// public programmes as stacked case panels, each with its own drawing, the
// services, and the contracting credentials before the close.
export default function GovernmentPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHeroMinimal
          title="SDVOSB Project Management for Federal, State and Local Government"
          intro="SDVOSB project management and independent oversight for federal, state, local and tribal infrastructure projects."
          scene={<GovernmentSceneMinimal className="h-full w-full" />}
          band={["SDVOSB certified", "Independent oversight", "Federal, state and local", "Board-ready reporting", "Multiyear schedules"]}
        />

        <AboutQuote quote="MWC is a reliable, high-trust partner for complex utility and capital projects." spacing="pt-24 lg:pt-u-200" />

        <ProblemSection
          id="verification-heading"
          stack
          heading={["Independent Verification", "Your Board Can Defend"]}
          body={[
            "When a utility, developer or contractor performs work under your agency’s authority, your board answers for the result. Deciding whether a demolition plan, waste disposal record or schedule meets the requirement takes engineering and field experience that few agencies keep on staff.",
          ]}
          lead="MWC provides independent oversight as your technical advisor:"
          items={[
            { lead: "Define completion", stack: "completion", text: "The final site condition is set at the start, so done means the same thing to every party." },
            {
              lead: "Track the waste",
              stack: "waste",
              text: "The responsible party must report where asbestos, hazardous waste, recyclables and demolition debris go.",
            },
            {
              lead: "Review and report",
              stack: "report",
              text: "MWC reviews monthly reports, holds regular update meetings and briefs elected officials at public meetings.",
            },
            {
              lead: "Certify on the record",
              stack: "certify",
              text: "Completion is certified only after review of the completion report, inspection records and regulatory correspondence.",
            },
          ]}
        />

        <CaseStack
          cases={[
            {
              id: "case-heading",
              heading: ["Independent Oversight of", "a Coal Plant Demolition", "for a County Board"],
              icon: "demolition",
              figures: [
                { value: "230", text: "About 230 acres demolished to prevailing grade" },
                { value: "19,076", text: "19,076 tons across 914 truckloads tracked to the county landfill" },
                { value: "3 + 8", text: "Closure of 3 underground and 8 aboveground storage tanks tracked" },
              ],
              body: "When a utility retired a large coal plant, a county ordinance required every above-grade structure to be removed to grade under a board-approved plan. Much of the waste was headed to the county’s own landfill. Through competitive selection, the county board chose MWC as its independent technical advisor.",
              link: { label: "See the Results", href: "/resources/after-action-reports/san-juan-generating-station-oversight" },
            },
            {
              id: "federal-heading",
              heading: ["One Schedule Shared", "Across Federal Partners"],
              icon: "federal",
              body: "A water utility’s dam raise, pumped storage and pipeline programs required constant coordination with the Bureau of Reclamation and U.S. Forest Service through environmental studies, easements and funding decisions. MWC built 10-year schedules in the native format each federal partner required. The schedules were tied to the budget so leaders could see when funding thresholds and fiscal year commitments would fall. One action log, recording an owner, due date and status for each item, went to every party after every meeting.",
              link: { label: "See the Results", href: "/resources/after-action-reports/multi-agency-water-storage" },
            },
          ]}
        />

        <ServicesSection
          id="services-heading"
          spacing="pt-28 lg:pt-u-160"
          heading={["Verification, Schedules and", "Reporting for Public Programs"]}
          more={{ label: "Compare All Services", href: "/all-services" }}
          groups={[
            {
              label: "Field Execution",
              items: [
                {
                  lead: "Power Plant Decommissioning",
                  text: "Independent review covers demolition, abatement, waste tracking, storage tank and pond closures, and final site condition.",
                  href: "/services/power-plant-decommissioning",
                },
                {
                  lead: "Owner’s Representative",
                  text: "Your agency’s requirements are enforced with contractors and developers from plan review through final acceptance.",
                  href: "/services/owners-representative",
                },
              ],
            },
            {
              label: "Cost and Schedule Control",
              items: [
                {
                  lead: "Project Controls and Scheduling",
                  text: "Multiyear schedules are delivered in the formats federal and state partners require, with budget and funding milestones linked.",
                  href: "/services/project-controls-scheduling",
                },
              ],
            },
            {
              label: "Reporting and Escalation",
              items: [
                {
                  lead: "Project and Program Management",
                  text: "Action logs, change summaries and board-ready reporting support multi-agency programs.",
                  href: "/services/project-program-management",
                },
              ],
            },
          ]}
        />

        <CredentialPanel
          link={{ label: "Download the Capability Statement", href: "/resources/capability-statements" }}
          facts={[
            {
              value: "Service-disabled veteran-owned small business (SDVOSB), certified by the U.S. Small Business Administration and eligible for federal set-aside contracts",
            },
            { label: "Unique Entity Identifier", value: "U9WJDCH3V369" },
            { label: "Commercial and Government Entity code", value: "96A46" },
            { value: "Registered in SAM.gov" },
          ]}
        />

        <AboutQuote dark quote="We know the level of quality we get when we use MWC." />

        <Cta4 flush heading={["Overseeing a Plant Retirement", "or Public Capital Program?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
