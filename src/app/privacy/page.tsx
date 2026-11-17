import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { LegalPage, type Section } from "@/components/legal/LegalPage";

// Copy: "MWC Website Content 1", Privacy Policy.
export const metadata: Metadata = {
  title: "Privacy Policy | MWC",
  description: "How MWC collects, uses and protects information submitted through mwconsultllc.com.",
};

const sections: Section[] = [
  {
    title: "Information We Collect",
    blocks: [
      {
        lead: "Information you provide.",
        text: "Forms on this site collect your name, email address, phone number, company or agency, organization type, project details and any files you upload.",
      },
      {
        lead: "Information collected automatically.",
        text: "Our service providers record technical details of each visit, including IP address, browser and device type, pages viewed, referring website and time on site, using cookies and similar technologies.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    blocks: [
      {
        list: [
          "Responding to your request and sending the documents you ask for",
          "Routing your message to the right person at MWC",
          "Reviewing job applications",
          "Sending Field Guides, After Action Reports and company updates, with your opt-in",
          "Improving the site based on how visitors use it",
          "Meeting legal obligations",
        ],
      },
    ],
  },
  {
    title: "Email Communications",
    blocks: [
      "Marketing email goes only to people who opt in. Each message includes an unsubscribe link, and requests to info@mwconsultllc.com are also honored. Without an opt-in, you’ll hear from us only about your request.",
    ],
  },
  {
    title: "Cookies and Analytics",
    blocks: [
      "HubSpot and [Google Analytics] use cookies to measure traffic and site use. Browser settings and our cookie banner let you control cookies, though blocking them may limit some features.",
    ],
  },
  {
    title: "How We Share Information",
    blocks: [
      "MWC does not sell personal information. Information is shared only:",
      {
        list: [
          "With service providers such as HubSpot that operate the site and manage inquiries, under agreements that limit their use of it",
          "When the law requires it or to protect our rights",
          "As part of a merger, acquisition or sale of company assets",
        ],
      },
    ],
  },
  {
    title: "Data Retention",
    blocks: [
      "Personal information is kept only as long as the purposes in this policy require, unless the law requires longer. Job applications are kept for [period].",
    ],
  },
  {
    title: "Security",
    blocks: [
      "Reasonable administrative, technical and physical safeguards protect the information we hold. No method of transmission or storage is completely secure.",
    ],
  },
  {
    title: "Your Rights",
    blocks: [
      "Email info@mwconsultllc.com to access, correct or delete your personal information, or to stop marketing email. Residents of California and other states with privacy laws may have additional rights, and exercising them will not affect how we treat you.",
    ],
  },
  {
    title: "Children’s Privacy",
    blocks: ["This site is not intended for children under 13, and we do not knowingly collect their information."],
  },
  {
    title: "Other Websites",
    blocks: ["Links to outside websites are provided for convenience. Their privacy practices are not covered by this policy."],
  },
  {
    title: "Updates",
    blocks: ["Revisions to this policy are reflected in the effective date above."],
  },
  {
    title: "Contact",
    blocks: [
      "Mountain West Consulting, LLC\n4602 E University Dr Suite 175, Phoenix, AZ 85034\ninfo@mwconsultllc.com · (623) 738-6988",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <LegalPage
          current="/privacy"
          title="Privacy Policy"
          effective="[Date]"
          intro="Mountain West Consulting, LLC (“MWC,” “we,” “us”) operates mwconsultllc.com. This policy explains what information we collect, how we use it and the choices you have."
          sections={sections}
        />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
