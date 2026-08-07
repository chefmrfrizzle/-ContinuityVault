"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Who is this plan for?",
    copy: "Choose the kind of plan you want to practise.",
    options: [
      {
        label: "Just me",
        description: "Personal instructions and important information.",
      },
      {
        label: "My household",
        description: "Information that family members may need.",
      },
      {
        label: "My business",
        description: "Important steps if I cannot manage the business.",
      },
      {
        label: "My online accounts",
        description: "Instructions for accounts, devices, and digital files.",
      },
    ],
  },
  {
    title: "How often should we ask if you are okay?",
    copy: "You can change this later. Missing one reminder does not share anything.",
    options: [
      {
        label: "Every 2 weeks",
        description: "More frequent. Good when things change often.",
      },
      {
        label: "Every month",
        description: "A simple, balanced choice for most people.",
        badge: "Suggested",
      },
      {
        label: "Every 3 months",
        description: "Fewer check-ins. Good for a plan that rarely changes.",
      },
    ],
  },
  {
    title: "Who should agree before anything is shared?",
    copy: "One missed check-in is never enough. Choose the extra safety checks you want.",
    options: [
      {
        label: "Two people must agree",
        description:
          "Two trusted contacts must both confirm before the waiting period can begin.",
      },
      {
        label: "Three out of five people must agree",
        description:
          "At least three of five trusted contacts must confirm. If answers conflict, sharing stops.",
      },
      {
        label: "Wait, then ask two people",
        description:
          "The system waits the full safety period, then two trusted contacts must agree. This gives you the most time to return.",
        badge: "Most cautious",
      },
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
          Your practice plan is ready to finish.
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-[var(--cv-ink-soft)]">
          Next, add a practice note, choose trusted contacts, and try the whole
          process from beginning to end. Nothing will be sent.
        </p>
        <Button href="/app/plans/new" className="mt-7">
          Continue setting up my plan <ArrowRight size={16} />
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
          Practice mode: use made-up information only.
        </div>
        <h2 className="mt-8 max-w-xl text-3xl font-semibold tracking-[-.04em]">
          {current?.title}
        </h2>
        <p className="mt-3 text-[var(--cv-ink-soft)]">{current?.copy}</p>
        <div className="mt-7 grid gap-3">
          {current?.options.map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={choices[step] === option.label}
              onClick={() =>
                setChoices([...choices.slice(0, step), option.label])
              }
              className={`min-h-20 rounded-md border p-4 text-left ${choices[step] === option.label ? "border-[var(--cv-forest)] bg-[var(--cv-mint)]/30" : "border-[var(--cv-line)] bg-white hover:border-[var(--cv-forest)]"}`}
            >
              <span className="flex flex-wrap items-center gap-2 font-semibold">
                {option.label}
                {option.badge && (
                  <span className="rounded-full bg-[var(--cv-paper-deep)] px-2 py-1 text-[10px] uppercase tracking-[.08em] text-[var(--cv-ink-soft)]">
                    {option.badge}
                  </span>
                )}
              </span>
              <span className="mt-1 block text-sm font-normal leading-6 text-[var(--cv-ink-soft)]">
                {option.description}
              </span>
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
