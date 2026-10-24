import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { breadcrumbLd, itemListLd } from "@/lib/seo";
import { categories, getCategory, toolsInCategory } from "@/lib/data";

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
    description: `${c.tagline} ${c.intro}`,
    alternates: { canonical: `/categories/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const list = toolsInCategory(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={[breadcrumbLd([[c.name, `/categories/${c.slug}`]]), itemListLd(c, list)]} />
      <header className="mx-auto max-w-3xl py-10 text-center">
        <p className="label">
          <Link href="/#categories" className="hover:text-hover">Browse by task</Link> &middot; {c.name}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
          {c.headline}
        </h1>
        <p className="mt-4 text-lg italic">{c.intro}</p>
      </header>
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <li key={t.slug}>
            <ToolCard tool={t} headingLevel={2} />
          </li>
        ))}
      </ul>
      <p className="mt-12 border-t border-rule pt-4 text-sm italic text-muted">
        Listed alphabetically. Sponsored notices, when there are any, sit at the
        top and are always labeled.{" "}
        <Link href="/submit" className="link text-ink">
          Know a tool we should add?
        </Link>
      </p>
    </div>
  );
}
