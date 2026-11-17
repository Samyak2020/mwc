import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import {
  AboutCta,
  AboutExperience,
  AboutFramework,
  AboutHero,
  AboutQuote,
  AboutResults,
  AboutStory,
  AboutTeam,
} from "@/components/about/About";

export const metadata: Metadata = {
  title: "About MWC | Veteran-Led Project and Construction Management Firm",
  description:
    "Learn what sets MWC apart: experienced leadership, proven project workstreams and a commitment to representing your interests.",
};

// About page (copy: "MWC Website Content 1"; layout after letsgrowcanada.ca/about-us).
export default function AboutPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <AboutHero />
        <AboutQuote
          quote="MWC stands out because they understand capital delivery at both the field and portfolio levels. Their planning rigor, forecasting discipline, and ability to adapt in real time have materially improved our ability to execute safely, stay on schedule, and make informed decisions."
          by="Capital Planning / Portfolio Executive"
        />
        <AboutStory />
        <AboutFramework />
        <AboutResults />
        <AboutExperience />
        <AboutTeam />
        <AboutQuote
          dark
          quote="MWC has become a trusted extension of our organization. They don’t just manage projects, they bring clarity, discipline, and calm to complex, high-risk environments. Whether navigating outages, regulatory constraints, or staffing transitions, their team consistently delivers predictable outcomes and strong financial control. We have full confidence in MWC and value them as a long-term partner."
          by="Utility Executive, Capital & Generation Leadership"
        />
        <AboutCta />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
