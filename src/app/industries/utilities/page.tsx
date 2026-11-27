import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { AboutQuote } from "@/components/about/About";
import { Cta4 } from "@/components/comp4/Cta4";
import { CaseStudy, IndustryHeroMinimal, ProblemSection, RowsSection, ServicesSection } from "@/components/industries/IndustrySections";
import { UtilitiesSceneMinimal } from "@/components/industries/UtilitiesSceneMinimal";

export const metadata: Metadata = {
  title: "Utility Project Management Services | MWC",
  description: "Utility project management, construction management and project controls for electric, natural gas and water utilities.",
};

// Industries: Utilities (copy: "MWC Website Content 2"), built from the same
// blocks as Power Producers.
export default function UtilitiesPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHeroMinimal
          title="Utility Project Management for Electric, Natural Gas and Water Utilities"
          intro="Utility project management, construction management and project controls for electric, natural gas and water utilities."
          scene={<UtilitiesSceneMinimal className="h-full w-full" />}
          band={["Electric, Gas and Water", "Program Management", "Permitting", "Project Controls", "Service Coordination"]}
        />

        <AboutQuote
          quote="The MWC team runs smoothly and integrates exceptionally well with our internal teams and contractors. They understand our processes, manage personalities effectively, and keep projects moving even when conditions change. Their presence reduces risk and increases confidence across the job."
          by="Project Manager – Utility Capital Projects"
          spacing="pt-24 lg:pt-u-200"
        />

        <ProblemSection
          id="capital-heading"
          stack
          heading={["Turn More Authorized", "Capital Into Completed Work"]}
          body={[
            "Load growth and commission-mandated programs are adding projects faster than you can hire. Late requests for proposals carry dollars over, permits stall and service requests back up.",
          ]}
          lead="MWC project managers, schedulers and construction managers join your team, work in your systems and are funded from the capital budget, not operations and maintenance:"
          items={[
            {
              lead: "Procurement a Year Ahead",
              stack: "procure",
              text: "Requests for proposals are standardized and run in the prior fiscal year, so contractors are ready to start in January.",
            },
            {
              lead: "Permitting by Jurisdiction",
              stack: "permit",
              text: "Schedules use permit and inspection durations specific to each town and county, and every submittal and inspection is managed.",
            },
            {
              lead: "Integrated Cost and Schedule",
              stack: "schedule",
              text: "Schedules in Primavera P6 or Microsoft Project are tied to monthly forecasts and accruals, reported in dashboards your leadership and the commission can use.",
            },
            {
              lead: "Your Systems, Not New Ones",
              stack: "systems",
              text: "Work runs inside PowerPlan, Power BI, PowerClerk, Oracle Customer Care and Billing and Procore.",
            },
          ]}
        />

        <CaseStudy
          id="case-heading"
          heading={["90% of Authorized", "Capital Delivered"]}
          body={[
            "An electric utility’s customer programs group had a manager, a supervisor and one coordinator, with no project schedules or project-level cost control. Commission-mandated charging, solar and distributed energy programs were falling behind, and budgets sat largely unspent by October. MWC stood up a program management office across hundreds of projects and taught the client team to run accruals. Construction managers verified field work through daily logs in Procore.",
          ]}
          metrics={[
            { value: "90%", text: "20% to 90% of annual authorization spent" },
            { value: "30-45", text: "Permitting cut from three months to 30-45 days" },
            { value: "$60-$70M", text: "$60-$70M delivered, including 150+ Level 2 chargers, five fast charging sites and a dual-feed microgrid for a municipal wastewater system" },
          ]}
          link={{ label: "See the Results", href: "/resources/after-action-reports/commission-mandated-customer-programs" }}
        />

        <RowsSection
          id="results-heading"
          heading={["Results Across Generation,", "Grid and Water"]}
          items={[
            {
              lead: "Coal Ash Closure",
              icon: "ashpond",
              text: "A nearly $500M obligation across two plants and two state regulators was packaged into a 10-year plan with correct cost shares for each co-owner.",
              link: { label: "See the Results", href: "/resources/after-action-reports/coal-ash-closure-program" },
            },
            {
              lead: "Service Coordination",
              icon: "service",
              text: "Service request times fell from 12 to 14 weeks to 6 to 8 weeks, with each coordinator carrying 60 to 120 active work orders.",
              link: { label: "See the Results", href: "/resources/after-action-reports/service-coordination-backlog" },
            },
            {
              lead: "Water and Storage",
              icon: "water",
              text: "Schedule updates on three 10-year programs moved from every other month to monthly, delivered on time.",
              link: { label: "See the Results", href: "/resources/after-action-reports/multi-agency-water-storage" },
            },
          ]}
          related={{
            label: "Related Projects",
            links: [
              { label: "Electric Vehicle Charging and Demand-Side Management", href: "/projects/electric-vehicle-charging" },
              { label: "Transmission, Distribution and Substations", href: "/projects/transmission-distribution" },
              { label: "Power Generation", href: "/projects/power-generation" },
            ],
          }}
        />

        <ServicesSection
          id="services-heading"
          heading={["From Procurement", "to Energization"]}
          more={{ label: "Compare All Services", href: "/all-services" }}
          groups={[
            {
              label: "Field Execution",
              items: [
                {
                  lead: "Construction Management",
                  text: "Contractor progress, inspections, quality and change orders are tracked from mobilization to energization.",
                  href: "/services/construction-management",
                },
                {
                  lead: "Utility and Interconnection Coordination",
                  text: "Coordinators complete 10 to 12 field walks a day, size services and coordinate electricians, builders, inspectors and line crews.",
                  href: "/services/utility-interconnection-coordination",
                },
              ],
            },
            {
              label: "Cost and Schedule Control",
              items: [
                {
                  lead: "Project Controls and Scheduling",
                  text: "Baseline schedules, critical path management, monthly forecasts, accruals and variance reporting.",
                  href: "/services/project-controls-scheduling",
                },
              ],
            },
            {
              label: "Reporting and Escalation",
              items: [
                {
                  lead: "Project and Program Management",
                  text: "A program management office reports scope, cost, schedule and risk across every project in the portfolio.",
                  href: "/services/project-program-management",
                },
              ],
            },
          ]}
        />

        <AboutQuote
          dark
          gap="mt-20 lg:mt-u-104"
          quote="MWC’s scheduling work has been recognized at the highest levels of leadership. Their ability to recover schedules, align stakeholders, and maintain critical path integrity under pressure directly contributes to on-time delivery."
          by="Senior Stakeholder – Scheduling & Planning"
        />

        <Cta4 flush heading={["Planning Your Next", "Program Year?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
