/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.stamp.fyi",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "jbm.infura-ipfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ipfs.dweb.link",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
    ],
    unoptimized: true, // Disable Next.js image optimization for IPFS images
  },
  // Allow eval in development for debugging
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob:; object-src 'none';"
              : "script-src 'self' 'unsafe-inline' data: blob:; object-src 'none';"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
