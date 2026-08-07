import { NextResponse } from "next/server";
import Stripe from "stripe";
import { integrationAvailability } from "@/lib/integrations/availability";

export async function POST(request: Request) {
  if (
    !integrationAvailability("stripe").configured ||
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_WEBHOOK_SECRET
  ) {
    return NextResponse.json({ error: "STRIPE_UNAVAILABLE" }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "MISSING_SIGNATURE" }, { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }
  return NextResponse.json(
    {
      error: "REPLAY_STORE_UNAVAILABLE",
      message:
        "Signed event was not processed because durable replay protection is not enabled.",
    },
    { status: 503 },
  );
}
