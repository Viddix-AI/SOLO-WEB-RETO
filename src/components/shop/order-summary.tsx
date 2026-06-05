import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, productCopy } from "@/lib/products";
import { Eyebrow } from "@/components/eyebrow";
import { ProductImage } from "@/components/product-image";

export function fmtMoney(value: number, currency: "USD" | "EUR"): string {
  return currency === "EUR"
    ? "€" + value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Order summary for the book checkout. Ported from 05 (OrderSummary). */
export function OrderSummary({
  region,
  qty,
  unit,
  currency,
}: {
  region: Region;
  qty: number;
  unit: number;
  currency: "USD" | "EUR";
}) {
  const { lang } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const book = getProduct("book")!;
  const name = productCopy(book, lang).name;
  const subtotal = unit * qty;

  return (
    <div className="card bg-surface-1 p-5 lg:p-[26px]">
      <Eyebrow className="mb-[18px]">{t("co.summary")}</Eyebrow>
      <div className="flex items-center gap-3.5">
        <div className="w-14 shrink-0">
          <ProductImage label={name.split(" ")[0]} ratio="1 / 1" radius={8} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] tracking-[-0.01em]">{name}</div>
          <div className="mono mono-sm mt-1 text-ink-4">
            {lang === "es" ? "Cant." : "Qty"} {qty}
          </div>
        </div>
        <div className="whitespace-nowrap font-mono text-[13px] text-ink">{fmtMoney(subtotal, currency)}</div>
      </div>

      <div className="hairline my-5" />
      <Row label={t("co.subtotal")} value={fmtMoney(subtotal, currency)} />
      <Row label={t("co.shipfee")} value={t("co.free")} positive />
      <Row label={t("co.tax")} value={fmtMoney(0, currency)} muted />
      <div className="hairline my-4" />
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] tracking-[-0.01em]">{t("co.total")}</span>
        <span className="font-mono text-[20px] tracking-[-0.01em] text-ink">{fmtMoney(subtotal, currency)}</span>
      </div>
      <p className="muted mb-0 mt-4 text-[11.5px] leading-[1.6]">{t("co.duties")}</p>
    </div>
  );
}

function Row({ label, value, muted, positive }: { label: string; value: string; muted?: boolean; positive?: boolean }) {
  return (
    <div className="flex justify-between py-[5px]">
      <span className="mono mono-sm text-ink-3">{label}</span>
      <span className={["font-mono text-[12.5px]", positive ? "text-positive" : muted ? "text-ink-4" : "text-ink-2"].join(" ")}>
        {value}
      </span>
    </div>
  );
}
