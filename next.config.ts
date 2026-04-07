import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/trading-journal',
  assetPrefix: '/trading-journal',
};

export default nextConfig;
