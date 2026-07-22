import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't infer it from a
  // stray parent-directory lockfile (caused a build-time warning / wrong root).
  turbopack: {
    root: __dirname,
  },
  images: {
    // Next 16 only serves qualities on this allowlist (default [75]).
    // 90 is for dense text screenshots (the mechanism site-scroll mock),
    // where q75 WebP visibly smears small type.
    qualities: [75, 90],
  },
};

export default nextConfig;
