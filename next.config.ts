import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/sign-up',
        destination: '/signup',
      },
    ];
  },
  sassOptions: {
    prependData: `
      @use "@/styles" as *;
    `,
  },
  images: {
    qualities: [70],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
