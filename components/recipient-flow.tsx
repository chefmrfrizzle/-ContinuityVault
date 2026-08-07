import { KeyRound, LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
export function RecipientFlow({
  kind,
}: {
  kind: "invitation" | "challenge" | "delivery" | "guide";
}) {
  const content = {
    invitation: [
      "Recipient invitation",
      "A real invitation requires a free authenticated account and a short-lived plan-scoped challenge.",
    ],
    challenge: [
      "Trusted-contact response",
      "Responses happen in the authenticated app. A text or email reply never counts.",
    ],
    delivery: [
      "Ciphertext delivery",
      "No delivery is available in test mode. A reviewed release would provide ciphertext only after every deterministic gate passes.",
    ],
    guide: [
      "Recovery guide",
      "Recovery material is arranged separately by the owner. Continuity Vault cannot recover a key it does not possess.",
    ],
  }[kind];
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cv-paper)] p-5">
      <section className="w-full max-w-xl border border-[var(--cv-line)] bg-[#fbfaf6] p-7 sm:p-10">
        <StatusBadge tone="warning">Synthetic preview</StatusBadge>
        <div className="mt-8 grid size-12 place-items-center bg-[var(--cv-forest)] text-white">
          {kind === "delivery" ? (
            <KeyRound />
          ) : kind === "challenge" ? (
            <LockKeyhole />
          ) : (
            <ShieldAlert />
          )}
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-.05em]">
          {content[0]}
        </h1>
        <p className="mt-4 leading-7 text-[var(--cv-ink-soft)]">{content[1]}</p>
        <div className="mt-7 border-l-4 border-[var(--cv-warning)] bg-[#f7eddb] p-4 text-sm leading-6">
          No token is consumed and no response is recorded in this unconfigured
          preview.
        </div>
        <Button href="/sign-in" className="mt-7">
          Continue to managed sign-in
        </Button>
      </section>
    </main>
  );
}
