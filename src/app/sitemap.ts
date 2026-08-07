import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Metadata routes are Route Handlers, and `output: "export"` refuses to build
// one that has not explicitly opted into static rendering.
export const dynamic = "force-static";

/**
 * The homepage plus the three category pages. Trailing slashes match
 * `trailingSlash: true` in next.config.ts, so each URL here is the same one
 * that page's canonical tag points at. `lastModified` is stamped at build
 * time, so each deploy tells crawlers the content moved on.
 */
const routes = ["/", "/summits/", "/installations/", "/retreats-coaching/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
