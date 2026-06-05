import type { Region } from "@/lib/regions";
import { priceFor } from "@/lib/products";

/** Only the book is a direct purchase (chamber is request-only). */
export const MAX_QTY = 10;

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

export interface BookCharge {
  /** Amazon Pay amount, decimal string e.g. "59.98". */
  amount: string;
  currencyCode: "USD" | "EUR";
  /** Unit price (29.99) for the order summary. */
  unit: number;
  qty: number;
}

/**
 * Server-authoritative charge for a book order. The client never decides the
 * price — it always comes from the region price book via priceFor.
 */
export function bookChargeAmount(region: Region, qty: number): BookCharge {
  const unit = priceFor("book", region.id).value ?? 0;
  const q = clampQty(qty);
  return {
    amount: (unit * q).toFixed(2),
    currencyCode: region.currency,
    unit,
    qty: q,
  };
}
