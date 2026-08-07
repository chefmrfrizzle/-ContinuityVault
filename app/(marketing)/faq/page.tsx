export const metadata = { title: "FAQ" };
const items = [
  [
    "Can Continuity Vault read my package?",
    "No. The intended architecture keeps plaintext and unwrapped content keys in your browser. This prototype supports harmless test packages only.",
  ],
  [
    "Does a missed text deliver anything?",
    "No. A message is a reminder, never authorization. Missed check-ins begin a staged process with grace periods, authenticated responses, quorum, and a final hold.",
  ],
  [
    "Can support force a release?",
    "No. Operators can freeze or resolve blockers within policy; they cannot decrypt, skip quorum, shorten a hold, or force delivery.",
  ],
  [
    "What if a provider is down?",
    "The affected release freezes. Provider failure or uncertainty can never move a plan closer to delivery.",
  ],
  [
    "Do recipients pay?",
    "No. Recipients use free accounts to authenticate and receive an authorized test or eventual reviewed delivery.",
  ],
  [
    "Is this a replacement for an executor or attorney?",
    "No. It is continuity infrastructure, not an executor, trustee, legal-document service, emergency service, or professional adviser.",
  ],
];
export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[.18em]">
        Plain-language answers
      </p>
      <h1 className="mt-5 text-6xl font-semibold tracking-[-.06em]">
        Questions worth asking.
      </h1>
      <div className="mt-12 border-t border-[var(--cv-line)]">
        {items.map(([q, a]) => (
          <details
            key={q}
            className="group border-b border-[var(--cv-line)] py-6"
          >
            <summary className="cursor-pointer list-none pr-8 text-xl font-semibold">
              {q}
              <span className="float-right text-[var(--cv-ink-soft)] group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-2xl leading-7 text-[var(--cv-ink-soft)]">
              {a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
