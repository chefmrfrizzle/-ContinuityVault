import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cv-line)] bg-[color:rgba(244,243,237,0.92)] backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-[1200px] items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="Continuity Vault home">
          <BrandMark />
        </Link>
        <nav
          className="hidden items-center gap-7 text-sm font-medium md:flex"
          aria-label="Main navigation"
        >
          <Link href="/how-it-works">How it works</Link>
          <Link href="/security">Security</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button href="/sign-in" tone="quiet">
            Sign in
          </Button>
          <Button href="/app/onboarding">Start test plan</Button>
        </div>
        <Link
          href="/app"
          className="grid size-11 place-items-center md:hidden"
          aria-label="Open app"
        >
          <Menu aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
