"use client";

import { useState } from "react";
import Link from "next/link";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { PRODUCTS, productCopy, type Product } from "@/lib/products";
import { Eyebrow } from "@/components/eyebrow";
import { Badge } from "@/components/badge";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";
import { Icons } from "@/components/icons";
import { Price } from "./price-tags";

type FilterKey = "all" | "hardware" | "book";

/**
 * Shop / marketplace. Ported from 03-shop-screen.jsx (`ShopScreen`).
 * Client component: filter state drives the chamber hero + product grid.
 */
export function ShopScreen({ region, checkoutEnabled }: { region: Region; checkoutEnabled: boolean }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filters: [FilterKey, string][] = [
    ["all", t("shop.all")],
    ["hardware", t("shop.hardware")],
    ["book", t("shop.books")],
  ];
  const visible = PRODUCTS.filter((p) => filter === "all" || p.kind === filter);
  const hero = PRODUCTS.find((p) => p.id === "chamber")!;
  const rest = visible.filter((p) => !p.hero);
  const showHero = filter === "all" || filter === "hardware";

  return (
    <section className="mx-auto max-w-shell px-[18px] lg:px-10">
      {/* header */}
      <div className="pb-6 pt-10 lg:pb-9 lg:pt-16">
        <Eyebrow>{t("shop.k")}</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h1 className="display text-[44px] lg:text-[80px]">{t("shop.h")}</h1>
          <div className="mono mono-sm flex items-center gap-2 pb-2 text-ink-3">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-positive" />
            <span>
              {t("shop.region.note")} {region.label} · {region.currency}
            </span>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-2 overflow-x-auto border-b border-line-soft pb-6 lg:pb-8">
        {filters.map(([k, label]) => {
          const active = filter === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              aria-pressed={active}
              className={[
                "whitespace-nowrap rounded-pill border px-[18px] py-[9px] font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                active
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line bg-transparent text-ink-2 hover:border-line-hover",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* hero product — chamber */}
      {showHero && (
        <Reveal>
          <Link
            href={`/${slug}/shop/chamber`}
            className="card mt-7 block overflow-hidden bg-surface-2 transition-colors hover:border-line-hover lg:mt-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
              <div className="p-4 lg:p-7">
                <ProductImage
                  label="PRODUCTO ESTRELLA — cámara hiperbárica"
                  className="aspect-[4/3] lg:aspect-square"
                  radius={12}
                />
              </div>
              <div className="flex flex-col justify-center px-5 pb-7 pt-2 lg:py-11 lg:pl-3 lg:pr-11">
                <div className="mb-[18px] flex gap-2">
                  <Badge irid>{t("shop.hero.k")}</Badge>
                </div>
                <div className="mono mono-sm text-ink-4">{productCopy(hero, lang).cat}</div>
                <h2 className="h1 mt-3 text-[34px] lg:text-[52px]">{productCopy(hero, lang).name}</h2>
                <p className="lede mt-4 max-w-[420px] text-[16px]">{productCopy(hero, lang).short}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <Price pid="chamber" region={region} large />
                  <span className="btn btn-outline btn-sm pointer-events-none">
                    {t("shop.view")} {Icons.arrow}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      {/* grid — remaining products */}
      <div className="mt-[18px] grid grid-cols-1 gap-[18px] pb-14 lg:mt-6 lg:grid-cols-3 lg:gap-6 lg:pb-[100px]">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}>
            <ProductCard product={p} region={region} checkoutEnabled={checkoutEnabled} />
          </Reveal>
        ))}
        {filter === "all" &&
          [0, 1].map((i) => (
            <Reveal key={`soon-${i}`} delay={(rest.length + i) * 60}>
              <ComingSoonCard index={i} lang={lang} />
            </Reveal>
          ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  region,
  checkoutEnabled,
}: {
  product: Product;
  region: Region;
  checkoutEnabled: boolean;
}) {
  const { lang, routeSlug: slug } = region;
  const c = productCopy(product, lang);
  return (
    <Link
      href={`/${slug}/shop/${product.id}`}
      className="card flex h-full flex-col bg-surface-2 p-4 text-left transition-colors hover:border-line-hover lg:p-[18px]"
    >
      <ProductImage label={c.name.toUpperCase()} className="aspect-[4/3]" radius={10} />
      <div className="mt-4 flex flex-1 flex-col">
        <div className="mono mono-sm text-ink-4">{c.cat}</div>
        <div className="h3 mt-2 text-[20px]">{c.name}</div>
        <p className="muted mt-2.5 text-[13.5px] leading-[1.55]">{c.short}</p>
        <div className="mt-[18px] flex items-center justify-between border-t border-line-soft pt-4">
          {product.id === "book" && !checkoutEnabled ? (
            <span className="mono text-[11.5px] text-ink-3">
              {region.lang === "es" ? "Próximamente" : "Coming soon"}
            </span>
          ) : (
            <Price pid={product.id} region={region} />
          )}
          <span className="inline-flex text-ink-3">{Icons.arrow}</span>
        </div>
      </div>
    </Link>
  );
}

function ComingSoonCard({ index, lang }: { index: number; lang: "en" | "es" }) {
  const label =
    index === 0
      ? lang === "es"
        ? "RECOVERY — próximamente"
        : "RECOVERY — coming soon"
      : lang === "es"
        ? "DIAGNÓSTICO — próximamente"
        : "DIAGNOSTICS — coming soon";
  const title =
    index === 0
      ? lang === "es"
        ? "Kit de Recuperación"
        : "Recovery Kit"
      : lang === "es"
        ? "Panel Diagnóstico"
        : "Diagnostic Panel";
  return (
    <div className="card flex h-full flex-col p-4 opacity-60 lg:p-[18px]">
      <ProductImage label={label} className="aspect-[4/3]" radius={10} />
      <div className="mt-4">
        <div className="mono mono-sm text-ink-4">{lang === "es" ? "Próximamente" : "Coming soon"}</div>
        <div className="h3 mt-2 text-[19px] text-ink-2">{title}</div>
      </div>
    </div>
  );
}
