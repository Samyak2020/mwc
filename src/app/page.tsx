import { Hero } from "@/components/Hero";
import { SiteNav } from "@/components/SiteNav";
import { ProjectSupport } from "@/components/ProjectSupport";
import { WorkstreamsSection } from "@/components/Workstreams";
import { Experience } from "@/components/Experience";
import { TrustedBy } from "@/components/TrustedBy";
import { ClientResources } from "@/components/ClientResources";
import { Leadership } from "@/components/Leadership";
import { TeamRow } from "@/components/TeamRow";
import { Cta2 } from "@/components/comp2/Cta2";
import { Footer2 } from "@/components/comp2/Footer2";

// Comp 1, revised (Figma "Revised homepage 1" 548:1071).
export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <ProjectSupport />
        <WorkstreamsSection />
        <Experience />
        <TrustedBy label={false} className="mt-10 lg:mt-u-38" />
        <ClientResources />
        <Leadership />
        <TeamRow />
        <Cta2 />
      </main>
      <Footer2 />
    </>
  );
}
