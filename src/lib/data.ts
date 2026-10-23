import toolsJson from "../../data/tools.json";
import categoriesJson from "../../data/categories.json";

export type Pricing = string; // "Free" | "Freemium" | "From $X/mo" | "Unknown"

export interface Tool {
  slug: string;
  name: string;
  url: string;
  category: string;
  use_cases: string[];
  what: string;
  best_for: string;
  pricing: Pricing;
  verdict: string;
  added: string;
  updated: string;
  source_url: string;
  sponsored: boolean;
  sponsor_until: string | null;
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
}

export const tools = toolsJson as Tool[];
export const categories = categoriesJson as Category[];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

// Sponsored entries are pinned first and always labeled. Within each group,
// order is alphabetical: sponsorship never changes the verdict or the ranking.
export function toolsInCategory(slug: string) {
  return tools
    .filter((t) => t.category === slug)
    .sort(
      (a, b) =>
        Number(b.sponsored) - Number(a.sponsored) ||
        a.name.localeCompare(b.name),
    );
}

// "Now" is the newest `added` date in the data, so pages stay static and
// the build is reproducible. Tools added within 7 days of it are "new".
export function newThisWeek(limit = 6) {
  const latest = tools.reduce((m, t) => (t.added > m ? t.added : m), "");
  if (!latest) return [];
  const cutoff = new Date(latest + "T00:00:00Z");
  cutoff.setUTCDate(cutoff.getUTCDate() - 6);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return tools
    .filter((t) => t.added >= cutoffStr)
    .sort((a, b) => b.added.localeCompare(a.added) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
