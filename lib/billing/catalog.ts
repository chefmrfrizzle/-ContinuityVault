export const billingTiers = ["personal", "household", "founder"] as const;
export const billingIntervals = ["annual", "monthly"] as const;

export type BillingTier = (typeof billingTiers)[number];
export type BillingInterval = (typeof billingIntervals)[number];

export const entitlements = {
  personal: {
    maxPlans: 1,
    maxRecipientsPerPlan: 3,
    rehearsalFrequency: "quarterly",
    organizationRoles: false,
    priorityExceptionHandling: false,
  },
  household: {
    maxPlans: 5,
    maxRecipientsPerPlan: 10,
    rehearsalFrequency: "quarterly",
    organizationRoles: false,
    priorityExceptionHandling: false,
  },
  founder: {
    maxPlans: 20,
    maxRecipientsPerPlan: 25,
    rehearsalFrequency: "monthly",
    organizationRoles: true,
    priorityExceptionHandling: true,
  },
} as const satisfies Record<
  BillingTier,
  {
    maxPlans: number;
    maxRecipientsPerPlan: number;
    rehearsalFrequency: "quarterly" | "monthly";
    organizationRoles: boolean;
    priorityExceptionHandling: boolean;
  }
>;

export function getPriceId(tier: BillingTier, interval: BillingInterval) {
  const key = `STRIPE_PRICE_${tier.toUpperCase()}_${
    interval === "annual" ? "ANNUAL" : "MONTHLY"
  }`;
  return process.env[key];
}

export function tierForPrice(priceId: string) {
  return billingTiers.find((tier) =>
    billingIntervals.some((interval) => getPriceId(tier, interval) === priceId),
  );
}
