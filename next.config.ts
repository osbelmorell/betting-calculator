import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    mcpServer: true,
    typedEnv: true,
    inlineCss: true,
  },
};

export default nextConfig;
