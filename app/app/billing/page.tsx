import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
export const metadata = { title: "Billing" };
export default function Page() {
  const ready = Boolean(process.env.STRIPE_SECRET_KEY);
  return (
    <>
      <StatusBadge tone={ready ? "healthy" : "warning"}>
        {ready ? "Stripe test configured" : "Integration unavailable"}
      </StatusBadge>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em]">Billing</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-[var(--cv-ink-soft)]">
        Subscriptions fund monitoring and rehearsals. Billing state is isolated
        from release authorization.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <CreditCard />
          <h2 className="mt-5 text-2xl font-semibold">Test Mode</h2>
          <p className="mt-2 text-[var(--cv-ink-soft)]">
            Free prototype · no Stripe customer
          </p>
          <Button disabled={!ready} className="mt-8">
            Open billing portal
          </Button>
        </section>
        <section className="border border-[var(--cv-line)] bg-[var(--cv-paper-deep)] p-6">
          <Lock />
          <h2 className="mt-5 text-2xl font-semibold">Release isolation</h2>
          <p className="mt-3 leading-7 text-[var(--cv-ink-soft)]">
            Payment failure may restrict paid features, but it can never advance
            a workflow or destroy the only export.
          </p>
        </section>
      </div>
    </>
  );
}
