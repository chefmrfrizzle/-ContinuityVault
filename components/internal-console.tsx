import Link from "next/link";
import {
  AlertOctagon,
  Ban,
  CloudOff,
  DatabaseZap,
  ShieldAlert,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
const cases = [
  {
    title: "Security freeze",
    severity: "Critical",
    summary: "Global release processing remains frozen by default.",
    Icon: AlertOctagon,
  },
  {
    title: "Provider health unavailable",
    severity: "High",
    summary: "No production provider probes are configured.",
    Icon: CloudOff,
  },
  {
    title: "Persistence unavailable",
    severity: "High",
    summary: "Neon is not provisioned in this local environment.",
    Icon: DatabaseZap,
  },
];
export function InternalConsole({ section }: { section: string }) {
  return (
    <main className="min-h-screen bg-[#e8e7df]">
      <header className="border-b border-[var(--cv-line)] bg-[var(--cv-forest-deep)] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-5 px-5 py-5">
          <ShieldAlert />
          <strong>Continuity Vault · operator plane</strong>
          <StatusBadge tone="danger">Global freeze on</StatusBadge>
          <nav className="ml-auto flex gap-4 text-sm">
            <Link href="/internal/cases">Cases</Link>
            <Link href="/internal/workflows">Workflows</Link>
            <Link href="/internal/provider-health">Providers</Link>
            <Link href="/internal/audit">Audit</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <p className="font-mono text-xs uppercase tracking-[.16em]">
          {section}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">
          Exception queue
        </h1>
        <div className="mt-8 grid gap-4">
          {cases.map(({ title, severity, summary, Icon }) => (
            <article
              key={title}
              className="grid gap-4 border border-[var(--cv-line)] bg-[#fbfaf6] p-5 sm:grid-cols-[48px_1fr_auto] sm:items-center"
            >
              <span className="grid size-11 place-items-center bg-[#f4d9d6] text-[var(--cv-danger)]">
                <Icon />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">{title}</h2>
                  <span className="font-mono text-[10px] uppercase">
                    {severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--cv-ink-soft)]">
                  {summary}
                </p>
              </div>
              <Button tone="secondary">Inspect redacted case</Button>
            </article>
          ))}
        </div>
        <div className="mt-8 border border-[var(--cv-danger)]/30 bg-[#f4d9d6] p-5">
          <div className="flex gap-3">
            <Ban className="shrink-0" />
            <p className="text-sm leading-6">
              <strong>Operator limits:</strong> no plaintext, keys, envelope
              changes, forced delivery, skipped quorum, shortened final hold, or
              concealed audit event. Freeze removal requires two-person control
              and is not implemented.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
