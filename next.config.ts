import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    prependData: `
      @use "@/styles" as *;
    `,
  },
};

export default nextConfig;
