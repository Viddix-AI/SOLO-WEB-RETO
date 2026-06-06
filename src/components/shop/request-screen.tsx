"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { getProduct, productCopy } from "@/lib/products";
import type { Lead } from "@/lib/leads";
import { Field } from "@/components/field";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { EKGLine } from "@/components/ekg-line";
import { ProductImage } from "@/components/product-image";
import { Icons } from "@/components/icons";

const COUNTRIES = [
  "United States",
  "España",
  "México",
  "Argentina",
  "Colombia",
  "Chile",
  "United Kingdom",
  "France",
  "Deutschland",
  "Italia",
  "Portugal",
];

type FormState = Record<string, string>;
type Errors = Record<string, string>;
type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

/**
 * Chamber concierge request form. Ported from 05-request-checkout-confirmation.jsx
 * (`RequestScreen`). Fields per spec: contact + country + shipping address.
 * On valid submit → POST to the server, which creates a QuickBooks Customer +
 * Invoice (email safety net if QBO fails) → inline confirmation.
 */
export function RequestScreen({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const product = getProduct("chamber")!;
  const c = productCopy(product, lang);

  const [f, setF] = useState<FormState>({});
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: string) => (e: FieldEvent) => setF((s) => ({ ...s, [k]: e.target.value }));

  function validate(): Errors {
    const er: Errors = {};
    const req = lang === "es" ? "Requerido" : "Required";
    (["fname", "lname", "email", "phone", "addr", "city", "zip", "country"] as const).forEach((k) => {
      if (!f[k] || !f[k].trim()) er[k] = req;
    });
    if (f.email && !/^[^@]+@[^@]+\.[^@]+$/.test(f.email)) {
      er.email = lang === "es" ? "Email no válido" : "Invalid email";
    }
    return er;
  }

  async function submit() {
    setSubmitError(null);
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setSending(true);
    const lead: Lead = {
      product: "chamber",
      region: region.id,
      fname: f.fname,
      lname: f.lname,
      email: f.email,
      phone: f.phone,
      country: f.country,
      address: {
        addr: f.addr,
        addr2: f.addr2 || undefined,
        city: f.city,
        state: f.state || undefined,
        zip: f.zip,
      },
      message: f.msg || undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/quickbooks/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error("request failed");
      setSent(true);
    } catch {
      setSubmitError(
        lang === "es"
          ? "No se pudo enviar la solicitud. Inténtalo de nuevo."
          : "Could not send your request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) return <RequestConfirmation region={region} />;

  const colCls = "grid grid-cols-1 gap-4 lg:grid-cols-2";

  return (
    <section className="mx-auto max-w-[1080px] px-[18px] lg:px-10">
      <div className="pt-8 lg:pt-[52px]">
        <Link
          href={`/${slug}/shop/chamber`}
          className="mono mono-sm tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
        >
          ← {t("co.back")}
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 pb-14 lg:grid-cols-2 lg:gap-14 lg:pb-[100px]">
        {/* intro */}
        <div>
          <Eyebrow>{t("co.req.title")}</Eyebrow>
          <h1 className="h1 mt-4 text-[36px] lg:text-[52px]">{c.name}</h1>
          <p className="lede mt-4 max-w-[420px]">{t("co.req.note")}</p>
          <div className="my-6">
            <EKGLine height={18} />
          </div>
          <div className="mt-2">
            <ProductImage label="CÁMARA HIPERBÁRICA" src="/chamber.jpg" ratio="16 / 10" radius={14} />
          </div>
          <p className="mono mono-sm mt-4 leading-[1.7] text-ink-3">{t("p.included")}</p>
        </div>

        {/* form */}
        <div className="card bg-surface-1 p-[22px] lg:p-[30px]">
          <div className="flex flex-col gap-4">
            <div className={colCls}>
              <Field name="fname" label={t("co.fname")} value={f.fname || ""} onChange={set("fname")} error={errors.fname} required />
              <Field name="lname" label={t("co.lname")} value={f.lname || ""} onChange={set("lname")} error={errors.lname} required />
              <Field name="phone" type="tel" label={t("co.phone")} value={f.phone || ""} onChange={set("phone")} error={errors.phone} required />
              <Field name="email" type="email" label={t("co.email")} value={f.email || ""} onChange={set("email")} error={errors.email} required />
            </div>

            <div className={colCls}>
              <Field name="addr" label={t("co.addr")} value={f.addr || ""} onChange={set("addr")} error={errors.addr} required full />
              <Field name="addr2" label={t("co.addr2")} value={f.addr2 || ""} onChange={set("addr2")} full />
              <Field name="city" label={t("co.city")} value={f.city || ""} onChange={set("city")} error={errors.city} required />
              <Field name="state" label={t("co.state")} value={f.state || ""} onChange={set("state")} />
              <Field name="zip" label={t("co.zip")} value={f.zip || ""} onChange={set("zip")} error={errors.zip} required />
              <Field name="country" label={t("co.country")} error={errors.country} required>
                <select className="reto-input" name="country" value={f.country || ""} onChange={set("country")}>
                  <option value="">—</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field name="msg" label={t("co.req.msg")}>
              <textarea
                className="reto-input"
                rows={4}
                name="msg"
                value={f.msg || ""}
                onChange={set("msg")}
                placeholder={lang === "es" ? "Espacio, plazos, financiación…" : "Space, timeline, financing…"}
              />
            </Field>

            <Button onClick={submit} block size="lg" disabled={sending}>
              {sending ? t("co.placing") : t("co.req.send")} {!sending && Icons.arrow}
            </Button>
            {submitError && <p className="font-mono text-[12px] text-[#D69A9A]">{submitError}</p>}
            <SecureNote region={region} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SecureNote({ region }: { region: Region }) {
  return (
    <div className="mono mono-sm flex items-center gap-2 text-ink-3">
      <span className="inline-flex text-ink-2">{Icons.lock}</span>
      {translate(region.lang, "co.req.secure")}
    </div>
  );
}

/** Request-received confirmation. Ported from `ConfirmationScreen` (request mode). */
function RequestConfirmation({ region }: { region: Region }) {
  const { lang, routeSlug: slug } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const steps = [t("cf.n1"), t("cf.n2"), t("cf.n3")];

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col justify-center px-[18px] lg:px-10">
      <div className="py-12 text-center lg:py-20">
        <div className="mb-7 flex justify-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-line bg-surface-1">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#reto-check)" strokeWidth="1.6">
              <defs>
                <linearGradient id="reto-check" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7FE3D2" />
                  <stop offset="100%" stopColor="#E9C9E4" />
                </linearGradient>
              </defs>
              <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <Eyebrow>{t("co.req.title")}</Eyebrow>
        <h1 className="display mt-4 text-[44px] lg:text-[72px]">{t("cf.req.h")}</h1>
        <p className="lede mx-auto mt-5 max-w-[460px]">{t("cf.req.b")}</p>
        <div className="mx-auto mt-7 max-w-[320px]">
          <EKGLine height={20} />
        </div>

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
