/* ============================================================
   RETO — Design System page  →  window.DesignSystemScreen
   ============================================================ */
(function () {
  const { useReto } = window;
  const { Logo, EKGLine, Button, Badge, Field, ProductImage, RegionSelector, Icons } = window.RetoUI;

  function Section({ k, title, desc, children }) {
    return (
      <div style={{ paddingTop: 56, borderTop: "1px solid var(--line-soft)" }}>
        <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{k}</div>
        <h2 className="h2" style={{ marginTop: 12, fontSize: 30 }}>{title}</h2>
        {desc && <p className="muted" style={{ maxWidth: 540, marginTop: 12, fontSize: 14.5 }}>{desc}</p>}
        <div style={{ marginTop: 32 }}>{children}</div>
      </div>
    );
  }

  function Swatch({ name, varName, hex, dark }) {
    return (
      <div style={{ border: "1px solid var(--line-soft)", borderRadius: 10, overflow: "hidden", background: "var(--surface-1)" }}>
        <div style={{ height: 76, background: hex, borderBottom: "1px solid var(--line-soft)" }} />
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 13.5, letterSpacing: "-0.01em" }}>{name}</div>
          <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 6 }}>{varName}</div>
          <div className="mono mono-sm" style={{ color: "var(--ink-3)", marginTop: 3 }}>{hex}</div>
        </div>
      </div>
    );
  }

  function DesignSystemScreen({ device }) {
    const { t } = useReto();
    const mobile = device === "mobile";
    const PAD = mobile ? "0 18px" : "0 40px";
    const grid = (min) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 14 });

    const typeScale = [
      ["Display", "clamp 44–104px / 700 / -0.03em", "display", "El futuro de la salud, hoy."],
      ["H1", "clamp 32–64px / 700", "h1", "Recuperación diseñada"],
      ["H2", "clamp 26–40px / 600", "h2", "Resultados medidos"],
      ["H3", "22px / 600", "h3", "Oxígeno hiperbárico"],
      ["Lede", "18px / 1.55 / ink-2", "lede", "Medicina preventiva premium para longevidad y rendimiento."],
      ["Body", "16px / 1.5", "", "Cámaras de carcasa rígida, diseñadas por RETO, para recuperación celular."],
      ["Mono label", "12px / 0.22em / uppercase", "mono", "STRENGTH · RECOVERY · CLARITY"],
    ];

    return (
      <div className="screen-enter">
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: PAD, paddingBottom: mobile ? 64 : 110 }}>
          {/* Intro */}
          <div style={{ paddingTop: mobile ? 40 : 64 }}>
            <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>Design System · v1</div>
            <h1 className="display" style={{ fontSize: mobile ? 44 : 80, marginTop: 14 }}>Tokens & components</h1>
            <p className="lede" style={{ maxWidth: 560, marginTop: 20 }}>
              {t("brand.mantra")} — un sistema monocromo, clínico y futurista. El cromo del logotipo es el único color; todo lo demás es blanco y negro hasta confirmar el hex de marca.
            </p>
            <div style={{ maxWidth: 460, marginTop: 28 }}><EKGLine height={24} /></div>
          </div>

          {/* Colors */}
          <Section k="01" title="Color" desc="Base negra absoluta, superficies elevadas en gris muy oscuro, hairlines en blanco translúcido. --accent permanece monocromo (plata fría) a la espera del hex de marca.">
            <div style={grid(150)}>
              <Swatch name="Stage" varName="--bg" hex="#000000" />
              <Swatch name="Surface 1" varName="--surface-1" hex="#08080A" />
              <Swatch name="Surface 2 (card)" varName="--surface-2" hex="#0E0E11" />
              <Swatch name="Surface 3" varName="--surface-3" hex="#151518" />
              <Swatch name="Ink" varName="--ink" hex="#F4F4F2" />
              <Swatch name="Ink 2" varName="--ink-2" hex="#B6B6B4" />
              <Swatch name="Ink 3 (mono)" varName="--ink-3" hex="#87878A" />
              <Swatch name="Accent (silver)" varName="--accent" hex="#EDEEF0" />
              <Swatch name="Positive" varName="--positive" hex="#8FE0B0" />
            </div>
            <div style={{ marginTop: 16, border: "1px solid var(--line-soft)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: 64, background: "var(--irid)" }} />
              <div style={{ padding: "12px 16px", background: "var(--surface-1)" }}>
                <div style={{ fontSize: 13.5 }}>Iridescent chrome · <span className="mono mono-sm">--irid</span></div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Uso reservado: logo, línea EKG, hairlines de hero, glints de foco. Nunca en bloques de texto.</div>
              </div>
            </div>
          </Section>

          {/* Type */}
          <Section k="02" title="Tipografía" desc="Helvetica Neue para display y cuerpo; IBM Plex Mono para etiquetas técnicas, precios y datos. Tracking negativo en titulares; tracking amplio en mono caps.">
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <Badge>Helvetica Neue · display + body</Badge>
              <Badge>IBM Plex Mono · labels + data</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--line-soft)", borderRadius: 12, overflow: "hidden" }}>
              {typeScale.map(([name, spec, cls, sample], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "200px 1fr", gap: 16, padding: mobile ? "18px 18px" : "22px 24px", borderTop: i ? "1px solid var(--line-soft)" : "none", background: "var(--surface-1)", alignItems: "baseline" }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{name}</div>
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 6 }}>{spec}</div>
                  </div>
                  <div className={cls} style={{ fontSize: cls === "display" ? 30 : cls === "h1" ? 26 : undefined, margin: 0, color: cls === "mono" ? "var(--ink-3)" : undefined }}>{sample}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Spacing / radius */}
          <Section k="03" title="Espaciado & radios" desc="Escala base de 4px. Radios ajustados (3–16px) para una sensación de precisión clínica.">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 30 }}>
              {[["1", 4], ["2", 8], ["3", 12], ["4", 16], ["5", 24], ["6", 32], ["7", 48], ["8", 64]].map(([n, px]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{ width: px, height: px, background: "var(--irid)", borderRadius: 3, opacity: 0.8 }} />
                  <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 8 }}>{px}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[["xs", 3], ["sm", 6], ["md", 10], ["lg", 16], ["pill", 999]].map(([n, r]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{ width: 64, height: 48, background: "var(--surface-3)", border: "1px solid var(--line)", borderRadius: r }} />
                  <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 8 }}>--r-{n}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Components */}
          <Section k="04" title="Componentes">
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {/* Buttons */}
              <CompBlock label="Button — primary · outline · ghost · sizes">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <Button>Primary {Icons.arrow}</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost {Icons.arrow}</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large CTA</Button>
                </div>
              </CompBlock>
              {/* Badges */}
              <CompBlock label="Badge — hairline · dot · iridescent">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Badge>Specification</Badge>
                  <Badge dot>In stock</Badge>
                  <Badge irid>Producto estrella</Badge>
                </div>
              </CompBlock>
              {/* Field */}
              <CompBlock label="Form field — label · input · select · invalid">
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, maxWidth: 560 }}>
                  <Field name="ds1" label="Email" placeholder="you@email.com" />
                  <Field name="ds2" label="Country"><select className="reto-input"><option>United States</option><option>España</option></select></Field>
                  <Field name="ds3" label="Postal code" error="Requerido" value="" onChange={() => {}} />
                  <Field name="ds4" label="Phone" placeholder="+1 305 000 0000" />
                </div>
              </CompBlock>
              {/* Region selector + nav */}
              <CompBlock label="Region selector (nav)">
                <div style={{ display: "inline-flex" }}><RegionSelector /></div>
              </CompBlock>
              {/* Product card */}
              <CompBlock label="Product card">
                <div style={{ maxWidth: 300 }}>
                  <div className="card" style={{ padding: 16 }}>
                    <ProductImage slotId="ds-card" label="PRODUCTO" ratio="4 / 3" radius={10} />
                    <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginTop: 14 }}>Recovery Hardware</div>
                    <div className="h3" style={{ marginTop: 8, fontSize: 19 }}>Cámara Hiperbárica</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>$64,900 <span className="mono mono-sm" style={{ color: "var(--ink-4)" }}>USD</span></span>
                      <span style={{ color: "var(--ink-3)" }}>{Icons.arrow}</span>
                    </div>
                  </div>
                </div>
              </CompBlock>
              {/* EKG */}
              <CompBlock label="Heartbeat / EKG motif">
                <div style={{ maxWidth: 420 }}><EKGLine height={28} /></div>
              </CompBlock>
            </div>
          </Section>
        </section>
      </div>
    );
  }

  function CompBlock({ label, children }) {
    return (
      <div>
        <div className="mono mono-sm" style={{ color: "var(--ink-4)", marginBottom: 18 }}>{label}</div>
        {children}
      </div>
    );
  }

  window.DesignSystemScreen = DesignSystemScreen;
})();
