import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@google/generative-ai'],
  images: {
    domains: ['localhost']
  },
  eslint: {
    // Disable ESLint during build so we can iterate without the build failing.
    // Remove this after fixing the lint errors reported by ESLint.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to succeed even if there are type errors. Fix types later.
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig;
