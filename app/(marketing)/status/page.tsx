import { StatusBadge } from "@/components/ui/status-badge";
export const metadata = { title: "System status" };
export default function StatusPage() {
  return (
    <div className="mx-auto min-h-[60vh] max-w-[900px] px-5 py-20">
      <StatusBadge tone="warning">Prototype · no live monitoring</StatusBadge>
      <h1 className="mt-6 text-6xl font-semibold tracking-[-.06em]">
        System status
      </h1>
      <p className="mt-6 text-xl leading-8 text-[var(--cv-ink-soft)]">
        Provider health monitoring is not provisioned in this test-mode build.
        Release processing remains globally frozen by default.
      </p>
      <div className="mt-12 border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
        <div className="flex justify-between">
          <span className="font-semibold">Release processing</span>
          <span className="font-mono text-sm text-[var(--cv-danger)]">
            FROZEN
          </span>
        </div>
        <p className="mt-3 text-sm text-[var(--cv-ink-soft)]">
          Expected until independent review and production approval.
        </p>
      </div>
    </div>
  );
}
