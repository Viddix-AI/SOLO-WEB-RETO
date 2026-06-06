import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, productCopy } from "@/lib/products";
import { Breadcrumb } from "./breadcrumb";
import { BookBuyPanel } from "./book-buy-panel";
import { Badge } from "@/components/badge";
import { Eyebrow } from "@/components/eyebrow";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";

/**
 * Book product page. Ported from 04-chamber-book-screens.jsx (`BookScreen`).
 * Direct purchase → "Comprar ahora" (BookBuyPanel → checkout stub).
 */
export function BookScreen({ region }: { region: Region }) {
  const { lang } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct("book")!;
  const c = productCopy(product, lang);

  return (
    <section className="mx-auto max-w-[1100px] px-[18px] lg:px-10">
      <div className="pt-7 lg:pt-11">
        <Breadcrumb region={region} name={c.name} />
      </div>

      <div className="mt-[22px] grid grid-cols-1 items-center gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-16">
        {/* cover */}
        <div className="relative">
          <div className="mx-auto max-w-[280px] rounded-[6px] shadow-pop lg:mx-0 lg:max-w-[380px]">
            <ProductImage label="PORTADA — Péptidos" src="/book.jpg" ratio="3 / 4.2" radius={6} />
          </div>
        </div>

        {/* buy */}
        <div>
          <div className="mono mono-sm text-ink-4">
            {c.tagline} · {c.cat}
          </div>
          <h1 className="h1 mt-3.5 text-[38px] lg:text-[54px]">{c.name}</h1>
          <p className="lede mt-4 max-w-[440px]">{c.short}</p>
          <div className="mt-[22px] flex flex-wrap gap-2.5">
            <Badge>{t("bk.format")}</Badge>
            <Badge dot>{t("bk.ship")}</Badge>
          </div>
          <BookBuyPanel region={region} />
        </div>
      </div>

      {/* inside the book */}
      <div className="pb-14 pt-14 lg:pb-[100px] lg:pt-[100px]">
        <Reveal>
          <Eyebrow>{t("bk.about.h")}</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h2 mt-[18px] max-w-[620px]">{t("bk.about.b")}</h2>
        </Reveal>
        {/* TODO: índice real del libro pendiente — los capítulos del prototipo se
            quitaron por no corresponder al libro real (Péptidos). NO copiar el
            índice de Amazon (copyright); pegar el oficial cuando esté disponible. */}
      </div>
    </section>
  );
}
