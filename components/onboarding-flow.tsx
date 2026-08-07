"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "What continuity problem are you preparing for?",
    copy: "Choose a harmless test scenario.",
    options: [
      "Personal instructions",
      "Household coordination",
      "Founder or business operations",
      "Digital-account continuity",
    ],
  },
  {
    title: "How often should the test plan check in?",
    copy: "You will see the full staged timeline before saving.",
    options: ["Every 14 days", "Every 30 days", "Every 90 days"],
  },
  {
    title: "What must be confirmed before delivery?",
    copy: "Single-message authorization is never offered.",
    options: [
      "Two trusted contacts",
      "Three-of-five quorum",
      "Time delay plus two contacts",
    ],
  },
];
export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const current = steps[step];
  const done = step === steps.length;
  if (done)
    return (
      <div className="border border-[var(--cv-line)] bg-[#fbfaf6] p-8">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--cv-mint)]">
          <Check />
        </span>
        <h2 className="mt-6 text-3xl font-semibold tracking-[-.04em]">
          Test plan outline ready.
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-[var(--cv-ink-soft)]">
          Next, prepare a harmless local test package, add synthetic recipients,
          run a rehearsal, and review the complete timeline before simulated
          arming.
        </p>
        <Button href="/app/plans/new" className="mt-7">
          Continue to plan workspace <ArrowRight size={16} />
        </Button>
      </div>
    );
  return (
    <div className="border border-[var(--cv-line)] bg-[#fbfaf6]">
      <div className="flex items-center justify-between border-b border-[var(--cv-line)] p-5">
        <p className="font-mono text-xs uppercase tracking-[.14em]">
          Step {step + 1} of {steps.length}
        </p>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 ${i <= step ? "bg-[var(--cv-forest)]" : "bg-[var(--cv-paper-deep)]"}`}
            />
          ))}
        </div>
      </div>
      <div className="p-6 sm:p-10">
        <div className="flex gap-3 rounded-md bg-[#f7eddb] p-4 text-sm">
          <ShieldAlert
            size={18}
            className="shrink-0 text-[var(--cv-warning)]"
          />
          Test mode accepts synthetic scenarios only.
        </div>
        <h2 className="mt-8 max-w-xl text-3xl font-semibold tracking-[-.04em]">
          {current?.title}
        </h2>
        <p className="mt-3 text-[var(--cv-ink-soft)]">{current?.copy}</p>
        <div className="mt-7 grid gap-3">
          {current?.options.map((option) => (
            <button
              key={option}
              onClick={() => setChoices([...choices.slice(0, step), option])}
              className={`min-h-14 rounded-md border p-4 text-left font-semibold ${choices[step] === option ? "border-[var(--cv-forest)] bg-[var(--cv-mint)]/30" : "border-[var(--cv-line)] bg-white hover:border-[var(--cv-forest)]"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <Button
            tone="quiet"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <Button disabled={!choices[step]} onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
