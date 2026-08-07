import { OnboardingFlow } from "@/components/onboarding-flow";
export const metadata = { title: "Onboarding" };
export default function Page() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[.16em] text-[var(--cv-ink-soft)]">
        New continuity plan
      </p>
      <h1 className="mt-3 mb-8 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
        One consequential choice at a time.
      </h1>
      <OnboardingFlow />
    </>
  );
}
