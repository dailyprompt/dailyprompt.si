import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "How The Daily Prompt picks and reviews AI tools, how it makes money, and why rankings are never for sale.",
};

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-6 font-display text-2xl font-bold">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold">About The Daily Prompt</h1>
      <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed">
        <p>
          New AI tools launch every day, and most people don&apos;t know which
          one to use for which job. We sort tools by the task you want to get
          done, and give each one a short, honest verdict.
        </p>
      </div>

      <H2>How we pick and review tools</H2>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed">
        <li>We open every tool&apos;s official site before it goes in the directory.</li>
        <li>We write our own descriptions. We don&apos;t copy marketing copy or other directories.</li>
        <li>Verdicts are one sentence and include the catch, when there is one.</li>
        <li>
          Prices come from the official pricing page. When a price isn&apos;t
          published or we can&apos;t confirm it, we say &quot;Unknown&quot;
          rather than guess.
        </li>
        <li>We check the directory every weekday and update tools when they change.</li>
      </ul>

      <H2 id="sponsorship">How sponsorship works</H2>
      <p className="mt-4 leading-relaxed">
        The site is paid for by two things, both always labeled
        &quot;Sponsored&quot;:
      </p>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed">
        <li>
          <strong>Featured listings.</strong> A tool maker can pay to be pinned
          at the top of a category for a set time.
        </li>
        <li>
          <strong>Newsletter sponsor.</strong> Each weekly issue has one
          labeled sponsor slot.
        </li>
      </ul>
      <p className="mt-4 leading-relaxed">
        <strong>Rankings and verdicts are never for sale.</strong> A sponsor
        gets placement, not a better review. A sponsored tool keeps the same
        verdict it would have had anyway. If we ever add affiliate links,
        we&apos;ll mark them clearly.
      </p>

      <H2>Spotted a mistake?</H2>
      <p className="mt-4 leading-relaxed">
        Tools change fast. If a price, feature or link is wrong, or you know a
        tool we should add,{" "}
        <Link href="/submit" className="link">
          send it our way
        </Link>
        .
      </p>
    </div>
  );
}
