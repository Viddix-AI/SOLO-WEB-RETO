/* ============================================================
   RETO — Shop / Marketplace  →  window.ShopScreen
   ============================================================ */
(function () {
  const { useReto } = window;
  const { Button, Badge, Eyebrow, ProductImage, Reveal, Icons } = window.RetoUI;
  const { useState } = React;

  function Price({ pid, large }) {
    const { fmtProductPrice, t } = useReto();
    const p = fmtProductPrice(pid);
    if (p.onRequest) return <span className="mono" style={{ color: "var(--ink-2)", fontSize: large ? 13 : 11.5 }}>{t("p.onrequest")}</span>;
    return (
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: large ? 17 : 14, color: "var(--ink)", letterSpacing: "0.01em" }}>{p.display}</span>
        <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{p.note}</span>
      </span>
    );
  }

  function ShopScreen({ device }) {
    const { t, go, lang, regionData } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const MAXW = 1320;
    const [filter, setFilter] = useState("all");
    const products = window.RETO_DATA.PRODUCTS;
    const filters = [["all", t("shop.all")], ["hardware", t("shop.hardware")], ["book", t("shop.books")]];
    const visible = products.filter((p) => filter === "all" || p.kind === filter || (filter === "book" && p.kind === "book"));
    const hero = products.find((p) => p.id === "chamber");
    const rest = visible.filter((p) => !p.hero);

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
          {/* Header */}
          <div style={{ paddingTop: mobile ? 40 : 64, paddingBottom: mobile ? 24 : 36 }}>
            <Eyebrow>{t("shop.k")}</Eyebrow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
              <h1 className="display" style={{ fontSize: mobile ? 44 : 80 }}>{t("shop.h")}</h1>
              <div className="mono mono-sm" style={{ color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8, paddingBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--positive)", flexShrink: 0 }} />
                <span>{t("shop.region.note")} {regionData.label} · {regionData.currency}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, paddingBottom: mobile ? 24 : 32, borderBottom: "1px solid var(--line-soft)", overflowX: "auto" }} className="reto-scroll">
            {filters.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)}
                style={{
                  background: filter === k ? "var(--accent)" : "transparent",
                  color: filter === k ? "var(--accent-ink)" : "var(--ink-2)",
                  border: "1px solid " + (filter === k ? "var(--accent)" : "var(--line)"),
                  borderRadius: 999, padding: "9px 18px", fontFamily: "var(--font-mono)",
                  fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "all .2s",
                }}>{label}</button>
            ))}
          </div>

          {/* HERO product — Chamber */}
          {(filter === "all" || filter === "hardware") && (
            <Reveal>
              <button onClick={() => go("chamber")} className="card"
                style={{ width: "100%", textAlign: "left", marginTop: mobile ? 28 : 40, padding: 0, overflow: "hidden", cursor: "pointer", background: "var(--surface-2)", display: "block" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--line-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1.05fr 1fr", gap: 0 }}>
                  <div style={{ padding: mobile ? 16 : 28 }}>
                    <ProductImage slotId="shop-chamber" label="PRODUCTO ESTRELLA — cámara hiperbárica" ratio={mobile ? "4 / 3" : "1 / 1"} radius={12} />
                  </div>
                  <div style={{ padding: mobile ? "8px 20px 28px" : "44px 44px 44px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                      <Badge irid>{t("shop.hero.k")}</Badge>
                    </div>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{hero[lang].cat}</div>
                    <h2 className="h1" style={{ fontSize: mobile ? 34 : 52, marginTop: 12 }}>{hero[lang].name}</h2>
                    <p className="lede" style={{ maxWidth: 420, marginTop: 16, fontSize: 16 }}>{hero[lang].short}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
                      <Price pid="chamber" large />
                      <span className="btn btn-outline btn-sm" style={{ pointerEvents: "none" }}>{t("shop.view")} {Icons.arrow}</span>
                    </div>
                  </div>
                </div>
              </button>
            </Reveal>
          )}

          {/* Grid — remaining products */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: mobile ? 18 : 24, marginTop: mobile ? 18 : 24, paddingBottom: mobile ? 56 : 100 }}>
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} lang={lang} t={t} go={go} mobile={mobile} Price={Price} />
              </Reveal>
            ))}
            {/* Coming soon placeholder cards to fill the grid rhythm */}
            {filter === "all" && [0, 1].map((i) => (
              <Reveal key={"soon" + i} delay={(rest.length + i) * 60}>
                <div className="card" style={{ padding: mobile ? 16 : 18, opacity: 0.6, display: "flex", flexDirection: "column", height: "100%" }}>
                  <ProductImage slotId={"soon-" + i} label={i === 0 ? "RECOVERY — próximamente" : "DIAGNÓSTICO — próximamente"} ratio="4 / 3" radius={10} />
                  <div style={{ marginTop: 16 }}>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{lang === "es" ? "Próximamente" : "Coming soon"}</div>
                    <div className="h3" style={{ marginTop: 8, fontSize: 19, color: "var(--ink-2)" }}>{i === 0 ? (lang === "es" ? "Kit de Recuperación" : "Recovery Kit") : (lang === "es" ? "Panel Diagnóstico" : "Diagnostic Panel")}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function ProductCard({ product, lang, t, go, mobile, Price }) {
    const c = product[lang];
    return (
      <button onClick={() => go(product.id)} className="card"
        style={{ textAlign: "left", padding: mobile ? 16 : 18, cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", background: "var(--surface-2)" }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--line-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
        <ProductImage slotId={"card-" + product.id} label={c.name.toUpperCase()} ratio="4 / 3" radius={10} />
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", flex: 1 }}>
          <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{c.cat}</div>
          <div className="h3" style={{ marginTop: 8, fontSize: 20 }}>{c.name}</div>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, margin: "10px 0 0" }}>{c.short}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
            <Price pid={product.id} />
            <span style={{ color: "var(--ink-3)", display: "inline-flex" }}>{window.RetoUI.Icons.arrow}</span>
          </div>
        </div>
      </button>
    );
  }

  window.ShopScreen = ShopScreen;
})();
