import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { bookChargeAmount } from "@/lib/checkout";
import { getClient, isCheckoutEnabled } from "@/lib/amazon-pay";
import { saveConfirmedOrder } from "@/lib/orders";
import { ConfirmationScreen, type OrderView } from "@/components/shop/confirmation-screen";

export const metadata: Metadata = { title: "Order confirmed" };

function buildOrderView(base: string, lang: "en" | "es"): OrderView {
  const orderNumber = "RH-" + base.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
  const now = Date.now();
  const from = new Date(now + 3 * 86_400_000);
  const to = new Date(now + 7 * 86_400_000);
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "short" });
  return { orderNumber, eta: `${fmt.format(from)} – ${fmt.format(to)} ${to.getFullYear()}` };
}

/**
 * Amazon Pay checkoutResultReturnUrl. Completes the Checkout Session (capturing
 * the charge), then shows the confirmation from the completed session. Falls
 * back to reading the session if it was already completed.
 */
export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams: Promise<{ amazonCheckoutSessionId?: string; qty?: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();

  const sp = await searchParams;
  const sessionId = typeof sp.amazonCheckoutSessionId === "string" ? sp.amazonCheckoutSessionId : "";
  const charge = bookChargeAmount(region, Number(sp.qty) || 1);

  let order: OrderView | null = null;
  if (sessionId && isCheckoutEnabled(region.id)) {
    const client = getClient(region.id)!;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        const res = await client.completeCheckoutSession(sessionId, {
          chargeAmount: { amount: charge.amount, currencyCode: charge.currencyCode },
        });
        data = res.data;
      } catch {
        // Already completed or transient — read the current session state.
        const res = await client.getCheckoutSession(sessionId);
        data = res.data;
      }

      if (data?.statusDetails?.state === "Completed") {
        const chargeId: string | null = data?.chargeId ?? null;
        order = buildOrderView(chargeId ?? sessionId, region.lang);
        saveConfirmedOrder({
          checkoutSessionId: sessionId,
          chargeId,
          buyerEmail: data?.buyer?.email ?? null,
          amount: charge.amount,
          currency: charge.currencyCode,
          region: region.id,
          status: "confirmed",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("[RETO] confirmation complete error:", err instanceof Error ? err.message : err);
    }
  }

  return <ConfirmationScreen region={region} order={order} />;
}
