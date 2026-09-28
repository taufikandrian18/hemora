import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) for the Docker image in /Dockerfile.
  output: "standalone",
};

export default nextConfig;
