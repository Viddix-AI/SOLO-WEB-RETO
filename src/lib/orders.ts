/**
 * Mock order store (Bloque D · Amazon Pay). We keep only Amazon Pay identifiers
 * (checkout session id, charge id) + buyer email — never card data (Amazon Pay
 * never exposes card numbers anyway). In-memory for now; real DB persistence
 * lands in a later block (Supabase, currently parked).
 */
export interface ConfirmedOrder {
  checkoutSessionId: string;
  chargeId: string | null;
  buyerEmail: string | null;
  amount: string; // "29.99"
  currency: string;
  region: string;
  status: "confirmed";
  createdAt: string;
}

const orders = new Map<string, ConfirmedOrder>();

export function saveConfirmedOrder(order: ConfirmedOrder): void {
  orders.set(order.checkoutSessionId, order);
  console.log("[RETO] Pago confirmado (mock · Amazon Pay):", {
    checkoutSessionId: order.checkoutSessionId,
    chargeId: order.chargeId,
    amount: order.amount,
    currency: order.currency,
    region: order.region,
  });
}

export function getConfirmedOrder(checkoutSessionId: string): ConfirmedOrder | undefined {
  return orders.get(checkoutSessionId);
}

/** Mark a payment confirmed from a (verified) Amazon Pay IPN. Mock: logs only. */
export function markConfirmedByIpn(objectType: string, objectId: string): void {
  console.log(`[RETO] Amazon Pay IPN verificada — ${objectType} ${objectId} confirmado (mock).`);
}
