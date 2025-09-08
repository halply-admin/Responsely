import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  devIndicators: false,

  // Force disable standalone output (Vercel adds it automatically otherwise)
  output: undefined,
};

export default withSentryConfig(nextConfig, {
  org: "responsely",
  project: "responsely",

  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
