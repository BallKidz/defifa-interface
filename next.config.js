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
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname:  "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname:  "i.seadn.io",
      },
      {
        protocol: "https",
        hostname:  "i.imgur.com",
      },
      {
        protocol: "https",
        hostname:  "openseauserdata.com",
      },
     
    ],
  },
};

module.exports = nextConfig;
