import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/info",
        destination: "/info/index.html",
      },
    ];
  },
};

export default nextConfig;
