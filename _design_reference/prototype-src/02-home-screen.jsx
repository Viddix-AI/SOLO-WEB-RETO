/* ============================================================
   RETO — Home / Landing screen  →  window.HomeScreen
   ============================================================ */
(function () {
  const { useReto } = window;
  const { Logo, EKGLine, Button, Badge, Eyebrow, ProductImage, Reveal, Ticker, Icons } = window.RetoUI;

  function PriceTag({ pid }) {
    const { region, fmtProductPrice, t } = useReto();
    const p = fmtProductPrice(pid);
    if (p.onRequest) return <span className="mono" style={{ color: "var(--ink-2)", fontSize: 12 }}>{t("p.onrequest")}</span>;
    return <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink)" }}>{t("shop.from")} {p.display}</span>;
  }

  function SciCard({ n, h, b, mobile }) {
    return (
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 22, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{n}</div>
        <div className="h3" style={{ fontWeight: 600 }}>{h}</div>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{b}</p>
      </div>
    );
  }

  function HomeScreen({ device }) {
    const { t, go } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const MAXW = 1320;

    return (
      <div className="screen-enter">
        {/* HERO */}
        <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line-soft)" }}>
          <div className="grid-lines" style={{ position: "absolute", inset: 0, opacity: 0.5, "--col": mobile ? "44px" : "90px",
            maskImage: "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 78%)" }} />
          <div style={{ position: "relative", maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1.15fr 0.85fr", gap: mobile ? 36 : 56, alignItems: "center", paddingTop: mobile ? 56 : 96, paddingBottom: mobile ? 56 : 100 }}>
              <div>
                <Reveal>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--positive)", flexShrink: 0 }} />
                    <Eyebrow>{t("home.eyebrow")}</Eyebrow>
                  </div>
                </Reveal>
                <Reveal delay={60}>
                  <h1 className="display" style={{ margin: mobile ? "26px 0 0" : "30px 0 0" }}>
                    {t("home.h1a")}<br /><span className="irid-text">{t("home.h1b")}</span>
                  </h1>
                </Reveal>
                <Reveal delay={120}>
                  <div style={{ maxWidth: 460, margin: "26px 0 0" }}>
                    <EKGLine height={22} />
                  </div>
                </Reveal>
                <Reveal delay={160}>
                  <p className="lede" style={{ maxWidth: 480, marginTop: 24 }}>{t("home.sub")}</p>
                </Reveal>
                <Reveal delay={220}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
                    <Button size="lg" onClick={() => go("shop")}>{t("home.cta")} {Icons.arrow}</Button>
                    <Button variant="outline" size="lg" onClick={() => go("chamber")}>{t("home.cta2")}</Button>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={120} style={{ position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <ProductImage slotId="img-hero" label="HERO — cámara hiperbárica sobre negro" ratio={mobile ? "4 / 3" : "3 / 4"} radius={16} />
                  <div style={{ position: "absolute", left: 14, bottom: 14, display: "flex", gap: 8 }}>
                    <Badge irid>{t("brand.mantra")}</Badge>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Ticker />

        {/* SCIENCE */}
        <section id="science" style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 64 : 110, paddingBottom: mobile ? 24 : 40 }}>
            <Reveal><Eyebrow>{t("home.science.k")}</Eyebrow></Reveal>
            <Reveal delay={60}>
              <h2 className="h1" style={{ maxWidth: 760, marginTop: 18 }}>{t("home.science.h")}</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="lede" style={{ maxWidth: 560, marginTop: 20 }}>{t("home.science.b")}</p>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 28 : 44, paddingBottom: mobile ? 56 : 96 }}>
              <SciCard n="01" h={t("home.s1.h")} b={t("home.s1.b")} mobile={mobile} />
              <SciCard n="02" h={t("home.s2.h")} b={t("home.s2.b")} mobile={mobile} />
              <SciCard n="03" h={t("home.s3.h")} b={t("home.s3.b")} mobile={mobile} />
            </div>
          </Reveal>
        </section>

        {/* SOCIAL PROOF */}
        <section style={{ borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)", background: "var(--surface-1)" }}>
          <div style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
            <div style={{ paddingTop: mobile ? 48 : 80, paddingBottom: mobile ? 48 : 80 }}>
              <Reveal><Eyebrow>{t("home.proof.k")}</Eyebrow></Reveal>
              <Reveal delay={80}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: mobile ? 22 : 52, alignItems: "center", marginTop: 28, opacity: 0.82 }}>
                  {["NBA", "LaLiga", "UFC", "Olympic", "F1"].map((m) => (
                    <span key={m} style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: mobile ? 20 : 28, letterSpacing: "-0.02em", color: "var(--ink-2)" }}>{m}</span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={140}>
                <p style={{ maxWidth: 680, marginTop: 34, fontSize: mobile ? 19 : 24, lineHeight: 1.5, letterSpacing: "-0.01em", color: "var(--ink)" }}>
                  {t("home.proof.b")}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PRODUCTS TEASER */}
        <section style={{ maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
          <div style={{ paddingTop: mobile ? 64 : 110 }}>
            <Reveal>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <Eyebrow>{t("home.products.k")}</Eyebrow>
                  <h2 className="h1" style={{ marginTop: 16 }}>{t("home.products.h")}</h2>
                </div>
                <Button variant="ghost" onClick={() => go("shop")}>{t("home.products.cta")} {Icons.arrow}</Button>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1.4fr 1fr", gap: mobile ? 20 : 24, marginTop: 34, paddingBottom: mobile ? 56 : 100 }}>
                <TeaserCard pid="chamber" big onClick={() => go("chamber")} PriceTag={PriceTag} t={t} mobile={mobile} />
                <TeaserCard pid="book" onClick={() => go("book")} PriceTag={PriceTag} t={t} mobile={mobile} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* CLINICS */}
        <section style={{ borderTop: "1px solid var(--line-soft)", position: "relative", overflow: "hidden" }}>
          <div className="grid-lines" style={{ position: "absolute", inset: 0, opacity: 0.4, "--col": mobile ? "44px" : "90px",
            maskImage: "radial-gradient(120% 120% at 50% 100%, #000 20%, transparent 75%)", WebkitMaskImage: "radial-gradient(120% 120% at 50% 100%, #000 20%, transparent 75%)" }} />
          <div style={{ position: "relative", maxWidth: MAXW, margin: "0 auto", padding: PAD }}>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 32 : 56, alignItems: "center", paddingTop: mobile ? 64 : 110, paddingBottom: mobile ? 64 : 110 }}>
              <div>
                <Reveal><Eyebrow>{t("home.clinics.k")}</Eyebrow></Reveal>
                <Reveal delay={60}><h2 className="display" style={{ fontSize: mobile ? 40 : 64, marginTop: 18 }}>{t("home.clinics.h")}</h2></Reveal>
                <Reveal delay={120}><p className="lede" style={{ maxWidth: 420, marginTop: 20 }}>{t("home.clinics.b")}</p></Reveal>
                <Reveal delay={180}>
                  <div style={{ marginTop: 30 }}><Button size="lg" onClick={() => go("shop")}>{t("home.cta.final")} {Icons.arrow}</Button></div>
                </Reveal>
              </div>
              <Reveal delay={120}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <ProductImage slotId="img-clinic-mia" label="CLÍNICA — Miami" ratio="3 / 4" radius={14} />
                  <ProductImage slotId="img-clinic-mad" label="CLÍNICA — Madrid" ratio="3 / 4" radius={14} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function TeaserCard({ pid, big, onClick, PriceTag, t, mobile }) {
    const { lang } = useReto();
    const prod = window.RETO_DATA.PRODUCTS.find((p) => p.id === pid);
    const c = prod[lang];
    return (
      <button onClick={onClick} className="card" style={{ textAlign: "left", padding: 0, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", background: "var(--surface-2)" }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--line-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
        <div style={{ padding: big && !mobile ? 24 : 16 }}>
          <ProductImage slotId={"teaser-" + pid} label={(big ? "PRODUCTO ESTRELLA — " : "") + c.name.toUpperCase()} ratio={big ? (mobile ? "4 / 3" : "16 / 11") : "4 / 3"} radius={10} />
        </div>
        <div style={{ padding: big && !mobile ? "4px 24px 24px" : "4px 18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <div>
            <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{c.cat}{prod.hero ? " · " + t("shop.featured") : ""}</div>
            <div className="h3" style={{ marginTop: 8, fontSize: big ? (mobile ? 22 : 26) : 20 }}>{c.name}</div>
          </div>
          <PriceTag pid={pid} />
        </div>
      </button>
    );
  }

  window.HomeScreen = HomeScreen;
})();
