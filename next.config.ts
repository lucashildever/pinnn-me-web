import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sign-up",
        destination: "/signup",
      },
    ];
  },
  sassOptions: {
    prependData: `
      @use "@/styles" as *;
    `,
  },
};

export default nextConfig;
