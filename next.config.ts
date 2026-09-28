import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) for the Docker image in /Dockerfile.
  output: "standalone",
  // Serve under a sub-path in production (e.g. /hemora); empty for local development and tests.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export default nextConfig;
