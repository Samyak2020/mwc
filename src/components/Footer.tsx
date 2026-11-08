import Image from "next/image";

const columns = [
  {
    label: "Services",
    className: "",
    links: [
      "Owner’s Representative",
      "Project and Program Management",
      "Project Controls and Scheduling",
      "Construction Management",
      "Construction Safety Management",
      "Owner’s Engineer and Design Review",
      "Project Coordination and Document Control",
      "Utility and Interconnection Coordination",
      "Plant Outage Planning",
      "Technology Project Management",
      "Power Plant Decommissioning",
    ],
  },
  {
    label: "Projects",
    className: "",
    links: [
      "Power Generation",
      "Solar and Battery Energy Storage",
      "Transmission",
      "Distribution and Substations",
      "Electric Vehicle Charging",
      "Microgrids",
      "Commercial and Industrial",
      "Oil and Gas",
    ],
  },
  {
    label: "Organizations",
    className: "",
    links: ["Power Producers", "Utilities", "Government", "Commercial, Industrial and General Contractors", "Oil and Gas"],
  },
  {
    label: "Company",
    className: "",
    links: ["About", "Veteran-Led", "The People on Your Site", "Careers", "Owner’s Toolkit"],
  },
];

// Figma "Footer" (y=8041, 1440×1265).
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg">
      <div className="shell pt-14 lg:pt-u-56">
        <div className="footer-cols flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:gap-0">
          <Image src="/figma/footer-logo.svg" alt="MWC" width={145} height={63} />
          {/* starts on the Projects column */}
          <p className="max-w-[445px] text-base leading-[1.3] font-medium tracking-[-0.005em] text-fg/80 lg:col-span-3 lg:col-start-2 lg:w-u-445">
            Owner’s representative, project controls and construction management for gas, solar, battery storage and
            transmission projects. Veteran-led and certified SDVOSB.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="footer-cols mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:mt-u-128 lg:items-start lg:gap-0"
        >
          {columns.map((col) => (
            <div key={col.label} className={`flex flex-col gap-8 ${col.className}`}>
              <p className="text-sm leading-[1.3] font-semibold tracking-[0.06em] text-muted uppercase">{col.label}</p>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="block py-1 text-base leading-[1.3] font-medium tracking-[-0.005em] text-fg/80 hover:text-navy"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-6 text-sm lg:mt-u-120 lg:flex-row lg:items-end lg:gap-0">
          <p className="leading-[1.4] text-fg lg:w-u-552">
            [Address] · <a href="tel:+16237386988">(623) 738-6988</a>
            <br />
            <a href="mailto:info@mwconsultllc.com">info@mwconsultllc.com</a> · <a href="#">LinkedIn</a>
          </p>
          <p className="text-fg lg:w-u-429">
            <a href="#">Privacy</a> · <a href="#">Terms</a>
          </p>
          <ul className="leading-[1.4] text-muted">
            <li>- Service-Disabled Veteran-Owned Small Business (SDVOSB)</li>
            <li>- Unique Entity Identifier U9WJDCH3V369</li>
            <li>- Commercial and Government Entity code 96A46</li>
          </ul>
        </div>
      </div>

      {/* Oversized MWC wordmark bleeding off the bottom edge */}
      {/* (Figma: top 894 of the 1265 footer, so only the top 371px shows) */}
      <div aria-hidden className="relative mt-12 h-u-371 overflow-hidden lg:mt-u-16">
        <img
          src="/figma/footer-mark.svg"
          alt=""
          className="absolute top-u-196 left-[calc(50%+var(--u)*529)] w-u-159"
        />
        <div className="absolute top-0 left-1/2 w-u-1544 -translate-x-1/2">
          <img src="/figma/footer-mwc.svg" alt="" className="block h-auto w-full" />
        </div>
      </div>
    </footer>
  );
}
