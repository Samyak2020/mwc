import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably crisper than WebP at the same size
    formats: ["image/avif", "image/webp"],
    // 90 for photography (see PHOTO_QUALITY), 75 default for the rest
    qualities: [75, 90],
  },
  // comp 4 is the homepage; the earlier comps live under /drafts
  async redirects() {
    return [
      { source: "/comp-4", destination: "/", permanent: false },
      { source: "/comp-:n(1|2|3)", destination: "/drafts/comp-:n", permanent: false },
    ];
  },
};

export default nextConfig;
