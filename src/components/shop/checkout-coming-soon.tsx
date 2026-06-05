import type { Region } from "@/lib/regions";
import { translate } from "@/lib/i18n";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";

/**
 * Book checkout "Coming soon" — shown when Amazon Pay isn't available for the
 * region (LATAM always; US/EU when credentials are missing).
 */
export function CheckoutComingSoon({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const soon = lang === "es" ? "Próximamente" : "Coming soon";
  const note =
    lang === "es"
      ? "El pago del libro aún no está disponible en tu región. Vuelve pronto."
      : "Book checkout isn't available in your region yet. Check back soon.";

  return (
    <section className="mx-auto max-w-[760px] px-[18px] py-16 lg:px-10 lg:py-24">
      <Eyebrow>{translate(lang, "co.k")}</Eyebrow>
      <h1 className="display mt-3.5 text-[40px] lg:text-[64px]">{soon}</h1>
      <p className="lede mt-5 max-w-[520px]">{note}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button href={`/${slug}/shop/book`} variant="outline">
          {translate(lang, "co.back")}
        </Button>
        <Button href={`/${slug}/shop`} variant="ghost">
          {translate(lang, "cf.shop")}
        </Button>
      </div>
    </section>
  );
}
