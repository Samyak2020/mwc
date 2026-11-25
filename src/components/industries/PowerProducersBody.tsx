import { AboutQuote } from "@/components/about/About";
import { Cta4 } from "@/components/comp4/Cta4";
import { CaseStudy, ProblemSection, RowsSection, ServicesSection } from "./IndustrySections";

// Power Producers page below the hero (copy: "MWC Website Content 2"), shared
// by the live page and the hero drafts.
export function PowerProducersBody() {
  return (
    <>
    <AboutQuote
      quote="During critical outages, MWC brought structure, accountability, and schedule discipline that kept the work focused and safe. Their construction managers and schedulers were proactive, detail-oriented, and trusted by both field crews and leadership."
      by="Outage / Construction Lead"
      spacing="pt-24 lg:pt-u-200"
    />

    <ProblemSection
      id="scopes-heading"
      stack
      heading={["Complete Scopes Before", "Contractors Mobilize"]}
      body={[
        "Each plant in your portfolio carries a sustaining capital list, an outage calendar and a budget your asset manager has to defend. A scope that goes to bid thin comes back as change orders after mobilization, inside a window tied to a return-to-service date.",
      ]}
      lead="MWC puts an owner’s representative at the plant to close those gaps:"
      items={[
        { lead: "Estimates in two stages", icon: "estimates", text: "Plus or minus 30% for future fiscal year planning, then plus or minus 20% for final approval." },
        {
          lead: "Contractor readiness", icon: "package",
          text: "Each contractor receives a construction work package, attends a pre-construction meeting and submits an execution plan before mobilizing.",
        },
        {
          lead: "Cost tracking during the outage", icon: "costs",
          text: "Commitments, actual costs and cost-to-complete are tracked by project and reported at the asset level.",
        },
      ]}
    />

    <RowsSection
      id="ownership-heading"
      heading={["Field Teams for Every", "Ownership Model"]}
      items={[
        {
          lead: "International owners", icon: "globe",
          text: "MWC puts experienced construction managers on your U.S. sites and reports in the format your head office expects, without adding headcount.",
        },
        {
          lead: "Fund-owned platforms", icon: "coins",
          text: "A project manager at your site verifies contractor progress, cost and schedule against the numbers your investment committee reviews.",
        },
        {
          lead: "New market developers", icon: "pylon",
          text: "Teams experienced with utility interconnection and commissioning give you execution capacity in a new market from the first week.",
        },
        {
          lead: "Storage developers", icon: "batteries",
          text: "One construction management and commissioning playbook, carried by the same team from site to site, keeps every project consistent.",
          link: { label: "Solar and Battery Energy Storage Projects", href: "/projects/solar-battery-storage" },
        },
        {
          lead: "Thermal operators", icon: "thermal",
          text: "MWC handles outage planning, turnaround construction management and sustaining capital delivery under long-term master service agreements.",
          link: { label: "Power Generation Projects", href: "/projects/power-generation" },
        },
      ]}
    />

    <CaseStudy
      id="case-heading"
      heading={["17 Projects, 2 Acquired Plants,", "1 Owner’s Representative"]}
      body={[
        "After acquiring two combined cycle plants, a North American independent power producer had more sustaining capital work than its staff could manage. The large engineering firm it had used before was seldom in the field. MWC took over scope development, estimating, engineering management, bids and field construction management for turbine uprates, generator and controls upgrades, fire protection and water treatment projects.",
        "The team flexed with the outage calendar, adding a night shift construction manager during outages and part-time project controls between them. When a supplier couldn’t rebuild relief valves mid-outage, MWC changed course and still finished on time.",
      ]}
      metrics={[
        { value: "0.6%", text: "5 projects totaling $9.0M finished within 0.6 percent of combined budget and inside their outage windows" },
        { value: "11%", text: "$30.7M forecast about 11% under budget, with contingency intact" },
        { value: "8.5%", text: "8.5% under authorized budget across completed and forecast work on $39.7M" },
      ]}
        link={{ label: "See the Results", href: "/resources/after-action-reports/sustaining-capital-owners-representative" }}
    />

    <ServicesSection
      id="services-heading"
      spacing="pt-36 lg:pt-u-280"
      heading={["From Scope Development", "to Return to Service"]}
      more={{ label: "Compare All Services", href: "/all-services" }}
      groups={[
        {
          label: "Field Execution",
          items: [
            { lead: "Owner’s Representative", text: "One lead carries each project from scope through bid, construction and closeout.", href: "/services/owners-representative" },
            {
              lead: "Plant Outage Planning and Management",
              text: "Scope freeze, parts identification from prior inspection findings, contractor sequencing and work package tracking are planned against your return-to-service date.",
              href: "/services/plant-outage-planning",
            },
            {
              lead: "Construction Management",
              text: "Daily field oversight covers progress, quality, change order review and turnover documentation.",
              href: "/services/construction-management",
            },
          ],
        },
        {
          label: "Cost and Schedule Control",
          items: [
            {
              lead: "Project Controls and Scheduling",
              text: "Baseline schedules in Primavera P6 are integrated with the plant’s master outage schedule, with monthly cost-to-complete forecasts by project.",
              href: "/services/project-controls-scheduling",
            },
          ],
        },
        {
          label: "Reporting and Escalation",
          items: [
            {
              lead: "Project and Program Management",
              text: "Portfolio dashboards show budget, commitments and variances across plants for asset managers and investment committees.",
              href: "/services/project-program-management",
            },
            {
              lead: "Utility and Interconnection Coordination",
              text: "Interconnection, service applications and energization are worked directly with the serving utility.",
              href: "/services/utility-interconnection-coordination",
            },
          ],
        },
      ]}
    />

    <AboutQuote
      dark
      gap="mt-20 lg:mt-u-104"
      quote="MWC’s forecasting and project controls capabilities are exceptional. Closing monthly forecasts within hundreds of dollars on large, complex programs is not typical and it has significantly improved our financial confidence and decision-making."
      by="Capital Planner / Financial Controls Manager"
    />

    <Cta4 flush heading={["Planning an Outage or", "Sustaining Capital Program?"]} />
    </>
  );
}
