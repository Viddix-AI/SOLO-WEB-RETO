"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Region } from "@/lib/regions";
import type { Lang, TranslationKey } from "@/lib/i18n/dictionary";
import { createTranslator } from "@/lib/i18n";

interface RegionContextValue {
  region: Region;
  lang: Lang;
  /** Translate a key in the active region's language. */
  t: (key: TranslationKey) => string;
}

const RegionContext = createContext<RegionContextValue | null>(null);

/**
 * Provides the active region + a bound translator to client components.
 * The region is driven by the URL segment, so language and currency
 * update live whenever the region selector navigates between /us /latam /eu.
 */
export function RegionProvider({ region, children }: { region: Region; children: ReactNode }) {
  const value = useMemo<RegionContextValue>(
    () => ({ region, lang: region.lang, t: createTranslator(region.lang) }),
    [region],
  );
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within a RegionProvider");
  return ctx;
}

/** Convenience hook: the bound translator for the active region. */
export function useT(): (key: TranslationKey) => string {
  return useRegion().t;
}
