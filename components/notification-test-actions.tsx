"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotificationTestActions({
  emailReady,
}: {
  emailReady: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string>();

  async function sendTest() {
    setPending(true);
    setMessage(undefined);
    const response = await fetch("/api/notifications/email/test", {
      method: "POST",
    });
    if (response.status === 401) {
      router.push(
        `/sign-in?redirect_url=${encodeURIComponent("/app/settings/notifications")}`,
      );
      return;
    }
    setPending(false);
    setMessage(
      response.ok
        ? "Practice email sent to your signed-in address."
        : "The practice email could not be sent. Try again later.",
    );
  }

  return (
    <>
      <Button
        disabled={!emailReady || pending}
        onClick={sendTest}
        className="mt-5"
      >
        {pending ? "Sending..." : "Send me a practice email"}
      </Button>
      {message ? (
        <p role="status" className="mt-3 text-sm text-[var(--cv-ink-soft)]">
          {message}
        </p>
      ) : null}
    </>
  );
}
