import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Stripe webhook. The raw request body + the `stripe-signature` header are
 * verified against STRIPE_WEBHOOK_SECRET before any event is trusted. On
 * payment_intent.succeeded we mark the order paid, keeping only the
 * payment_method id (a token — never the card number).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Missing webhook signature/secret" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("[RETO] Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const paymentMethodId =
      typeof pi.payment_method === "string" ? pi.payment_method : pi.payment_method?.id ?? null;
    markOrderPaid(pi.id, paymentMethodId, {
      buyerEmail: pi.receipt_email ?? null,
      amount: (pi.amount_received / 100).toFixed(2),
      currency: pi.currency.toUpperCase(),
      region: typeof pi.metadata?.region === "string" ? pi.metadata.region : "",
    });
  }

  return NextResponse.json({ received: true });
}
