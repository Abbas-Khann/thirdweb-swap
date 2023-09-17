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
      {
        protocol: "https",
        hostname:
          "bafybeigfcagqsgk3yrd6gii6hhimgsykkhheaxaqi6asuxngbdcsfol7oa.ipfs.cf-ipfs.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
