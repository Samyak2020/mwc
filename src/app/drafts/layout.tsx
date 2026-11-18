import type { Metadata } from "next";

// Earlier homepage comps, kept for reference only (the live homepage is comp 4 at /).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DraftsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
