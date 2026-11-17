import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { LegalPage, type Section } from "@/components/legal/LegalPage";

// Copy: "MWC Website Content 1", Terms of Use.
export const metadata: Metadata = {
  title: "Terms of Use | MWC",
  description: "Terms governing use of mwconsultllc.com and the documents available on it.",
};

const sections: Section[] = [
  {
    title: "Use of the Site",
    blocks: [
      "You may browse the site and download documents for your own business evaluation. Copying, redistributing or reselling site content without written permission is not allowed, and neither is any attempt to disrupt the site or access it without authorization.",
    ],
  },
  {
    title: "Intellectual Property",
    blocks: [
      "Site content, including text, graphics, logos, Field Guides, After Action Reports, capability statements, Fly Sheets and the company brochure, belongs to MWC or its licensors. Workstream™ names and the MWC name and logo are MWC trademarks.",
    ],
  },
  {
    title: "Information Only",
    blocks: [
      "Site content describes MWC’s services and general industry practice. It is not engineering, legal or financial advice for any specific project. A signed agreement defines the scope of any MWC engagement.",
    ],
  },
  {
    title: "Client References and Testimonials",
    blocks: [
      "Testimonials reflect individual client experiences and are published with permission. Results on one project do not guarantee results on another.",
    ],
  },
  {
    title: "Links to Other Websites",
    blocks: ["Outside websites linked from this site are not controlled by MWC, and MWC is not responsible for their content."],
  },
  {
    title: "Disclaimer",
    blocks: ["The site and its content are provided as is, without warranties of any kind, to the extent the law allows."],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      "To the extent the law allows, MWC is not liable for indirect, incidental or consequential damages arising from use of the site.",
    ],
  },
  {
    title: "Governing Law",
    blocks: ["Arizona law governs these terms, without regard to conflict-of-law rules."],
  },
  {
    title: "Updates",
    blocks: [
      "Revisions to these terms are reflected in the effective date above. Continued use of the site after a revision means you accept the updated terms.",
    ],
  },
  {
    title: "Contact",
    blocks: ["Mountain West Consulting, LLC\n[Business address]\ninfo@mwconsultllc.com · (623) 738-6988"],
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <LegalPage
          current="/terms"
          title="Terms of Use"
          effective="[Date]"
          intro="These terms govern your use of mwconsultllc.com, operated by Mountain West Consulting, LLC (“MWC”). Using the site means you accept them."
          sections={sections}
        />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
