import type { NextConfig } from "next";

/**
 * The site is served from the domain root (https://www.go4tpg.com) on the VPS,
 * so basePath is empty by default. Only set NEXT_PUBLIC_BASE_PATH at build time
 * when hosting under a sub-path (e.g. https://example.com/go4tpg).
 * It must stay in sync with `src/lib/basePath.ts`, which reads the same value.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  trailingSlash: true,
  // A stray package-lock.json in the parent directory (d:\Remap) makes Turbopack
  // infer the wrong workspace root; pin it to this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
