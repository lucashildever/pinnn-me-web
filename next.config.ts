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
        protocol: (process.env.NEXT_PUBLIC_STORAGE_PROTOCOL || 'http') as
          | 'http'
          | 'https',
        hostname: process.env.NEXT_PUBLIC_STORAGE_HOSTNAME || 'localhost',
        port: process.env.NEXT_PUBLIC_STORAGE_PORT || '9000',
      },
    ],
  },
};

export default nextConfig;
