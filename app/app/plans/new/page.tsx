import { TestPackageBuilder } from "@/components/plans/test-package-builder";
export const metadata = { title: "New test plan" };
export default function Page() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--cv-ink-soft)]">
        Plan workspace · package
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
        Prepare a local test package.
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-lg leading-7 text-[var(--cv-ink-soft)]">
        This vertical slice demonstrates the browser-only boundary. It does not
        upload or persist anything.
      </p>
      <TestPackageBuilder />
    </>
  );
}
