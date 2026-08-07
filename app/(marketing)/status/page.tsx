import { StatusBadge } from "@/components/ui/status-badge";
export const metadata = { title: "System status" };
export default function StatusPage() {
  return (
    <div className="mx-auto min-h-[60vh] max-w-[900px] px-5 py-20">
      <StatusBadge tone="warning">Practice version · not live</StatusBadge>
      <h1 className="mt-6 text-6xl font-semibold tracking-[-.06em]">
        System status
      </h1>
      <p className="mt-6 text-xl leading-8 text-[var(--cv-ink-soft)]">
        The outside services for sign-in, reminders, billing, and monitoring are
        not connected yet. Sharing is turned off.
      </p>
      <div className="mt-12 border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
        <div className="flex justify-between">
          <span className="font-semibold">Package sharing</span>
          <span className="font-mono text-sm text-[var(--cv-danger)]">
            TURNED OFF
          </span>
        </div>
        <p className="mt-3 text-sm text-[var(--cv-ink-soft)]">
          This stays off until the service connections and independent security
          reviews are complete.
        </p>
      </div>
    </div>
  );
}
