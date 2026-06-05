import Link from "next/link";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { RetoLogo } from "./reto-logo";

/**
 * Footer. Ported from 01-ui-components.jsx (`Footer` + `FooterCol`).
 * Server component; device-prop branching becomes responsive CSS. `go(...)`
 * becomes region-prefixed hrefs. Copy comes entirely from the dictionary.
 */
export function SiteFooter({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);

  const colShop: [TranslationKey, string][] = [
    ["nav.shop", `/${slug}/shop`],
    ["nav.method", `/${slug}/shop/book`],
  ];
  const colScience: [TranslationKey, string][] = [
    ["nav.science", `/${slug}#science`],
    ["nav.clinics", `/${slug}#clinics`],
  ];

  return (
    <footer className="border-t border-line-soft bg-surface-1 px-[18px] pb-9 pt-10 lg:px-10 lg:pb-11 lg:pt-16">
      <div className="mx-auto max-w-shell">
        <div className="flex flex-col justify-between gap-7 lg:flex-row">
          <div className="max-w-[320px]">
            <RetoLogo />
            <p className="muted mt-4 text-[14px] leading-[1.6]">{t("ft.tag")}</p>
            <div className="mono mono-sm mt-3.5">{t("brand.locations")}</div>
          </div>
          <div className="flex gap-10 lg:gap-16">
            <FooterCol title={t("nav.shop")} items={colShop} t={t} />
            <FooterCol title={t("nav.science")} items={colScience} t={t} />
          </div>
        </div>

        <div className="hairline mb-[18px] mt-8" />

        <div className="flex flex-col justify-between gap-2.5 lg:flex-row">
          <div className="mono mono-sm">{t("ft.rights")}</div>
          <div className="mono mono-sm text-ink-4">{t("brand.triad")}</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  t,
}: {
  title: string;
  items: [TranslationKey, string][];
  t: (k: TranslationKey) => string;
}) {
  return (
    <div>
      <div className="mono mono-sm mb-3.5">{title}</div>
      <div className="flex flex-col gap-2.5">
        {items.map(([key, href], i) => (
          <Link key={i} href={href} className="text-[14px] text-ink-2 transition-colors hover:text-ink">
            {t(key)}
          </Link>
        ))}
      </div>
    </div>
  );
}
