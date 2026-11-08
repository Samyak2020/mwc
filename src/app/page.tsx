import { Hero } from "@/components/Hero";
import { SiteNav } from "@/components/SiteNav";
import { ProjectSupport } from "@/components/ProjectSupport";
import { WorkstreamsSection } from "@/components/Workstreams";
import { Experience } from "@/components/Experience";
import { TrustedBy } from "@/components/TrustedBy";
import { Resources } from "@/components/Resources";
import { Leadership } from "@/components/Leadership";
import { Team } from "@/components/Team";
import { ProjectLeadCta } from "@/components/ProjectLeadCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <ProjectSupport />
        <WorkstreamsSection />
        <Experience />
        <TrustedBy />
        <Resources />
        <Leadership />
        <Team />
        <ProjectLeadCta />
      </main>
      <Footer />
    </>
  );
}
