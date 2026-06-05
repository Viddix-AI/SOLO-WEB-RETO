"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { PriceBlock } from "./price-tags";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";

/**
 * Book price + quantity + "Buy now" → Amazon Pay checkout. When checkout isn't
 * enabled for the region (LATAM always; US/EU without credentials) the CTA is a
 * disabled "Coming soon" with no checkout route.
 */
export function BookBuyPanel({ region, checkoutEnabled }: { region: Region; checkoutEnabled: boolean }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const t = (k: TranslationKey) => translate(region.lang, k);

  if (!checkoutEnabled) {
    const soon = region.lang === "es" ? "Próximamente" : "Coming soon";
    return (
      <div className="card mt-[26px] bg-surface-1 p-5 lg:p-6">
        <PriceBlock pid="book" region={region} large />
        <div className="mt-5">
          <span className="btn btn-outline btn-lg btn-block pointer-events-none opacity-60">{soon}</span>
        </div>
        <p className="muted mb-0 mt-3 text-[12.5px] leading-[1.6]">
          {region.lang === "es"
            ? "El pago del libro aún no está disponible en tu región."
            : "Book checkout isn't available in your region yet."}
        </p>
      </div>
    );
  }

  function buy() {
    router.push(`/${region.routeSlug}/checkout?qty=${qty}`);
  }

  return (
    <div className="card mt-[26px] bg-surface-1 p-5 lg:p-6">
      <PriceBlock pid="book" region={region} large />
      <div className="mt-5 flex items-stretch gap-3">
        <div className="flex items-center overflow-hidden rounded-sm border border-line">
          <QtyBtn onClick={() => setQty((q) => Math.max(1, q - 1))} label="−" />
          <span className="w-10 text-center font-mono text-[15px]">{qty}</span>
          <QtyBtn onClick={() => setQty((q) => q + 1)} label="+" />
        </div>
        <Button onClick={buy} size="lg" className="flex-1">
          {t("p.buy")} {Icons.arrow}
        </Button>
      </div>
    </div>
  );
}

function QtyBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label === "+" ? "+1" : "-1"}
      className="flex h-[52px] w-11 items-center justify-center text-[18px] text-ink"
    >
      {label}
    </button>
  );
}
