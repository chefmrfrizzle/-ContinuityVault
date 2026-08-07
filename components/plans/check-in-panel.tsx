"use client";
import { useState } from "react";
import { CheckCircle2, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CheckInPanel() {
  const [complete, setComplete] = useState(false);
  if (complete)
    return (
      <div aria-live="polite" className="rounded-md bg-[var(--cv-mint)] p-6">
        <CheckCircle2 />
        <h2 className="mt-4 text-2xl font-semibold">Simulation renewed.</h2>
        <p className="mt-2 text-[var(--cv-ink-soft)]">
          Synthetic receipt · next check-in 06 September 2026. No server state
          changed.
        </p>
      </div>
    );
  return (
    <div className="rounded-md bg-[var(--cv-forest-deep)] p-6 text-white">
      <RadioTower className="text-[var(--cv-mint)]" />
      <p className="mt-5 text-sm text-white/60">Current stage</p>
      <h2 className="mt-1 text-3xl font-semibold">Armed simulation</h2>
      <p className="mt-4 max-w-xl leading-7 text-white/70">
        A secure check-in would consume an authenticated one-time challenge and
        reset the schedule. This preview records nothing.
      </p>
      <Button
        onClick={() => setComplete(true)}
        className="mt-6 bg-[var(--cv-acid)] text-[var(--cv-forest-deep)] hover:bg-[var(--cv-mint)]"
      >
        I am available — renew this test plan
      </Button>
    </div>
  );
}
