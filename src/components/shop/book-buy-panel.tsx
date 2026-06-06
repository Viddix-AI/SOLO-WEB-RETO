"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { PriceBlock } from "./price-tags";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";

/**
 * Book price + quantity + "Buy now" → Stripe checkout. Enabled in all three
 * regions (US/LATAM in USD, EU in EUR).
 */
export function BookBuyPanel({ region }: { region: Region }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const t = (k: TranslationKey) => translate(region.lang, k);

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
