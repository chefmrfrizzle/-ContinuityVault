"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center p-5">
      <div className="max-w-lg border border-[var(--cv-danger)]/30 bg-[#f4d9d6] p-8">
        <p className="font-mono text-xs uppercase tracking-[.16em]">
          Safe failure
        </p>
        <h1 className="mt-4 text-3xl font-semibold">The request stopped.</h1>
        <p className="mt-3 leading-7">
          No workflow state was advanced. Retry only after the underlying
          condition is understood.
        </p>
        <Button onClick={reset} tone="secondary" className="mt-6">
          Retry view
        </Button>
      </div>
    </main>
  );
}
