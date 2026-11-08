import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably crisper than WebP at the same size
    formats: ["image/avif", "image/webp"],
    // 90 for photography (see PHOTO_QUALITY), 75 default for the rest
    qualities: [75, 90],
  },
};

export default nextConfig;
