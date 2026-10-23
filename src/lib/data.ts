import fs from "node:fs";
import path from "node:path";
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

export interface Edition {
  date: string;
  edition: number;
  headline: string;
  dek: string;
  top_news: { title: string; summary: string; source: string; url: string; published?: string }[];
  new_tools: { name: string; category: string; url: string; slug: string | null }[];
  prompt_codes?: unknown;
  poll?: unknown;
}

// Editions of The Daily Prompt, imported by scripts/import-editions.mjs.
const editionsDir = path.join(process.cwd(), "data/editions");
export const editions: Edition[] = fs.existsSync(editionsDir)
  ? fs
      .readdirSync(editionsDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => JSON.parse(fs.readFileSync(path.join(editionsDir, f), "utf8")) as Edition)
      .sort((a, b) => b.date.localeCompare(a.date))
  : [];

export const latestEdition: Edition | undefined = editions[0];

export function getEdition(date: string) {
  return editions.find((e) => e.date === date);
}

// "New this week": tools from The Daily Prompt's new_tools in the editions of
// the 7 days up to the latest edition, limited to ones in the directory
// (every directory entry has been checked against its official site).
export function newThisWeek(limit = 5) {
  if (!latestEdition) return [];
  const cutoff = new Date(latestEdition.date + "T00:00:00Z");
  cutoff.setUTCDate(cutoff.getUTCDate() - 6);
  const from = cutoff.toISOString().slice(0, 10);
  const seen = new Set<string>();
  const out: Tool[] = [];
  for (const e of editions.filter((e) => e.date >= from)) {
    for (const nt of e.new_tools) {
      const t = nt.slug ? getTool(nt.slug) : undefined;
      if (t && !seen.has(t.slug)) {
        seen.add(t.slug);
        out.push(t);
      }
    }
  }
  return out.slice(0, limit);
}

// Until editions supply new tools, the sidebar shows a fixed editor's pick.
const FEATURED = ["claude-code", "perplexity", "granola", "elevenlabs", "canva"];
export function featuredTools() {
  return FEATURED.map(getTool).filter((t): t is Tool => !!t);
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
