/* ============================================================
   RETO — Shared UI components  →  window.RetoUI, window.useReto
   ============================================================ */
const RetoContext = React.createContext(null);
window.RetoContext = RetoContext;
const useReto = () => React.useContext(RetoContext);
window.useReto = useReto;

const { useState, useEffect, useRef } = React;

/* ---------- Logo ---------- */
function Logo({ height = 26, onClick, className = "" }) {
  const src = (window.__resources && window.__resources.retoLogo) ? window.__resources.retoLogo : "assets/reto-logo.png";
  return (
    <img
      src={src}
      alt="RETO Health & Performance"
      onClick={onClick}
      className={className}
      style={{ height, width: "auto", cursor: onClick ? "pointer" : "default", userSelect: "none" }}
      draggable={false}
    />
  );
}

/* ---------- EKG / heartbeat line ---------- */
function EKGLine({ height = 28, color = "irid", strokeWidth = 2, animate = true, className = "", style = {} }) {
  const id = useRef("ekg" + Math.random().toString(36).slice(2, 7)).current;
  const path = "M0 24 H78 l7 -16 l8 34 l9 -44 l8 30 l6 -4 H260";
  return (
    <svg viewBox="0 0 260 48" preserveAspectRatio="none" height={height} width="100%"
      className={className} style={{ display: "block", overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7FE3D2" />
          <stop offset="35%" stopColor="#BFC6D6" />
          <stop offset="60%" stopColor="#E9C9E4" />
          <stop offset="100%" stopColor="#9FD8CF" />
        </linearGradient>
      </defs>
      <path d={path} fill="none"
        stroke={color === "irid" ? `url(#${id})` : color}
        strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"
        vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------- Button ---------- */
function Button({ variant = "primary", size = "", block, children, className = "", ...rest }) {
  const cls = ["btn", `btn-${variant}`, size && `btn-${size}`, block && "btn-block", className]
    .filter(Boolean).join(" ");
  return <button className={cls} {...rest}>{children}</button>;
}

/* ---------- Badge ---------- */
function Badge({ children, dot, irid, className = "" }) {
  if (irid) return <span className={"badge-irid " + className}><span>{children}</span></span>;
  return <span className={"badge " + className}>{dot && <span className="dot" />}{children}</span>;
}

/* ---------- Eyebrow / mono label ---------- */
function Eyebrow({ children, style }) {
  return <div className="mono" style={{ color: "var(--ink-3)", ...style }}>{children}</div>;
}

/* ---------- Field ---------- */
function Field({ label, type = "text", value, onChange, placeholder, error, required, autoComplete, name, full, half, children, ...rest }) {
  const cls = ["field", error && "invalid"].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ gridColumn: full ? "1 / -1" : half ? "span 1" : undefined }}>
      {label && <label htmlFor={name}>{label}{required && <span style={{ color: "var(--ink-4)" }}> *</span>}</label>}
      {children ? children : (
        <input id={name} name={name} className="reto-input" type={type} value={value}
          onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} {...rest} />
      )}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

/* ---------- Product image (user-fillable slot) ---------- */
function ProductImage({ slotId, label, shape = "rounded", radius = 14, ratio = "1 / 1", style = {}, fit = "cover" }) {
  return (
    <div style={{ position: "relative", aspectRatio: ratio, width: "100%", ...style }}>
      <image-slot
        id={slotId}
        shape={shape}
        radius={radius}
        fit={fit}
        placeholder={label}
        style={{ width: "100%", height: "100%", "--is-bg": "var(--surface-1)" }}
      ></image-slot>
    </div>
  );
}

/* ---------- Striped image placeholder (no upload) ---------- */
function ImgPlaceholder({ label, ratio = "1 / 1", radius = 14, className = "", style = {} }) {
  return (
    <div className={"img-ph " + className}
      style={{ aspectRatio: ratio, borderRadius: radius, ...style }}>
      <span className="ph-label">{label}</span>
    </div>
  );
}

/* ---------- Reveal on scroll (rect-based; IO is unreliable in-frame) ---------- */
function Reveal({ children, delay = 0, as = "div", className = "", style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let done = false;
    const check = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < h * 0.94 && r.bottom > 0) {
        done = true; setSeen(true);
        window.removeEventListener("scroll", check, true);
        window.removeEventListener("resize", check);
      }
    };
    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, true);
    window.addEventListener("resize", check);
    const fallback = setTimeout(() => { if (!done) { done = true; setSeen(true); } }, 1600);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(fallback);
      window.removeEventListener("scroll", check, true);
      window.removeEventListener("resize", check);
    };
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={"reveal " + (seen ? "in " : "") + className}
      style={{ transitionDelay: seen ? delay + "ms" : "0ms", ...style }}>
      {children}
    </Tag>
  );
}

/* ---------- Region selector ---------- */
function RegionSelector({ compact }) {
  const { region, setRegion, regionData } = useReto();
  const { REGIONS, REGION_ORDER } = window.RETO_DATA;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "transparent",
          border: "1px solid var(--line)", borderRadius: 999, padding: compact ? "6px 10px" : "8px 14px",
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ink-2)",
          textTransform: "uppercase", transition: "border-color .2s",
        }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--positive)" }} />
        {regionData.short}
        <svg width="9" height="6" style={{ marginLeft: 2, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" strokeWidth="1.2" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 220, zIndex: 60,
          background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12,
          padding: 6, boxShadow: "var(--shadow-pop)",
        }}>
          <div className="mono mono-sm" style={{ padding: "8px 12px 6px", color: "var(--ink-4)" }}>Región · Region</div>
          {REGION_ORDER.map((rid) => {
            const r = REGIONS[rid]; const active = rid === region;
            return (
              <button key={rid} onClick={() => { setRegion(rid); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  background: active ? "rgba(255,255,255,0.05)" : "transparent", border: "none",
                  borderRadius: 8, padding: "11px 12px", textAlign: "left", color: "var(--ink)",
                }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ fontSize: 14, letterSpacing: "-0.01em" }}>{r.label}</span>
                  <span className="mono mono-sm" style={{ color: "var(--ink-3)" }}>{r.short}</span>
                </span>
                {active && <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--positive)" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Cart button ---------- */
function CartButton() {
  const { cart, t, go } = useReto();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  return (
    <button onClick={() => go(count ? "checkout" : "shop")}
      style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "var(--ink-2)", padding: 4 }}>
      <span style={{ position: "relative", display: "inline-flex" }}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 4h2l2.4 12.5a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 7H6" />
          <circle cx="9" cy="20.5" r="1.1" /><circle cx="18" cy="20.5" r="1.1" />
        </svg>
        {count > 0 && (
          <span style={{
            position: "absolute", top: -7, right: -9, minWidth: 16, height: 16, padding: "0 4px",
            borderRadius: 99, background: "var(--accent)", color: "var(--accent-ink)",
            fontFamily: "var(--font-mono)", fontSize: 9.5, display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 600,
          }}>{count}</span>
        )}
      </span>
    </button>
  );
}

/* ---------- Navigation header ---------- */
function Nav({ device }) {
  const { t, go, screen } = useReto();
  const [open, setOpen] = useState(false);
  const isMobile = device === "mobile";
  const links = [
    { k: "nav.shop", s: "shop" },
    { k: "nav.science", s: "home", hash: "science" },
    { k: "nav.method", s: "book" },
    { k: "nav.clinics", s: "home", hash: "clinics" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      background: "rgba(0,0,0,0.62)", borderBottom: "1px solid var(--line-soft)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 18px" : "18px 40px", maxWidth: 1320, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Logo height={isMobile ? 20 : 24} onClick={() => go("home")} />
          {!isMobile && (
            <nav style={{ display: "flex", gap: 28 }}>
              {links.map((l) => (
                <button key={l.k} onClick={() => go(l.s)}
                  style={{
                    background: "none", border: "none", padding: "4px 0",
                    fontFamily: "var(--font-mono)", fontSize: 11.5, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--ink-3)", transition: "color .2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-3)"}>
                  {t(l.k)}
                </button>
              ))}
            </nav>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 14 : 18 }}>
          {!isMobile && <RegionSelector />}
          <CartButton />
          {isMobile && (
            <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", padding: 4, color: "var(--ink)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                {open ? <path d="M5 5l14 14M19 5L5 19" /> : <><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h18" /></>}
              </svg>
            </button>
          )}
        </div>
      </div>
      {isMobile && open && (
        <div style={{ borderTop: "1px solid var(--line-soft)", padding: "16px 18px 22px", background: "rgba(0,0,0,0.9)" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((l) => (
              <button key={l.k} onClick={() => { go(l.s); setOpen(false); }}
                style={{ background: "none", border: "none", textAlign: "left", padding: "12px 0", color: "var(--ink)", fontSize: 17, letterSpacing: "-0.01em" }}>
                {t(l.k)}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 16 }}><RegionSelector /></div>
        </div>
      )}
    </header>
  );
}

/* ---------- Triad ticker ---------- */
function Ticker() {
  const { t } = useReto();
  const item = t("brand.triad");
  const seq = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)", padding: "14px 0" }}>
      <div className="ticker-track">
        {[0, 1].map((g) => (
          <div key={g} style={{ display: "inline-flex", alignItems: "center" }}>
            {seq.map((i) => (
              <span key={i} className="mono" style={{ padding: "0 28px", color: "var(--ink-3)", fontSize: 12 }}>
                {item}<span style={{ margin: "0 0 0 28px", color: "var(--ink-4)" }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer({ device }) {
  const { t, go } = useReto();
  const isMobile = device === "mobile";
  return (
    <footer style={{ borderTop: "1px solid var(--line-soft)", padding: isMobile ? "40px 18px 36px" : "64px 40px 44px", background: "var(--surface-1)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 28 }}>
          <div style={{ maxWidth: 320 }}>
            <Logo height={22} />
            <p className="muted" style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6 }}>{t("ft.tag")}</p>
            <div className="mono mono-sm" style={{ marginTop: 14 }}>{t("brand.locations")}</div>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 40 : 64 }}>
            <FooterCol title={t("nav.shop")} items={[["nav.shop", "shop"], ["nav.method", "book"]]} go={go} t={t} />
            <FooterCol title={t("nav.science")} items={[["nav.science", "home"], ["nav.clinics", "home"]]} go={go} t={t} />
          </div>
        </div>
        <div className="hairline" style={{ margin: "32px 0 18px" }} />
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 10 }}>
          <div className="mono mono-sm">{t("ft.rights")}</div>
          <div className="mono mono-sm" style={{ color: "var(--ink-4)" }}>{t("brand.triad")}</div>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items, go, t }) {
  return (
    <div>
      <div className="mono mono-sm" style={{ marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(([k, s], i) => (
          <button key={i} onClick={() => go(s)} style={{ background: "none", border: "none", padding: 0, textAlign: "left", color: "var(--ink-2)", fontSize: 14 }}>{t(k)}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Trust row ---------- */
function TrustRow({ items, device }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: device === "mobile" ? "1fr 1fr" : `repeat(${items.length}, 1fr)`, gap: 1, background: "var(--line-soft)", border: "1px solid var(--line-soft)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: "var(--surface-1)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "var(--ink-2)", display: "inline-flex" }}>{it.icon}</span>
          <span className="mono mono-sm" style={{ color: "var(--ink-2)" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Small inline icons */
const Icons = {
  ship: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="17.5" r="1.4" /><circle cx="17.5" cy="17.5" r="1.4" /></svg>,
  shield: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>,
  install: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M14 6l4 4M3 21l4-1 11-11-3-3L4 17z" /></svg>,
  lock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  concierge: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
};
window.Icons = Icons;

window.RetoUI = { Logo, EKGLine, Button, Badge, Eyebrow, Field, ProductImage, ImgPlaceholder, Reveal, RegionSelector, CartButton, Nav, Ticker, Footer, TrustRow, Icons };
