import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import {
  getProduct,
  productCopy,
  CHAMBER_SPECS,
  UNIT_SPECS,
  CHAMBER_HIGHLIGHTS,
  CHAMBER_FEATURES,
  chamberSpec,
  chamberCard,
  type ChamberSpec,
  type ChamberCard,
} from "@/lib/products";
import { Breadcrumb } from "./breadcrumb";
import { PriceBlock } from "./price-tags";
import { ChamberGallery } from "./chamber-gallery";
import { Badge } from "@/components/badge";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { EKGLine } from "@/components/ekg-line";
import { TrustRow } from "@/components/trust-row";
import { Reveal } from "@/components/reveal";
import { Icons } from "@/components/icons";

/** A responsive grid of numbered title/body cards (highlights, features). */
function CardGrid({ cards, lang }: { cards: ChamberCard[]; lang: Region["lang"] }) {
  return (
    <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const { h, b } = chamberCard(card, lang);
        return (
          <Reveal key={i} delay={(i % 3) * 70}>
            <div className="border-t border-line pt-5">
              <div className="mono mono-sm text-ink-4">{String(i + 1).padStart(2, "0")}</div>
              <div className="h3 mt-3">{h}</div>
              <p className="muted mt-2.5 text-[14.5px] leading-[1.6]">{b}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** A spec card: bilingual [label, value] rows in a raised panel. */
function SpecCard({ specs, lang }: { specs: ChamberSpec[]; lang: Region["lang"] }) {
  return (
    <div className="card overflow-hidden bg-surface-1">
      {specs.map((s, i) => {
        const [k, v] = chamberSpec(s, lang);
        return (
          <div
            key={i}
            className={[
              "grid grid-cols-2 items-start gap-4 px-[18px] py-4 lg:grid-cols-[1fr_1.4fr] lg:px-[26px] lg:py-[18px]",
              i ? "border-t border-line-soft" : "",
            ].join(" ")}
          >
            <span className="mono mono-sm text-ink-3">{k}</span>
            <span className="text-[15px] leading-[1.5] tracking-[-0.01em] text-ink">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Chamber product page (high-ticket). Ported from 04-chamber-book-screens.jsx
 * (`ChamberScreen`). CTA is request-only — NOT a direct purchase.
 * Copy: real Oxify × RETO product data (highlights, two spec groups, features).
 */
export function ChamberScreen({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct("chamber")!;
  const c = productCopy(product, lang);

  return (
    <section className="mx-auto max-w-[1240px] px-[18px] lg:px-10">
      <div className="pt-7 lg:pt-11">
        <Breadcrumb region={region} name={c.name} />
      </div>

      {/* gallery + buy panel */}
      <div className="mt-[22px] grid grid-cols-1 gap-7 lg:mt-[34px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <ChamberGallery />

        <div>
          <Badge irid>{c.tagline}</Badge>
          <h1 className="h1 mt-[18px] text-[38px] lg:text-[56px]">{c.name}</h1>
          <p className="lede mt-4 max-w-[460px]">{c.short}</p>
          <div className="mb-1.5 mt-[26px]">
            <EKGLine height={20} />
          </div>

          <div className="card mt-[22px] bg-surface-1 p-5 lg:p-[26px]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <PriceBlock pid="chamber" region={region} large />
              <Badge>{t("p.finance")}</Badge>
            </div>
            <p className="mono mono-sm mt-4 leading-[1.7] tracking-[0.08em] text-ink-3">{t("p.included")}</p>
            <div className="mt-5">
              <Button href={`/${slug}/shop/chamber/request`} block size="lg">
                {t("p.request")} {Icons.arrow}
              </Button>
            </div>
            <p className="muted mb-0 mt-4 text-[12.5px] leading-[1.6]">{t("ch.cta.note")}</p>
          </div>

          <div className="mt-[18px]">
            <TrustRow
              items={[
                { icon: Icons.ship, label: t("p.trust.ship") },
                { icon: Icons.shield, label: t("p.trust.warranty") },
                { icon: Icons.install, label: t("p.trust.install") },
                { icon: Icons.concierge, label: t("p.trust.support") },
              ]}
            />
          </div>
        </div>
      </div>

      {/* highlights */}
      <div className="pt-16 lg:pt-[110px]">
        <Reveal>
          <Eyebrow>{t("p.highlights")}</Eyebrow>
        </Reveal>
        <CardGrid cards={CHAMBER_HIGHLIGHTS} lang={lang} />
      </div>

      {/* features */}
      <div className="pt-16 lg:pt-[110px]">
        <Reveal>
          <Eyebrow>{t("p.features")}</Eyebrow>
        </Reveal>
        <CardGrid cards={CHAMBER_FEATURES} lang={lang} />
      </div>

      {/* specs — chamber + all-in-one unit */}
      <div className="pb-14 pt-16 lg:pb-[110px] lg:pt-[110px]">
        <Reveal>
          <Eyebrow>{t("p.specs")}</Eyebrow>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <Reveal delay={60}>
            <div className="mono mono-sm mb-3 text-ink-4">{t("p.specs.chamber")}</div>
            <SpecCard specs={CHAMBER_SPECS} lang={lang} />
          </Reveal>
          <Reveal delay={120}>
            <div className="mono mono-sm mb-3 text-ink-4">{t("p.specs.unit")}</div>
            <SpecCard specs={UNIT_SPECS} lang={lang} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
