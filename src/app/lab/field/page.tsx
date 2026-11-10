import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { FieldJourney } from "@/components/field/FieldJourney";

export const metadata: Metadata = { title: "MWC | Field journey (preview)" };

// Standalone preview of the FieldJourney module. It is not part of any comp
// page yet; the blocks above and below only give it something to scroll past.
export default function FieldLab() {
  return (
    <>
      <SiteNav solidCta />
      <main className="bg-night text-bg">
        <div data-nav-theme="dark" className="shell flex h-[70svh] items-end pb-16">
          <p className="max-w-[445px] text-base leading-[1.5] font-medium text-bg/70">
            Preview of the field journey module. Scroll down: the section pins, then each scroll step flies the camera to
            the next workstream.
          </p>
        </div>
        <FieldJourney />
        <div data-nav-theme="dark" className="shell flex h-[70svh] items-start pt-16">
          <p className="text-base leading-[1.5] font-medium text-bg/70">End of the module. The next section would follow here.</p>
        </div>
      </main>
    </>
  );
}
