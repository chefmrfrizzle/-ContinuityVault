export type IntegrationName =
  "clerk" | "neon" | "blob" | "upstash" | "resend" | "twilio" | "stripe";

const requirements: Record<IntegrationName, readonly string[]> = {
  clerk: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
  neon: [],
  blob: ["BLOB_READ_WRITE_TOKEN"],
  upstash: [],
  resend: ["RESEND_API_KEY", "EMAIL_FROM"],
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
  const missing = [...requirements[name].filter((key) => !env[key])];
  if (
    name === "neon" &&
    !["POSTGRES_URL", "DATABASE_URL_UNPOOLED", "DATABASE_URL"].some(
      (key) => env[key],
    )
  ) {
    missing.push("POSTGRES_URL|DATABASE_URL_UNPOOLED|DATABASE_URL");
  }
  if (name === "upstash") {
    if (!env.UPSTASH_REDIS_REST_URL && !env.KV_REST_API_URL) {
      missing.push("UPSTASH_REDIS_REST_URL|KV_REST_API_URL");
    }
    if (!env.UPSTASH_REDIS_REST_TOKEN && !env.KV_REST_API_TOKEN) {
      missing.push("UPSTASH_REDIS_REST_TOKEN|KV_REST_API_TOKEN");
    }
  }
  return { configured: missing.length === 0, missing };
}
