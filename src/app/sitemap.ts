import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Metadata routes are Route Handlers, and `output: "export"` refuses to build
// one that has not explicitly opted into static rendering.
export const dynamic = "force-static";

/**
 * One entry, because the site is a single page. The trailing slash matches
 * `trailingSlash: true` in next.config.ts, so the URL here is the same one the
 * canonical tag points at. `lastModified` is stamped at build time, so each
 * deploy tells crawlers the content moved on.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
