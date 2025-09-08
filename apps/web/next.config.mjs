import {withSentryConfig} from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  devIndicators: false,
  output: 'standalone', // Add this line
  experimental: {
    optimizePackageImports: undefined // Disable this optimization
  }
}

export default withSentryConfig(nextConfig, {
  org: "responsely",
  project: "responsely",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
  hideSourceMaps: true // Add this to reduce complexity
});