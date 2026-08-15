import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
