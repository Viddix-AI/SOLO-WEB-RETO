import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { bookChargeAmount, toMinorUnits } from "@/lib/checkout";
import { translate, type TranslationKey } from "@/lib/i18n";
import { OrderSummary } from "@/components/shop/order-summary";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Eyebrow } from "@/components/eyebrow";

export const metadata: Metadata = { title: "Checkout" };

/**
 * Book checkout via Stripe (TEST mode). The book is the only direct purchase and
 * checkout is enabled in all three regions (US/LATAM in USD, EU in EUR). The
 * amount is computed SERVER-SIDE from the price book; the client only displays
 * it and never sets the price. The buyer fills their details, then pays with the
 * Stripe Payment Element.
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

  const { qty } = await searchParams;
  const charge = bookChargeAmount(region, Number(qty) || 1);
  const t = (k: TranslationKey) => translate(region.lang, k);

  return (
    <section className="mx-auto max-w-[1100px] px-[18px] lg:px-10">
      <div className="pb-6 pt-8 lg:pb-9 lg:pt-[52px]">
        <Eyebrow>{t("co.k")}</Eyebrow>
        <h1 className="display mt-3.5 text-[40px] lg:text-[64px]">{t("co.h")}</h1>
        <p className="lede mt-3.5 max-w-[460px] text-[16px]">{t("co.pay.intro")}</p>
      </div>

      <div className="grid grid-cols-1 gap-9 pb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:pb-[100px]">
        <CheckoutForm
          region={region}
          qty={charge.qty}
          amountMinor={toMinorUnits(charge.amount)}
          currency={charge.currencyCode.toLowerCase()}
        />
        <OrderSummary region={region} qty={charge.qty} unit={charge.unit} currency={charge.currencyCode} />
      </div>
    </section>
  );
}
