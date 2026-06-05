/* ============================================================
   RETO — App shell: context, navigation, device frame, control rail
   ============================================================ */
(function () {
  const { useState, useEffect, useCallback } = React;
  const { RegionSelector } = window.RetoUI;
  const D = window.RETO_DATA;

  const LS = {
    get: (k, d) => { try { const v = localStorage.getItem("reto." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem("reto." + k, JSON.stringify(v)); } catch {} },
  };

  const SCREENS = {
    home: { c: () => window.HomeScreen, chrome: true, label: "Home" },
    shop: { c: () => window.ShopScreen, chrome: true, label: "Tienda" },
    chamber: { c: () => window.ChamberScreen, chrome: true, label: "Cámara" },
    book: { c: () => window.BookScreen, chrome: true, label: "Libro" },
    request: { c: () => window.RequestScreen, chrome: true, label: "Solicitar" },
    checkout: { c: () => window.CheckoutScreen, chrome: true, label: "Checkout" },
    confirmation: { c: () => window.ConfirmationScreen, chrome: true, label: "Confirmación" },
    ds: { c: () => window.DesignSystemScreen, chrome: false, label: "Design System" },
  };
  const RAIL_TABS = ["home", "shop", "chamber", "book", "checkout", "confirmation", "ds"];

  function App() {
    const [region, setRegionState] = useState(() => LS.get("region", "US"));
    const [device, setDeviceState] = useState(() => LS.get("device", "desktop"));
    const [screen, setScreen] = useState("home");
    const [params, setParams] = useState(null);
    const [cart, setCart] = useState(() => LS.get("cart", [{ id: "chamber", qty: 1 }]));

    const regionData = D.REGIONS[region];
    const lang = regionData.lang;

    const setRegion = (r) => { setRegionState(r); LS.set("region", r); };
    const setDevice = (d) => { setDeviceState(d); LS.set("device", d); };
    useEffect(() => { LS.set("cart", cart); }, [cart]);

    const t = useCallback((key) => {
      const dict = D.T[lang] || D.T.en;
      return dict[key] != null ? dict[key] : (D.T.en[key] != null ? D.T.en[key] : key);
    }, [lang]);

    const fmtProductPrice = useCallback((pid) => {
      const e = (D.PRICES[pid] || {})[region] || {};
      return { display: e.display, note: e.note, onRequest: !!e.onRequest, value: e.value };
    }, [region]);

    const go = useCallback((s, p = null) => {
      setScreen(s); setParams(p);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    }, []);

    const addToCart = useCallback((id, qty = 1) => {
      setCart((c) => {
        const ex = c.find((i) => i.id === id);
        if (ex) return c.map((i) => i.id === id ? { ...i, qty: i.qty + qty } : i);
        return [...c, { id, qty }];
      });
    }, []);
    const clearCart = useCallback(() => setCart([]), []);

    const ctx = { region, setRegion, regionData, lang, t, fmtProductPrice, go, screen, cart, addToCart, clearCart, device };

    const meta = SCREENS[screen];
    const ScreenComp = meta.c();
    const { Nav, Footer, Ticker } = window.RetoUI;
    const isMobile = device === "mobile";
    const frameW = isMobile ? 402 : 1280;

    return (
      <window.RetoContext.Provider value={ctx}>
        {/* Control rail (presentation chrome) */}
        <ControlRail screen={screen} go={go} device={device} setDevice={setDevice} region={region} setRegion={setRegion} t={t} />

        {/* Stage */}
        <div style={{ paddingTop: 56, background: "#000", minHeight: "100vh" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: isMobile ? "26px 16px 60px" : "24px 16px 60px" }}>
            <div style={{
              width: "100%", maxWidth: frameW,
              border: isMobile ? "1px solid var(--line)" : "1px solid var(--line-soft)",
              borderRadius: isMobile ? 30 : 14, overflow: "hidden",
              background: "var(--bg)", boxShadow: "var(--shadow-pop)",
            }}>
              {isMobile && <NotchBar />}
              <div key={screen + region} className="reto-app">
                {meta.chrome && <Nav device={device} />}
                <ScreenComp device={device} params={params} />
                {meta.chrome && screen !== "confirmation" && <Footer device={device} />}
              </div>
            </div>
          </div>
        </div>
      </window.RetoContext.Provider>
    );
  }

  function NotchBar() {
    return (
      <div style={{ height: 38, background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", borderBottom: "1px solid var(--line-soft)" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.02em" }}>9:41</span>
        <span style={{ width: 78, height: 18, background: "#000", border: "1px solid var(--line-soft)", borderRadius: 99, position: "absolute", left: "50%", transform: "translateX(-50%)" }} />
        <span style={{ display: "flex", gap: 5, alignItems: "center", color: "var(--ink-2)" }}>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="6" rx="0.5"/><rect x="8" y="3" width="3" height="8" rx="0.5"/><rect x="12" y="1" width="3" height="10" rx="0.5" opacity="0.4"/></svg>
          <svg width="22" height="11" viewBox="0 0 24 12" fill="none" stroke="currentColor"><rect x="0.5" y="1" width="20" height="10" rx="2.5" opacity="0.5"/><rect x="2" y="2.5" width="15" height="7" rx="1" fill="currentColor"/><rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>
        </span>
      </div>
    );
  }

  function ControlRail({ screen, go, device, setDevice, region, setRegion, t }) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 56, zIndex: 100,
        background: "#060607", borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <span className="mono mono-sm" style={{ color: "var(--ink-4)", whiteSpace: "nowrap" }}>RETO · PROTOTYPE</span>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }} className="reto-scroll">
            {RAIL_TABS.map((s) => {
              const active = s === screen || (screen === "request" && s === "chamber");
              return (
                <button key={s} onClick={() => go(s)}
                  style={{
                    background: active ? "rgba(255,255,255,0.08)" : "transparent", border: "none",
                    borderRadius: 7, padding: "7px 11px", whiteSpace: "nowrap",
                    fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: active ? "var(--ink)" : "var(--ink-3)", transition: "all .15s",
                  }}>{SCREENS[s].label}</button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {/* Device toggle */}
          <div style={{ display: "flex", background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 8, padding: 2 }}>
            {[["mobile", "Mobile"], ["desktop", "Desktop"]].map(([d, label]) => (
              <button key={d} onClick={() => setDevice(d)}
                style={{
                  background: device === d ? "var(--accent)" : "transparent", color: device === d ? "var(--accent-ink)" : "var(--ink-3)",
                  border: "none", borderRadius: 6, padding: "6px 12px", fontFamily: "var(--font-mono)",
                  fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all .15s",
                }}>{label}</button>
            ))}
          </div>
          <RegionSelector compact />
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
