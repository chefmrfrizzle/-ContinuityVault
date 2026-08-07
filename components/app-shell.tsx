import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import {
  Activity,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { StatusBadge } from "@/components/ui/status-badge";

const links = [
  ["/app", "Overview", LayoutDashboard],
  ["/app/plans/demo-plan", "My plan", FileCheck2],
  ["/app/plans/demo-plan/recipients", "Trusted people", Users],
  ["/app/plans/demo-plan/activity", "Activity", Activity],
  ["/app/billing", "Billing", CreditCard],
  ["/app/settings/security", "Security", LockKeyhole],
  ["/app/settings/notifications", "Settings", Settings],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const authConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <div className="min-h-screen bg-[var(--cv-paper)]">
      <header className="border-b border-[var(--cv-line)] bg-[#fbfaf6] lg:hidden">
        <div className="flex min-h-16 items-center justify-between px-5">
          <Link href="/">
            <BrandMark />
          </Link>
          <StatusBadge tone="warning">Test</StatusBadge>
        </div>
      </header>
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--cv-line)] bg-[#fbfaf6] p-5 lg:flex lg:flex-col">
        <Link href="/" className="py-2">
          <BrandMark />
        </Link>
        <div className="mt-8 rounded-md border border-[var(--cv-warning)]/25 bg-[#f7eddb] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--cv-warning)]">
            Practice mode
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--cv-ink-soft)]">
            Use made-up information only. Payments and messages stay in test
            mode.
          </p>
        </div>
        <nav className="mt-8 grid gap-1" aria-label="Application">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-[var(--cv-ink-soft)] hover:bg-[var(--cv-paper-deep)] hover:text-[var(--cv-ink)]"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-[var(--cv-line)] pt-4">
          {authConfigured ? (
            <Show
              when="signed-in"
              fallback={
                <>
                  <p className="text-sm font-semibold">Practice account</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--cv-ink-soft)]">
                    Sign in for provider tests
                  </p>
                </>
              }
            >
              <div className="flex items-center gap-3">
                <UserButton />
                <div>
                  <p className="text-sm font-semibold">Practice account</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--cv-success)]">
                    Signed in securely
                  </p>
                </div>
              </div>
            </Show>
          ) : (
            <>
              <p className="text-sm font-semibold">Practice account</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--cv-ink-soft)]">
                Authentication unavailable
              </p>
            </>
          )}
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1160px] px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
