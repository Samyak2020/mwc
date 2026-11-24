// Client Resources content: categories and the (placeholder) resource list.

export const categories = [
  "Brochure",
  "Case Studies",
  "Capability Statements",
  "Service Descriptions",
  "Workflows",
  "Articles",
] as const;
export type Category = (typeof categories)[number];

export type Resource = {
  title: string;
  summary: string;
  category: Category;
  date: string;
  meta: string;
  image: string;
};

export const resources: Resource[] = [
  {
    title: "MWC Company Brochure 2026",
    summary:
      "Who we are, the industries we serve and how our project leads support capital programs from planning to closeout.",
    category: "Brochure",
    date: "November 4, 2026",
    meta: "PDF · 12 pages",
    image: "/about-v2/hero.png",
  },
  {
    title: "Delivering a 230 kV Substation Upgrade on Schedule",
    summary:
      "How owner’s representation kept a utility substation upgrade on track through outages and design changes.",
    category: "Case Studies",
    date: "October 28, 2026",
    meta: "Case study",
    image: "/comp4v2/ind-utilities.png",
  },
  {
    title:
      "What Does an Owner’s Representative Actually Do on a Utility Project?",
    summary:
      "The responsibilities of the role, how it differs from construction management and where it can supplement your team.",
    category: "Articles",
    date: "October 21, 2026",
    meta: "6 min read",
    image: "/comp1r/res-1.png",
  },
  {
    title: "Capability Statement: Power Generation",
    summary:
      "Our experience, certifications and past performance across gas, solar and storage generation projects.",
    category: "Capability Statements",
    date: "October 14, 2026",
    meta: "PDF · 2 pages",
    image: "/comp4v2/ind-power.png",
  },
  {
    title: "Project Controls and Scheduling",
    summary:
      "Schedule development, cost forecasting and reporting that give owners a clear view of where a project stands.",
    category: "Service Descriptions",
    date: "October 7, 2026",
    meta: "PDF · 4 pages",
    image: "/about-v2/ws-plan.png",
  },
  {
    title: "From Kickoff to Closeout: Our Project Workflow",
    summary:
      "The stages, handoffs and checkpoints we follow on every project, and what owners can expect at each one.",
    category: "Workflows",
    date: "September 30, 2026",
    meta: "Workflow",
    image: "/about-v2/ws-build-a.png",
  },
  {
    title: "Restoring a Government Dam’s Spillway Gates",
    summary:
      "Coordinating contractors, regulators and outage windows on a multi-year federal infrastructure project.",
    category: "Case Studies",
    date: "September 23, 2026",
    meta: "Case study",
    image: "/comp4v2/ind-government.png",
  },
  {
    title: "What Construction Firms Need to Know Before Entering Utility Work",
    summary:
      "Documentation, utility coordination and scheduling requirements that affect planning and field execution.",
    category: "Articles",
    date: "September 16, 2026",
    meta: "5 min read",
    image: "/comp1r/res-2.png",
  },
  {
    title: "Capability Statement: Oil & Gas",
    summary:
      "Midstream and downstream project support, from front-end planning through commissioning.",
    category: "Capability Statements",
    date: "September 9, 2026",
    meta: "PDF · 2 pages",
    image: "/comp4v2/ind-oil.png",
  },
  {
    title: "Construction Management and Field Oversight",
    summary:
      "Daily site presence, quality and safety oversight, and documented decisions that protect the owner.",
    category: "Service Descriptions",
    date: "September 2, 2026",
    meta: "PDF · 4 pages",
    image: "/about-v2/ws-operate.png",
  },
  {
    title: "Change Order Review Workflow",
    summary:
      "How we review, negotiate and document change orders so scope and cost stay under control.",
    category: "Workflows",
    date: "August 26, 2026",
    meta: "Workflow",
    image: "/about-v2/ws-decom.png",
  },
  {
    title: "How Project Leaders Keep Construction Teams Aligned",
    summary:
      "Defined responsibilities, regular coordination and documented decisions help teams manage changing field conditions.",
    category: "Articles",
    date: "August 19, 2026",
    meta: "4 min read",
    image: "/comp1r/res-3.png",
  },
  {
    title: "Industrial Services Brochure",
    summary:
      "An overview of our support for industrial and commercial facilities, expansions and shutdowns.",
    category: "Brochure",
    date: "August 12, 2026",
    meta: "PDF · 8 pages",
    image: "/comp4v2/ind-commercial.png",
  },
];
