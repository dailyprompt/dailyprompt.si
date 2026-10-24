import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { editions, formatDate, getEdition, getTool, toolsInEdition } from "@/lib/data";
import { breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return editions.map((e) => ({ date: e.date }));
}

export async function generateMetadata({
  params,
}: PageProps<"/editions/[date]">): Promise<Metadata> {
  const { date } = await params;
  const e = getEdition(date);
  if (!e) return {};
  return {
    title: `AI news, ${formatDate(e.date)}: No. ${e.edition}`,
    description: e.dek,
    alternates: { canonical: `/editions/${e.date}` },
  };
}

export default async function EditionPage({ params }: PageProps<"/editions/[date]">) {
  const { date } = await params;
  const e = getEdition(date);
  if (!e) notFound();
  const i = editions.indexOf(e);
  const newer = editions[i - 1];
  const newSlugs = new Set(e.new_tools.map((nt) => nt.slug));
  const mentioned = toolsInEdition(e).filter((t) => !newSlugs.has(t.slug));
  const older = editions[i + 1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={breadcrumbLd([[`No. ${e.edition}`, `/editions/${e.date}`]])} />
      <p className="label text-center">
        No. {e.edition} &middot; <time dateTime={e.date}>{formatDate(e.date)}</time>
      </p>
      <h1 className="mt-3 text-center font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
        {e.headline}
      </h1>
      <p className="mt-4 text-center text-lg italic">{e.dek}</p>

      <section aria-labelledby="top-h" className="mt-10">
        <div className="rule-double" />
        <h2 id="top-h" className="label mt-3">Top news</h2>
        <ol className="mt-2 divide-y divide-rule">
          {e.top_news.map((n, k) => (
            <li key={n.url} id={`story-${k + 1}`} className="scroll-mt-6 py-5">
              <h3 className="font-display text-2xl font-bold leading-tight">{n.title}</h3>
              <p className="mt-2">{n.summary}</p>
              <p className="mt-2 text-sm">
                Source:{" "}
                <a href={n.url} target="_blank" rel="noopener" className="link">
                  {n.source}
                </a>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {e.new_tools.length > 0 && (
        <section aria-labelledby="tools-h" className="mt-8">
          <div className="rule-thick" />
          <h2 id="tools-h" className="label mt-3">New tools in this edition</h2>
          <ul className="mt-2 divide-y divide-rule">
            {e.new_tools.map((nt) => {
              const t = nt.slug ? getTool(nt.slug) : undefined;
              return (
                <li key={nt.name} className="py-3">
                  {t ? (
                    <Link href={`/tools/${t.slug}`} className="font-display text-lg font-bold hover:text-hover">
                      {nt.update ? `${t.name}: ${nt.update}` : nt.name}
                    </Link>
                  ) : (
                    <span className="font-display text-lg font-bold">{nt.name}</span>
                  )}
                  <span className="label ml-2 text-muted !font-normal">{nt.category}</span>
                  {t ? (
                    <p className="text-sm">{t.verdict}</p>
                  ) : (
                    <p className="text-sm italic text-muted">Not listed in the directory.</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {mentioned.length > 0 && (
        <section aria-labelledby="mentioned-h" className="mt-8">
          <div className="rule-thick" />
          <h2 id="mentioned-h" className="label mt-3">Also mentioned in this edition</h2>
          <ul className="mt-2 divide-y divide-rule">
            {mentioned.map((t) => (
              <li key={t.slug} className="py-3">
                <Link href={`/tools/${t.slug}`} className="font-display text-lg font-bold hover:text-hover">
                  {t.name}
                </Link>
                <p className="text-sm">{t.verdict}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Editions" className="mt-10 flex justify-between border-t border-ink pt-4 text-sm">
        {older ? (
          <Link href={`/editions/${older.date}`} className="link">No. {older.edition}</Link>
        ) : <span />}
        {newer && (
          <Link href={`/editions/${newer.date}`} className="link">No. {newer.edition}</Link>
        )}
      </nav>
    </div>
  );
}
