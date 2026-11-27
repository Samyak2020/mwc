import type { ProjectRecord } from "./ProjectSections";

// Projects: Power Generation, the four project records (copy: "MWC Website
// Content 2", verbatim). Shared by the page and its story-layout draft.
export const POWER_GEN_RECORDS: ProjectRecord[] = [
  {
    id: "operate-heading",
    image: { src: "/projects/power-generation/operate.jpg", alt: "An MWC field lead at a valve rack in a combined cycle plant" },
    stage: "Operate",
    title: "Turbine Overhauls at a Supercritical Coal Plant",
    icon: "overhaul",
    facts: [
      { term: "Owner", text: "Investor-owned utility" },
      { term: "Scope", text: "Major and minor turbine overhauls inside fixed outage windows" },
      {
        term: "MWC’s Role",
        text: "Turbine technical advisors on both 12-hour shifts, an integrated turbine schedule, project controls, safety management and material coordination",
      },
      {
        term: "Result",
        text: "About $5M in claimed change orders per outage resolved at roughly 20% of what was submitted, once the disputed work was confirmed as part of the contracted scope. There were zero safety incidents on the turbine scope, and one project controls engagement in 2017 grew to more than 25 task orders at the plant.",
      },
    ],
    workstreams: [
      { label: "Project Scheduling", href: "/services/project-controls-scheduling" },
      { label: "Safety Management", href: "/services/safety-management" },
      { label: "Project Coordination", href: "/services/project-coordination" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/turbine-overhaul-accountability" },
  },
  {
    id: "upgrade-heading",
    image: { src: "/projects/power-generation/upgrade.jpg", alt: "Two MWC team members walking beside a heat recovery steam generator and its stacks" },
    stage: "Upgrade",
    title: "Sustaining Capital at Two Combined Cycle Plants",
    icon: "combined",
    facts: [
      { term: "Owner", text: "Independent power producer" },
      { term: "Scope", text: "17+ projects, including turbine uprates, exhaust upgrades, generator and controls upgrades, and fire protection" },
      { term: "MWC’s Role", text: "Scope development, estimating, bids, construction work packages and field construction management" },
      {
        term: "Result",
        text: "One exhaust upgrade finished about 32% under budget. When a supplier couldn’t rebuild relief valves mid-outage, the team changed course and still finished on time.",
      },
    ],
    workstreams: [
      { label: "Owner’s Representative", href: "/services/owners-representative" },
      { label: "Construction Management", href: "/services/construction-management" },
      { label: "Engineering Services", href: "/services/engineering-services" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/sustaining-capital-owners-representative" },
  },
  {
    id: "close-heading",
    image: { src: "/projects/power-generation/close.jpg", alt: "Two MWC leads checking a barricaded excavation at a plant" },
    stage: "Close",
    title: "Coal Ash Closure at Two Retiring Plants",
    icon: "ashpond",
    facts: [
      { term: "Owner", text: "Investor-owned utility with co-owners" },
      { term: "Scope", text: "Pond closures, a bottom ash monofill, dewatering, and monitoring and extraction wells" },
      {
        term: "MWC’s Role",
        text: "Program management, coordination with the engineer of record, contractor bids, and field checks on production rates, dust control and compaction testing",
      },
      { term: "Result", text: "Extraction wells installed, dewatering underway, and standardized piping layouts that lower long-term maintenance cost" },
    ],
    workstreams: [
      { label: "Project Management", href: "/services/project-program-management" },
      { label: "Engineering Services", href: "/services/engineering-services" },
      { label: "Construction Management", href: "/services/construction-management" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/coal-ash-closure-program" },
  },
  {
    id: "demolish-heading",
    image: { src: "/projects/power-generation/demolish.jpg", alt: "An MWC lead walking a plant yard past its storage tanks" },
    stage: "Demolish",
    title: "Independent Oversight of a Coal Plant Demolition",
    icon: "demolition",
    facts: [
      { term: "Owner", text: "County board of commissioners" },
      { term: "Scope", text: "Removal of every above-grade structure to prevailing grade" },
      { term: "MWC’s Role", text: "Independent technical advisor, tracking every waste stream and certifying completion" },
      { term: "Result", text: "About 751 tons of asbestos abatement and 161,000 tons of recycled ferrous metal tracked to final destination" },
    ],
    workstreams: [
      { label: "Owner’s Representative", href: "/services/owners-representative" },
      { label: "Project Coordination", href: "/services/project-coordination" },
      { label: "Power Plant Decommissioning", href: "/services/power-plant-decommissioning" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/coal-plant-demolition-oversight" },
  },
];
