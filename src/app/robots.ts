import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

// Search engines and AI assistants are welcome; we want to be read and cited.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: abs("/sitemap.xml"),
    host: "dailyprompt.si",
  };
}
