import Link from "next/link";
import type { Tool } from "@/lib/data";

export function PricingTag({ pricing }: { pricing: string }) {
  return <span className="label !tracking-[0.12em] !font-normal">{pricing}</span>;
}

export function SponsoredTag() {
  return <span className="label border border-ink px-1.5 py-0.5">Sponsored notice</span>;
}

// A short newspaper "brief". Sponsored entries get a boxed notice so they
// never look like an editorial pick.
export function ToolCard({ tool, showCategory }: { tool: Tool; showCategory?: string }) {
  return (
    <article
      className={`relative flex h-full flex-col gap-2 ${
        tool.sponsored ? "border-2 border-ink p-4" : "border-t border-ink pt-3"
      }`}
    >
      {(tool.sponsored || showCategory) && (
        <p className="flex flex-wrap items-center gap-2">
          {tool.sponsored && <SponsoredTag />}
          {showCategory && <span className="label text-muted">{showCategory}</span>}
        </p>
      )}
      <h3 className="font-display text-xl font-bold leading-tight">
        <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0 hover:text-hover">
          {tool.name}
        </Link>
      </h3>
      <p className="text-[0.95rem]">{tool.verdict}</p>
      <p className="mt-auto pt-1 text-sm text-muted">
        <PricingTag pricing={tool.pricing} />
        <span aria-hidden="true"> &middot; </span>
        <span className="italic">Best for {tool.best_for.charAt(0).toLowerCase() + tool.best_for.slice(1)}</span>
      </p>
    </article>
  );
}
