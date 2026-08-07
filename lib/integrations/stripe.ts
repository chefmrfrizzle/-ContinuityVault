import Stripe from "stripe";
import { IntegrationUnavailableError } from "@/db";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new IntegrationUnavailableError("Stripe");
  return new Stripe(key);
}
