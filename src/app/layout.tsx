import type { Metadata } from "next";
import Link from "next/link";
import { Libre_Baskerville, Playfair_Display, UnifrakturMaguntia } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { latestEdition, paperDate } from "@/lib/data";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dailyprompt.si"),
  title: {
    default: "The Daily Prompt: find the right AI tool for the job",
    template: "%s | The Daily Prompt",
  },
  description:
    "A directory of AI tools sorted by what you want to get done, with short, honest verdicts. Updated every weekday.",
  openGraph: {
    siteName: "The Daily Prompt",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The Daily Prompt" }],
  },
  twitter: { card: "summary_large_image" },
};

const SECTIONS = [
  ["Writing", "/categories/writing"],
  ["Coding", "/categories/coding"],
  ["Research", "/categories/research"],
  ["Design", "/categories/design"],
  ["Video", "/categories/video"],
  ["Agents", "/categories/agents"],
  ["All tools", "/tools"],
] as const;

// The paper's date and number come from the latest edition of The Daily
// Prompt; the build date is the fallback.
function formatPaperDate(d: string | undefined) {
  if (!d) return null;
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const date = formatPaperDate(paperDate);
  return (
    <html
      lang="en"
      className={`${unifraktur.variable} ${playfair.variable} ${baskerville.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <header className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
          <p className="label flex flex-wrap justify-center gap-x-3 border-b border-rule pb-2 text-center !font-normal !tracking-[0.15em] text-[0.7rem] sm:justify-between">
            <span>
              Vol. I{latestEdition && <> &middot; No. {latestEdition.edition}</>}
            </span>
            {date && <span>{date}</span>}
            <span>dailyprompt.si</span>
          </p>
          <div className="mx-auto max-w-[900px] pt-5 text-center">
            <Link href="/" className="inline-block">
              <span className="block font-masthead text-[clamp(2.6rem,10vw,6.25rem)] leading-none">
                The Daily Prompt
              </span>
            </Link>
            <div className="rule-double mt-3" aria-hidden="true" />
            <p className="mt-3 font-display text-[0.8rem] uppercase tracking-[0.28em] sm:text-sm">
              Superintelligence, delivered daily
            </p>
          </div>
          <nav aria-label="Sections" className="mt-4 border-t border-ink">
            <ul className="flex flex-wrap justify-center gap-x-1 py-1 sm:justify-between">
              {SECTIONS.map(([name, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="label inline-flex min-h-[44px] items-center px-2 hover:text-hover"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rule-double" aria-hidden="true" />
          </nav>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
          <div className="rule-thick" />
          <div className="flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; The Daily Prompt</p>
            <p className="italic">Rankings are never for sale. Sponsored notices are always labeled.</p>
            <nav aria-label="Footer" className="label flex gap-4">
              <Link href="/about" className="hover:text-hover">About</Link>
              <Link href="/submit" className="hover:text-hover">Submit a tool</Link>
            </nav>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
