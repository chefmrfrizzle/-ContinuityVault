import { createHash } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/integrations/stripe";
import { consumeRateLimit } from "@/lib/integrations/upstash";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "INVALID_ORIGIN" }, { status: 403 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "AUTHENTICATION_REQUIRED" },
      { status: 401 },
    );
  }

  try {
    const subject = createHash("sha256").update(userId).digest("hex");
    const rateLimit = await consumeRateLimit(
      `billing:portal:${subject}`,
      10,
      900,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 });
    }
    const stripe = getStripe();
    const customers = await stripe.customers.search({
      query: `metadata['clerk_user_id']:'${userId}'`,
      limit: 1,
    });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json(
        { error: "NO_BILLING_ACCOUNT" },
        { status: 404 },
      );
    }
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${appUrl}/app/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "BILLING_UNAVAILABLE" }, { status: 503 });
  }
}
