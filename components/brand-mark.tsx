export function BrandMark() {
  return (
    <span className="flex items-center gap-2.5 text-[var(--cv-ink)]">
      <span
        className="relative grid size-7 place-items-center rounded-sm bg-[var(--cv-forest)]"
        aria-hidden="true"
      >
        <span className="size-2.5 rotate-45 border border-[var(--cv-mint)]" />
      </span>
      <span className="font-semibold tracking-[-0.03em]">Continuity Vault</span>
    </span>
  );
}
