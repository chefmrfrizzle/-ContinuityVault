import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SitePage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: string[][];
}) {
  return (
    <>
      <section className="border-b border-[var(--cv-line)]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[.18em]">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-6xl font-semibold leading-[.95] tracking-[-.06em] md:text-7xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-[var(--cv-ink-soft)]">
            {intro}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-5 py-20 lg:px-8">
        <div className="grid border-l border-t border-[var(--cv-line)] md:grid-cols-3">
          {sections.map(([heading, copy], i) => (
            <article
              key={heading}
              className="min-h-80 border-b border-r border-[var(--cv-line)] bg-[#fbfaf6] p-8"
            >
              <p className="font-mono text-xs text-[var(--cv-ink-soft)]">
                0{i + 1}
              </p>
              <h2 className="mt-16 text-2xl font-semibold tracking-[-.03em]">
                {heading}
              </h2>
              <p className="mt-4 leading-7 text-[var(--cv-ink-soft)]">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Button href="/app/onboarding">
            Build a test plan <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </>
  );
}
