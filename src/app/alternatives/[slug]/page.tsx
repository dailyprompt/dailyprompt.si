import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPageView } from "@/components/EditorialPageView";
import { getPage, pagePath, pages } from "@/lib/pages";

export function generateStaticParams() {
  return pages.filter((p) => p.type === "alternatives").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/alternatives/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPage("alternatives", slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.meta_description,
    alternates: { canonical: pagePath(p) },
    openGraph: { title: p.title, description: p.meta_description, type: "article" },
  };
}

export default async function Page({ params }: PageProps<"/alternatives/[slug]">) {
  const { slug } = await params;
  const p = getPage("alternatives", slug);
  if (!p) notFound();
  return <EditorialPageView page={p} />;
}
