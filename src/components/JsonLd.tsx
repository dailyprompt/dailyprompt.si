// Structured data for search engines. "<" is escaped so data can't close
// the script tag (per the Next.js JSON-LD guide).
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
