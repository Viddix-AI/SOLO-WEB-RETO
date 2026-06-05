import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { EKGLine } from "@/components/ekg-line";

export interface OrderView {
  orderNumber: string;
  eta: string;
}

/** Order confirmation. Ported from 05 (ConfirmationScreen, order mode). */
export function ConfirmationScreen({ region, order }: { region: Region; order: OrderView | null }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const steps = [t("cf.n1"), t("cf.n2"), t("cf.n3")];

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col justify-center px-[18px] lg:px-10">
      <div className="py-12 text-center lg:py-20">
        <div className="mb-7 flex justify-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-line bg-surface-1">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#reto-check-ok)" strokeWidth="1.6">
              <defs>
                <linearGradient id="reto-check-ok" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7FE3D2" />
                  <stop offset="100%" stopColor="#E9C9E4" />
                </linearGradient>
              </defs>
              <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <Eyebrow>{t("cf.k")}</Eyebrow>
        <h1 className="display mt-4 text-[44px] lg:text-[72px]">{t("cf.h")}</h1>
        <p className="lede mx-auto mt-5 max-w-[460px]">{t("cf.b")}</p>
        <div className="mx-auto mt-7 max-w-[320px]">
          <EKGLine height={20} />
        </div>

        {order && (
          <div className="card mt-9 overflow-hidden bg-surface-1 text-left">
            <div className="grid grid-cols-2">
              <div className="px-6 py-5">
                <div className="mono mono-sm text-ink-4">{t("cf.order")}</div>
                <div className="mt-2 font-mono text-[16px]">{order.orderNumber}</div>
              </div>
              <div className="border-l border-line-soft px-6 py-5">
                <div className="mono mono-sm text-ink-4">{t("cf.eta")}</div>
                <div className="mt-2 text-[15px] tracking-[-0.01em]">{order.eta}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-left">
          <div className="mono mono-sm mb-3.5 text-center text-ink-4">{t("cf.next")}</div>
          <div className="flex flex-col gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3.5 bg-surface-1 px-5 py-4">
                <span className="mono mono-sm text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] tracking-[-0.01em]">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={`/${slug}`}>{t("cf.home")}</Button>
          <Button href={`/${slug}/shop`} variant="outline">
            {t("cf.shop")}
          </Button>
        </div>
      </div>
    </section>
  );
}
