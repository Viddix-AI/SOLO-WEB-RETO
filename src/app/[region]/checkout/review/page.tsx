import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { bookChargeAmount } from "@/lib/checkout";
import { getClient, isCheckoutEnabled } from "@/lib/amazon-pay";
import { translate, type TranslationKey } from "@/lib/i18n";
import { OrderSummary } from "@/components/shop/order-summary";
import { CheckoutComingSoon } from "@/components/shop/checkout-coming-soon";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "Review order" };

interface AmazonAddress {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrRegion?: string;
  postalCode?: string;
  countryCode?: string;
}

function originFrom(host: string, proto: string | null): string {
  const scheme = proto ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${scheme}://${host}`;
}

/**
 * Amazon Pay checkoutReviewReturnUrl. Reads the buyer + shipping address chosen
 * inside Amazon, shows a review, and on confirm updates the Checkout Session
 * with the server-authoritative amount, then redirects to Amazon's final
 * confirmation (amazonPayRedirectUrl).
 */
export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams: Promise<{ amazonCheckoutSessionId?: string; qty?: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  if (!isCheckoutEnabled(region.id)) return <CheckoutComingSoon region={region} />;

  const sp = await searchParams;
  const sessionId = typeof sp.amazonCheckoutSessionId === "string" ? sp.amazonCheckoutSessionId : "";
  if (!sessionId) notFound();
  const charge = bookChargeAmount(region, Number(sp.qty) || 1);
  const t = (k: TranslationKey) => translate(region.lang, k);

  const client = getClient(region.id)!;
  let buyerName = "";
  let address: AmazonAddress | null = null;
  try {
    const res = await client.getCheckoutSession(sessionId);
    buyerName = res.data?.buyer?.name ?? "";
    address = (res.data?.shippingAddress as AmazonAddress) ?? null;
  } catch (err) {
    console.error("[RETO] review getCheckoutSession error:", err instanceof Error ? err.message : err);
  }

  const h = await headers();
  const origin = originFrom(h.get("host") ?? "", h.get("x-forwarded-proto"));

  async function confirmAndPay() {
    "use server";
    const c = getClient(region!.id);
    if (!c) return;
    const update = await c.updateCheckoutSession(sessionId, {
      webCheckoutDetails: {
        checkoutResultReturnUrl: `${origin}/${slug}/checkout/confirmation?qty=${charge.qty}`,
      },
      paymentDetails: {
        paymentIntent: "AuthorizeWithCapture",
        canHandlePendingAuthorization: false,
        chargeAmount: { amount: charge.amount, currencyCode: charge.currencyCode },
      },
      merchantMetadata: {
        merchantReferenceId: sessionId.replace(/[^A-Za-z0-9]/g, "").slice(0, 20),
        merchantStoreName: "RETO",
        noteToBuyer: "The RETO Method",
      },
    });
    const redirectUrl = update.data?.webCheckoutDetails?.amazonPayRedirectUrl as string | undefined;
    if (redirectUrl) redirect(redirectUrl);
  }

  return (
    <section className="mx-auto max-w-[1100px] px-[18px] lg:px-10">
      <div className="pb-6 pt-8 lg:pb-9 lg:pt-[52px]">
        <Eyebrow>{t("co.k")}</Eyebrow>
        <h1 className="display mt-3.5 text-[40px] lg:text-[64px]">{t("co.h")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-9 pb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:pb-[100px]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="mono mono-sm text-ink-4">01</span>
              <span className="h3 text-[18px]">{t("co.shipping")}</span>
            </div>
            <div className="card bg-surface-1 p-5">
              {address ? (
                <div className="text-[14.5px] leading-[1.7] tracking-[-0.01em] text-ink-2">
                  {buyerName && <div className="text-ink">{buyerName}</div>}
                  {address.name && address.name !== buyerName && <div className="text-ink">{address.name}</div>}
                  <div>{[address.addressLine1, address.addressLine2].filter(Boolean).join(", ")}</div>
                  <div>{[address.city, address.stateOrRegion, address.postalCode].filter(Boolean).join(", ")}</div>
                  <div>{address.countryCode}</div>
                </div>
              ) : (
                <p className="muted m-0 text-[14px]">
                  {region.lang === "es" ? "Cargando datos de Amazon…" : "Loading details from Amazon…"}
                </p>
              )}
            </div>
          </div>

          <form action={confirmAndPay}>
            <Button type="submit" block size="lg">
              {t("co.pay")} {Icons.arrow}
            </Button>
          </form>
          <div className="mono mono-sm flex items-center gap-2 text-ink-3">
            <span className="inline-flex text-ink-2">{Icons.lock}</span>
            {t("co.secure.note")}
          </div>
        </div>

        <OrderSummary region={region} qty={charge.qty} unit={charge.unit} currency={charge.currencyCode} />
      </div>
    </section>
  );
}
