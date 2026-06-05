/* ============================================================
   RETO — Checkout, Request, Confirmation
   →  window.CheckoutScreen, window.RequestScreen, window.ConfirmationScreen
   ============================================================ */
(function () {
  const { useReto } = window;
  const { Button, Badge, Eyebrow, Field, ProductImage, EKGLine, Icons } = window.RetoUI;
  const { useState } = React;

  function SecureNote({ t }) {
    return (
      <div className="mono mono-sm" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-3)" }}>
        <span style={{ display: "inline-flex", color: "var(--ink-2)" }}>{Icons.lock}</span>
        {t("co.secure.note")}
      </div>
    );
  }

  function SectionTitle({ n, children }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{n}</span>
        <span className="h3" style={{ fontSize: 18, fontWeight: 600 }}>{children}</span>
      </div>
    );
  }

  /* ---------- Order summary ---------- */
  function OrderSummary({ device, sticky }) {
    const { t, cart, lang, fmtProductPrice, regionData } = useReto();
    const mobile = device === "mobile";
    let onRequest = false, subtotal = 0;
    const lines = cart.map((item) => {
      const prod = window.RETO_DATA.PRODUCTS.find((p) => p.id === item.id);
      const p = fmtProductPrice(item.id);
      if (p.onRequest) onRequest = true; else subtotal += (p.value || 0) * item.qty;
      return { prod, item, p };
    });
    const fmtMoney = (v) => regionData.currency === "EUR"
      ? "€" + v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <div className="card" style={{ padding: mobile ? 20 : 26, background: "var(--surface-1)", position: sticky && !mobile ? "sticky" : "static", top: 24 }}>
        <Eyebrow style={{ marginBottom: 18 }}>{t("co.summary")}</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {lines.map(({ prod, item, p }, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 56, flexShrink: 0 }}><ProductImage slotId={"sum-" + item.id} label={prod[lang].name.split(" ")[0]} ratio="1 / 1" radius={8} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, letterSpacing: "-0.01em" }}>{prod[lang].name}</div>
                <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 4 }}>{lang === "es" ? "Cant." : "Qty"} {item.qty}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink)", whiteSpace: "nowrap" }}>
                {p.onRequest ? t("p.onrequest") : p.display}
              </div>
            </div>
          ))}
          {cart.length === 0 && <p className="muted" style={{ fontSize: 14 }}>{lang === "es" ? "Tu carrito está vacío." : "Your cart is empty."}</p>}
        </div>

        <div className="hairline" style={{ margin: "20px 0" }} />
        <Row label={t("co.subtotal")} value={onRequest ? t("p.onrequest") : fmtMoney(subtotal)} />
        <Row label={t("co.shipfee")} value={t("co.free")} positive />
        <Row label={t("co.tax")} value={onRequest ? "—" : fmtMoney(0)} muted />
        <div className="hairline" style={{ margin: "16px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 15, letterSpacing: "-0.01em" }}>{t("co.total")}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--ink)", letterSpacing: "-0.01em" }}>{onRequest ? t("p.onrequest") : fmtMoney(subtotal)}</span>
        </div>
        <p className="muted" style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 16, marginBottom: 0 }}>{t("co.duties")}</p>
      </div>
    );
  }
  function Row({ label, value, muted, positive }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
        <span className="mono mono-sm" style={{ color: "var(--ink-3)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: positive ? "var(--positive)" : muted ? "var(--ink-4)" : "var(--ink-2)" }}>{value}</span>
      </div>
    );
  }

  /* ---------- Checkout ---------- */
  function CheckoutScreen({ device }) {
    const { t, go, lang, cart, fmtProductPrice } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const [f, setF] = useState({});
    const [errors, setErrors] = useState({});
    const [sameAddr, setSameAddr] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const hasOnRequest = cart.some((i) => fmtProductPrice(i.id).onRequest);
    const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

    const required = ["fname", "lname", "phone", "email", "dob", "b_addr", "b_city", "b_zip", "card", "exp", "cvc", "cardname"];
    const validate = () => {
      const er = {};
      required.forEach((k) => { if (!f[k] || !String(f[k]).trim()) er[k] = lang === "es" ? "Requerido" : "Required"; });
      if (f.email && !/^[^@]+@[^@]+\.[^@]+$/.test(f.email)) er.email = lang === "es" ? "Email no válido" : "Invalid email";
      if (!sameAddr) { ["s_addr", "s_city", "s_zip"].forEach((k) => { if (!f[k] || !String(f[k]).trim()) er[k] = lang === "es" ? "Requerido" : "Required"; }); }
      setErrors(er);
      return Object.keys(er).length === 0;
    };
    const submit = () => {
      if (hasOnRequest) { go("request"); return; }
      if (!validate()) {
        const first = document.querySelector(".field.invalid input");
        if (first) first.focus();
        return;
      }
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); go("confirmation"); }, 1400);
    };

    const colStyle = { display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 };

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 32 : 52, paddingBottom: mobile ? 24 : 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>{t("co.k")}</Eyebrow>
              <h1 className="display" style={{ fontSize: mobile ? 40 : 64, marginTop: 14 }}>{t("co.h")}</h1>
            </div>
            <SecureNote t={t} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1.5fr 1fr", gap: mobile ? 36 : 56, paddingBottom: mobile ? 56 : 100 }}>
            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 36 : 44 }}>
              {/* Contact */}
              <div>
                <SectionTitle n="01">{t("co.contact")}</SectionTitle>
                <div style={colStyle}>
                  <Field name="fname" label={t("co.fname")} value={f.fname || ""} onChange={set("fname")} error={errors.fname} required autoComplete="given-name" />
                  <Field name="lname" label={t("co.lname")} value={f.lname || ""} onChange={set("lname")} error={errors.lname} required autoComplete="family-name" />
                  <Field name="phone" label={t("co.phone")} type="tel" value={f.phone || ""} onChange={set("phone")} error={errors.phone} required autoComplete="tel" placeholder="+1 305 000 0000" />
                  <Field name="email" label={t("co.email")} type="email" value={f.email || ""} onChange={set("email")} error={errors.email} required autoComplete="email" placeholder="you@email.com" />
                  <Field name="dob" label={t("co.dob")} type="date" value={f.dob || ""} onChange={set("dob")} error={errors.dob} required full />
                </div>
              </div>

              {/* Billing */}
              <div>
                <SectionTitle n="02">{t("co.billing")}</SectionTitle>
                <AddressFields prefix="b_" f={f} set={set} errors={errors} t={t} colStyle={colStyle} />
              </div>

              {/* Shipping */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>03</span>
                    <span className="h3" style={{ fontSize: 18, fontWeight: 600 }}>{t("co.shipping")}</span>
                  </div>
                  <Toggle on={sameAddr} onChange={() => setSameAddr((v) => !v)} label={t("co.same")} />
                </div>
                {!sameAddr && <AddressFields prefix="s_" f={f} set={set} errors={errors} t={t} colStyle={colStyle} />}
                {sameAddr && <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>{lang === "es" ? "Se enviará a tu dirección de facturación." : "We'll ship to your billing address."}</p>}
              </div>

              {/* Payment */}
              <div>
                <SectionTitle n="04">{t("co.payment")}</SectionTitle>
                {hasOnRequest && (
                  <div className="card" style={{ padding: 18, marginBottom: 18, background: "var(--surface-1)", borderColor: "var(--line)" }}>
                    <p className="muted" style={{ fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>{lang === "es" ? "Este pedido incluye un producto con precio bajo consulta. Continúa para solicitar contacto con concierge." : "This order includes a price-on-request item. Continue to request concierge contact."}</p>
                  </div>
                )}
                <div style={colStyle}>
                  <Field name="card" label={t("co.card")} value={f.card || ""} onChange={set("card")} error={errors.card} required full placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" />
                  <Field name="exp" label={t("co.exp")} value={f.exp || ""} onChange={set("exp")} error={errors.exp} required placeholder="MM / YY" autoComplete="cc-exp" />
                  <Field name="cvc" label={t("co.cvc")} value={f.cvc || ""} onChange={set("cvc")} error={errors.cvc} required placeholder="123" autoComplete="cc-csc" />
                  <Field name="cardname" label={t("co.cardname")} value={f.cardname || ""} onChange={set("cardname")} error={errors.cardname} required full autoComplete="cc-name" />
                </div>
              </div>

              {mobile && <OrderSummary device={device} />}

              <div>
                <Button block size="lg" onClick={submit} disabled={submitting || cart.length === 0}>
                  {submitting ? t("co.placing") : hasOnRequest ? t("p.request") : t("co.pay")} {!submitting && Icons.arrow}
                </Button>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}><SecureNote t={t} /></div>
              </div>
            </div>

            {/* Summary */}
            {!mobile && <div><OrderSummary device={device} sticky /></div>}
          </div>
        </section>
      </div>
    );
  }

  function AddressFields({ prefix, f, set, errors, t, colStyle }) {
    return (
      <div style={colStyle}>
        <Field name={prefix + "addr"} label={t("co.addr")} value={f[prefix + "addr"] || ""} onChange={set(prefix + "addr")} error={errors[prefix + "addr"]} required full autoComplete="address-line1" />
        <Field name={prefix + "addr2"} label={t("co.addr2")} value={f[prefix + "addr2"] || ""} onChange={set(prefix + "addr2")} full autoComplete="address-line2" />
        <Field name={prefix + "city"} label={t("co.city")} value={f[prefix + "city"] || ""} onChange={set(prefix + "city")} error={errors[prefix + "city"]} required autoComplete="address-level2" />
        <Field name={prefix + "state"} label={t("co.state")} value={f[prefix + "state"] || ""} onChange={set(prefix + "state")} autoComplete="address-level1" />
        <Field name={prefix + "zip"} label={t("co.zip")} value={f[prefix + "zip"] || ""} onChange={set(prefix + "zip")} error={errors[prefix + "zip"]} required autoComplete="postal-code" />
        <Field name={prefix + "country"} label={t("co.country")} autoComplete="country-name">
          <select className="reto-input" name={prefix + "country"} value={f[prefix + "country"] || ""} onChange={set(prefix + "country")}>
            <option value="">—</option>
            {["United States", "España", "México", "Argentina", "Colombia", "Chile", "United Kingdom", "France", "Deutschland", "Italia", "Portugal"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
    );
  }

  function Toggle({ on, onChange, label }) {
    return (
      <button onClick={onChange} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0 }}>
        <span style={{ width: 40, height: 23, borderRadius: 99, background: on ? "var(--accent)" : "var(--surface-3)", border: "1px solid " + (on ? "var(--accent)" : "var(--line)"), position: "relative", transition: "all .25s" }}>
          <span style={{ position: "absolute", top: 2, left: on ? 19 : 2, width: 17, height: 17, borderRadius: 99, background: on ? "var(--accent-ink)" : "var(--ink-3)", transition: "all .25s" }} />
        </span>
        <span className="mono mono-sm" style={{ color: "var(--ink-2)" }}>{label}</span>
      </button>
    );
  }

  /* ---------- Request (high-ticket concierge) ---------- */
  function RequestScreen({ device }) {
    const { t, go, lang, regionData } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const prod = window.RETO_DATA.PRODUCTS.find((p) => p.id === "chamber");
    const [f, setF] = useState({});
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
    const submit = () => {
      const er = {};
      ["fname", "lname", "phone", "email"].forEach((k) => { if (!f[k] || !f[k].trim()) er[k] = lang === "es" ? "Requerido" : "Required"; });
      if (f.email && !/^[^@]+@[^@]+\.[^@]+$/.test(f.email)) er.email = lang === "es" ? "Email no válido" : "Invalid email";
      setErrors(er);
      if (Object.keys(er).length) return;
      setSending(true);
      setTimeout(() => { setSending(false); go("confirmation", { request: true }); }, 1300);
    };
    const colStyle = { display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 };

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 32 : 52 }}>
            <button onClick={() => go("chamber")} className="mono mono-sm" style={{ background: "none", border: "none", color: "var(--ink-3)", padding: 0, letterSpacing: "0.14em" }}>← {t("co.back")}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 32 : 56, marginTop: 24, paddingBottom: mobile ? 56 : 100, alignItems: "start" }}>
            <div>
              <Eyebrow>{t("co.req.title")}</Eyebrow>
              <h1 className="h1" style={{ fontSize: mobile ? 36 : 52, marginTop: 16 }}>{prod[lang].name}</h1>
              <p className="lede" style={{ marginTop: 16, maxWidth: 420 }}>{t("co.req.note")}</p>
              <div style={{ margin: "24px 0" }}><EKGLine height={18} /></div>
              <div style={{ marginTop: 8 }}><ProductImage slotId="request-chamber" label="CÁMARA HIPERBÁRICA" ratio="16 / 10" radius={14} /></div>
              <p className="mono mono-sm" style={{ color: "var(--ink-3)", marginTop: 16, lineHeight: 1.7 }}>{t("p.included")}</p>
            </div>
            <div className="card" style={{ padding: mobile ? 22 : 30, background: "var(--surface-1)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={colStyle}>
                  <Field name="fname" label={t("co.fname")} value={f.fname || ""} onChange={set("fname")} error={errors.fname} required />
                  <Field name="lname" label={t("co.lname")} value={f.lname || ""} onChange={set("lname")} error={errors.lname} required />
                  <Field name="phone" label={t("co.phone")} type="tel" value={f.phone || ""} onChange={set("phone")} error={errors.phone} required />
                  <Field name="email" label={t("co.email")} type="email" value={f.email || ""} onChange={set("email")} error={errors.email} required />
                </div>
                <Field name="region" label={t("nav.region")}>
                  <input className="reto-input" value={regionData.label} disabled />
                </Field>
                <Field name="msg" label={t("co.req.msg")}>
                  <textarea className="reto-input" rows={4} value={f.msg || ""} onChange={set("msg")} placeholder={lang === "es" ? "Espacio, plazos, financiación…" : "Space, timeline, financing…"} />
                </Field>
                <Button block size="lg" onClick={submit} disabled={sending}>{sending ? t("co.placing") : t("co.req.send")} {!sending && Icons.arrow}</Button>
                <SecureNote t={t} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Confirmation ---------- */
  function ConfirmationScreen({ device, params }) {
    const { t, go, lang, clearCart } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const isReq = params && params.request;
    const orderId = "RH-" + (lang === "es" ? "26" : "26") + Math.floor(1000 + Math.random() * 8999);
    React.useEffect(() => { if (!isReq) clearCart(); }, []);
    const eta = lang === "es" ? "12–18 jun 2026" : "Jun 12–18, 2026";
    const steps = [t("cf.n1"), t("cf.n2"), t("cf.n3")];

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: 760, margin: "0 auto", padding: PAD, minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ paddingTop: mobile ? 48 : 80, paddingBottom: mobile ? 48 : 80, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-1)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#cg)" strokeWidth="1.6">
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7FE3D2" /><stop offset="100%" stopColor="#E9C9E4" /></linearGradient></defs>
                  <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <Eyebrow style={{ textAlign: "center" }}>{isReq ? t("co.req.title") : t("cf.k")}</Eyebrow>
            <h1 className="display" style={{ fontSize: mobile ? 44 : 72, marginTop: 16 }}>{isReq ? t("cf.req.h") : t("cf.h")}</h1>
            <p className="lede" style={{ maxWidth: 460, margin: "20px auto 0" }}>{isReq ? t("cf.req.b") : t("cf.b")}</p>
            <div style={{ maxWidth: 320, margin: "30px auto 0" }}><EKGLine height={20} /></div>

            {!isReq && (
              <div className="card" style={{ marginTop: 36, padding: 0, overflow: "hidden", textAlign: "left", background: "var(--surface-1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ padding: "20px 24px" }}>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{t("cf.order")}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, marginTop: 8 }}>{orderId}</div>
                  </div>
                  <div style={{ padding: "20px 24px", borderLeft: "1px solid var(--line-soft)" }}>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{t("cf.eta")}</div>
                    <div style={{ fontSize: 15, marginTop: 8, letterSpacing: "-0.01em" }}>{eta}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, textAlign: "left" }}>
              <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginBottom: 14, textAlign: "center" }}>{t("cf.next")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--line-soft)", border: "1px solid var(--line-soft)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ background: "var(--surface-1)", padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
                    <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 15, letterSpacing: "-0.01em" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}>
              <Button onClick={() => go("home")}>{t("cf.home")}</Button>
              <Button variant="outline" onClick={() => go("shop")}>{t("cf.shop")}</Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  window.CheckoutScreen = CheckoutScreen;
  window.RequestScreen = RequestScreen;
  window.ConfirmationScreen = ConfirmationScreen;
})();
