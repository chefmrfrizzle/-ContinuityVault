import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Pricing" };
const plans = [
  [
    "Test mode",
    "Free",
    "30 days",
    [
      "Harmless test packages",
      "Local encrypted export",
      "Full rehearsal preview",
    ],
  ],
  [
    "Personal",
    "CAD 149",
    "per year",
    ["One continuity plan", "Up to 3 recipients", "Quarterly rehearsals"],
  ],
  [
    "Household",
    "CAD 299",
    "per year",
    ["Multiple plans", "Up to 10 recipients", "Quarterly rehearsals"],
  ],
  [
    "Founder",
    "CAD 1,200",
    "per year",
    ["Organization roles", "Monthly rehearsals", "Priority exception handling"],
  ],
];
export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-20 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[.18em]">
        Annual-first plans
      </p>
      <h1 className="mt-4 max-w-3xl text-6xl font-semibold tracking-[-.06em]">
        Infrastructure for a plan that stays ready.
      </h1>
      <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--cv-ink-soft)]">
        Pricing is a product assumption and will be configured through Stripe.
        Billing never influences release authorization.
      </p>
      <div className="mt-14 grid border-l border-t border-[var(--cv-line)] md:grid-cols-2 lg:grid-cols-4">
        {plans.map(([name, price, term, items], i) => (
          <article
            key={name as string}
            className="flex min-h-[420px] flex-col border-b border-r border-[var(--cv-line)] bg-[#fbfaf6] p-6"
          >
            <p className="font-mono text-xs uppercase tracking-[.14em]">
              {name}
            </p>
            <p className="mt-8 text-4xl font-semibold tracking-[-.05em]">
              {price}
            </p>
            <p className="mt-1 text-sm text-[var(--cv-ink-soft)]">{term}</p>
            <ul className="mt-8 grid gap-3 text-sm">
              {(items as string[]).map((item) => (
                <li key={item} className="flex gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-[var(--cv-success)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              href={i === 0 ? "/app/onboarding" : "/sign-up"}
              tone={i === 1 ? "primary" : "secondary"}
              className="mt-auto"
            >
              {i === 0 ? "Start practice plan" : "Choose plan"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
