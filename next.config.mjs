import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove swcMinify entirely
  poweredByHeader: false, // Recommended security best practice
  // Add if using app router
  experimental: {
    // appDir: true
  }
};

export default withVanillaExtract(nextConfig);
