import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured.");

const stripe = new Stripe(secretKey);
const catalog = [
  {
    tier: "personal",
    name: "Continuity Vault Personal",
    annual: 14900,
    monthly: 1500,
  },
  {
    tier: "household",
    name: "Continuity Vault Household",
    annual: 29900,
    monthly: 3000,
  },
  {
    tier: "founder",
    name: "Continuity Vault Founder",
    annual: 120000,
    monthly: 12000,
  },
];

const products = await stripe.products.list({ active: true, limit: 100 });
const output = {};

for (const item of catalog) {
  let product = products.data.find(
    (candidate) => candidate.metadata.continuity_vault_tier === item.tier,
  );
  product ??= await stripe.products.create({
    name: item.name,
    metadata: { continuity_vault_tier: item.tier },
  });

  const existingPrices = await stripe.prices.list({
    product: product.id,
    active: true,
    type: "recurring",
    limit: 100,
  });

  for (const [interval, amount] of [
    ["year", item.annual],
    ["month", item.monthly],
  ]) {
    let price = existingPrices.data.find(
      (candidate) =>
        candidate.currency === "cad" &&
        candidate.unit_amount === amount &&
        candidate.recurring?.interval === interval,
    );
    price ??= await stripe.prices.create({
      product: product.id,
      currency: "cad",
      unit_amount: amount,
      recurring: { interval },
      metadata: {
        continuity_vault_tier: item.tier,
        continuity_vault_interval: interval,
      },
    });

    output[
      `STRIPE_PRICE_${item.tier.toUpperCase()}_${
        interval === "year" ? "ANNUAL" : "MONTHLY"
      }`
    ] = price.id;
  }
}

console.log(JSON.stringify(output));
