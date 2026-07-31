/**
 * Mirrors `basePath` in next.config.ts, which reads the same env var. next/image
 * does not auto-prefix `src` with basePath (only next/link does), so asset URLs
 * passed to next/image must be prefixed manually.
 *
 * Empty for the default root deployment; NEXT_PUBLIC_BASE_PATH is inlined into
 * the client bundle at build time, so changing it requires a rebuild.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(assetPath: string): string {
  return `${basePath}${assetPath}`;
}
