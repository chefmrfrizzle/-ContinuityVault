import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Download,
  MoreHorizontal,
  RadioTower,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export function Dashboard() {
  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--cv-ink-soft)]">
            Friday · 07 August 2026
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
            Good afternoon.
          </h1>
          <p className="mt-3 text-[var(--cv-ink-soft)]">
            Your practice plan is ready.
          </p>
        </div>
        <Button href="/app/onboarding">Create another plan</Button>
      </div>
      <section className="mt-10 border border-[var(--cv-line)] bg-[#fbfaf6]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--cv-line)] px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--cv-ink-soft)]">
              Practice plan · household
            </p>
            <h2 className="mt-1 text-xl font-semibold">Household essentials</h2>
          </div>
          <StatusBadge tone="healthy">Practice plan active</StatusBadge>
        </div>
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-5 sm:p-7">
            <div className="rounded-md bg-[var(--cv-forest-deep)] p-6 text-white sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--cv-mint)]">
                <RadioTower size={16} /> Your next check-in
              </div>
              <p className="mt-7 text-sm text-white/60">
                We will ask if you are okay in
              </p>
              <p className="mt-1 text-5xl font-semibold tracking-[-.06em] sm:text-6xl">
                24 days
              </p>
              <p className="mt-3 font-mono text-xs text-white/60">
                31 AUG 2026 · 09:00 EDT
              </p>
              <Button
                href="/app/plans/demo-plan"
                className="mt-8 bg-[var(--cv-acid)] text-[var(--cv-forest-deep)] hover:bg-[var(--cv-mint)]"
              >
                Check in now <ArrowRight size={16} />
              </Button>
            </div>
          </div>
          <div className="border-t border-[var(--cv-line)] p-5 lg:border-l lg:border-t-0">
            <p className="font-mono text-xs uppercase tracking-[.12em] text-[var(--cv-ink-soft)]">
              Readiness
            </p>
            {[
              { Icon: Users, label: "Recipients", value: "3 of 3 ready" },
              {
                Icon: ShieldCheck,
                label: "Practice run",
                value: "Passed 18 Jul",
              },
              { Icon: Clock3, label: "Final hold", value: "48 hours" },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-[var(--cv-line)] py-5 last:border-0"
              >
                <span className="grid size-10 place-items-center bg-[var(--cv-paper)]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm text-[var(--cv-ink-soft)]">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
                <Check size={16} className="ml-auto text-[var(--cv-success)]" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--cv-line)] px-5 py-4 text-sm">
          <Link
            href="/app/plans/demo-plan"
            className="font-semibold text-[var(--cv-forest)]"
          >
            Open plan
          </Link>
          <Link
            href="/app/plans/demo-plan/export"
            className="ml-auto flex items-center gap-2"
          >
            <Download size={15} /> Encrypted export
          </Link>
          <button
            aria-label="More plan actions"
            className="grid size-11 place-items-center"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </section>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <Link
              href="/app/plans/demo-plan/activity"
              className="text-sm font-semibold"
            >
              View all
            </Link>
          </div>
          <ol className="mt-5 grid gap-4">
            {[
              "Practice run completed",
              "Trusted people checked",
              "Safety rules saved",
            ].map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="mt-2 size-2 rounded-full bg-[var(--cv-success)]" />
                <div>
                  <p className="text-sm font-medium">{item}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase text-[var(--cv-ink-soft)]">
                    {i + 1} day{i ? "s" : ""} ago · redacted event
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="border border-[var(--cv-line)] bg-[var(--cv-paper-deep)] p-6">
          <h2 className="text-lg font-semibold">Practice-mode limits</h2>
          <p className="mt-4 leading-7 text-[var(--cv-ink-soft)]">
            This practice version stores no plan information and sends nothing.
            Real information stays disabled until the security review is done.
          </p>
          <Link
            href="/security"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
          >
            Learn how your information is protected <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
