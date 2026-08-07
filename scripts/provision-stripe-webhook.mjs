import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!secretKey || !appUrl) {
  throw new Error("Stripe and application URL configuration are required.");
}

const stripe = new Stripe(secretKey);
const url = `${appUrl.replace(/\/$/, "")}/api/webhooks/stripe`;
const existing = await stripe.webhookEndpoints.list({ limit: 100 });
const matches = existing.data.filter((endpoint) => endpoint.url === url);
if (matches.length && !process.argv.includes("--replace")) {
  throw new Error("A Stripe webhook already exists for this URL.");
}
for (const endpoint of matches) {
  await stripe.webhookEndpoints.del(endpoint.id);
}

const endpoint = await stripe.webhookEndpoints.create({
  url,
  description: "Continuity Vault subscription synchronization",
  enabled_events: [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_failed",
  ],
});

if (!endpoint.secret)
  throw new Error("Stripe did not return a signing secret.");
process.stdout.write(endpoint.secret);
