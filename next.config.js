/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [] },
  // Wagmi/Viem ship ESM-only packages; Next 14 handles this fine, but we
  // surface helpful warnings if something regresses.
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
