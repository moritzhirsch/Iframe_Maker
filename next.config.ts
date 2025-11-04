import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Keystatic content files are bundled with the server output on Vercel
  // so `createReader(process.cwd(), ...)` can access them at runtime.
  outputFileTracingIncludes: {
    '*': ["content/**"],
    '/app/bijloke/[slug]/page': ["content/**"],
    '/app/keystatic/[[...params]]/page': ["content/**"],
  },
};

export default nextConfig;
