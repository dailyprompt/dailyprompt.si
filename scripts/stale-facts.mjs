// List facts due for a re-check: tool entries and page facts whose checked
// date is older than N days (default 60). Prices and free-plan limits first.
//
// Usage: node scripts/stale-facts.mjs [days]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const days = Number(process.argv[2] ?? 60);
const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const out = [];

for (const t of read(path.join(root, "data/tools.json"))) {
  if (t.updated < cutoff) out.push({ checked: t.updated, where: `tools.json: ${t.name}`, what: `pricing "${t.pricing}" and verdict`, source: t.source_url, priority: 0 });
}

// Walk any JSON value and collect objects that look like facts.
function facts(value, where) {
  if (Array.isArray(value)) value.forEach((v) => facts(v, where));
  else if (value && typeof value === "object") {
    if (typeof value.text === "string" && value.checked && value.checked < cutoff) {
      const priority = /\$|€|free|plan|minutes|price|month/i.test(value.text) ? 0 : 1;
      out.push({ checked: value.checked, where, what: value.text, source: value.source, priority });
    }
    for (const v of Object.values(value)) facts(v, where);
  }
}
for (const dir of ["data/pages", "data/category-extras"]) {
  const d = path.join(root, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((f) => f.endsWith(".json"))) facts(read(path.join(d, f)), `${dir}/${f}`);
}

out.sort((a, b) => a.priority - b.priority || a.checked.localeCompare(b.checked));
if (!out.length) console.log(`Nothing older than ${days} days (before ${cutoff}).`);
for (const o of out) console.log(`${o.checked}  ${o.where}\n    ${o.what}\n    ${o.source ?? "(no source)"}`);
