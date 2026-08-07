import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { tierForPrice } from "@/lib/billing/catalog";
import { getStripe } from "@/lib/integrations/stripe";
import {
  claimReplayKey,
  completeReplayKey,
  releaseReplayKey,
} from "@/lib/integrations/upstash";

async function persistSubscription(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata.clerk_user_id;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = subscription.metadata.tier || (priceId && tierForPrice(priceId));
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  if (!clerkUserId || !priceId || !tier) {
    throw new Error("SUBSCRIPTION_METADATA_INCOMPLETE");
  }

  const stripe = getStripe();
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted || !customer.email) {
    throw new Error("CUSTOMER_EMAIL_UNAVAILABLE");
  }

  const emailHash = createHash("sha256")
    .update(customer.email.trim().toLowerCase())
    .digest("hex");
  const db = getDb();
  const [user] = await db
    .insert(users)
    .values({ authProviderUserId: clerkUserId, primaryEmailHash: emailHash })
    .onConflictDoUpdate({
      target: users.authProviderUserId,
      set: { primaryEmailHash: emailHash, updatedAt: new Date() },
    })
    .returning({ id: users.id });
  if (!user) throw new Error("USER_UPSERT_FAILED");

  const periodEnd = subscription.items.data.reduce(
    (latest, item) => Math.max(latest, item.current_period_end),
    0,
  );
  const values = {
    userId: user.id,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    priceId,
    tier,
    status: subscription.status,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    updatedAt: new Date(),
  };
  const [existing] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1);
  if (existing) {
    await db
      .update(subscriptions)
      .set(values)
      .where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values(values);
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    return NextResponse.json({ error: "STRIPE_UNAVAILABLE" }, { status: 503 });
  }
  if (!signature) {
    return NextResponse.json({ error: "MISSING_SIGNATURE" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  const replayKey = `stripe:webhook:${event.id}`;
  try {
    const claimed = await claimReplayKey(replayKey, 300);
    if (!claimed) return NextResponse.json({ received: true, duplicate: true });

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await persistSubscription(event.data.object);
    }
    await completeReplayKey(replayKey, 60 * 60 * 24 * 30);
    return NextResponse.json({ received: true });
  } catch {
    await releaseReplayKey(replayKey).catch(() => undefined);
    return NextResponse.json(
      { error: "WEBHOOK_PROCESSING_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
