export const metadata = { title: "FAQ" };
const items = [
  [
    "Can Continuity Vault read my package?",
    "No. Your browser locks the information before the service receives anything, and we do not get the key needed to read it. For now, use made-up practice information only.",
  ],
  [
    "Does a missed text deliver anything?",
    "No. A message is only a reminder. We remind you, wait, ask trusted people to agree, and then wait again before anything can be shared.",
  ],
  [
    "Can support force a release?",
    "No. Support can stop the process or help fix a problem. It cannot read your package, skip the people who must agree, shorten a waiting period, or force sharing.",
  ],
  [
    "What if a provider is down?",
    "The process stops. A service outage or uncertainty can never move a plan closer to sharing.",
  ],
  [
    "Do recipients pay?",
    "No. Trusted people use free accounts to sign in and receive an approved practice message or, after launch, a locked package.",
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
