import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ensure Keystatic content files are bundled with the server output on Vercel
    // so `createReader(process.cwd(), ...)` can access them at runtime.
    outputFileTracingIncludes: {
      // Include the entire content directory for any server route that might read it
      // (using a top-level key ensures it's available to all traces).
      '*': ["content/**"],
    },
  },
};

export default nextConfig;
