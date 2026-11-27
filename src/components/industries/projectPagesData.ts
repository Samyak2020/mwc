import type { ProjectRecord } from "./ProjectSections";

// Project pages after Power Generation (copy: "MWC Website Content 2",
// verbatim). Each doc heading "Project Record: <title>" is split into the
// record's stop label (stage) and its title; the words are unchanged. The
// doc's "[Andrew to supply an example]" records are left out until supplied.

export const SOLAR_RECORDS: ProjectRecord[] = [
  {
    id: "community-solar-heading",
    stage: "Project Record",
    title: "Community Solar Program",
    icon: "batteries",
    facts: [
      { term: "Owner", text: "Customer programs group of a regulated electric utility" },
      {
        term: "Scope",
        text: "Hundreds of solar installations serving low-income households, schools, veterans’ organizations and tribal communities, in a program of about $38M",
      },
      { term: "MWC’s Role", text: "Program management office, scheduling, permitting by jurisdiction, electrical design and field construction management" },
      { term: "Result", text: "Permitting cut from three months to 30 to 45 days" },
    ],
    workstreams: [
      { label: "Project Management", href: "/services/project-program-management" },
      { label: "Project Coordination", href: "/services/project-coordination" },
      { label: "Construction Management", href: "/services/construction-management" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/commission-mandated-customer-programs" },
  },
  {
    id: "pumped-storage-heading",
    stage: "Project Record",
    title: "Pumped Storage Hydropower Program",
    icon: "water",
    facts: [
      { term: "Owner", text: "Water and power utility" },
      { term: "Scope", text: "A large pumped storage project, alongside a dam raise and pipeline, with a 10+ year schedule" },
      { term: "MWC’s Role", text: "Program scheduling and coordination with federal partners" },
      { term: "Result", text: "Schedule updates moved from every other month to monthly, delivered on time" },
    ],
    workstreams: [
      { label: "Project Scheduling", href: "/services/project-controls-scheduling" },
      { label: "Project Coordination", href: "/services/project-coordination" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/multi-agency-water-storage" },
  },
];

export const TD_RECORDS: ProjectRecord[] = [
  {
    id: "service-coordination-heading",
    stage: "Project Record",
    title: "Service Coordination During a Construction Boom",
    icon: "service",
    facts: [
      { term: "Owner", text: "Transmission and distribution organization of an investor-owned utility" },
      {
        term: "Scope",
        text: "New and upgraded electric services across a territory adding about 35,000 meters a year, including single-phase services up to 600 or 800 amps",
      },
      {
        term: "MWC’s Role",
        text: "Service coordination, senior coordination, program management, training and quality review, with about 12 coordinators at peak",
      },
      {
        term: "Result",
        text: "Request times cut from 12 to 14 weeks to 6 to 8 weeks. New areas were staffed in about 30 days and fully productive within 90, and the utility hired MWC-trained coordinators into permanent roles.",
      },
    ],
    workstreams: [
      { label: "Project Coordination", href: "/services/project-coordination" },
      { label: "Project Management", href: "/services/project-program-management" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/service-coordination-backlog" },
  },
];

export const EV_RECORDS: ProjectRecord[] = [
  {
    id: "charging-programs-heading",
    stage: "Project Record",
    title: "Utility Charging and Distributed Energy Programs",
    icon: "pylon",
    facts: [
      { term: "Owner", text: "Customer programs group of a regulated electric utility" },
      {
        term: "Scope",
        text: "150+ Level 2 charging stations, 5 direct current fast charging sites (about $15M), residential battery storage and distributed energy management",
      },
      {
        term: "MWC’s Role",
        text: "Program management office, integrated schedules, monthly forecasts and accruals, permitting, electrical design, document control and field construction management",
      },
      { term: "Result", text: "The utility relies on MWC to drive its long-range program forecast, with the program running since 2018." },
    ],
    workstreams: [
      { label: "Project Management", href: "/services/project-program-management" },
      { label: "Project Scheduling", href: "/services/project-controls-scheduling" },
      { label: "Construction Management", href: "/services/construction-management" },
      { label: "Project Coordination", href: "/services/project-coordination" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/commission-mandated-customer-programs" },
  },
];

export const MICROGRID_RECORDS: ProjectRecord[] = [
  {
    id: "critical-microgrid-heading",
    stage: "Project Record",
    title: "Critical Infrastructure Microgrid",
    icon: "batteries",
    facts: [
      { term: "Owner", text: "Electric utility, serving a municipal wastewater treatment system" },
      { term: "Scope", text: "Dual-feed microgrid with new switchgear and backup generation" },
      { term: "MWC’s Role", text: "Program management, scheduling, permitting and field construction management" },
      { term: "Result", text: "Critical infrastructure resiliency for the treatment system, which stayed in operation during construction" },
    ],
    workstreams: [
      { label: "Project Management", href: "/services/project-program-management" },
      { label: "Construction Management", href: "/services/construction-management" },
      { label: "Engineering Services", href: "/services/engineering-services" },
    ],
    link: { label: "Read the Case Study", href: "/resources/after-action-reports/commission-mandated-customer-programs" },
  },
];
