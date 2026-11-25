import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { AboutQuote } from "@/components/about/About";
import { Cta4 } from "@/components/comp4/Cta4";
import { IndustryHeroMinimal, ProblemSection } from "@/components/industries/IndustrySections";
import { AudienceRouter, OwnerChecklist, ProofSheet } from "@/components/industries/IndustryLayouts";
import { CommercialSceneMinimal } from "@/components/industries/IndustryScenes";

export const metadata: Metadata = {
  title: "Construction Project Management Firm | MWC",
  description: "Construction project management and owner’s representation for commercial and industrial owners and general contractors.",
};

// Industries: Commercial, Industrial and General Contractors (copy: "MWC
// Website Content 2"). Two readers, so the page names both right after the
// hero and lets each jump to their part: facility owners get the pinned stack
// and the microgrid proof sheet; general contractors get the checklist of what
// owners write into the contract, ticked off, then the services that pass it.
export default function CommercialIndustrialPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHeroMinimal
          title="Construction Project Management for Commercial and Industrial Projects"
          intro="Construction project management and owner’s representation for commercial and industrial owners and general contractors."
          scene={<CommercialSceneMinimal className="h-full w-full" />}
          band={["Facility owners", "General contractors", "Shutdown planning", "Utility coordination", "Project controls"]}
        />

        <AudienceRouter
          audiences={[
            { title: "Facility Owners", text: "Construction That Keeps Production Running", href: "#production-heading-top" },
            { title: "General Contractors", text: "Project Staff Who Know What Owners Check", href: "#contractors-heading" },
          ]}
        />

        <AboutQuote
          quote="If execution weren’t going well, we wouldn’t be talking about next-stage strategies. MWC helped stabilize delivery, improve coordination, and give us confidence to plan ahead instead of reacting."
          by="Industrial Client – Program Execution"
          spacing="pt-24 lg:pt-u-200"
        />

        <ProblemSection
          id="production-heading"
          stack
          heading={["Construction That Keeps", "Production Running"]}
          body={[
            "New switchgear, backup generation, on-site solar, battery storage or a second utility feed all require work next to equipment that has to keep running. Tie-ins need planned shutdowns. Contractors need access routes that stay clear of operations, and the serving utility sets its own interconnection timeline.",
          ]}
          lead="MWC works as your owner’s representative and coordinates directly with plant operations:"
          items={[
            {
              lead: "Shutdown planning",
              stack: "shutdown",
              text: "Tie-ins and outages are scheduled with your operations team and sequenced around production.",
            },
            { lead: "Contractor access", stack: "access", text: "Work areas, laydown and access are planned to protect existing equipment." },
            {
              lead: "Utility coordination",
              stack: "utility",
              text: "Service applications, interconnection and energization are managed with the serving utility.",
            },
            {
              lead: "Backup generation",
              stack: "generator",
              text: "Fuel choices are evaluated against permitted run hours. Natural gas can often be permitted for more hours than diesel.",
            },
          ]}
        />

        <ProofSheet
          body="For a utility’s customer programs, MWC managed a dual-feed microgrid with new switchgear and backup generation for a municipal wastewater treatment system. The system kept operating throughout the work."
          link={{ label: "See the Full Results", href: "/resources/after-action-reports/commission-mandated-customer-programs" }}
          lists={[
            {
              label: "Services for Facility Owners",
              links: [
                { label: "Owner’s Representative", href: "/services/owners-representative" },
                { label: "Construction Management", href: "/services/construction-management" },
                { label: "Utility and Interconnection Coordination", href: "/services/utility-interconnection-coordination" },
              ],
            },
            {
              label: "Related Projects",
              links: [
                { label: "Microgrids", href: "/projects/microgrids" },
                { label: "Solar and Battery Energy Storage", href: "/projects/solar-battery-storage" },
              ],
            },
          ]}
        />

        <OwnerChecklist
          id="contractors-heading"
          heading={["Project Staff Who Know", "What Owners Check"]}
          body={[
            "Owners write their requirements into the contract, including baseline schedules in their format, monthly updates, daily reports, site-specific safety plans and closeout documentation. When your bench is spread across several jobs, a late submittal or rejected schedule update can hold up payment for the next phase.",
            "MWC places project managers, schedulers and safety managers on your team for the length of the job. Because MWC usually works on the owner’s side as owner’s representative, its people know what owners check in a schedule update, a pay application or a safety plan, and they build your deliverables to pass that review the first time. They work in your systems and report to your project leadership.",
          ]}
          list={{
            label: "Services for General Contractors",
            links: [
              { label: "Project Controls and Scheduling", href: "/services/project-controls-scheduling" },
              { label: "Construction Safety Management", href: "/services/construction-safety-management" },
              { label: "Project and Program Management", href: "/services/project-program-management" },
              { label: "See All Services", href: "/all-services" },
            ],
          }}
        />

        <AboutQuote
          dark
          quote="Safety is not a checkbox for MWC—it’s embedded in how they lead. Their safety managers adapt to operational realities, provide continuous coverage, and reinforce a culture where compliance and productivity coexist."
          by="Safety / Operations Leadership"
        />

        <Cta4 flush heading={["Planning Work Inside an Operating", "Facility or Staffing Your Next Job?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
