"use client";
import { useState } from "react";
import { CheckCircle2, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CheckInPanel({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  if (complete)
    return (
      <div aria-live="polite" className="rounded-md bg-[var(--cv-mint)] p-6">
        <CheckCircle2 />
        <h2 className="mt-4 text-2xl font-semibold">You checked in.</h2>
        <p className="mt-2 text-[var(--cv-ink-soft)]">
          Your next practice check-in is 06 September 2026. In practice mode,
          nothing is saved or sent.
        </p>
      </div>
    );
  return (
    <div className="rounded-md bg-[var(--cv-forest-deep)] p-6 text-white">
      <RadioTower className="text-[var(--cv-mint)]" />
      <p className="mt-5 text-sm text-white/60">Practice plan</p>
      <h2 className="mt-1 text-3xl font-semibold">Your plan is active.</h2>
      <p className="mt-4 max-w-xl leading-7 text-white/70">
        Checking in tells the system you are okay and starts a new countdown. In
        practice mode, nothing is saved or sent.
      </p>
      <Button
        onClick={() => {
          setComplete(true);
          onComplete?.();
        }}
        className="mt-6 bg-[var(--cv-acid)] text-[var(--cv-forest-deep)] hover:bg-[var(--cv-mint)]"
      >
        I&apos;m okay — start the next 30 days
      </Button>
    </div>
  );
}
