import Link from "next/link";
import { FactCell } from "@/components/FactCell";
import { JsonLd } from "@/components/JsonLd";
import { PricingTag } from "@/components/ToolCard";
import { formatDate, getCategory, getTool, type Tool } from "@/lib/data";
import { pagePath, pagesForCategory, type EditorialPage } from "@/lib/pages";
import { abs, breadcrumbLd } from "@/lib/seo";

// Shared layout for "X vs Y" and "X alternatives" pages: the short answer
// first, a sourced fact table, sections, our verdict, then related pages.
export function EditorialPageView({ page }: { page: EditorialPage }) {
  const c = getCategory(page.category)!;
  const tools = page.tools.map(getTool).filter((t): t is Tool => !!t);
  const related = pagesForCategory(page.category).filter((p) => p !== page);
  const path = pagePath(page);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <JsonLd
        data={[
          breadcrumbLd([
            [c.name, `/categories/${c.slug}`],
            [page.h1, path],
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.h1,
            description: page.meta_description,
            dateModified: page.updated,
            mainEntityOfPage: abs(path),
            author: { "@type": "Organization", name: "The Daily Prompt", url: abs("/") },
            publisher: { "@type": "Organization", name: "The Daily Prompt", url: abs("/") },
          },
        ]}
      />
      <header className="py-10 text-center">
        <p className="label">
          <Link href={`/categories/${c.slug}`} className="hover:text-hover">{c.name}</Link> &middot;{" "}
          {page.type === "compare" ? "Comparison" : "Alternatives"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">{page.h1}</h1>
        <p className="mt-4 text-sm text-muted">
          Last updated <time dateTime={page.updated}>{formatDate(page.updated)}</time> &middot;{" "}
          Facts from official pricing and help pages &middot;{" "}
          <Link href="/about#how-we-review" className="link">How we review</Link>
        </p>
      </header>

      <section aria-labelledby="answer-h" className="border-2 border-ink p-5 sm:p-6">
        <h2 id="answer-h" className="label">The short answer</h2>
        <p className="mt-2 font-display text-xl leading-snug sm:text-2xl">{page.summary}</p>
      </section>

      {page.table && (
        <section aria-labelledby="table-h" className="mt-10">
          <div className="rule-double" />
          <h2 id="table-h" className="label mt-3">{page.table.caption}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="label w-32 py-2 pr-4"><span className="sr-only">Feature</span></th>
                  {tools.map((t) => (
                    <th key={t.slug} scope="col" className="py-2 pr-4 font-display text-base font-bold">
                      <Link href={`/tools/${t.slug}`} className="hover:text-hover">{t.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((row) => (
                  <tr key={row.label} className="border-b border-rule align-top">
                    <th scope="row" className="label py-3 pr-4">{row.label}</th>
                    {tools.map((t) => (
                      <td key={t.slug} className="py-3 pr-4">
                        {row.cells[t.slug] ? <FactCell fact={row.cells[t.slug]} /> : <span className="text-muted">&ndash;</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page.sections.map((s, i) => {
        const t = s.tool ? getTool(s.tool) : undefined;
        return (
          <section key={i} aria-labelledby={`s${i}-h`} className="mt-10">
            <div className="rule-double" />
            <h2 id={`s${i}-h`} className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              {s.heading}
            </h2>
            {t && (
              <p className="mt-2 text-sm">
                <PricingTag pricing={t.pricing} />
                <span aria-hidden="true"> &middot; </span>
                <span className="italic">Best for {t.best_for.charAt(0).toLowerCase() + t.best_for.slice(1)}</span>
                <span aria-hidden="true"> &middot; </span>
                <Link href={`/tools/${t.slug}`} className="link">Our verdict on {t.name}</Link>
              </p>
            )}
            {s.body.map((para, j) => (
              <p key={j} className="mt-3 leading-relaxed">{para}</p>
            ))}
            {s.facts && s.facts.length > 0 && (
              <ul className="mt-3 list-disc pl-5 text-sm">
                {s.facts.map((f, j) => (
                  <li key={j} className="mt-1"><FactCell fact={f} /></li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <section aria-labelledby="verdict-h" className="mt-10 border-2 border-ink p-5 sm:p-6">
        <h2 id="verdict-h" className="label">{page.verdict.heading}</h2>
        {page.verdict.body.map((para, j) => (
          <p key={j} className="mt-2 font-display text-lg leading-snug">{para}</p>
        ))}
      </section>

      <section aria-labelledby="related-h" className="mt-10">
        <div className="rule-thick" />
        <h2 id="related-h" className="label mt-3">Keep comparing</h2>
        <ul className="mt-2 divide-y divide-rule">
          <li className="py-2">
            <Link href={`/categories/${c.slug}`} className="link">{c.headline}</Link>
          </li>
          {related.map((p) => (
            <li key={p.slug} className="py-2">
              <Link href={pagePath(p)} className="link">{p.h1}</Link>
            </li>
          ))}
          {tools.map((t) => (
            <li key={t.slug} className="py-2">
              <Link href={`/tools/${t.slug}`} className="link">{t.name}: pricing and verdict</Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 border-t border-rule pt-4 text-sm italic text-muted">
        We compare tools using their official pricing and help pages, linked next
        to each fact. Plans change often; confirm on the official site before you
        buy. No tool paid to appear on this page.
      </p>
    </div>
  );
}
