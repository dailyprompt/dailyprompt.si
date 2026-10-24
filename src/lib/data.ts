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
  headline: string; // "Best AI tools for ..." page and lead-story headline
  tagline: string;
  intro: string;
  summary: string; // quotable "short answer": which tool is best for whom
  meta_description: string; // 150-160 characters
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
  new_tools: { name: string; category: string; url: string; slug: string | null; update?: string }[];
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

// Tool names that are also everyday words; never auto-linked from prose.
const GENERIC_NAMES = new Set(["Make", "Rows", "Hex", "Pika", "Gemini", "Claude", "Codex", "Comet"]);

// Directory tools an edition talks about: its new_tools plus any tool named
// (case-sensitive, whole word) in its headline, dek or top stories.
export function toolsInEdition(e: Edition) {
  const text = [e.headline, e.dek, ...e.top_news.flatMap((n) => [n.title, n.summary])].join(" ");
  const named = tools.filter(
    (t) =>
      !GENERIC_NAMES.has(t.name) &&
      new RegExp(`(^|[^\\w])${t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`).test(text),
  );
  const fromNew = e.new_tools.map((nt) => (nt.slug ? getTool(nt.slug) : undefined));
  const seen = new Set<string>();
  return [...fromNew, ...named].filter((t): t is Tool => !!t && !seen.has(t.slug) && !!seen.add(t.slug));
}

// "New this week": tools from The Daily Prompt's new_tools in the editions of
// the 7 days up to the latest edition, limited to ones in the directory
// (every directory entry has been checked against its official site).
// `update` names the new feature when an existing product shipped it.
export function newThisWeek(limit = 5) {
  if (!latestEdition) return [];
  const from = addDays(latestEdition.date, -6);
  const seen = new Set<string>();
  const out: { tool: Tool; update?: string }[] = [];
  for (const e of editions.filter((e) => e.date >= from)) {
    for (const nt of e.new_tools) {
      const tool = nt.slug ? getTool(nt.slug) : undefined;
      if (tool && !seen.has(tool.slug)) {
        seen.add(tool.slug);
        out.push({ tool, update: nt.update });
      }
    }
  }
  return out.slice(0, limit);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// The paper's date: the latest edition, or the build date.
export const paperDate: string | undefined = latestEdition?.date ?? process.env.BUILD_DATE;

// The lead "Best AI tools for ..." story rotates weekly through the
// categories, starting with Meetings in the week of 2026-10-19.
const ROTATION_START = { monday: "2026-10-19", category: "meetings" };
export function leadCategory(): Category {
  const start = categories.findIndex((c) => c.slug === ROTATION_START.category);
  const day = paperDate ?? ROTATION_START.monday;
  const weeks = Math.floor(
    (Date.parse(day + "T00:00:00Z") - Date.parse(ROTATION_START.monday + "T00:00:00Z")) /
      (7 * 86400000),
  );
  const n = categories.length;
  return categories[(((start + weeks) % n) + n) % n];
}

// Until editions supply new tools, the sidebar shows a fixed editor's pick.
const FEATURED = ["claude-code", "perplexity", "granola", "elevenlabs", "canva"];
export function featuredTools() {
  return FEATURED.map(getTool).filter((t): t is Tool => !!t);
}

// When a category's entries were last checked: the newest `updated` date.
export function lastUpdated(slug: string) {
  return toolsInCategory(slug).reduce((m, t) => (t.updated > m ? t.updated : m), "");
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
