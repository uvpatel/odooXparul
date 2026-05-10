import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.image2url.com",
      },
    ],
  },
};

export default nextConfig;
