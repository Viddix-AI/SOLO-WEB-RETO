"use client";

import { useState, type ChangeEvent } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { Region } from "@/lib/regions";
import { translate, type TranslationKey } from "@/lib/i18n";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

/** ISO 3166-1 alpha-2 country codes — Stripe expects 2-letter codes. */
const COUNTRIES: [code: string, label: string][] = [
  ["US", "United States"],
  ["ES", "España"],
  ["MX", "México"],
  ["AR", "Argentina"],
  ["CO", "Colombia"],
  ["CL", "Chile"],
  ["PE", "Perú"],
  ["GB", "United Kingdom"],
  ["FR", "France"],
  ["DE", "Deutschland"],
  ["IT", "Italia"],
  ["PT", "Portugal"],
];

type FormState = Record<string, string>;
type Errors = Record<string, string>;
type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

/** Address shape Stripe accepts for billing_details / shipping. */
interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#7FE3D2",
    colorBackground: "#060607",
    colorText: "#F4F4F2",
    colorTextSecondary: "#B6B6B4",
    colorDanger: "#D69A9A",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    borderRadius: "4px",
  },
};

export interface CheckoutFormProps {
  region: Region;
  qty: number;
  /** Server-authoritative amount in minor units (cents), for display/eligibility only. */
  amountMinor: number;
  /** Lowercase ISO currency, e.g. "usd" / "eur". */
  currency: string;
}

/**
 * Book checkout (Stripe, TEST mode). Collects the buyer's details BEFORE paying
 * (contact + DOB + billing & shipping address) and renders the Stripe Payment
 * Element. On submit it asks the SERVER to create the PaymentIntent (the server
 * sets the amount from the price book — the client never fixes the price), then
 * confirms the payment. We never see or store the card number.
 */
export function CheckoutForm({ region, qty, amountMinor, currency }: CheckoutFormProps) {
  if (!stripePromise) {
    const note =
      region.lang === "es"
        ? "El pago no está configurado todavía. Define las claves de Stripe."
        : "Payments are not configured yet. Set the Stripe keys.";
    return <p className="font-mono text-[12.5px] text-[#D69A9A]">{note}</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: "payment", amount: amountMinor, currency, appearance }}
    >
      <CheckoutFields region={region} qty={qty} />
    </Elements>
  );
}

function CheckoutFields({ region, qty }: { region: Region; qty: number }) {
  const { lang } = region;
  const t = (k: TranslationKey) => translate(lang, k);
  const stripe = useStripe();
  const elements = useElements();

  const [f, setF] = useState<FormState>({ shipCountry: "", billCountry: "" });
  const [sameShip, setSameShip] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = (k: string) => (e: FieldEvent) => setF((s) => ({ ...s, [k]: e.target.value }));

  function validate(): Errors {
    const er: Errors = {};
    const req = lang === "es" ? "Requerido" : "Required";
    const need = (k: string) => {
      if (!f[k] || !f[k].trim()) er[k] = req;
    };
    ["fname", "lname", "phone", "email", "dob", "billAddr", "billCity", "billZip", "billCountry"].forEach(need);
    if (!sameShip) ["shipAddr", "shipCity", "shipZip", "shipCountry"].forEach(need);
    if (f.email && !/^[^@]+@[^@]+\.[^@]+$/.test(f.email)) {
      er.email = lang === "es" ? "Email no válido" : "Invalid email";
    }
    return er;
  }

  function billingAddress(): Address {
    return {
      line1: f.billAddr ?? "",
      line2: f.billAddr2 ?? "",
      city: f.billCity ?? "",
      state: f.billState ?? "",
      postal_code: f.billZip ?? "",
      country: f.billCountry ?? "",
    };
  }

  function shippingAddress(): Address {
    if (sameShip) return billingAddress();
    return {
      line1: f.shipAddr ?? "",
      line2: f.shipAddr2 ?? "",
      city: f.shipCity ?? "",
      state: f.shipState ?? "",
      postal_code: f.shipZip ?? "",
      country: f.shipCountry ?? "",
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!stripe || !elements) return;

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    try {
      // 1) Validate the Payment Element.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setFormError(submitError.message ?? (lang === "es" ? "Revisa los datos de pago." : "Check your payment details."));
        return;
      }

      // 2) Ask the SERVER for the PaymentIntent (server decides the amount).
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          region: region.id,
          qty,
          customer: {
            fname: f.fname,
            lname: f.lname,
            email: f.email,
            phone: f.phone,
            dob: f.dob,
            billing: billingAddress(),
            shipping: shippingAddress(),
          },
        }),
      });
      if (!res.ok) throw new Error("intent failed");
      const { clientSecret } = (await res.json()) as { clientSecret: string };

      // 3) Confirm the payment with our own billing details (we never store the card).
      const fullName = [f.fname, f.lname].filter(Boolean).join(" ").trim();
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/${region.routeSlug}/checkout/confirmation`,
          payment_method_data: {
            billing_details: {
              name: fullName,
              email: f.email,
              phone: f.phone,
              address: billingAddress(),
            },
          },
          shipping: { name: fullName, phone: f.phone, address: shippingAddress() },
        },
      });

      // If we reach here, confirmation failed (success redirects to return_url).
      if (error) {
        setFormError(error.message ?? (lang === "es" ? "No se pudo completar el pago." : "Could not complete the payment."));
      }
    } catch {
      setFormError(lang === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const colCls = "grid grid-cols-1 gap-4 lg:grid-cols-2";

  return (
    <form onSubmit={submit} className="card flex flex-col gap-6 bg-surface-1 p-[22px] lg:p-[30px]">
      {/* 01 — Contact */}
      <Section n="01" title={t("co.contact")}>
        <div className={colCls}>
          <Field name="fname" label={t("co.fname")} value={f.fname || ""} onChange={set("fname")} error={errors.fname} autoComplete="given-name" required />
          <Field name="lname" label={t("co.lname")} value={f.lname || ""} onChange={set("lname")} error={errors.lname} autoComplete="family-name" required />
          <Field name="phone" type="tel" label={t("co.phone")} value={f.phone || ""} onChange={set("phone")} error={errors.phone} autoComplete="tel" required />
          <Field name="email" type="email" label={t("co.email")} value={f.email || ""} onChange={set("email")} error={errors.email} autoComplete="email" required />
          <Field name="dob" type="date" label={t("co.dob")} value={f.dob || ""} onChange={set("dob")} error={errors.dob} autoComplete="bday" required full />
        </div>
      </Section>

      {/* 02 — Billing address */}
      <Section n="02" title={t("co.billing")}>
        <AddressFields prefix="bill" f={f} set={set} errors={errors} t={t} required />
      </Section>

      {/* 03 — Shipping address */}
      <Section n="03" title={t("co.shipping")}>
        <label className="mb-1 inline-flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-2">
          <input
            type="checkbox"
            checked={sameShip}
            onChange={(e) => setSameShip(e.target.checked)}
            className="h-4 w-4 accent-[#7FE3D2]"
          />
          {t("co.same")}
        </label>
        {!sameShip && (
          <div className="mt-3">
            <AddressFields prefix="ship" f={f} set={set} errors={errors} t={t} required />
          </div>
        )}
      </Section>

      {/* 04 — Payment */}
      <Section n="04" title={t("co.payment")}>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "never", email: "never", phone: "never", address: "never" } },
          }}
        />
      </Section>

      <Button type="submit" block size="lg" disabled={busy || !stripe}>
        {busy ? t("co.placing") : t("co.pay")} {!busy && Icons.arrow}
      </Button>
      {formError && <p className="font-mono text-[12px] text-[#D69A9A]">{formError}</p>}
      <div className="mono mono-sm flex items-center gap-2 text-ink-3">
        <span className="inline-flex text-ink-2">{Icons.lock}</span>
        {t("co.secure.note")}
      </div>
    </form>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3.5 flex items-center gap-3">
        <span className="mono mono-sm text-ink-4">{n}</span>
        <span className="h3 text-[18px]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function AddressFields({
  prefix,
  f,
  set,
  errors,
  t,
  required,
}: {
  prefix: "bill" | "ship";
  f: FormState;
  set: (k: string) => (e: FieldEvent) => void;
  errors: Errors;
  t: (k: TranslationKey) => string;
  required?: boolean;
}) {
  const k = (s: string) => `${prefix}${s}`;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Field name={k("Addr")} label={t("co.addr")} value={f[k("Addr")] || ""} onChange={set(k("Addr"))} error={errors[k("Addr")]} autoComplete="address-line1" required={required} full />
      <Field name={k("Addr2")} label={t("co.addr2")} value={f[k("Addr2")] || ""} onChange={set(k("Addr2"))} autoComplete="address-line2" full />
      <Field name={k("City")} label={t("co.city")} value={f[k("City")] || ""} onChange={set(k("City"))} error={errors[k("City")]} autoComplete="address-level2" required={required} />
      <Field name={k("State")} label={t("co.state")} value={f[k("State")] || ""} onChange={set(k("State"))} autoComplete="address-level1" />
      <Field name={k("Zip")} label={t("co.zip")} value={f[k("Zip")] || ""} onChange={set(k("Zip"))} error={errors[k("Zip")]} autoComplete="postal-code" required={required} />
      <Field name={k("Country")} label={t("co.country")} error={errors[k("Country")]} required={required}>
        <select className="reto-input" name={k("Country")} value={f[k("Country")] || ""} onChange={set(k("Country"))}>
          <option value="">—</option>
          {COUNTRIES.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
