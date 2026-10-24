import { formatDate } from "@/lib/data";
import type { Fact } from "@/lib/pages";

// A fact with its official source and checked date. Unconfirmed facts are
// labeled as such, never presented as settled.
export function FactCell({ fact }: { fact: Fact }) {
  return (
    <>
      <span>{fact.text}</span>
      {!fact.confirmed && (
        <span className="label ml-1 border border-ink px-1 !text-[0.6rem]">Not confirmed</span>
      )}
      {fact.source && (
        <span className="mt-0.5 block text-xs text-muted">
          <a href={fact.source} target="_blank" rel="noopener" className="link">
            Source
          </a>
          {fact.checked && (
            <>
              , checked <time dateTime={fact.checked}>{formatDate(fact.checked)}</time>
            </>
          )}
        </span>
      )}
    </>
  );
}
