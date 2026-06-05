import type { Lang } from "@/lib/i18n/dictionary";

/**
 * Regions — ported from _design/reto-data.js (REGIONS + REGION_ORDER).
 * One config per region carrying language, currency and route slug.
 * Order is fixed: US, LATAM, EU.
 */

export type RegionId = "US" | "LATAM" | "EU";
export type Currency = "USD" | "EUR";

export interface Region {
  id: RegionId;
  /** URL segment: /us /latam /eu */
  routeSlug: "us" | "latam" | "eu";
  lang: Lang;
  currency: Currency;
  symbol: "$" | "€";
  /** Full region name, shown in the selector. */
  label: string;
  /** Compact label, e.g. "US · USD". */
  short: string;
}

export const REGIONS: Record<RegionId, Region> = {
  US: {
    id: "US",
    routeSlug: "us",
    lang: "en",
    currency: "USD",
    symbol: "$",
    label: "United States",
    short: "US · USD",
  },
  LATAM: {
    id: "LATAM",
    routeSlug: "latam",
    lang: "es",
    currency: "USD",
    symbol: "$",
    label: "Latinoamérica",
    short: "LATAM · USD",
  },
  EU: {
    id: "EU",
    routeSlug: "eu",
    lang: "es",
    currency: "EUR",
    symbol: "€",
    label: "Europa",
    short: "EU · EUR",
  },
};

/** Display / routing order. */
export const REGION_ORDER: RegionId[] = ["US", "LATAM", "EU"];

/** Regions in canonical order — convenient for selectors and static params. */
export const REGIONS_ORDERED: Region[] = REGION_ORDER.map((id) => REGIONS[id]);

/** Region used when none is in the URL (the `/` redirect target). */
export const DEFAULT_REGION_ID: RegionId = "US";

export function isRegionId(value: string): value is RegionId {
  return value === "US" || value === "LATAM" || value === "EU";
}

export function getRegion(id: RegionId): Region {
  return REGIONS[id];
}

/** Resolve a URL slug (case-insensitive) to a Region, or null if unknown. */
export function regionFromSlug(slug: string): Region | null {
  const id = slug.toUpperCase();
  return isRegionId(id) ? REGIONS[id] : null;
}
