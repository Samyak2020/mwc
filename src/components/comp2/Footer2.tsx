import { Rise } from "@/components/motion/Rise";
import { companyGroups, industries, projectGroups, serviceGroups, type Link } from "@/components/nav/navData";

// The footer mirrors the header menus: same groups, same names, same links.
const columns: { label: string; links: Link[] }[] = [
  { label: "Industries", links: industries },
  ...serviceGroups,
  ...projectGroups,
  {
    label: "Company",
    links: [
      ...companyGroups.flatMap((g) => g.links),
      { label: "Client Resources", href: "/client-resources" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Figma "Footer" (594:3205): navy, 1440×737.
export function Footer2({ logoV2 = false }: { logoV2?: boolean } = {}) {
  // comp 4 v2: the columns rise in one after another
  const Col = logoV2 ? Rise : "div";
  return (
    <footer data-nav-theme="dark" className="relative overflow-hidden bg-[#062567] text-bg/90">
      {/* comp 4 v2 (Figma 781:6530): the logo's ridge repeated as three stacked
          bands, tone-on-tone, oversized and cropped (2616 wide on 1440, 263 left) */}
      {logoV2 && (
        <img
          src="/comp4v2/footer-ridges.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-0 left-[-18.24%] h-auto w-[181.67%] max-w-none"
        />
      )}
      <div className="shell relative pt-14 pb-10 lg:pt-u-54 lg:pb-[calc(var(--u)*40)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* comp 4 v2: the new two-tone mark (Figma 733:1613, 102.7×59.8) */}
          {logoV2 ? (
            <img src="/comp4v2/footer-logo.svg" alt="MWC" width={103} height={60} />
          ) : (
            <img src="/comp2/footer-logo.svg" alt="MWC" width={79} height={60} />
          )}
          <p className="max-w-[471px] text-base leading-[1.3] font-medium tracking-[-0.005em] lg:mt-0.5 lg:w-u-471">
            Owner’s representative, project controls and construction management for gas, solar, battery storage and
            transmission projects. Veteran-led and certified SDVOSB.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:mt-u-133 lg:flex lg:items-start lg:justify-between lg:gap-0"
        >
          {columns.map((col, i) => (
            <Col key={col.label} {...(logoV2 ? { order: i } : {})} className={`flex flex-col gap-8 ${i === 0 ? "lg:w-u-210" : "lg:whitespace-nowrap"}`}>
              <p className="text-sm leading-[1.3] font-semibold tracking-[0.06em] text-bg/60 uppercase">{col.label}</p>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="block py-1 text-base leading-[1.3] font-medium tracking-[-0.005em] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-base)] hover:decoration-current"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-6 text-sm opacity-50 lg:mt-u-80 lg:flex-row lg:items-end lg:gap-0">
          <p className="leading-[1.4] lg:w-u-552">
            [Address] · <a href="tel:+16237386988">(623) 738-6988</a>
            <br />
            <a href="mailto:info@mwconsultllc.com">info@mwconsultllc.com</a> · <a href="#">LinkedIn</a>
          </p>
          <p className="lg:w-u-429">
            <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
          </p>
          <ul className="leading-[1.4] lg:whitespace-nowrap">
            <li>Service-Disabled Veteran-Owned Small Business (SDVOSB)</li>
            <li>Unique Entity Identifier U9WJDCH3V369</li>
            <li>Commercial and Government Entity code 96A46</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
