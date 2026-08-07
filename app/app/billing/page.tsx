import { CreditCard, Lock } from "lucide-react";
import { BillingActions } from "@/components/billing-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { integrationAvailability } from "@/lib/integrations/availability";

export const metadata = { title: "Billing" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const ready =
    integrationAvailability("stripe").configured &&
    integrationAvailability("upstash").configured;

  return (
    <>
      <StatusBadge tone={ready ? "healthy" : "warning"}>
        {ready ? "Stripe test configured" : "Integration unavailable"}
      </StatusBadge>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em]">Billing</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-[var(--cv-ink-soft)]">
        Choose a plan or manage an existing subscription. Billing can never
        approve or trigger sharing.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <CreditCard />
          <h2 className="mt-5 text-2xl font-semibold">Test payments</h2>
          <p className="mt-2 text-[var(--cv-ink-soft)]">
            Use Stripe test cards here. No real charge will be made.
          </p>
          <BillingActions ready={ready} checkoutStatus={checkout} />
        </section>
        <section className="border border-[var(--cv-line)] bg-[var(--cv-paper-deep)] p-6">
          <Lock />
          <h2 className="mt-5 text-2xl font-semibold">
            Billing stays separate
          </h2>
          <p className="mt-3 leading-7 text-[var(--cv-ink-soft)]">
            A failed or cancelled payment may change paid features. It cannot
            move a continuity plan forward, share a package, or delete the only
            export.
          </p>
        </section>
      </div>
    </>
  );
}
