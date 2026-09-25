/**
 * Canonical production origin, shared by the root metadata, the sitemap, and
 * robots.txt so the three can never drift apart. No trailing slash — callers
 * append their own path.
 */
export const siteUrl = "https://www.go4tpg.com";

/**
 * The site-wide share card. Next.js replaces a parent's `openGraph` and
 * `twitter` objects wholesale when a page declares its own, so every page that
 * sets either one spreads these in rather than inheriting them from the root
 * layout. Absolute URL, JPEG: some share scrapers reject relative URLs and WebP.
 */
export const shareImage = {
  url: `${siteUrl}/assets/og/tpg-og-cyrolia.jpg`,
  width: 1200,
  height: 630,
  alt: "Cyrolia, The Peterson Group's sailboat, at anchor in French Polynesia",
};

/** Fallback og:description and twitter:description for pages without their own. */
export const shareDescription =
  "Facilitated planning summits for leadership teams. One day. The plan your business runs on.";
