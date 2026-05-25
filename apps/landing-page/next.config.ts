import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/info",
        destination: "/info/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
