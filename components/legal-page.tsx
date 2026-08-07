export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[780px] px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[.18em]">
        Prototype policy draft
      </p>
      <h1 className="mt-5 text-6xl font-semibold tracking-[-.06em]">{title}</h1>
      <div className="mt-10 grid gap-6 text-[var(--cv-ink-soft)] [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--cv-ink)] [&_p]:leading-7">
        {children}
      </div>
    </article>
  );
}
