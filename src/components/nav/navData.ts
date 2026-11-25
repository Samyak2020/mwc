// Site navigation data, shared by the header menus, the mobile menu, the
// footer and the contact form. Plain module (no "use client") so server
// components can read it.
import type { IndustryKey } from "./IndustryGraphic";

export type MenuKey = "industries" | "services" | "projects" | "company";

export type Link = { label: string; href: string };
type Industry = Link & { key: IndustryKey; description: string };

export const industries: Industry[] = [
  {
    key: "power",
    label: "Power Producers",
    href: "/industries/power-producers",
    description:
      "MWC provides owner’s representation, construction management and project controls for individual facilities and multi-site portfolios.",
  },
  {
    key: "utilities",
    label: "Utilities",
    href: "/industries/utilities",
    description:
      "Within electric, natural gas and water utility capital delivery organizations, MWC provides project and program management, construction oversight and project controls.",
  },
  {
    key: "government",
    label: "Government",
    href: "/industries/government",
    description:
      "Federal, state and local projects are delivered by MWC, a certified service-disabled veteran-owned small business.",
  },
  {
    key: "commercial",
    label: "Construction",
    href: "/industries/commercial-industrial",
    description:
      "Owner-side project oversight and project delivery personnel are available for commercial, industrial and on-site energy projects, with added support for contractor teams.",
  },
  {
    key: "oil",
    label: "Oil and Gas",
    href: "/industries/oil-gas",
    description:
      "From upstream production sites to midstream pipelines and downstream refinery turnarounds, projects are managed with contractor safety oversight from mobilization to closeout.",
  },
];

export const serviceGroups: { label: string; href?: string; links: Link[] }[] =
  [
    {
      label: "Workstreams",
      links: [
        {
          label: "Owner’s Representative",
          href: "/services/owners-representative",
        },
        {
          label: "Project Management",
          href: "/services/project-program-management",
        },
        {
          label: "Controls and Scheduling",
          href: "/services/project-controls-scheduling",
        },
        {
          label: "Construction Management",
          href: "/services/construction-management",
        },
        {
          label: "Safety Management",
          href: "/services/construction-safety-management",
        },
        {
          label: "Coordination and Document Control",
          href: "/services/project-coordination",
        },
        {
          label: "Engineering Services",
          href: "/services/engineering-services",
        },
        {
          label: "Technology Project Management",
          href: "/services/technology-project-management",
        },
      ],
    },
    {
      label: "Specialized Services",
      links: [
        {
          label: "Plant Outage Management",
          href: "/services/plant-outage-planning",
        },
        {
          label: "Utility Interconnection Coordination",
          href: "/services/utility-interconnection-coordination",
        },
        {
          label: "Power Plant Decommissioning",
          href: "/services/power-plant-decommissioning",
        },
      ],
    },
  ];

export const projectGroups: { label: string; href?: string; links: Link[] }[] =
  [
    {
      label: "Projects",
      href: "/projects",
      links: [
        { label: "Power Generation", href: "/projects/power-generation" },
        {
          label: "Solar and BESS",
          href: "/projects/solar-battery-storage",
        },
        {
          label: "Transmission, Distribution and Substations",
          href: "/projects/transmission-distribution",
        },
        {
          label: "EV and Demand-Side Management",
          href: "/projects/electric-vehicle-charging",
        },
        { label: "Microgrids", href: "/projects/microgrids" },
      ],
    },
  ];

export const companyGroups: { label: string; href?: string; links: Link[] }[] =
  [
    {
      label: "Company",
      links: [
        { label: "About MWC", href: "/about" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];
