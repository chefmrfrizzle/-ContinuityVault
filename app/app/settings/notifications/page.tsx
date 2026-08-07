import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Notification settings" };
export default function Page() {
  return (
    <>
      <Bell />
      <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em]">
        Notification routes
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--cv-ink-soft)]">
        Email and SMS carry neutral reminders. They never complete a check-in or
        authorize release.
      </p>
      <div className="mt-8 border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
        <p className="font-semibold">No providers configured</p>
        <p className="mt-2 text-sm text-[var(--cv-ink-soft)]">
          Provision Resend and Twilio test credentials to manage verified
          routes.
        </p>
        <Button disabled className="mt-5">
          Add verified route
        </Button>
      </div>
    </>
  );
}
