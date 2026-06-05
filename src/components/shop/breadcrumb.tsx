import Link from "next/link";
import type { Region } from "@/lib/regions";
import { translate } from "@/lib/i18n";

/** Breadcrumb: Shop / <product>. Ported from 04-chamber-book-screens.jsx. */
export function Breadcrumb({ region, name }: { region: Region; name: string }) {
  return (
    <div className="mono mono-sm flex items-center gap-2 text-ink-4">
      <Link
        href={`/${region.routeSlug}/shop`}
        className="text-ink-3 transition-colors hover:text-ink"
      >
        {translate(region.lang, "shop.h")}
      </Link>
      <span>/</span>
      <span className="text-ink-2">{name}</span>
    </div>
  );
}
