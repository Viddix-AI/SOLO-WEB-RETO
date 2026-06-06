import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/orders";
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
 * Stripe return_url. After confirmPayment, Stripe redirects here with the
 * payment_intent id. We retrieve it server-side to read the authoritative status
 * + amount, mark the order paid (the webhook is the source of truth, this is a
 * fallback for local/dev), and show the confirmation.
 */
export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();

  const sp = await searchParams;
  const paymentIntentId = typeof sp.payment_intent === "string" ? sp.payment_intent : "";

  let order: OrderView | null = null;
  if (paymentIntentId && isStripeConfigured()) {
    try {
      const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
      if (pi.status === "succeeded") {
        const paymentMethodId =
          typeof pi.payment_method === "string" ? pi.payment_method : pi.payment_method?.id ?? null;
        markOrderPaid(pi.id, paymentMethodId, {
          buyerEmail: pi.receipt_email ?? null,
          amount: (pi.amount_received / 100).toFixed(2),
          currency: pi.currency.toUpperCase(),
          region: region.id,
        });
        order = buildOrderView(pi.id, region.lang);
      }
    } catch (err) {
      console.error("[RETO] confirmation retrieve error:", err instanceof Error ? err.message : err);
    }
  }

  return <ConfirmationScreen region={region} order={order} />;
}
