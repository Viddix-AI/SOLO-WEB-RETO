/**
 * Mock order store (Bloque G1 · Stripe, TEST mode). We persist ONLY Stripe
 * identifiers + buyer email — never card data. Stripe tokenizes the card inside
 * the Payment Element; the only payment references we keep are:
 *   - customerId       (Stripe Customer id)
 *   - paymentIntentId  (Stripe PaymentIntent id)
 *   - paymentMethodId  (Stripe PaymentMethod id — a token, not a card number)
 * In-memory for now; real DB persistence lands in a later block (Supabase, parked).
 */
export interface Order {
  paymentIntentId: string;
  customerId: string | null;
  paymentMethodId: string | null;
  buyerEmail: string | null;
  amount: string; // "29.99"
  currency: string; // "USD" | "EUR"
  region: string;
  qty: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

const orders = new Map<string, Order>();

/** Record a pending order when its PaymentIntent is created. */
export function savePendingOrder(order: Order): void {
  orders.set(order.paymentIntentId, order);
  console.log("[RETO] Pedido pendiente (mock · Stripe):", {
    paymentIntentId: order.paymentIntentId,
    customerId: order.customerId,
    amount: order.amount,
    currency: order.currency,
    region: order.region,
  });
}

export function getOrder(paymentIntentId: string): Order | undefined {
  return orders.get(paymentIntentId);
}

/**
 * Mark an order paid — called from the verified Stripe webhook on
 * payment_intent.succeeded (and, as a fallback, from the confirmation page).
 * Idempotent: a second call just refreshes the payment_method id.
 */
export function markOrderPaid(
  paymentIntentId: string,
  paymentMethodId: string | null,
  details?: { buyerEmail?: string | null; amount?: string; currency?: string; region?: string },
): void {
  const existing = orders.get(paymentIntentId);
  if (existing) {
    existing.status = "paid";
    existing.paidAt = existing.paidAt ?? new Date().toISOString();
    if (paymentMethodId) existing.paymentMethodId = paymentMethodId;
  } else {
    orders.set(paymentIntentId, {
      paymentIntentId,
      customerId: null,
      paymentMethodId,
      buyerEmail: details?.buyerEmail ?? null,
      amount: details?.amount ?? "",
      currency: details?.currency ?? "",
      region: details?.region ?? "",
      qty: 1,
      status: "paid",
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });
  }
  console.log(`[RETO] Pago confirmado (mock · Stripe) — ${paymentIntentId} · pm ${paymentMethodId ?? "—"}`);
}
