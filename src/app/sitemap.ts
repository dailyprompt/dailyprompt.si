import type { MetadataRoute } from "next";
import { categories, editions, paperDate, tools, toolsInCategory } from "@/lib/data";
import { pagePath, pages } from "@/lib/pages";
import { abs } from "@/lib/seo";

// Dates come from the data, so a page's lastModified changes only when its
// content does.
export default function sitemap(): MetadataRoute.Sitemap {
  const newest = (dates: string[]) => dates.reduce((m, d) => (d > m ? d : m), "");
  const allTools = newest(tools.map((t) => t.updated));

  return [
    { url: abs("/"), lastModified: paperDate ?? allTools, changeFrequency: "daily", priority: 1 },
    { url: abs("/tools"), lastModified: allTools, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({
      url: abs(`/categories/${c.slug}`),
      lastModified: newest(toolsInCategory(c.slug).map((t) => t.updated)) || allTools,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...tools.map((t) => ({
      url: abs(`/tools/${t.slug}`),
      lastModified: t.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...pages.map((p) => ({
      url: abs(pagePath(p)),
      lastModified: p.updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...editions.map((e) => ({
      url: abs(`/editions/${e.date}`),
      lastModified: e.date,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: abs("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/submit"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
