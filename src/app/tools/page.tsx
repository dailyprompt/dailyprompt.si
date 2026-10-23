import type { Metadata } from "next";
import Link from "next/link";
import { PricingTag } from "@/components/ToolCard";
import { categories, tools, toolsInCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "All AI tools",
  description: `Every tool in The Daily Prompt directory, ${tools.length} in all, grouped by task with a one-line verdict.`,
  alternates: { canonical: "/tools" },
};

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="mx-auto max-w-3xl py-10 text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">All tools</h1>
        <p className="mt-3 text-lg italic">
          {tools.length} tools, grouped by task. Each has a one-line verdict.
        </p>
      </header>
      <div className="gap-10 [column-rule:1px_solid_var(--rule)] md:columns-2 lg:columns-3">
        {categories.map((c) => (
          <section key={c.slug} className="mb-8 break-inside-avoid">
            <div className="rule-thick" />
            <h2 className="mt-2 font-display text-2xl font-bold">
              <Link href={`/categories/${c.slug}`} className="hover:text-hover">
                {c.name}
              </Link>
            </h2>
            <ul className="mt-2 divide-y divide-rule">
              {toolsInCategory(c.slug).map((t) => (
                <li key={t.slug} className="py-2">
                  <Link href={`/tools/${t.slug}`} className="font-bold hover:text-hover">
                    {t.name}
                  </Link>{" "}
                  <span className="text-sm text-muted">
                    <PricingTag pricing={t.pricing} />
                  </span>
                  <p className="text-sm">{t.verdict}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
