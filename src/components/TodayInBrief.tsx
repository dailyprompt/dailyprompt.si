import Link from "next/link";
import type { Edition } from "@/lib/data";

// The latest edition of The Daily Prompt in brief: headline plus the top
// stories, each linking to the edition. Prompt codes and the poll get their
// own slots here once editions start carrying them.
export function TodayInBrief({ edition }: { edition: Edition }) {
  const href = `/editions/${edition.date}`;
  const items = edition.top_news.slice(0, 4);
  return (
    <section aria-labelledby="brief-h">
      <div className="rule-double" />
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="brief-h" className="label">Today in brief</h2>
        <p className="label text-muted !font-normal">
          The Daily Prompt &middot; No. {edition.edition}
        </p>
      </div>
      <p className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
        <Link href={href} className="hover:text-hover">{edition.headline}</Link>
      </p>
      <ol className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((n, i) => (
          <li key={n.url} className="border-t border-rule pt-2 text-[0.95rem] leading-snug">
            <Link href={`${href}#story-${i + 1}`} className="hover:text-hover">
              {n.title}
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm">
        <Link href={href} className="link italic">Read today&apos;s edition</Link>
      </p>
    </section>
  );
}
