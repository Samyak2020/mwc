import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { Cta4 } from "@/components/comp4/Cta4";
import { CaseStudy, IndustryHeroMinimal, ServicesSection } from "@/components/industries/IndustrySections";
import { SafetyMobilizeBand, TimelineSection } from "@/components/industries/IndustryLayouts";
import { OilSceneMinimal } from "@/components/industries/IndustryScenes";

export const metadata: Metadata = {
  title: "Oil and Gas Turnaround Planning | MWC",
  description: "Turnaround planning, construction management and safety oversight for upstream, midstream and downstream oil and gas.",
};

// Industries: Oil and Gas (copy: "MWC Website Content 2"). Built around the
// shutdown window: the five commitments sit on a timeline of before, during
// (the fixed window, shaded) and startup; the case study follows; safety and
// mobilization share a navy band with the figures behind them. No testimonial
// in the doc, so no quotes. The doc's bracketed note for Andrew is left out.
export default function OilGasPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHeroMinimal
          title="Turnaround Planning and Project Management for Oil and Gas"
          intro="Turnaround planning, construction management and safety oversight for upstream, midstream and downstream oil and gas."
          scene={<OilSceneMinimal className="h-full w-full" />}
          band={["Turnarounds", "Upstream, midstream and downstream", "Shutdown planning", "Owner-side control", "Safety oversight"]}
        />

        <TimelineSection
          id="team-heading"
          heading={["One Team From Work", "Package to Startup"]}
          body="On most shutdowns, planning and execution change hands, and the owner reviews contractor invoices after the fact. MWC keeps the same team from first work package review through startup. Technical advisors with 20+ years as manufacturer field engineers work on your side, so scope, change orders and time and material claims are challenged by people who know the equipment as well as the contractor does."
          phases={[
            {
              span: 1,
              items: [
                {
                  lead: "Long-lead parts ordered early",
                  text: "Prior inspection findings and outage reports are reviewed so parts are identified and ordered well before shutdown.",
                },
              ],
            },
            {
              span: 3,
              items: [
                {
                  lead: "Owner-side presence on both shifts",
                  text: "Advisors and construction managers cover day and night shifts and attend every shift change and outage meeting.",
                },
                {
                  lead: "Claims checked the same day",
                  text: "Time and material sheets are reconciled against actual headcount and work performed before they become disputes.",
                },
                {
                  lead: "Delays explained in real time",
                  text: "When the schedule slips, plant staff and leadership see the cause and impact as it happens, through an integrated Primavera P6 schedule reported through your control center.",
                },
              ],
            },
            {
              span: 1,
              items: [{ lead: "Capacity without permanent staff", text: "The team scales up for the shutdown and steps back down at startup." }],
            },
          ]}
        />

        <CaseStudy
          id="case-heading"
          heading={["Owner-Side Control on", "Fixed-Window Shutdowns"]}
          body={[
            "When many contractors share one site and the window can’t move, the owner needs someone checking the work and the invoices every day. MWC attends every shift change and outage meeting, reviews daily reports and time and material sheets against actual headcount, and challenges any claimed change already covered by the contract.",
          ]}
          metrics={[
            { value: "$5M", text: "About $5M in claimed manufacturer change orders per outage, negotiated down to roughly 20 percent of what was submitted" },
            { value: "0", text: "Zero safety incidents on turbine overhaul scope" },
            { value: "5", text: "Five completed combined cycle projects finished inside their outage windows" },
          ]}
          link={[
            { label: "See the Turbine Overhaul Results", href: "/resources/after-action-reports/turbine-overhaul-accountability" },
            { label: "See the Sustaining Capital Results", href: "/resources/after-action-reports/sustaining-capital-owners-representative" },
          ]}
        />

        <SafetyMobilizeBand
          safety={{
            id: "safety-heading",
            heading: ["Safety Management", "for High-Hazard Work"],
            body: "MWC safety managers work inside your site safety program and hold each contractor to it. Coverage is matched to your shift plan, including night shift when the work requires it. On coal ash closure work, every MWC team member held 30-hour Occupational Safety and Health Administration training. Safe positioning around heavy haul equipment was enforced in the field.",
            link: { label: "Strengthen Contractor Safety", href: "/services/construction-safety-management" },
          }}
          mobilize={{
            id: "mobilizing-heading",
            heading: ["Mobilizing", "Nationwide"],
            body: "Support scales from one scheduler to a full turnaround team and steps back down at startup. For operators with published supplier diversity targets, work awarded to a certified service-disabled veteran-owned small business can count toward them.",
          }}
        />

        <ServicesSection
          id="services-heading"
          heading={["How MWC Supports", "Your Turnaround"]}
          more={{ label: "Compare All Services", href: "/all-services" }}
          groups={[
            {
              label: "Field Execution",
              items: [
                {
                  lead: "Plant Outage Planning and Management",
                  text: "Scope freeze, work package readiness, contractor sequencing and startup planning.",
                  href: "/services/plant-outage-planning",
                },
                {
                  lead: "Construction Management",
                  text: "Daily contractor oversight, time and material verification and change order review.",
                  href: "/services/construction-management",
                },
                {
                  lead: "Construction Safety Management",
                  text: "Contractor safety oversight matched to your shift plan.",
                  href: "/services/construction-safety-management",
                },
              ],
            },
            {
              label: "Cost and Schedule Control",
              items: [
                {
                  lead: "Project Controls and Scheduling",
                  text: "Critical path schedules, daily progress updates and cost-to-complete forecasts.",
                  href: "/services/project-controls-scheduling",
                },
              ],
            },
            {
              label: "Reporting and Escalation",
              items: [
                {
                  lead: "Owner’s Representative",
                  text: "One accountable lead reports schedule, cost and risk to operations leadership.",
                  href: "/services/owners-representative",
                },
              ],
            },
          ]}
        />

        <Cta4 heading={["Planning Your Next", "Turnaround?"]} />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
