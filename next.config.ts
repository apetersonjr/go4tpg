import type { NextConfig } from "next";

/**
 * The site is served from the domain root (https://www.go4tpg.com) on the VPS,
 * so basePath is empty by default. Only set NEXT_PUBLIC_BASE_PATH at build time
 * when hosting under a sub-path (e.g. https://example.com/go4tpg).
 * It must stay in sync with `src/lib/basePath.ts`, which reads the same value.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /*
   * No `output: "export"` — it disables route handlers at build time, and the
   * berth reservation form needs `/api/berth`. The app now runs as a Node
   * server (`next start`) inside the same container behind the same Traefik
   * route; every marketing page is still prerendered at build time, so nothing
   * about how they are served changed.
   */

  /*
   * Still unoptimized. It was required under static export; with a Node server
   * the optimizer is available, but turning it on is a separate change with its
   * own risk (sharp in the image, CPU on the box, cache growth) and no benefit
   * to a site whose only raster assets are small logos.
   */
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
