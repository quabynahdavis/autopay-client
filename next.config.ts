import type { NextConfig } from "next";

// The backend URL is only ever read server-side (no NEXT_PUBLIC_ prefix),
// so it is never exposed in the client bundle.
const BACKEND_URL =
  process.env.INTERNAL_API_URL ?? "https://autopay-server-f1oq.onrender.com";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.188.230.56"],

  async rewrites() {
    return [
      {
        // Proxy every /api/:path* request to the Express backend.
        // The browser always calls its own origin, so CORS is never triggered.
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
