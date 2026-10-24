// Import The Daily Prompt editions into data/editions/<date>.json.
//
// Usage: node scripts/import-editions.mjs <dir-of-raw-edition-json>
// The raw files are the "editions" collection of The Daily Prompt artifact,
// saved one document per file (<date>.json). Only the public, general-audience
// fields are kept: no "for_you" notes, and nothing before FIRST_PUBLIC_DATE.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FIRST_PUBLIC_DATE = "2026-10-22"; // first general-audience edition
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "data/editions");
const tools = JSON.parse(fs.readFileSync(path.join(root, "data/tools.json"), "utf8"));
// Edition tool names that map to a different directory entry (e.g. a feature
// of an existing tool). Everything else is matched by name.
const aliases = JSON.parse(fs.readFileSync(path.join(root, "data/new-tools-map.json"), "utf8"));

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const bySlug = new Set(tools.map((t) => t.slug));
const byName = new Map(tools.map((t) => [norm(t.name), t.slug]));

function slugFor(name) {
  const a = aliases[name];
  if (a && bySlug.has(a)) return a;
  return byName.get(norm(name)) ?? null;
}

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/import-editions.mjs <dir>");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

let n = 0;
for (const file of fs.readdirSync(src).filter((f) => f.endsWith(".json")).sort()) {
  const raw = JSON.parse(fs.readFileSync(path.join(src, file), "utf8"));
  const e = raw.data ?? raw; // tolerate a {data: {...}} wrapper
  if (!e.date || e.date < FIRST_PUBLIC_DATE) continue;
  const out = {
    date: e.date,
    edition: e.edition,
    headline: e.headline,
    dek: e.dek,
    top_news: (e.top_news ?? []).map(({ title, summary, source, url, published }) => ({
      title, summary, source, url, published,
    })),
    new_tools: (e.new_tools ?? []).map(({ name, category, url }) => ({
      name, category, url, slug: slugFor(name),
    })),
  };
  // Reserved for later: shown on the site when the newsroom starts sending them.
  if (e.prompt_codes) out.prompt_codes = e.prompt_codes;
  if (e.poll) out.poll = e.poll;
  fs.writeFileSync(path.join(outDir, `${e.date}.json`), JSON.stringify(out, null, 2) + "\n");
  n++;
}
console.log(`Imported ${n} edition(s) into data/editions/`);
