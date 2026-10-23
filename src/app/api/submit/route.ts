import { categories } from "@/lib/data";

// Submissions become issues in a private GitHub repo for review.
// Nothing is published automatically. We store no personal data.
const REPO = process.env.SUBMISSIONS_REPO ?? "dailyprompt/submissions";

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (clean(body.company, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 100);
  const url = clean(body.url, 300);
  const category = clean(body.category, 40);
  const what = clean(body.what, 600);

  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {}
  if (!name || !parsed || !/^https?:$/.test(parsed.protocol)) {
    return Response.json(
      { error: "Please give the tool's name and a full link (https://...)." },
      { status: 400 },
    );
  }
  const cat = categories.find((c) => c.slug === category)?.name ?? "Not sure";

  const token = process.env.SUBMISSIONS_GITHUB_TOKEN;
  if (!token) {
    console.error("SUBMISSIONS_GITHUB_TOKEN is not set");
    return Response.json(
      { error: "Submissions are switched off right now. Please try again later." },
      { status: 503 },
    );
  }

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: `Tool submission: ${name}`,
      labels: ["submission"],
      body: [
        `**Name:** ${name}`,
        `**URL:** ${parsed.href}`,
        `**Category:** ${cat}`,
        "",
        "**What it does (from the submitter):**",
        what || "_not given_",
        "",
        "Review before adding: open the official site, confirm it works, write our own description and verdict.",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("GitHub issue create failed", res.status, await res.text());
    return Response.json(
      { error: "Something went wrong on our side. Please try again later." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
