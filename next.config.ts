import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site rebuilds every weekday, so the build date is the paper's date.
  env: {
    BUILD_DATE: new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" }),
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
