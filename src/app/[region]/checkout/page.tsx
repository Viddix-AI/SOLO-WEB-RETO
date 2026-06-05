import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { bookChargeAmount } from "@/lib/checkout";
import {
  isCheckoutEnabled,
  getRegionCredentials,
  getClient,
  checkoutScriptSrc,
  checkoutLanguage,
  ledgerCurrency,
  amazonPaySandbox,
} from "@/lib/amazon-pay";
import { translate, type TranslationKey } from "@/lib/i18n";
import { OrderSummary } from "@/components/shop/order-summary";
import { AmazonPayButton } from "@/components/shop/amazon-pay-button";
import { CheckoutComingSoon } from "@/components/shop/checkout-coming-soon";
import { Eyebrow } from "@/components/eyebrow";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "Checkout" };

function originFrom(host: string, proto: string | null): string {
  const scheme = proto ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${scheme}://${host}`;
}

/**
 * Book checkout via Amazon Pay (book is the only direct purchase). Enabled per
 * region: LATAM and any region without credentials fall back to "Coming soon".
 * The amount is computed server-side; the buyer pays with their Amazon account.
 */
export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams: Promise<{ qty?: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();

  if (!isCheckoutEnabled(region.id)) {
    return <CheckoutComingSoon region={region} />;
  }

  const { qty } = await searchParams;
  const charge = bookChargeAmount(region, Number(qty) || 1);
  const creds = getRegionCredentials(region.id)!;
  const client = getClient(region.id)!;
  const t = (k: TranslationKey) => translate(region.lang, k);

  const h = await headers();
  const origin = originFrom(h.get("host") ?? "", h.get("x-forwarded-proto"));

  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: `${origin}/${slug}/checkout/review?qty=${charge.qty}`,
      checkoutResultReturnUrl: `${origin}/${slug}/checkout/confirmation?qty=${charge.qty}`,
    },
    storeId: creds.storeId,
  };
  const signature = client.generateButtonSignature(payload);

  const buttonConfig = {
    merchantId: creds.merchantId,
    publicKeyId: creds.publicKeyId,
    ledgerCurrency: ledgerCurrency(region),
    checkoutLanguage: checkoutLanguage(region),
    sandbox: amazonPaySandbox,
    scriptSrc: checkoutScriptSrc(region.id),
    payloadJSON: JSON.stringify(payload),
    signature,
  };

  return (
    <section className="mx-auto max-w-[1100px] px-[18px] lg:px-10">
      <div className="pb-6 pt-8 lg:pb-9 lg:pt-[52px]">
        <Eyebrow>{t("co.k")}</Eyebrow>
        <h1 className="display mt-3.5 text-[40px] lg:text-[64px]">{t("co.h")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-9 pb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:pb-[100px]">
        <div className="flex flex-col gap-6">
          <p className="lede max-w-[460px] text-[16px]">{t("co.amazon")}</p>
          <AmazonPayButton config={buttonConfig} />
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
