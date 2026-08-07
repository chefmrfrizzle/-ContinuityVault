export type IntegrationName =
  "clerk" | "neon" | "blob" | "upstash" | "resend" | "twilio" | "stripe";

const requirements: Record<IntegrationName, readonly string[]> = {
  clerk: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
  neon: ["DATABASE_URL"],
  blob: ["BLOB_READ_WRITE_TOKEN"],
  upstash: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  resend: ["RESEND_API_KEY", "RESEND_WEBHOOK_SECRET", "EMAIL_FROM"],
  twilio: [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_MESSAGING_SERVICE_SID",
    "TWILIO_WEBHOOK_SECRET",
  ],
  stripe: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
};

export function integrationAvailability(
  name: IntegrationName,
  env: Record<string, string | undefined> = process.env,
) {
  const missing = requirements[name].filter((key) => !env[key]);
  return { configured: missing.length === 0, missing };
}
