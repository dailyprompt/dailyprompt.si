"use client";

import { useState } from "react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; msg: string };

const field = "min-h-[44px] w-full border-2 border-ink bg-paper px-3 py-2 text-base";

export function SubmitForm({ categories }: { categories: { slug: string; name: string }[] }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      form.reset();
      setStatus({ kind: "done" });
    } catch (err) {
      setStatus({ kind: "error", msg: (err as Error).message });
    }
  }

  if (status.kind === "done") {
    return (
      <div role="status" className="border-2 border-ink p-5">
        <p className="font-display text-xl font-bold">Thanks. We got it.</p>
        <p className="mt-2 text-sm text-muted">
          We check every submission by hand. If it fits, it shows up in the
          directory with our own write-up.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="link mt-4 min-h-[44px] text-sm"
        >
          Submit another tool
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="label mb-1 block">Tool name</label>
        <input id="name" name="name" required maxLength={100} className={field} />
      </div>
      <div>
        <label htmlFor="url" className="label mb-1 block">Official website</label>
        <input id="url" name="url" type="url" required placeholder="https://" maxLength={300} className={field} />
      </div>
      <div>
        <label htmlFor="category" className="label mb-1 block">Best fit category</label>
        <select id="category" name="category" className={field} defaultValue="">
          <option value="">Not sure</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="what" className="label mb-1 block">
          What does it do? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="what" name="what" rows={4} maxLength={600} className={field} />
      </div>
      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="btn disabled:opacity-60"
        >
          {status.kind === "sending" ? "Sending..." : "Submit for review"}
        </button>
        <p role="alert" className="text-sm font-bold">
          {status.kind === "error" ? status.msg : ""}
        </p>
      </div>
    </form>
  );
}
