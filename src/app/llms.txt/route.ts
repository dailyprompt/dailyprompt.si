import { categories, latestEdition, tools, toolsInCategory } from "@/lib/data";
import { abs } from "@/lib/seo";

// llms.txt (llmstxt.org): a plain summary of the site and its key pages for
// AI assistants. Built from the same data as the pages.
export function GET() {
  const lines = [
    "# The Daily Prompt",
    "",
    "> An independent directory of AI tools sorted by the task you want to get done, with a short, honest verdict for each tool. Updated every weekday. Rankings and verdicts are never for sale; sponsored listings are always labeled.",
    "",
    `The directory covers ${tools.length} tools in ${categories.length} categories. Each tool page has what the tool does, who it is best for, pricing checked against the official site, a one-sentence verdict, and the date it was last checked. Facts come only from official sites; when a price can't be confirmed it is listed as "Unknown".`,
    "",
    "## Categories",
    ...categories.map(
      (c) => `- [${c.headline}](${abs(`/categories/${c.slug}`)}): ${c.tagline} ${toolsInCategory(c.slug).length} tools.`,
    ),
    "",
    "## Tools",
    ...categories.flatMap((c) =>
      toolsInCategory(c.slug).map(
        (t) => `- [${t.name}](${abs(`/tools/${t.slug}`)}) (${c.name}, ${t.pricing}): ${t.verdict}`,
      ),
    ),
    "",
    "## Key pages",
    `- [All tools](${abs("/tools")}): every tool, grouped by task.`,
    ...(latestEdition
      ? [`- [Latest edition, No. ${latestEdition.edition}](${abs(`/editions/${latestEdition.date}`)}): ${latestEdition.headline}`]
      : []),
    `- [About and how sponsorship works](${abs("/about")}): how tools are picked and reviewed, and why rankings are never for sale.`,
    `- [Submit a tool](${abs("/submit")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
