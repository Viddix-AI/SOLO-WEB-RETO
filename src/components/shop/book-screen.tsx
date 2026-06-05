import type { Region } from "@/lib/regions";
import type { Lang } from "@/lib/i18n/dictionary";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, productCopy } from "@/lib/products";
import { Breadcrumb } from "./breadcrumb";
import { BookBuyPanel } from "./book-buy-panel";
import { Badge } from "@/components/badge";
import { Eyebrow } from "@/components/eyebrow";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";

const CHAPTERS: Record<Lang, string[]> = {
  en: [
    "Baseline & diagnostics",
    "Recovery under pressure",
    "Sleep & nervous system",
    "Strength & longevity",
    "Clarity & focus",
    "The 90-day protocol",
  ],
  es: [
    "Línea base & diagnóstico",
    "Recuperación bajo presión",
    "Sueño & sistema nervioso",
    "Fuerza & longevidad",
    "Claridad & enfoque",
    "El protocolo de 90 días",
  ],
};

/**
 * Book product page. Ported from 04-chamber-book-screens.jsx (`BookScreen`).
 * Direct purchase → "Comprar ahora" (BookBuyPanel → checkout stub).
 */
export function BookScreen({ region, checkoutEnabled }: { region: Region; checkoutEnabled: boolean }) {
  const { lang } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct("book")!;
  const c = productCopy(product, lang);
  const chapters = CHAPTERS[lang];

  return (
    <section className="mx-auto max-w-[1100px] px-[18px] lg:px-10">
      <div className="pt-7 lg:pt-11">
        <Breadcrumb region={region} name={c.name} />
      </div>

      <div className="mt-[22px] grid grid-cols-1 items-center gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-16">
        {/* cover */}
        <div className="relative">
          <div className="mx-auto max-w-[280px] rounded-[6px] shadow-pop lg:mx-0 lg:max-w-[380px]">
            <ProductImage label="PORTADA — El Método RETO" ratio="3 / 4.2" radius={6} />
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
          <BookBuyPanel region={region} checkoutEnabled={checkoutEnabled} />
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
        <Reveal delay={120}>
          <div className="mt-9 grid grid-cols-1 overflow-hidden rounded-lg border border-line-soft lg:grid-cols-2">
            {chapters.map((ch, i) => (
              <div
                key={i}
                className={[
                  "flex items-center gap-4 bg-surface-1 px-5 py-[18px] lg:px-[26px] lg:py-[22px]",
                  chapterBorder(i),
                ].join(" ")}
              >
                <span className="mono mono-sm text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[16px] tracking-[-0.01em]">{ch}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Mirror the prototype's responsive cell borders: on mobile every row after the
// first gets a top border; on desktop (2 cols) rows 2-3 get a top border and the
// right column gets a left border.
function chapterBorder(i: number): string {
  const top =
    i === 0
      ? ""
      : i === 1
        ? "border-t border-line-soft lg:border-t-0"
        : "border-t border-line-soft";
  const left = i % 2 === 1 ? "lg:border-l lg:border-line-soft" : "";
  return [top, left].filter(Boolean).join(" ");
}
