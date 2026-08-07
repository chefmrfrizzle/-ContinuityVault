import { KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Security settings" };
export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-[-.05em]">
        Security settings
      </h1>
      <p className="mt-4 text-[var(--cv-ink-soft)]">
        Managed authentication is not provisioned in this local preview.
      </p>
      <div className="mt-8 grid gap-4">
        <section className="flex gap-4 border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <ShieldCheck className="shrink-0" />
          <div>
            <h2 className="font-semibold">Strong authentication</h2>
            <p className="mt-2 leading-6 text-[var(--cv-ink-soft)]">
              Prefer passkeys or another phishing-resistant factor supported by
              Clerk.
            </p>
            <Button disabled className="mt-5">
              Manage with Clerk
            </Button>
          </div>
        </section>
        <section className="flex gap-4 border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <KeyRound className="shrink-0" />
          <div>
            <h2 className="font-semibold">Recovery separation</h2>
            <p className="mt-2 leading-6 text-[var(--cv-ink-soft)]">
              Account recovery never grants access to package recovery keys.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
