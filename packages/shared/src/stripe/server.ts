import Stripe from "stripe";

import { getStripeSecretKey } from "../stripe/config.js";

let stripeClient: Stripe | null = null;

export function getStripeServerClient(): Stripe {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}
