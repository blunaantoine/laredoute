import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'laredoutesarl.com',
      },
      {
        protocol: 'https',
        hostname: 'www.laredoutesarl.com',
      },
    ],
    // Allow unoptimized images for uploaded files served via /api/files/
    unoptimized: false,
  },
};

export default nextConfig;
