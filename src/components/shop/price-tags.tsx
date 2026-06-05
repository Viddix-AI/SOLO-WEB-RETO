import type { Region } from "@/lib/regions";
import { translate } from "@/lib/i18n";
import { priceFor, type ProductId } from "@/lib/products";

/** Inline price for shop cards. Ported from 03-shop-screen.jsx (`Price`). */
export function Price({
  pid,
  region,
  large,
}: {
  pid: ProductId;
  region: Region;
  large?: boolean;
}) {
  const p = priceFor(pid, region.id);
  if (p.onRequest) {
    return (
      <span className={["mono text-ink-2", large ? "text-[13px]" : "text-[11.5px]"].join(" ")}>
        {translate(region.lang, "p.onrequest")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={["font-mono tracking-[0.01em] text-ink", large ? "text-[17px]" : "text-[14px]"].join(" ")}>
        {p.display}
      </span>
      <span className="mono mono-sm text-ink-4">{p.note}</span>
    </span>
  );
}

/** Larger price block for product pages. Ported from 04-chamber-book-screens.jsx (`PriceBlock`). */
export function PriceBlock({
  pid,
  region,
  large,
}: {
  pid: ProductId;
  region: Region;
  large?: boolean;
}) {
  const p = priceFor(pid, region.id);
  if (p.onRequest) {
    return (
      <div className="flex flex-col gap-1">
        <span className="mono text-[11px] text-ink-3">{translate(region.lang, "p.onrequest")}</span>
        <span className={["font-mono tracking-[-0.01em] text-ink", large ? "text-[28px]" : "text-[20px]"].join(" ")}>
          —
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-2.5">
      <span className={["font-mono tracking-[-0.01em] text-ink", large ? "text-[32px]" : "text-[22px]"].join(" ")}>
        {p.display}
      </span>
      <span className="mono mono-sm text-ink-4">{p.note}</span>
    </div>
  );
}
