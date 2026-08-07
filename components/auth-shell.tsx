import { SignIn, SignUp } from "@clerk/nextjs";
import { LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" }) {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <main className="grid min-h-screen bg-[var(--cv-paper)] lg:grid-cols-2">
      <section className="hidden bg-[var(--cv-forest-deep)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="[&_span]:text-white">
          <BrandMark />
        </div>
        <div>
          <LockKeyhole className="text-[var(--cv-mint)]" />
          <p className="mt-6 max-w-md text-4xl font-semibold tracking-[-.04em]">
            Account recovery and package recovery are deliberately separate.
          </p>
          <p className="mt-5 max-w-md leading-7 text-white/65">
            Authentication proves who may manage a plan. It never gives the
            company a key to read the package.
          </p>
        </div>
        <p className="font-mono text-xs text-white/45">
          TEST ENVIRONMENT · MANAGED AUTH REQUIRED
        </p>
      </section>
      <section className="grid place-items-center p-5">
        <div className="w-full max-w-md border border-[var(--cv-line)] bg-[#fbfaf6] p-8">
          <p className="font-mono text-xs uppercase tracking-[.16em]">
            {mode === "sign-in" ? "Welcome back" : "Create test account"}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">
            {mode === "sign-in"
              ? "Sign in securely"
              : "Start with strong authentication"}
          </h1>
          {configured ? (
            <div className="mt-7">
              {mode === "sign-in" ? (
                <SignIn routing="hash" />
              ) : (
                <SignUp routing="hash" />
              )}
            </div>
          ) : (
            <>
              <div className="mt-8 border border-[var(--cv-warning)]/30 bg-[#f7eddb] p-4 text-sm leading-6">
                <strong>Authentication is not provisioned.</strong>
                <br />
                Add Clerk test credentials to enable sign-in. No placeholder
                account or mock session is created.
              </div>
              <Button href="/app" tone="secondary" className="mt-6 w-full">
                View synthetic product preview
              </Button>
            </>
          )}
          <p className="mt-6 text-xs leading-5 text-[var(--cv-ink-soft)]">
            Email and SMS are reminders, not sufficient authentication. Use the
            strongest factor supported by the configured provider.
          </p>
        </div>
      </section>
    </main>
  );
}
