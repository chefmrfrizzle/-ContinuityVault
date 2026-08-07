import Stripe from "stripe";
import { Redis } from "@upstash/redis";

const checks = {};

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error("Stripe is not configured.");
const stripe = new Stripe(stripeKey);
const prices = await stripe.prices.list({ active: true, limit: 100 });
const expectedPriceIds = Object.entries(process.env)
  .filter(([key]) => key.startsWith("STRIPE_PRICE_"))
  .map(([, value]) => value)
  .filter(Boolean);
checks.stripe = expectedPriceIds.every((id) =>
  prices.data.some((price) => price.id === id),
);
const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
checks.stripeWebhook = Boolean(
  appUrl &&
  webhooks.data.some(
    (endpoint) =>
      endpoint.url === `${appUrl}/api/webhooks/stripe` &&
      endpoint.status === "enabled",
  ),
);

const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
if (!redisUrl || !redisToken) throw new Error("Upstash is not configured.");
const redis = new Redis({ url: redisUrl, token: redisToken });
const key = `verification:${crypto.randomUUID()}`;
await redis.set(key, "ok", { ex: 30 });
checks.upstash = (await redis.get(key)) === "ok";
await redis.del(key);

if (!Object.values(checks).every(Boolean)) {
  throw new Error("One or more provider checks failed.");
}
console.log(JSON.stringify(checks));
