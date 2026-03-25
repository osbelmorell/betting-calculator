import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
    inlineCss: true,
  },
};

export default nextConfig;
