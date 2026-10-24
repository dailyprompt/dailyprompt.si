import fs from "node:fs";
import path from "node:path";

// Editorial pages ("X vs Y", "X alternatives", guides) live as data in
// data/pages/<slug>.json, like the tool entries.

// One fact in a comparison table. Every fact carries the official page it
// came from and the date we checked it; anything we couldn't confirm on an
// official page is shown as unconfirmed rather than guessed.
export interface Fact {
  text: string;
  source?: string;
  checked?: string;
  confirmed: boolean;
}

export interface FactRow {
  label: string;
  cells: Record<string, Fact>; // keyed by tool slug
}

export interface Section {
  heading: string;
  tool?: string; // tool slug, when the section is about one tool
  body: string[]; // paragraphs
  facts?: Fact[]; // sourced facts listed under the paragraphs
}

export interface EditorialPage {
  slug: string;
  type: "compare" | "alternatives";
  category: string;
  title: string; // under 60 characters with " | The Daily Prompt"
  meta_description: string; // 150-160 characters
  h1: string;
  updated: string;
  summary: string; // the quotable short answer
  tools: string[]; // the tools compared, or [subject, ...alternatives]
  table?: { caption: string; rows: FactRow[] };
  sections: Section[];
  verdict: { heading: string; body: string[] };
}

const dir = path.join(process.cwd(), "data/pages");
export const pages: EditorialPage[] = fs.existsSync(dir)
  ? fs
      .readdirSync(dir)
      .filter((f) => /^[a-z0-9-]+\.json$/.test(f))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as EditorialPage)
      .sort((a, b) => a.h1.localeCompare(b.h1))
  : [];

export const pagePath = (p: EditorialPage) =>
  p.type === "compare" ? `/compare/${p.slug}` : `/alternatives/${p.slug}`;

export function getPage(type: EditorialPage["type"], slug: string) {
  return pages.find((p) => p.type === type && p.slug === slug);
}

export function pagesForCategory(category: string) {
  return pages.filter((p) => p.category === category);
}

export function pagesForTool(slug: string) {
  return pages.filter((p) => p.tools.includes(slug));
}

// Extra hub content for a category page (e.g. Meetings: free plans compared,
// bot or no bot), in data/category-extras/<category>.json.
export interface CategoryExtras {
  table?: { caption: string; tools: string[]; rows: FactRow[] };
  sections?: Section[];
}

export function categoryExtras(category: string): CategoryExtras | undefined {
  const f = path.join(process.cwd(), "data/category-extras", `${category}.json`);
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as CategoryExtras) : undefined;
}
