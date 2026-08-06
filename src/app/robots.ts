import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// See the note in sitemap.ts — required under `output: "export"`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
