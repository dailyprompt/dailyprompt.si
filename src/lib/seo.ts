import type { Category, Tool } from "@/lib/data";

export const SITE_URL = "https://dailyprompt.si";
export const SITE_NAME = "The Daily Prompt";

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

const ORG = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

export function organizationLd() {
  return [
    {
      "@context": "https://schema.org",
      ...ORG,
      logo: abs("/icon.svg"),
      description:
        "An independent directory of AI tools sorted by use case, with short, honest verdicts. Rankings are never for sale.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      publisher: ORG,
    },
  ];
}

// Crumbs after "Home": [name, path] pairs. The last one is the current page.
export function breadcrumbLd(crumbs: [string, string][]) {
  const items: [string, string][] = [["Home", "/"], ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

// Offers only when the price is confirmed. "Freemium" and "Free" have a
// free tier, so a $0 offer is true; "Unknown" gets no offer at all.
function offers(pricing: string) {
  const usd = (price: string) => ({ "@type": "Offer", price, priceCurrency: "USD" });
  if (pricing === "Free" || pricing === "Freemium") return usd("0");
  const m = pricing.match(/^From \$([\d.]+)\/mo$/);
  return m ? usd(m[1]) : undefined;
}

const APP_CATEGORY: Record<string, string> = {
  coding: "DeveloperApplication",
  design: "DesignApplication",
  video: "MultimediaApplication",
  voice: "MultimediaApplication",
};

// Our verdict is an editorial review. It deliberately has no star rating:
// we never publish ratings we haven't measured.
export function softwareLd(t: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.name,
    url: t.url,
    applicationCategory: APP_CATEGORY[t.category] ?? "BusinessApplication",
    description: t.what,
    offers: offers(t.pricing),
    review: {
      "@type": "Review",
      reviewBody: t.verdict,
      datePublished: t.updated,
      author: ORG,
      publisher: ORG,
    },
    mainEntityOfPage: abs(`/tools/${t.slug}`),
  };
}

export function itemListLd(c: Category, list: Tool[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.headline,
    numberOfItems: list.length,
    itemListElement: list.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: abs(`/tools/${t.slug}`),
    })),
  };
}
