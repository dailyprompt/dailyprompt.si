import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Submit a tool",
  description: "Suggest an AI tool for The Daily Prompt directory. Every submission is reviewed by hand.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Submit a tool</h1>
      <p className="mt-4 text-lg italic">
        Know an AI tool that belongs here? Tell us about it. We open every
        site, check that it works, and write our own description and verdict.
        Submitting does not guarantee a listing, and it never buys a better
        review.
      </p>
      <p className="mt-2 text-sm text-muted">
        Makers who want a featured spot can read{" "}
        <Link href="/about#sponsorship" className="link">
          how sponsorship works
        </Link>
        .
      </p>
      <div className="mt-8">
        <SubmitForm categories={categories.map(({ slug, name }) => ({ slug, name }))} />
      </div>
    </div>
  );
}
