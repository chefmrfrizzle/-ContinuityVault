import Link from "next/link";
import { AlertTriangle, Check, Download, FileLock2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TestPackageBuilder } from "@/components/plans/test-package-builder";
import { CheckInPanel } from "@/components/plans/check-in-panel";

const tabs = [
  ["", "Overview"],
  ["package", "Package"],
  ["recipients", "Trusted people"],
  ["policy", "Safety rules"],
  ["rehearsal", "Practice run"],
  ["activity", "Activity"],
  ["export", "Export"],
];
const timeline = [
  ["Due date", "In-app and email request"],
  ["+2 days", "Email and SMS reminder"],
  ["+5 days", "Second reminder"],
  ["+14 days", "Trusted contacts notified"],
  ["+21 days", "Verification may begin"],
  ["+28 days", "Final hold"],
  ["+30 days", "Locked package may be ready to share"],
];

export function PlanWorkspace({
  planId,
  section,
}: {
  planId: string;
  section: string;
}) {
  const base = `/app/plans/${planId}`;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--cv-ink-soft)]">
            Practice plan · household
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-.05em]">
            Household essentials
          </h1>
        </div>
        <StatusBadge tone="healthy">Practice plan active</StatusBadge>
      </div>
      <nav
        className="mt-8 flex gap-1 overflow-x-auto border-b border-[var(--cv-line)]"
        aria-label="Plan sections"
      >
        {tabs.map(([slug, label]) => (
          <Link
            key={slug}
            href={slug ? `${base}/${slug}` : base}
            className={`min-h-11 shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${section === slug ? "border-[var(--cv-forest)]" : "border-transparent text-[var(--cv-ink-soft)]"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="py-8">
        {section === "" && <Overview />}
        {section === "package" && <TestPackageBuilder />}
        {section === "recipients" && <Recipients />}
        {section === "policy" && <Policy />}
        {section === "rehearsal" && <Rehearsal />}
        {section === "activity" && <Activity />}
        {section === "export" && <ExportPanel />}
        {!tabs.some(([slug]) => slug === section) && (
          <div className="border p-8">
            <h2 className="text-2xl font-semibold">Unknown plan section</h2>
            <Button href={base} className="mt-5">
              Return to overview
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
function Overview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <CheckInPanel />
      <div className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
        <p className="font-mono text-xs uppercase tracking-[.13em]">
          Plan summary
        </p>
        <dl className="mt-5 grid gap-4">
          {[
            ["Status", "Practice plan active"],
            ["Next check-in", "31 Aug 2026"],
            ["Trusted people", "3 of 3 ready"],
            ["Last practice run", "Passed 18 Jul"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-[var(--cv-line)] pb-3"
            >
              <dt className="text-[var(--cv-ink-soft)]">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Practice-mode limits</h2>
        <p className="mt-3 leading-7 text-[var(--cv-ink-soft)]">
          This page is a working demonstration, not a live service yet. It saves
          nothing and sends nothing while the service connections and
          independent security checks are still being completed.
        </p>
      </div>
    </div>
  );
}
function Recipients() {
  return (
    <section>
      <div className="flex justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-.04em]">
            Trusted people
          </h2>
          <p className="mt-2 text-[var(--cv-ink-soft)]">
            Use made-up people in practice mode. Trusted people will never need
            a paid plan.
          </p>
        </div>
        <Button>Add a practice person</Button>
      </div>
      <div className="mt-7 border border-[var(--cv-line)] bg-[#fbfaf6]">
        {["Primary recipient", "Trusted contact A", "Trusted contact B"].map(
          (name, i) => (
            <div
              key={name}
              className="grid gap-3 border-b border-[var(--cv-line)] p-5 last:border-0 sm:grid-cols-[1fr_160px_140px] sm:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center bg-[var(--cv-paper)]">
                  <Users size={17} />
                </span>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="font-mono text-[10px] uppercase text-[var(--cv-ink-soft)]">
                    opaque-test-{i + 1}
                  </p>
                </div>
              </div>
              <span className="text-sm">
                {i ? "Trusted contact" : "Ciphertext recipient"}
              </span>
              <StatusBadge tone="healthy">Test ready</StatusBadge>
            </div>
          ),
        )}
      </div>
      <div className="mt-6 border-l-4 border-[var(--cv-warning)] bg-[#f7eddb] p-4 text-sm">
        When the live service is ready, changing a trusted person will require
        you to sign in again, wait through a safety period, and complete a new
        practice run.
      </div>
    </section>
  );
}
function Policy() {
  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-[-.04em]">Safety rules</h2>
      <p className="mt-2 text-[var(--cv-ink-soft)]">
        These are the steps the service must follow. A missed check-in never
        shares anything by itself.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <ol className="border-t border-[var(--cv-line)]">
          {timeline.map(([when, what]) => (
            <li
              key={when}
              className="grid grid-cols-[90px_1fr] border-b border-[var(--cv-line)] py-4"
            >
              <span className="font-mono text-xs">{when}</span>
              <span>{what}</span>
            </li>
          ))}
        </ol>
        <div className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <h3 className="font-semibold">People who must agree</h3>
          <p className="mt-3 text-3xl font-semibold">2 of 3</p>
          <p className="mt-2 leading-6 text-[var(--cv-ink-soft)]">
            Two of your three trusted people must agree. If anyone gives a
            conflicting answer, the process stops.
          </p>
          <Button tone="secondary" className="mt-6">
            Change these safety rules
          </Button>
        </div>
      </div>
    </section>
  );
}
function Rehearsal() {
  const checks = [
    "Your sign-in was checked",
    "The stop button worked",
    "Trusted people can receive a practice message",
    "The required people agreed",
    "The recovery file was created",
    "The locked practice package was checked",
  ];
  return (
    <section>
      <StatusBadge tone="healthy">Practice run passed</StatusBadge>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
        Practice run complete
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--cv-ink-soft)]">
        This practice used made-up information. It did not open a real package,
        send a message, or change a live check-in.
      </p>
      <div className="mt-7 grid gap-3">
        {checks.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 border border-[var(--cv-line)] bg-[#fbfaf6] p-4"
          >
            <span className="grid size-7 place-items-center rounded-full bg-[var(--cv-mint)]">
              <Check size={14} />
            </span>
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>
      <Button className="mt-6">Run the practice again</Button>
    </section>
  );
}
function Activity() {
  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-[-.04em]">
        Tamper-evident activity
      </h2>
      <p className="mt-3 text-[var(--cv-ink-soft)]">
        Redacted synthetic events demonstrate the audit surface.
      </p>
      <ol className="mt-8 border-t border-[var(--cv-line)]">
        {[
          "rehearsal.completed.v1",
          "recipient.readiness.updated.v1",
          "policy.created.v1",
          "plan.created.v1",
        ].map((event, i) => (
          <li
            key={event}
            className="grid gap-3 border-b border-[var(--cv-line)] py-5 sm:grid-cols-[1fr_180px]"
          >
            <div>
              <p className="font-mono text-sm">{event}</p>
              <p className="mt-2 text-sm text-[var(--cv-ink-soft)]">
                Actor and payload redacted · hash link intact in fixture
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--cv-ink-soft)]">
              0{18 - i} JUL 2026
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
function ExportPanel() {
  return (
    <section className="max-w-2xl">
      <FileLock2 size={28} />
      <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
        Portable by design.
      </h2>
      <p className="mt-3 leading-7 text-[var(--cv-ink-soft)]">
        Customers must be able to export ciphertext and policy even after
        subscription cancellation. In this preview, only files created locally
        in the package tab can be downloaded.
      </p>
      <div className="mt-7 border border-[var(--cv-line)] bg-[#fbfaf6] p-5">
        <div className="flex gap-3">
          <AlertTriangle className="shrink-0 text-[var(--cv-warning)]" />
          <p className="text-sm leading-6">
            No package is persisted in this synthetic plan, so there is nothing
            for the server to export. Create and download a local test package
            instead.
          </p>
        </div>
        <Button href="./package" className="mt-5">
          <Download size={16} /> Open package builder
        </Button>
      </div>
    </section>
  );
}
