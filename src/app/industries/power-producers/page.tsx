import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { IndustryHeroMinimal } from "@/components/industries/IndustrySections";
import { PowerProducersBody } from "@/components/industries/PowerProducersBody";
import { PowerSceneMinimal } from "@/components/industries/PowerSceneMinimal";

export const metadata: Metadata = {
  title: "Power Plant Consulting for Power Producers | MWC",
  description: "Owner’s representative and construction management for independent power producers, developers and storage platforms.",
};

// Industries: Power Producers (copy: "MWC Website Content 2"). Minimal hero (v2,
// after cantor8.io/partners); v1 is kept at /drafts/power-producers-v1.
export default function PowerProducersPage() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHeroMinimal
          title="Power Plant Consulting and Owner’s Representation for Power Producers"
          intro="Owner’s representative and construction management for independent power producers, developers and storage platforms."
          scene={<PowerSceneMinimal className="h-full w-full" />}
          band={["Power Producers", "Outage Planning", "Sustaining Capital", "Owner’s Representation", "Return to Service"]}
        />
        <PowerProducersBody />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
