import { createHash } from "node:crypto";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  billingIntervals,
  billingTiers,
  getPriceId,
} from "@/lib/billing/catalog";
import { getStripe } from "@/lib/integrations/stripe";
import { consumeRateLimit } from "@/lib/integrations/upstash";

const checkoutRequest = z.object({
  tier: z.enum(billingTiers),
  interval: z.enum(billingIntervals),
});

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([new URL(request.url).origin]);
  if (process.env.NEXT_PUBLIC_APP_URL) {
    allowed.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin);
  }
  return allowed.has(origin);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "INVALID_ORIGIN" }, { status: 403 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "AUTHENTICATION_REQUIRED" },
      { status: 401 },
    );
  }

  const parsed = checkoutRequest.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_PLAN" }, { status: 400 });
  }

  try {
    const subject = createHash("sha256").update(userId).digest("hex");
    const rateLimit = await consumeRateLimit(
      `billing:checkout:${subject}`,
      5,
      900,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 });
    }

    const priceId = getPriceId(parsed.data.tier, parsed.data.interval);
    if (!priceId) {
      return NextResponse.json({ error: "PRICE_UNAVAILABLE" }, { status: 503 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: "VERIFIED_EMAIL_REQUIRED" },
        { status: 409 },
      );
    }

    const stripe = getStripe();
    const existing = await stripe.customers.search({
      query: `metadata['clerk_user_id']:'${userId}'`,
      limit: 1,
    });
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({
        email,
        metadata: { clerk_user_id: userId },
      }));

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/app/billing?checkout=success`,
      cancel_url: `${appUrl}/app/billing?checkout=cancelled`,
      metadata: { clerk_user_id: userId, tier: parsed.data.tier },
      subscription_data: {
        metadata: { clerk_user_id: userId, tier: parsed.data.tier },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "CHECKOUT_UNAVAILABLE" },
        { status: 503 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "BILLING_UNAVAILABLE" }, { status: 503 });
  }
}
