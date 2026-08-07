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
    "Synthetic rehearsal note: verify the sample handoff and confirm the cancellation path.",
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
      return setError("Confirm that this is harmless synthetic test material.");
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
            <p className="font-semibold">Test-package mode only</p>
            <p className="mt-1 text-sm leading-6 text-[var(--cv-ink-soft)]">
              Use harmless synthetic text. Nothing is uploaded; encryption and
              downloads occur locally. This provisional implementation is not
              approved for real protected material.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7">
        <label className="grid gap-2 font-semibold">
          Harmless rehearsal text
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
          Never enter names, credentials, legal documents, recovery data,
          personal details, or real instructions.
        </p>
        <label className="grid gap-2 font-semibold">
          Local test recovery passphrase
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            minLength={12}
            autoComplete="new-password"
            className="min-h-12 rounded-md border border-[var(--cv-line)] bg-white px-4 font-normal"
          />
        </label>
        <label className="flex items-start gap-3 text-sm leading-6">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 size-5"
          />
          <span>
            I confirm this is harmless synthetic test material and understand
            the company cannot recover this local test passphrase.
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
          <FileLock2 size={16} /> Create local test package
        </Button>
        {result && (
          <div
            aria-live="polite"
            className="border border-[var(--cv-success)]/30 bg-[var(--cv-mint)]/35 p-5"
          >
            <p className="font-semibold">Local encryption complete</p>
            <p className="mt-2 font-mono text-xs break-all">
              SHA-256 · {result.package.ciphertextSha256}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  downloadJson("continuity-test-package.json", result.package)
                }
              >
                <Download size={16} /> Download ciphertext
              </Button>
              <Button
                tone="secondary"
                onClick={() =>
                  downloadJson("continuity-test-recovery.json", result.recovery)
                }
              >
                <Download size={16} /> Download recovery kit
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--cv-ink-soft)]">
              Keep the files separate for this rehearsal. Refresh clears the
              in-memory key and result.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
