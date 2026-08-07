import {
  ArrowRight,
  Check,
  FileLock2,
  Fingerprint,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const principles = [
  {
    icon: FileLock2,
    title: "Encrypted on your device",
    copy: "Protected material and unwrapped keys stay inside your browser. The service coordinates ciphertext only.",
  },
  {
    icon: Fingerprint,
    title: "Proof, not a text reply",
    copy: "Email and SMS remind you. A secure response always happens inside an authenticated application flow.",
  },
  {
    icon: ShieldCheck,
    title: "Uncertainty stops delivery",
    copy: "Conflicting evidence, provider trouble, integrity failure, or a security incident freezes the process.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--cv-line)]">
        <div
          className="grid-lines absolute inset-0 opacity-35"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1200px] items-center gap-16 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <StatusBadge>Independent review pending · test mode</StatusBadge>
            <h1 className="mt-8 max-w-3xl text-balance text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[.88] tracking-[-0.075em]">
              Your plan, kept in motion.
            </h1>
            <p className="mt-8 max-w-xl text-balance text-xl leading-8 text-[var(--cv-ink-soft)]">
              A continuity system that monitors your signal, rehearses the
              process, and coordinates delivery—without holding the key required
              to read your package.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/app/onboarding">
                Build a test plan <ArrowRight size={16} />
              </Button>
              <Button href="/how-it-works" tone="secondary">
                See the protocol
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[.12em] text-[var(--cv-ink-soft)]">
              No real protected material · local encrypted export only
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[510px]">
            <div
              className="absolute -inset-8 rounded-full bg-[var(--cv-mint)]/45 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative border border-[var(--cv-line)] bg-[#fbfaf6] p-3 shadow-[0_32px_90px_rgba(16,32,26,.13)]">
              <div className="flex items-center justify-between border-b border-[var(--cv-line)] px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2 rounded-full bg-[var(--cv-line)]" />
                  <span className="size-2 rounded-full bg-[var(--cv-line)]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[.16em]">
                  Plan health / sample
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[.12em] text-[var(--cv-ink-soft)]">
                      Household continuity
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">
                      Prepared & rehearsed
                    </h2>
                  </div>
                  <StatusBadge tone="healthy">Armed</StatusBadge>
                </div>
                <div className="my-8 border-y border-[var(--cv-line)] py-7">
                  <p className="text-sm text-[var(--cv-ink-soft)]">
                    Next secure check-in
                  </p>
                  <p className="mt-1 text-5xl font-semibold tracking-[-.06em]">
                    24 days
                  </p>
                  <p className="mt-2 font-mono text-xs">
                    31 AUG 2026 · 09:00 EDT
                  </p>
                </div>
                <div className="grid gap-3">
                  {[
                    "3 of 3 recipients ready",
                    "Rehearsal passed 18 Jul",
                    "Package integrity verified",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-b border-[var(--cv-line)] py-2 text-sm last:border-0"
                    >
                      <span className="grid size-5 place-items-center rounded-full bg-[var(--cv-mint)]">
                        <Check size={12} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-md bg-[var(--cv-forest)] p-5 text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <RadioTower size={16} /> Monitoring signal
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    A missed reminder starts a staged verification process. It
                    never causes immediate delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--cv-forest-deep)] text-white">
        <div className="mx-auto max-w-[1200px] px-5 py-24 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-[var(--cv-mint)]">
            The boundary matters
          </p>
          <h2 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-[-.045em] md:text-6xl">
            We coordinate the process. We cannot read the package.
          </h2>
          <div className="mt-16 grid border-y border-white/15 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, copy }, index) => (
              <article
                key={title}
                className="border-b border-white/15 px-0 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
              >
                <div className="grid size-11 place-items-center border border-white/20 text-[var(--cv-mint)]">
                  <Icon size={20} />
                </div>
                <p className="mt-7 font-mono text-xs text-white/50">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-white/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-[var(--cv-forest)]">
              Protect → Verify → Deliver
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-.055em]">
              Several safety locks. One calm routine.
            </h2>
          </div>
          <ol className="border-t border-[var(--cv-line)]">
            {[
              [
                "Prepare locally",
                "Create a harmless test package in your browser and keep your own recovery material.",
              ],
              [
                "Check in securely",
                "Renew your plan on schedule in a short authenticated flow.",
              ],
              [
                "Verify carefully",
                "If check-ins stop, reminders, grace periods, trusted contacts, and a final hold run in order.",
              ],
              [
                "Deliver ciphertext",
                "Only deterministic policy can authorize delivery—and only after every safety gate passes.",
              ],
            ].map(([title, copy], i) => (
              <li
                key={title}
                className="grid gap-3 border-b border-[var(--cv-line)] py-7 sm:grid-cols-[64px_180px_1fr]"
              >
                <span className="font-mono text-xs text-[var(--cv-ink-soft)]">
                  0{i + 1}
                </span>
                <span className="font-semibold">{title}</span>
                <span className="leading-7 text-[var(--cv-ink-soft)]">
                  {copy}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto mb-8 max-w-[1200px] px-5 lg:px-8">
        <div className="relative overflow-hidden bg-[var(--cv-acid)] px-6 py-16 sm:px-12 lg:px-16">
          <div
            className="grid-lines absolute inset-0 opacity-30"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[.18em]">
                Test the complete process
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
                Build a continuity plan you can actually rehearse.
              </h2>
            </div>
            <Button href="/app/onboarding" className="shrink-0">
              Start in test mode <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
