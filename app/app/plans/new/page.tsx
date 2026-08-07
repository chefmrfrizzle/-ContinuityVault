import { TestPackageBuilder } from "@/components/plans/test-package-builder";
export const metadata = { title: "New practice plan" };
export default function Page() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--cv-ink-soft)]">
        New practice plan · Step 2
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
        Create a practice package.
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-lg leading-7 text-[var(--cv-ink-soft)]">
        Try the locking and download steps with made-up information. Nothing on
        this page is saved to your account or sent to anyone.
      </p>
      <TestPackageBuilder />
    </>
  );
}
