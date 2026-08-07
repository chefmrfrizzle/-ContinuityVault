import { cn } from "@/lib/utils";

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "healthy" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]",
        tone === "neutral" &&
          "bg-[var(--cv-paper-deep)] text-[var(--cv-ink-soft)]",
        tone === "healthy" &&
          "bg-[var(--cv-mint)] text-[var(--cv-forest-deep)]",
        tone === "warning" && "bg-[#f4e6c9] text-[var(--cv-warning)]",
        tone === "danger" && "bg-[#f4d9d6] text-[var(--cv-danger)]",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
