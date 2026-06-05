import Link from "next/link";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, priceFor, productCopy, type ProductId } from "@/lib/products";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { EKGLine } from "@/components/ekg-line";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";
import { Icons } from "@/components/icons";

const HERO_MASK = "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 78%)";
const CLINIC_MASK = "radial-gradient(120% 120% at 50% 100%, #000 20%, transparent 75%)";

/**
 * Home / landing screen. Ported from 02-home-screen.jsx (`HomeScreen`).
 * Sections in order: hero · ticker · science · social proof · products teaser ·
 * clinics. The prototype's `device==="mobile"` branching is converted to
 * responsive CSS (base = mobile, lg: = desktop) with the same values.
 * Copy comes from the dictionary (home.* / brand.*).
 */
export function HomeScreen({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line-soft">
        <div
          className="grid-lines pointer-events-none absolute inset-0 opacity-50 [--col:44px] lg:[--col:90px]"
          style={{ maskImage: HERO_MASK, WebkitMaskImage: HERO_MASK }}
        />
        <div className="relative mx-auto max-w-shell px-[18px] lg:px-10">
          <div className="grid grid-cols-1 items-center gap-9 pb-14 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-[100px] lg:pt-24">
            <div>
              <Reveal>
                <div className="flex items-center gap-2.5">
                  <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-positive" />
                  <Eyebrow>{t("home.eyebrow")}</Eyebrow>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="display mt-[26px] lg:mt-[30px]">
                  {t("home.h1a")}
                  <br />
                  <span className="irid-text">{t("home.h1b")}</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-[26px] max-w-[460px]">
                  <EKGLine height={22} />
                </div>
              </Reveal>
              <Reveal delay={160}>
                <p className="lede mt-6 max-w-[480px]">{t("home.sub")}</p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-[34px] flex flex-wrap gap-3">
                  <Button href={`/${slug}/shop`} size="lg">
                    {t("home.cta")} {Icons.arrow}
                  </Button>
                  <Button href={`/${slug}#science`} variant="outline" size="lg">
                    {t("home.cta2")}
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="relative">
              <div className="relative">
                <ProductImage
                  label="HERO — cámara hiperbárica sobre negro"
                  className="aspect-[4/3] lg:aspect-[3/4]"
                  radius={16}
                />
                <div className="absolute bottom-3.5 left-3.5 flex gap-2">
                  <Badge irid>{t("brand.mantra")}</Badge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCIENCE */}
      <section id="science" className="mx-auto max-w-shell px-[18px] lg:px-10">
        <div className="pb-6 pt-16 lg:pb-10 lg:pt-[110px]">
          <Reveal>
            <Eyebrow>{t("home.science.k")}</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="h1 mt-[18px] max-w-[760px]">{t("home.science.h")}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede mt-5 max-w-[560px]">{t("home.science.b")}</p>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <div className="flex flex-col gap-7 pb-14 lg:flex-row lg:gap-11 lg:pb-24">
            <SciCard n="01" h={t("home.s1.h")} b={t("home.s1.b")} />
            <SciCard n="02" h={t("home.s2.h")} b={t("home.s2.b")} />
            <SciCard n="03" h={t("home.s3.h")} b={t("home.s3.b")} />
          </div>
        </Reveal>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-line-soft bg-surface-1">
        <div className="mx-auto max-w-shell px-[18px] lg:px-10">
          <div className="py-12 lg:py-20">
            <Reveal>
              <Eyebrow>{t("home.proof.k")}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-7 flex flex-wrap items-center gap-[22px] opacity-[0.82] lg:gap-[52px]">
                {["NBA", "LaLiga", "UFC"].map((m) => (
                  <span
                    key={m}
                    className="font-sans text-[20px] font-bold tracking-[-0.02em] text-ink-2 lg:text-[28px]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-[34px] max-w-[680px] text-[19px] leading-[1.5] tracking-[-0.01em] text-ink lg:text-[24px]">
                {t("home.proof.b")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRODUCTS TEASER */}
      <section className="mx-auto max-w-shell px-[18px] lg:px-10">
        <div className="pt-16 lg:pt-[110px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>{t("home.products.k")}</Eyebrow>
                <h2 className="h1 mt-4">{t("home.products.h")}</h2>
              </div>
              <Button href={`/${slug}/shop`} variant="ghost">
                {t("home.products.cta")} {Icons.arrow}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[34px] grid grid-cols-1 gap-5 pb-14 lg:grid-cols-[1.4fr_1fr] lg:gap-6 lg:pb-[100px]">
              <TeaserCard pid="chamber" big region={region} href={`/${slug}/shop/chamber`} />
              <TeaserCard pid="book" region={region} href={`/${slug}/shop/book`} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLINICS */}
      <section id="clinics" className="relative overflow-hidden border-t border-line-soft">
        <div
          className="grid-lines pointer-events-none absolute inset-0 opacity-40 [--col:44px] lg:[--col:90px]"
          style={{ maskImage: CLINIC_MASK, WebkitMaskImage: CLINIC_MASK }}
        />
        <div className="relative mx-auto max-w-shell px-[18px] lg:px-10">
          <div className="grid grid-cols-1 items-center gap-8 pb-16 pt-16 lg:grid-cols-2 lg:gap-14 lg:pb-[110px] lg:pt-[110px]">
            <div>
              <Reveal>
                <Eyebrow>{t("home.clinics.k")}</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display mt-[18px] text-[40px] lg:text-[64px]">{t("home.clinics.h")}</h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="lede mt-5 max-w-[420px]">{t("home.clinics.b")}</p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-[30px]">
                  <Button href={`/${slug}/shop`} size="lg">
                    {t("home.cta.final")} {Icons.arrow}
                  </Button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-3">
                <ProductImage label="CLÍNICA — Miami" ratio="3 / 4" radius={14} />
                <ProductImage label="CLÍNICA — Madrid" ratio="3 / 4" radius={14} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function SciCard({ n, h, b }: { n: string; h: string; b: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3 border-t border-line pt-[22px]">
      <div className="mono mono-sm text-ink-4">{n}</div>
      <div className="h3">{h}</div>
      <p className="muted m-0 text-[14.5px] leading-[1.6]">{b}</p>
    </div>
  );
}

function PriceTag({ pid, region }: { pid: ProductId; region: Region }) {
  const t = (k: TranslationKey) => translate(region.lang, k);
  const price = priceFor(pid, region.id);
  if (price.onRequest) {
    return <span className="mono text-[12px] text-ink-2">{t("p.onrequest")}</span>;
  }
  return (
    <span className="font-mono text-[13px] text-ink">
      {t("shop.from")} {price.display}
    </span>
  );
}

function TeaserCard({
  pid,
  big,
  region,
  href,
}: {
  pid: ProductId;
  big?: boolean;
  region: Region;
  href: string;
}) {
  const { lang } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct(pid);
  if (!product) return null;
  const copy = productCopy(product, lang);

  return (
    <Link
      href={href}
      className="card flex flex-col overflow-hidden bg-surface-2 text-left transition-colors hover:border-line-hover"
    >
      <div className={big ? "p-4 lg:p-6" : "p-4"}>
        <ProductImage
          label={(big ? "PRODUCTO ESTRELLA — " : "") + copy.name.toUpperCase()}
          className={big ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]"}
          radius={10}
        />
      </div>
      <div
        className={[
          "flex items-end justify-between gap-3",
          big ? "px-[18px] pb-5 pt-1 lg:px-6 lg:pb-6" : "px-[18px] pb-5 pt-1",
        ].join(" ")}
      >
        <div>
          <div className="mono mono-sm text-ink-4">
            {copy.cat}
            {product.hero ? " · " + t("shop.featured") : ""}
          </div>
          <div className={["h3 mt-2", big ? "text-[22px] lg:text-[26px]" : "text-[20px]"].join(" ")}>
            {copy.name}
          </div>
        </div>
        <PriceTag pid={pid} region={region} />
      </div>
    </Link>
  );
}
