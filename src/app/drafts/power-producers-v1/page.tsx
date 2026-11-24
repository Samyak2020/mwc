import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { PowerScene } from "@/components/industries/PowerScene";
import { IndustryHero } from "@/components/industries/IndustrySections";
import { PowerProducersBody } from "@/components/industries/PowerProducersBody";

export const metadata: Metadata = { title: "Power Producers, hero v1 (draft) | MWC" };

// Power Producers with the first hero (v1: homepage-style scene around a centred title). Draft only.
export default function PowerProducersV1() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <IndustryHero
          title="Power Plant Consulting and Owner’s Representation for Power Producers"
          scene={<PowerScene className="h-full w-full" />}
        />

        <PowerProducersBody />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
