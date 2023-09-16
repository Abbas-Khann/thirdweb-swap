/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "acb5c25436355eec698899f95b316159.ipfscdn.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
