import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, productCopy, CHAMBER_SPECS, chamberSpec } from "@/lib/products";
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

/**
 * Chamber product page (high-ticket). Ported from 04-chamber-book-screens.jsx
 * (`ChamberScreen`). CTA is request-only — NOT a direct purchase.
 */
export function ChamberScreen({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct("chamber")!;
  const c = productCopy(product, lang);
  const benefits: [string, string][] = [
    [t("ch.benefit1.h"), t("ch.benefit1.b")],
    [t("ch.benefit2.h"), t("ch.benefit2.b")],
    [t("ch.benefit3.h"), t("ch.benefit3.b")],
  ];

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

      {/* benefits */}
      <div className="pt-16 lg:pt-[110px]">
        <Reveal>
          <Eyebrow>{t("p.benefits")}</Eyebrow>
        </Reveal>
        <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:gap-10">
          {benefits.map(([h, b], i) => (
            <Reveal key={i} delay={i * 70} className="flex-1">
              <div className="border-t border-line pt-5">
                <div className="mono mono-sm text-ink-4">{String(i + 1).padStart(2, "0")}</div>
                <div className="h3 mt-3">{h}</div>
                <p className="muted mt-2.5 text-[14.5px] leading-[1.6]">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* specs */}
      <div className="pb-14 pt-14 lg:pb-[110px] lg:pt-24">
        <Reveal>
          <Eyebrow>{t("p.specs")}</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <div className="card mt-6 overflow-hidden bg-surface-1">
            {CHAMBER_SPECS.map((s, i) => {
              const [k, v] = chamberSpec(s, lang);
              return (
                <div
                  key={i}
                  className={[
                    "grid grid-cols-2 items-center gap-4 px-[18px] py-4 lg:grid-cols-[1fr_1.4fr] lg:px-[26px] lg:py-[18px]",
                    i ? "border-t border-line-soft" : "",
                  ].join(" ")}
                >
                  <span className="mono mono-sm text-ink-3">{k}</span>
                  <span className="text-[15px] tracking-[-0.01em] text-ink">{v}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
