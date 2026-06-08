"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegion } from "@/lib/region-context";
import type { TranslationKey } from "@/lib/i18n";
import { RetoLogo } from "./reto-logo";
import { RegionSelector } from "./region-selector";

/** RETO Clínica WhatsApp — +1 (305) 323-2293 (digits only for wa.me). */
const WHATSAPP_URL = "https://wa.me/13053232293";

/**
 * Navigation header. Ported from 01-ui-components.jsx (`Nav`) — the device-prop
 * branching becomes real responsive CSS (mobile = base, desktop = lg:).
 * `go(...)` becomes region-prefixed hrefs; CartButton is intentionally omitted
 * (cart lands in Bloque D). Shop/Method point to /[region]/shop and /book
 * (Bloque C); Science/Clinics are on-page anchors. Contact opens WhatsApp.
 */
export function SiteHeader() {
  const { region, t } = useRegion();
  const [open, setOpen] = useState(false);
  const slug = region.routeSlug;
  const menuLabel = region.lang === "es" ? "Menú" : "Menu";

  const links: { key: TranslationKey; href: string; external?: boolean }[] = [
    { key: "nav.shop", href: `/${slug}/shop` },
    { key: "nav.science", href: `/${slug}#science` },
    { key: "nav.method", href: `/${slug}/shop/book` },
    { key: "nav.clinics", href: `/${slug}#clinics` },
    { key: "nav.contact", href: WHATSAPP_URL, external: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-black/[0.62] backdrop-blur-[18px]">
      <div className="mx-auto flex max-w-shell items-center justify-between px-[18px] py-3.5 lg:px-10 lg:py-[18px]">
        <div className="flex items-center gap-9">
          <Link href={`/${slug}`} aria-label="RETO — Home" className="shrink-0">
            <RetoLogo height={24} priority />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
                >
                  {t(l.key)}
                </a>
              ) : (
                <Link
                  key={l.key}
                  href={l.href}
                  className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
                >
                  {t(l.key)}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3.5 lg:gap-[18px]">
          <div className="hidden lg:block">
            <RegionSelector />
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={menuLabel}
            aria-expanded={open}
            className="p-1 text-ink lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3" fill="none">
              {open ? (
                <path d="M5 5l14 14M19 5L5 19" />
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line-soft bg-black/90 px-[18px] pb-[22px] pt-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="py-3 text-left text-[17px] tracking-[-0.01em] text-ink"
                >
                  {t(l.key)}
                </a>
              ) : (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-left text-[17px] tracking-[-0.01em] text-ink"
                >
                  {t(l.key)}
                </Link>
              )
            )}
          </nav>
          <div className="mt-4">
            <RegionSelector />
          </div>
        </div>
      )}
    </header>
  );
}
