import { Bell } from "lucide-react";
import { NotificationTestActions } from "@/components/notification-test-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { integrationAvailability } from "@/lib/integrations/availability";

export const metadata = { title: "Notification settings" };

export default function Page() {
  const emailReady =
    integrationAvailability("resend").configured &&
    integrationAvailability("upstash").configured;
  const smsReady = integrationAvailability("twilio").configured;

  return (
    <>
      <Bell />
      <h1 className="mt-5 text-5xl font-semibold tracking-[-.05em]">
        Reminders
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--cv-ink-soft)]">
        Email and text messages only remind someone to return to the secure
        website. A message can never complete a check-in or approve sharing.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <StatusBadge tone={emailReady ? "healthy" : "warning"}>
            {emailReady ? "Email test ready" : "Email unavailable"}
          </StatusBadge>
          <h2 className="mt-4 text-2xl font-semibold">Email</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--cv-ink-soft)]">
            For now, Resend can send a harmless practice message to the email
            address on your signed-in account.
          </p>
          <NotificationTestActions emailReady={emailReady} />
        </section>
        <section className="border border-[var(--cv-line)] bg-[#fbfaf6] p-6">
          <StatusBadge tone={smsReady ? "healthy" : "warning"}>
            {smsReady ? "Text-message test ready" : "Not connected yet"}
          </StatusBadge>
          <h2 className="mt-4 text-2xl font-semibold">Text messages</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--cv-ink-soft)]">
            Twilio stays off until you create a trial account and choose a test
            number. You do not need Flask or Python for this website.
          </p>
        </section>
      </div>
    </>
  );
}
