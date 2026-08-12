import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Metadata routes are Route Handlers. This was required under
// `output: "export"`; it is kept now that the app runs as a Node server so the
// sitemap is still generated once at build time rather than on every request.
export const dynamic = "force-static";

/**
 * The homepage, the services hub, the three category pages, and the five child
 * offer pages. Trailing slashes match `trailingSlash: true` in next.config.ts,
 * so each URL here is the same one that page's canonical tag points at.
 * `lastModified` is stamped at build time, so each deploy tells crawlers the
 * content moved on.
 */
const categoryRoutes = ["/services/", "/summits/", "/installations/", "/retreats-coaching/"];

/**
 * The child pages are where paid traffic and outreach land, so they carry the
 * same priority as the category pages above them rather than being demoted for
 * sitting one level deeper.
 */
const offerRoutes = [
  "/summits/annual/",
  "/summits/mid-year/",
  "/installations/sprint/",
  "/retreats-coaching/at-sea/",
  "/retreats-coaching/reserve/",
];

const routes = ["/", ...categoryRoutes, ...offerRoutes];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
