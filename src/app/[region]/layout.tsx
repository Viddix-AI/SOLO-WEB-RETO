import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { plexMono } from "@/lib/fonts";
import { REGION_ORDER, regionFromSlug } from "@/lib/regions";
import { RegionProvider } from "@/lib/region-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** Only /us /latam /eu are valid; everything else 404s. */
export const dynamicParams = false;

/** Pre-render the three regions statically. */
export function generateStaticParams() {
  return REGION_ORDER.map((id) => ({ region: id.toLowerCase() }));
}

export const metadata: Metadata = {
  title: {
    default: "RETO — The future of health, today.",
    template: "%s · RETO",
  },
  description:
    "Premium preventive medicine for longevity, recovery and elite performance.",
};

export default async function RegionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();

  return (
    <html lang={region.lang} className={plexMono.variable}>
      <body className="bg-bg text-ink">
        <RegionProvider region={region}>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter region={region} />
          </div>
        </RegionProvider>
      </body>
    </html>
  );
}
