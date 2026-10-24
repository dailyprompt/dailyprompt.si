import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PricingTag, SponsoredTag } from "@/components/ToolCard";
import { categories, formatDate, getCategory, hostname, lastUpdated, toolsInCategory } from "@/lib/data";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: c.headline,
    description: c.meta_description,
    alternates: { canonical: `/categories/${c.slug}` },
    openGraph: { title: c.headline, description: c.meta_description },
  };
}

// A "Best AI tools for ..." money page: the short answer first (quotable by
// AI assistants), then a table to scan, then our verdict on every tool.
export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const list = toolsInCategory(slug);
  const updated = lastUpdated(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <JsonLd data={[breadcrumbLd([[c.name, `/categories/${c.slug}`]]), itemListLd(c, list)]} />
      <header className="py-10 text-center">
        <p className="label">
          <Link href="/#categories" className="hover:text-hover">Browse by task</Link> &middot; {c.name}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
          {c.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg italic">{c.intro}</p>
        <p className="mt-4 text-sm text-muted">
          Last updated <time dateTime={updated}>{formatDate(updated)}</time> &middot; {list.length} tools &middot;{" "}
          <Link href="/about" className="link">How we review</Link>
        </p>
      </header>

      <section aria-labelledby="answer-h" className="border-2 border-ink p-5 sm:p-6">
        <h2 id="answer-h" className="label">The short answer</h2>
        <p className="mt-2 font-display text-xl leading-snug sm:text-2xl">{c.summary}</p>
      </section>

      <section aria-labelledby="glance-h" className="mt-10">
        <div className="rule-double" />
        <h2 id="glance-h" className="label mt-3">At a glance</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="label py-2 pr-4">Tool</th>
                <th scope="col" className="label py-2 pr-4">Best for</th>
                <th scope="col" className="label py-2">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.slug} className="border-b border-rule align-top">
                  <th scope="row" className="py-2 pr-4 font-bold">
                    <a href={`#${t.slug}`} className="hover:text-hover">{t.name}</a>
                    {t.sponsored && <span className="ml-2"><SponsoredTag /></span>}
                  </th>
                  <td className="py-2 pr-4">{t.best_for}</td>
                  <td className="py-2 whitespace-nowrap"><PricingTag pricing={t.pricing} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="verdicts-h" className="mt-10">
        <div className="rule-double" />
        <h2 id="verdicts-h" className="label mt-3">Our verdicts</h2>
        <div className="divide-y divide-rule">
          {list.map((t) => (
            <article
              key={t.slug}
              id={t.slug}
              className={`scroll-mt-6 py-6 ${t.sponsored ? "my-4 border-2 border-ink px-4" : ""}`}
            >
              {t.sponsored && (
                <p className="mb-2">
                  <SponsoredTag />{" "}
                  <span className="text-sm italic">This maker pays for placement. The verdict is ours.</span>
                </p>
              )}
              <h3 className="font-display text-2xl font-bold">
                <Link href={`/tools/${t.slug}`} className="hover:text-hover">{t.name}</Link>
              </h3>
              <p className="mt-2 font-display text-lg leading-snug">{t.verdict}</p>
              <p className="mt-2">{t.what}</p>
              <p className="mt-3 text-sm">
                <span className="label text-muted">Best for</span> {t.best_for}
                <span aria-hidden="true"> &middot; </span>
                <PricingTag pricing={t.pricing} />
                <span aria-hidden="true"> &middot; </span>
                <span className="text-muted">
                  Checked <time dateTime={t.updated}>{formatDate(t.updated)}</time>
                </span>
              </p>
              <p className="mt-2 text-sm">
                <Link href={`/tools/${t.slug}`} className="link">{t.name} in detail</Link>
                <span aria-hidden="true"> &middot; </span>
                <a href={t.url} target="_blank" rel="noopener" className="link">
                  {hostname(t.url)}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-6 border-t border-rule pt-4 text-sm italic text-muted">
        Listed alphabetically. Sponsored notices, when there are any, sit at the
        top and are always labeled; a sponsor never gets a better verdict. Prices
        come from each tool&apos;s official site; confirm before you buy.{" "}
        <Link href="/submit" className="link text-ink">Know a tool we should add?</Link>
      </p>
    </div>
  );
}
