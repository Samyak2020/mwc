import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { ResourcesPage } from "@/components/resources/Resources";

export const metadata: Metadata = {
  title: "Client Resources | MWC",
  description: "Brochures, case studies, capability statements, service descriptions, workflows and articles from MWC.",
};

export default function ClientResources() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <ResourcesPage />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
