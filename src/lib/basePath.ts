/**
 * Mirrors `basePath` in next.config.ts. next/image does not auto-prefix
 * `src` with basePath (only next/link does), so asset URLs passed to
 * next/image must be prefixed manually.
 */
export const basePath = "/go4tpg";

export function withBasePath(assetPath: string): string {
  return `${basePath}${assetPath}`;
}
