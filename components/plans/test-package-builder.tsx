"use client";

import { useState } from "react";
import { Download, FileLock2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestOnlyWebCryptoProvider } from "@/lib/crypto/test-provider";
import type {
  EncryptedPackage,
  EncryptedRecoveryKit,
} from "@/lib/crypto/types";

function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function TestPackageBuilder() {
  const [text, setText] = useState(
    "This is a practice message for my family. Please confirm that you can open the practice file.",
  );
  const [passphrase, setPassphrase] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<{
    package: EncryptedPackage;
    recovery: EncryptedRecoveryKit;
  } | null>(null);
  const [error, setError] = useState("");

  async function create() {
    setError("");
    setResult(null);
    if (!confirmed)
      return setError("Please confirm that you are using made-up information.");
    try {
      const provider = new TestOnlyWebCryptoProvider();
      const created = await provider.createPackage({
        plaintext: text,
        planId: "00000000-0000-4000-8000-000000000001",
        policyVersion: 1,
      });
      const rawKey = await crypto.subtle.exportKey("raw", created.contentKey);
      const recovery = await provider.exportRecoveryKit({
        packageId: created.package.packageId,
        rawContentKey: rawKey,
        passphrase,
      });
      setResult({ package: created.package, recovery });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Package creation failed closed.",
      );
    }
  }

  return (
    <section className="border border-[var(--cv-line)] bg-[#fbfaf6]">
      <div className="border-b border-[var(--cv-line)] bg-[#f7eddb] p-5">
        <div className="flex gap-3">
          <ShieldAlert className="shrink-0 text-[var(--cv-warning)]" />
          <div>
            <p className="font-semibold">Practice only</p>
            <p className="mt-1 text-sm leading-6 text-[var(--cv-ink-soft)]">
              Use made-up information. This stays on this device and is not
              saved to your account.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7">
        <label className="grid gap-2 font-semibold">
          Practice note
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={5}
            className="rounded-md border border-[var(--cv-line)] bg-white p-4 font-normal leading-7"
            aria-describedby="package-hint"
          />
        </label>
        <p
          id="package-hint"
          className="-mt-4 text-xs text-[var(--cv-ink-soft)]"
        >
          Example: &ldquo;This is a practice message for my family.&rdquo; Do
          not enter names, passwords, documents, or real instructions yet.
        </p>
        <label className="grid gap-2 font-semibold">
          Practice password
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            minLength={12}
            autoComplete="new-password"
            className="min-h-12 rounded-md border border-[var(--cv-line)] bg-white px-4 font-normal"
            aria-describedby="password-hint"
          />
        </label>
        <p
          id="password-hint"
          className="-mt-4 text-xs leading-5 text-[var(--cv-ink-soft)]"
        >
          Use at least 12 characters. We cannot reset this password.
        </p>
        <label className="flex items-start gap-3 text-sm leading-6">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 size-5"
          />
          <span>
            I understand this is a practice. I am using made-up information
            only.
          </span>
        </label>
        {error && (
          <p
            role="alert"
            className="border-l-4 border-[var(--cv-danger)] bg-[#f4d9d6] p-3 text-sm"
          >
            {error}
          </p>
        )}
        <Button onClick={create} className="w-fit">
          <FileLock2 size={16} /> Lock my practice package
        </Button>
        {result && (
          <div
            aria-live="polite"
            className="border border-[var(--cv-success)]/30 bg-[var(--cv-mint)]/35 p-5"
          >
            <p className="font-semibold">Your practice package is locked.</p>
            <p className="mt-2 text-sm leading-6 text-[var(--cv-ink-soft)]">
              Download both files. Keep them in different safe places so one
              lost file does not leave you without a backup.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  downloadJson("continuity-test-package.json", result.package)
                }
              >
                <Download size={16} /> Download locked package
              </Button>
              <Button
                tone="secondary"
                onClick={() =>
                  downloadJson("continuity-test-recovery.json", result.recovery)
                }
              >
                <Download size={16} /> Download recovery file
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--cv-ink-soft)]">
              This practice result disappears when you refresh the page.
            </p>
            <details className="mt-4 text-xs text-[var(--cv-ink-soft)]">
              <summary className="cursor-pointer font-semibold">
                Technical details
              </summary>
              <p className="mt-2 font-mono break-all">
                SHA-256 · {result.package.ciphertextSha256}
              </p>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
