/* ============================================================
   RETO — Product pages: Chamber (high-ticket) + Book
   →  window.ChamberScreen, window.BookScreen
   ============================================================ */
(function () {
  const { useReto } = window;
  const { Button, Badge, Eyebrow, ProductImage, Reveal, TrustRow, EKGLine, Icons } = window.RetoUI;
  const { useState } = React;

  function Breadcrumb({ t, go, name }) {
    return (
      <div className="mono mono-sm" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-4)" }}>
        <button onClick={() => go("shop")} style={{ background: "none", border: "none", padding: 0, color: "var(--ink-3)", font: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>{t("shop.h")}</button>
        <span>/</span><span style={{ color: "var(--ink-2)" }}>{name}</span>
      </div>
    );
  }

  function PriceBlock({ pid, large }) {
    const { fmtProductPrice, t } = useReto();
    const p = fmtProductPrice(pid);
    if (p.onRequest)
      return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="mono" style={{ color: "var(--ink-3)", fontSize: 11 }}>{t("p.onrequest")}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: large ? 28 : 20, color: "var(--ink)", letterSpacing: "-0.01em" }}>—</span>
      </div>;
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: large ? 32 : 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>{p.display}</span>
        <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{p.note}</span>
      </div>
    );
  }

  /* ============ CHAMBER (high-ticket) ============ */
  function ChamberScreen({ device }) {
    const { t, go, lang, fmtProductPrice, addToCart } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const MAXW = 1240;
    const prod = window.RETO_DATA.PRODUCTS.find((p) => p.id === "chamber");
    const c = prod[lang];
    const specs = window.RETO_DATA.CHAMBER_SPECS;
    const [gi, setGi] = useState(0);
    const gallery = ["chamber-g0", "chamber-g1", "chamber-g2"];
    const galleryLabels = ["EXTERIOR — sobre negro", "INTERIOR — detalle", "CONTROL — pantalla táctil"];
    const benefits = [
      [t("ch.benefit1.h"), t("ch.benefit1.b")],
      [t("ch.benefit2.h"), t("ch.benefit2.b")],
      [t("ch.benefit3.h"), t("ch.benefit3.b")],
    ];

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 28 : 44 }}><Breadcrumb t={t} go={go} name={c.name} /></div>

          {/* Top: gallery + buy panel */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1.05fr 0.95fr", gap: mobile ? 28 : 56, marginTop: mobile ? 22 : 34 }}>
            {/* Gallery */}
            <div>
              <ProductImage slotId={gallery[gi]} label={galleryLabels[gi]} ratio="1 / 1" radius={16} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
                {gallery.map((g, i) => (
                  <button key={g} onClick={() => setGi(i)} style={{ padding: 0, border: "1px solid " + (gi === i ? "var(--line-hover)" : "var(--line-soft)"), borderRadius: 10, overflow: "hidden", background: "none", cursor: "pointer" }}>
                    <ProductImage slotId={g} label={["EXT", "INT", "UI"][i]} ratio="1 / 1" radius={9} />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy panel */}
            <div>
              <Badge irid>{prod[lang].tagline}</Badge>
              <h1 className="h1" style={{ fontSize: mobile ? 38 : 56, marginTop: 18 }}>{c.name}</h1>
              <p className="lede" style={{ marginTop: 16, maxWidth: 460 }}>{c.short}</p>
              <div style={{ margin: "26px 0 6px" }}><EKGLine height={20} /></div>

              <div className="card" style={{ padding: mobile ? 20 : 26, marginTop: 22, background: "var(--surface-1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <PriceBlock pid="chamber" large />
                  <Badge>{t("p.finance")}</Badge>
                </div>
                <p className="mono mono-sm" style={{ color: "var(--ink-3)", marginTop: 16, lineHeight: 1.7, letterSpacing: "0.08em" }}>{t("p.included")}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                  <Button block size="lg" onClick={() => go("request")}>{t("p.request")} {Icons.arrow}</Button>
                  {!fmtProductPrice("chamber").onRequest && (
                    <Button block variant="outline" onClick={() => { addToCart("chamber", 1); go("checkout"); }}>{t("p.finance")}</Button>
                  )}
                </div>
                <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, marginTop: 16, marginBottom: 0 }}>{t("ch.cta.note")}</p>
              </div>

              <div style={{ marginTop: 18 }}>
                <TrustRow device={device} items={[
                  { icon: Icons.ship, label: t("p.trust.ship") },
                  { icon: Icons.shield, label: t("p.trust.warranty") },
                  { icon: Icons.install, label: t("p.trust.install") },
                  { icon: Icons.concierge, label: t("p.trust.support") },
                ]} />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div style={{ paddingTop: mobile ? 64 : 110 }}>
            <Reveal><Eyebrow>{t("p.benefits")}</Eyebrow></Reveal>
            <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 28 : 40, marginTop: 28 }}>
              {benefits.map(([h, b], i) => (
                <Reveal key={i} delay={i * 70} style={{ flex: 1 }}>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</div>
                    <div className="h3" style={{ marginTop: 12, fontWeight: 600 }}>{h}</div>
                    <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 10 }}>{b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div style={{ paddingTop: mobile ? 56 : 96, paddingBottom: mobile ? 56 : 110 }}>
            <Reveal><Eyebrow>{t("p.specs")}</Eyebrow></Reveal>
            <Reveal delay={60}>
              <div className="card" style={{ marginTop: 24, overflow: "hidden", background: "var(--surface-1)" }}>
                {specs.map((s, i) => {
                  const [k, v] = s[lang];
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1.4fr", gap: 16, padding: mobile ? "16px 18px" : "18px 26px", borderTop: i ? "1px solid var(--line-soft)" : "none", alignItems: "center" }}>
                      <span className="mono mono-sm" style={{ color: "var(--ink-3)" }}>{k}</span>
                      <span style={{ fontSize: 15, color: "var(--ink)", letterSpacing: "-0.01em" }}>{v}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  /* ============ BOOK ============ */
  function BookScreen({ device }) {
    const { t, go, lang, addToCart } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const MAXW = 1100;
    const prod = window.RETO_DATA.PRODUCTS.find((p) => p.id === "book");
    const c = prod[lang];
    const [qty, setQty] = useState(1);
    const chapters = lang === "es"
      ? ["Línea base & diagnóstico", "Recuperación bajo presión", "Sueño & sistema nervioso", "Fuerza & longevidad", "Claridad & enfoque", "El protocolo de 90 días"]
      : ["Baseline & diagnostics", "Recovery under pressure", "Sleep & nervous system", "Strength & longevity", "Clarity & focus", "The 90-day protocol"];

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 28 : 44 }}><Breadcrumb t={t} go={go} name={c.name} /></div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 32 : 64, marginTop: mobile ? 22 : 40, alignItems: "center" }}>
            {/* Cover */}
            <div style={{ position: "relative" }}>
              <div style={{ maxWidth: mobile ? 280 : 380, margin: mobile ? "0 auto" : 0, boxShadow: "var(--shadow-pop)", borderRadius: 6 }}>
                <ProductImage slotId="book-cover" label="PORTADA — El Método RETO" ratio="3 / 4.2" radius={6} />
              </div>
            </div>
            {/* Buy */}
            <div>
              <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{prod[lang].tagline} · {c.cat}</div>
              <h1 className="h1" style={{ fontSize: mobile ? 38 : 54, marginTop: 14 }}>{c.name}</h1>
              <p className="lede" style={{ marginTop: 16, maxWidth: 440 }}>{c.short}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                <Badge>{t("bk.format")}</Badge>
                <Badge dot>{t("bk.ship")}</Badge>
              </div>

              <div className="card" style={{ padding: mobile ? 20 : 24, marginTop: 26, background: "var(--surface-1)" }}>
                <PriceBlock pid="book" large />
                <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "stretch" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                    <QtyBtn onClick={() => setQty((q) => Math.max(1, q - 1))}>–</QtyBtn>
                    <span style={{ width: 40, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 15 }}>{qty}</span>
                    <QtyBtn onClick={() => setQty((q) => q + 1)}>+</QtyBtn>
                  </div>
                  <Button style={{ flex: 1 }} size="lg" onClick={() => { addToCart("book", qty); go("checkout"); }}>{t("p.buy")} {Icons.arrow}</Button>
                </div>
                <button onClick={() => { addToCart("book", qty); }} className="btn btn-ghost" style={{ marginTop: 12, width: "100%" }}>{t("p.add")}</button>
              </div>
            </div>
          </div>

          {/* Inside the book */}
          <div style={{ paddingTop: mobile ? 56 : 100, paddingBottom: mobile ? 56 : 100 }}>
            <Reveal><Eyebrow>{t("bk.about.h")}</Eyebrow></Reveal>
            <Reveal delay={60}><h2 className="h2" style={{ maxWidth: 620, marginTop: 18 }}>{t("bk.about.b")}</h2></Reveal>
            <Reveal delay={120}>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 0, marginTop: 36, border: "1px solid var(--line-soft)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                {chapters.map((ch, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: mobile ? "18px 20px" : "22px 26px", borderTop: (mobile ? i : i > 1) ? "1px solid var(--line-soft)" : "none", borderLeft: !mobile && i % 2 ? "1px solid var(--line-soft)" : "none", background: "var(--surface-1)", alignItems: "center" }}>
                    <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{ch}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  function QtyBtn({ children, onClick }) {
    return <button onClick={onClick} style={{ width: 44, height: 52, background: "none", border: "none", color: "var(--ink)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</button>;
  }

  window.ChamberScreen = ChamberScreen;
  window.BookScreen = BookScreen;
})();
