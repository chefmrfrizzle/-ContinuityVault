import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--cv-line)] bg-[var(--cv-paper-deep)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--cv-ink-soft)]">
            Self-custodial continuity infrastructure. Test mode only while
            security and cryptographic review remain open.
          </p>
        </div>
        <div className="grid content-start gap-3 text-sm">
          <p className="font-semibold">Product</p>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/security">Security boundary</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/status">System status</Link>
        </div>
        <div className="grid content-start gap-3 text-sm">
          <p className="font-semibold">Legal</p>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/acceptable-use">Acceptable use</Link>
          <span className="mt-4 font-mono text-xs text-[var(--cv-ink-soft)]">
            PROTOTYPE · TEST DATA ONLY
          </span>
        </div>
      </div>
    </footer>
  );
}
