import { NextResponse } from "next/server";
import { validateRequest } from "twilio";
import { integrationAvailability } from "@/lib/integrations/availability";

export async function POST(request: Request) {
  if (
    !integrationAvailability("twilio").configured ||
    !process.env.TWILIO_AUTH_TOKEN
  ) {
    return NextResponse.json({ error: "TWILIO_UNAVAILABLE" }, { status: 503 });
  }
  const signature = request.headers.get("x-twilio-signature");
  if (!signature)
    return NextResponse.json({ error: "MISSING_SIGNATURE" }, { status: 400 });
  const params = Object.fromEntries(new URLSearchParams(await request.text()));
  if (
    !validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      signature,
      request.url,
      params,
    )
  ) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }
  return NextResponse.json(
    {
      error: "REPLAY_STORE_UNAVAILABLE",
      message:
        "Signed callback was not processed because durable replay protection is not enabled.",
    },
    { status: 503 },
  );
}
