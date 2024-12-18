import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.dimigo.hs.kr',
      },
    ],
  },
};

export default nextConfig;