import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_TLDRAW_LICENSE_KEY: process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
