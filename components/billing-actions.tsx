"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { BillingInterval, BillingTier } from "@/lib/billing/catalog";

export function BillingActions({ ready }: { ready: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function open(path: string, body?: object) {
    setPending(path + JSON.stringify(body ?? {}));
    setMessage(undefined);
    const response = await fetch(path, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401) {
      router.push(
        `/sign-in?redirect_url=${encodeURIComponent("/app/billing")}`,
      );
      return;
    }
    const data = (await response.json()) as { url?: string; error?: string };
    if (response.ok && data.url) {
      window.location.assign(data.url);
      return;
    }
    setPending(undefined);
    setMessage(
      data.error === "NO_BILLING_ACCOUNT"
        ? "Choose a plan first."
        : "Billing is temporarily unavailable. Please try again later.",
    );
  }

  const choices: Array<{
    tier: BillingTier;
    label: string;
    annual: string;
    monthly: string;
  }> = [
    {
      tier: "personal",
      label: "Personal",
      annual: "$149/year",
      monthly: "$15/month",
    },
    {
      tier: "household",
      label: "Household",
      annual: "$299/year",
      monthly: "$30/month",
    },
    {
      tier: "founder",
      label: "Founder",
      annual: "$1,200/year",
      monthly: "$120/month",
    },
  ];

  function checkout(tier: BillingTier, interval: BillingInterval) {
    return open("/api/billing/checkout", { tier, interval });
  }

  return (
    <div className="mt-8 grid gap-4">
      {choices.map((choice) => (
        <div
          key={choice.tier}
          className="grid gap-3 border border-[var(--cv-line)] bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
        >
          <strong className="text-lg">{choice.label}</strong>
          <Button
            disabled={!ready || Boolean(pending)}
            onClick={() => checkout(choice.tier, "annual")}
          >
            {choice.annual}
          </Button>
          <Button
            tone="secondary"
            disabled={!ready || Boolean(pending)}
            onClick={() => checkout(choice.tier, "monthly")}
          >
            {choice.monthly}
          </Button>
        </div>
      ))}
      <Button
        tone="secondary"
        disabled={!ready || Boolean(pending)}
        onClick={() => open("/api/billing/portal")}
      >
        Manage an existing subscription
      </Button>
      {message ? (
        <p role="status" className="text-sm text-[var(--cv-danger)]">
          {message}
        </p>
      ) : null}
      {!message && searchParams.get("checkout") === "success" ? (
        <p role="status" className="text-sm text-[var(--cv-success)]">
          Test payment succeeded. Stripe is updating your practice subscription.
        </p>
      ) : null}
      {!message && searchParams.get("checkout") === "cancelled" ? (
        <p role="status" className="text-sm text-[var(--cv-ink-soft)]">
          No payment was made.
        </p>
      ) : null}
    </div>
  );
}
