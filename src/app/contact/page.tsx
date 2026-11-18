import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer2 } from "@/components/comp2/Footer2";
import { ContactPage } from "@/components/contact/Contact";

export const metadata: Metadata = {
  title: "Contact MWC | Talk to a Project Lead",
  description: "Tell us about your project and we’ll connect you with the right people at MWC.",
};

export default function Contact() {
  return (
    <>
      <SiteNav v2 />
      <main>
        <ContactPage />
      </main>
      <Footer2 logoV2 />
    </>
  );
}
