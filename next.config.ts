import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "19-readtime";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
