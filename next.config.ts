import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js / Turbopack from trying to bundle MSW on the server.
  serverExternalPackages: ["msw", "msw/node"],
};

export default nextConfig;
