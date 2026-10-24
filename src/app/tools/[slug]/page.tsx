import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PricingTag, SponsoredTag, ToolCard } from "@/components/ToolCard";
import { pagePath, pagesForTool } from "@/lib/pages";
import { breadcrumbLd, softwareLd } from "@/lib/seo";
import { formatDate, getCategory, getTool, hostname, tools, toolsInCategory } from "@/lib/data";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return {
    title: `${t.name}: pricing and verdict`,
    description: `${t.what} Verdict: ${t.verdict}`,
    alternates: { canonical: `/tools/${t.slug}` },
  };
}

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) notFound();
  const c = getCategory(t.category);
  const others = toolsInCategory(t.category)
    .filter((o) => o.slug !== t.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd
        data={[
          breadcrumbLd([
            ...(c ? [[c.name, `/categories/${c.slug}`] as [string, string]] : []),
            [t.name, `/tools/${t.slug}`],
          ]),
          softwareLd(t),
        ]}
      />
      <article className="grid gap-10 py-10 lg:grid-cols-[1fr_18rem] lg:gap-0">
        <div className="lg:border-r lg:border-rule lg:pr-8">
          <p className="label">
            {c && (
              <Link href={`/categories/${c.slug}`} className="hover:text-hover">
                {c.name}
              </Link>
            )}
          </p>
          {t.sponsored && (
            <p className="mt-3">
              <SponsoredTag />{" "}
              <span className="text-sm italic">
                This maker pays for placement. The verdict is ours.
              </span>
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
            {t.name}
          </h1>
          <p className="mt-4 text-lg italic">{t.what}</p>

          <section aria-labelledby="verdict-h" className="mt-8">
            <div className="rule-double" />
            <h2 id="verdict-h" className="label mt-3">Our verdict</h2>
            <p className="mt-2 font-display text-2xl leading-snug">{t.verdict}</p>
          </section>

          {pagesForTool(t.slug).length > 0 && (
            <section aria-labelledby="cmp-h" className="mt-8 border-t border-rule pt-3">
              <h2 id="cmp-h" className="label">Compare</h2>
              <ul className="mt-2">
                {pagesForTool(t.slug).map((p) => (
                  <li key={p.slug}>
                    <Link href={pagePath(p)} className="link">{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="uses-h" className="mt-8 border-t border-rule pt-3">
            <h2 id="uses-h" className="label">Use it for</h2>
            <ul className="mt-2 list-disc pl-5">
              {t.use_cases.map((u) => (
                <li key={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-4 text-sm lg:pl-8">
          <div className="rule-thick" />
          <a href={t.url} target="_blank" rel="noopener" className="btn">
            Visit {hostname(t.url)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="label text-muted">Pricing</dt>
            <dd><PricingTag pricing={t.pricing} /></dd>
            <dt className="label text-muted">Best for</dt>
            <dd>{t.best_for}</dd>
            <dt className="label text-muted">Checked</dt>
            <dd>
              <time dateTime={t.updated}>{formatDate(t.updated)}</time>
            </dd>
          </dl>
          <p className="border-t border-rule pt-3 text-xs italic">
            Pricing and features checked against{" "}
            <a href={t.source_url} target="_blank" rel="noopener" className="link">
              the official site
            </a>
            . Prices change; confirm before you buy.
          </p>
        </aside>
      </article>

      {others.length > 0 && c && (
        <section aria-labelledby="alt-h">
          <div className="rule-double" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="alt-h" className="label">Other {c.name.toLowerCase()} tools</h2>
            <Link href={`/categories/${c.slug}`} className="link text-sm italic">
              {c.headline}, compared
            </Link>
          </div>
          <ul className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <ToolCard tool={o} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
