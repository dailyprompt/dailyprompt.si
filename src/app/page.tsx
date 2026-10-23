import Link from "next/link";
import { Search, type SearchItem } from "@/components/Search";
import { PricingTag } from "@/components/ToolCard";
import { categories, getCategory, newThisWeek, tools, toolsInCategory } from "@/lib/data";

const searchItems: SearchItem[] = tools.map((t) => {
  const categoryName = getCategory(t.category)?.name ?? t.category;
  return {
    slug: t.slug,
    name: t.name,
    category: t.category,
    categoryName,
    verdict: t.verdict,
    text: [t.name, ...t.use_cases, categoryName, "|", t.what, t.best_for]
      .join(" ")
      .toLowerCase(),
  };
});

// The lead story is a "Best AI tools for ..." comparison.
const LEAD = { category: "meetings", headline: "Best AI tools for meeting notes" };

export default function Home() {
  const lead = getCategory(LEAD.category)!;
  const leadTools = toolsInCategory(LEAD.category);
  const fresh = newThisWeek(5);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="mx-auto max-w-2xl py-8">
        <Search
          items={searchItems}
          examples={["meeting notes", "edit a podcast", "fix my code", "voiceover"]}
        />
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-0">
        <article className="lg:border-r lg:border-rule lg:pr-8">
          <div className="rule-thick" />
          <p className="label mt-3">The lead &middot; {lead.name}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
            <Link href={`/categories/${lead.slug}`} className="hover:text-hover">
              {LEAD.headline}
            </Link>
          </h1>
          <p className="mt-3 text-lg italic">{lead.intro}</p>
          <div className="mt-6 gap-8 [column-rule:1px_solid_var(--rule)] sm:columns-2">
            {leadTools.map((t) => (
              <section key={t.slug} className="mb-5 break-inside-avoid">
                <h2 className="font-display text-xl font-bold">
                  <Link href={`/tools/${t.slug}`} className="hover:text-hover">
                    {t.name}
                  </Link>
                </h2>
                <p className="mt-1">{t.verdict}</p>
                <p className="mt-1 text-sm text-muted">
                  <PricingTag pricing={t.pricing} />
                </p>
              </section>
            ))}
          </div>
          <p className="mt-2">
            <Link href={`/categories/${lead.slug}`} className="link italic">
              Compare all {lead.name.toLowerCase()} tools
            </Link>
          </p>
        </article>

        <aside className="lg:pl-8">
          <div className="rule-thick" />
          <h2 className="label mt-3">New this week</h2>
          <ul className="mt-3 divide-y divide-rule">
            {fresh.map((t) => (
              <li key={t.slug} className="py-3">
                <p className="label text-muted">{getCategory(t.category)?.name}</p>
                <h3 className="font-display text-lg font-bold leading-tight">
                  <Link href={`/tools/${t.slug}`} className="hover:text-hover">
                    {t.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm">{t.verdict}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink pt-3 text-sm">
            <Link href="/tools" className="link italic">See all {tools.length} tools</Link>
          </p>
        </aside>
      </div>

      <section id="categories" aria-labelledby="cat-h" className="mt-14 scroll-mt-4">
        <div className="rule-double" />
        <h2 id="cat-h" className="label mt-3">Browse by task</h2>
        <ul className="mt-4 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <li key={c.slug} className="border-b border-rule sm:odd:border-r lg:border-r lg:odd:border-r lg:[&:nth-child(5n)]:border-r-0">
              <Link
                href={`/categories/${c.slug}`}
                className="group flex h-full min-h-[44px] flex-col gap-1 p-4 hover:bg-tint"
              >
                <span className="font-display text-xl font-bold">{c.name}</span>
                <span className="text-sm italic text-muted">{c.tagline}</span>
                <span className="label mt-auto pt-2 !font-normal text-muted">
                  {toolsInCategory(c.slug).length} tools
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
