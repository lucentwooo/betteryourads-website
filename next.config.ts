import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't infer it from a
  // stray parent-directory lockfile (caused a build-time warning / wrong root).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
