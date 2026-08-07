import { NextResponse } from "next/server";
import { integrationAvailability } from "@/lib/integrations/availability";
import { isGlobalReleaseFrozen } from "@/lib/security/global-freeze";

export function GET() {
  const providers = Object.fromEntries(
    (
      [
        "clerk",
        "neon",
        "blob",
        "upstash",
        "resend",
        "twilio",
        "stripe",
      ] as const
    ).map((name) => [
      name,
      integrationAvailability(name).configured ? "configured" : "unavailable",
    ]),
  );
  return NextResponse.json(
    {
      mode: "test-only",
      releaseProcessing: isGlobalReleaseFrozen() ? "frozen" : "configured-off",
      providers,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
