import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-lg italic">
        That page doesn&apos;t exist, or the tool has moved.
      </p>
      <p className="mt-6">
        <Link href="/" className="link">
          Search the directory
        </Link>
      </p>
    </div>
  );
}
