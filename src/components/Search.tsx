"use client";

import Link from "next/link";
import { useId, useState } from "react";

export interface SearchItem {
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  verdict: string;
  text: string; // lowercased haystack: name, use cases, what, best for, category
}

const STOP = new Set(
  "a an the to for my me i of and or with on in at do make take get help want need ai tool tools best some app good".split(" "),
);

// Crude stemming so "notes" finds "note" and "podcasts" finds "podcast".
function terms(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
}

// Rank by how many query terms match, weighting the name and use cases
// (everything before the "|" in the haystack) above the description.
function score(item: SearchItem, words: string[]) {
  let s = 0;
  const name = item.name.toLowerCase();
  const head = item.text.slice(0, item.text.indexOf("|"));
  for (const w of words) {
    if (name.includes(w)) s += 4;
    else if (head.includes(w)) s += 3;
    else if (item.text.includes(w)) s += 1;
  }
  return s;
}

export function Search({ items, examples }: { items: SearchItem[]; examples: string[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const words = terms(q);

  const results = words.length
    ? items
        .map((item) => ({ item, s: score(item, words) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s || a.item.name.localeCompare(b.item.name))
        .slice(0, 8)
        .map((r) => r.item)
    : [];

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={id} className="mb-2 block font-display text-xl font-bold">
          What do you want to do?
        </label>
        <div className="flex">
          <input
            id={id}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. take meeting notes, edit a podcast"
            autoComplete="off"
            className="min-h-[44px] w-full min-w-0 border-2 border-r-0 border-ink bg-paper px-3 text-base placeholder:text-muted focus:outline-none"
          />
          <button type="submit" className="btn shrink-0">Find</button>
        </div>
      </form>

      {!q.trim() && (
        <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-muted">
          <span className="italic">Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQ(ex)}
              className="min-h-[44px] underline hover:text-ink"
            >
              {ex}
            </button>
          ))}
        </p>
      )}

      <div aria-live="polite">
        {q.trim() && results.length === 0 && (
          <p className="mt-4 text-sm text-muted">
            Nothing matches yet. Try a simpler task, or{" "}
            <Link href="/submit" className="link">
              suggest a tool
            </Link>
            .
          </p>
        )}
        {results.length > 0 && (
          <ul className="mt-4 divide-y divide-rule border-y border-ink">
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/tools/${r.slug}`}
                  className="block px-1 py-3 hover:bg-tint"
                >
                  <span className="font-display text-lg font-bold">{r.name}</span>{" "}
                  <span className="label text-muted">
                    {r.categoryName}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{r.verdict}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
