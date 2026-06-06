import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client (TEST mode). NEVER import this from a client
 * component — it reads the secret key. The publishable key
 * (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) is the only Stripe value that may reach
 * the browser. We never touch or store card numbers: Stripe tokenizes the card
 * inside the Payment Element and we only ever keep the customer / payment_intent
 * / payment_method ids.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client = new Stripe(key, { appInfo: { name: "RETO portal" } });
  return client;
}

/** True when both Stripe keys are present (server + publishable). */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}
