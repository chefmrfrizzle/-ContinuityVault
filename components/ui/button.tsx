import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "quiet" | "danger";
  className?: string;
} & Omit<ComponentProps<"button">, "children">;

export function Button({
  href,
  children,
  tone = "primary",
  className,
  ...buttonProps
}: Props) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cv-forest)] focus-visible:ring-offset-2",
    tone === "primary" &&
      "bg-[var(--cv-forest)] text-white hover:bg-[var(--cv-forest-deep)]",
    tone === "secondary" &&
      "border border-[var(--cv-line)] bg-white text-[var(--cv-ink)] hover:bg-[var(--cv-paper)]",
    tone === "quiet" &&
      "text-[var(--cv-forest)] hover:bg-[var(--cv-paper-deep)]",
    tone === "danger" && "bg-[var(--cv-danger)] text-white hover:brightness-90",
    className,
  );
  if (href)
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
