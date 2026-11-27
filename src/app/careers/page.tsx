import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { AboutHero, AboutQuote } from "@/components/about/About";
import { CareersPhotos, CareersPositions, CareersProfile } from "@/components/careers/Careers";

export const metadata: Metadata = {
  title: "Careers at MWC | Join Our Project Management Team",
  description:
    "Explore career opportunities at MWC and join an experienced team delivering complex, mission-critical projects.",
};

// Careers (copy: "MWC Website Content 1"; layout after afternow.co/careers).
export default function CareersPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <AboutHero
          id="careers-title"
          lines={["Build Your", "Career", "with MWC"]}
          intro="Explore career opportunities at MWC and join an experienced team delivering complex, mission-critical projects."
          image="/careers-v2/hero.png"
          alt="MWC project team on site"
          titleClassName="text-[56px] leading-[0.85] sm:text-[96px] lg:fs-u-128"
          band={["Careers at MWC", "Veteran-Led", "Experience", "Strategy", "Modern Mindset"]}
        />
        <AboutQuote quote="Creative, reliable, and genuinely passionate about what they do." by="Customer" />
        <CareersPhotos />
        <CareersProfile />
        <CareersPositions />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
