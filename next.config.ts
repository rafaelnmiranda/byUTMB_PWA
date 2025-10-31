import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep static export for production builds
  output: 'export',
  trailingSlash: false,
  // Do NOT override distDir in dev; Next uses .next automatically.
  // Removing distDir avoids conflicts with an existing out/ from export.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Ensure Next.js treats this project folder as the workspace root
    outputFileTracingRoot: path.join(__dirname),
  },
};

export default nextConfig;
