# Prototype source — JSX original del prototipo aprobado

Estos son los componentes React reales del prototipo `RETO Health Storefront`, ya
desempaquetados (Babel/JSX, sin compilar). Son la **referencia de maquetación**: porta
la estructura, jerarquía visual, clases y microcopy tal cual; NO reinventes el layout.

Reglas al portar a Next 15 + TS:
- Usa los tokens de `../design-tokens.css` y el i18n/regiones ya creados en el Bloque A
  (`src/lib/...`). Sustituye `useReto()`/`window.RETO_DATA`/`window.RetoUI` por tus hooks
  y módulos tipados equivalentes.
- Convierte a TypeScript y componentes server/client según corresponda (los que usan
  estado/efectos → `"use client"`).
- IGNORA el andamiaje de presentación: `07-app-shell.jsx` (ControlRail, device-frame,
  NotchBar) y `06-design-system.jsx` (Design System interno) NO van a producción.
- Las imágenes usan `<image-slot>` / `.img-ph` (placeholders rayados): mantén placeholders
  con la misma estética hasta tener los activos reales.

## Mapa de archivos

| Archivo | Define | Portar |
|---|---|---|
| `01-ui-components.jsx` | Nav, Footer, Logo, RegionSelector, Button, Badge, Field, Eyebrow, Ticker, TrustRow, ProductImage, EKGLine, Icons | Sí — base UI compartida |
| `02-home-screen.jsx` | HomeScreen + SciCard, TeaserCard, PriceTag | Sí — Bloque B |
| `03-shop-screen.jsx` | ShopScreen + ProductCard, Price | Sí — Bloque C |
| `04-chamber-book-screens.jsx` | ChamberScreen, BookScreen + Breadcrumb, PriceBlock, QtyBtn | Sí — Bloque C |
| `05-request-checkout-confirmation.jsx` | RequestScreen, CheckoutScreen, ConfirmationScreen + AddressFields, OrderSummary, Toggle | Parcial — Request/Checkout maqueta en C/D, lógica de pago en D |
| `06-design-system.jsx` | DesignSystemScreen | No — solo interno |
| `07-app-shell.jsx` | App, ControlRail, NotchBar | No — andamiaje del prototipo |
