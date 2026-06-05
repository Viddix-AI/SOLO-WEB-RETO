/* ============================================================
   RETO — Data layer: regions, i18n copy, products
   Exposes window.RETO_DATA
   ============================================================ */
(function () {
  // ---- Regions: language + currency + pricing ----
  const REGIONS = {
    US:    { id: "US",    flag: "US", lang: "en", currency: "USD", symbol: "$", label: "United States", short: "US · USD" },
    LATAM: { id: "LATAM", flag: "LAT", lang: "es", currency: "USD", symbol: "$", label: "Latinoamérica", short: "LATAM · USD" },
    EU:    { id: "EU",    flag: "EU", lang: "es", currency: "EUR", symbol: "€", label: "Europa", short: "EU · EUR" },
  };
  const REGION_ORDER = ["US", "LATAM", "EU"];

  // ---- Price book ----
  // chamber: US $64,900 / EU €69.900 / LATAM "bajo consulta"
  // book:    US $29.99 / EU €29,99 / LATAM $29.99 USD
  const PRICES = {
    chamber: {
      US:    { display: "$64,900", note: "USD", onRequest: false, value: 64900 },
      EU:    { display: "€69.900", note: "EUR", onRequest: false, value: 69900 },
      LATAM: { display: null,      note: null,  onRequest: true,  value: null },
    },
    book: {
      US:    { display: "$29.99",      note: "USD", onRequest: false, value: 29.99 },
      EU:    { display: "€29,99",      note: "EUR", onRequest: false, value: 29.99 },
      LATAM: { display: "$29.99 USD",  note: "USD", onRequest: false, value: 29.99 },
    },
  };

  // ---- Products ----
  const PRODUCTS = [
    {
      id: "chamber",
      slot: "img-chamber",
      kind: "hardware",
      hero: true,
      en: {
        name: "Hyperbaric Chamber",
        tagline: "Designed by RETO",
        cat: "Recovery Hardware",
        short: "Hard-shell hyperbaric oxygen therapy, engineered in-house for elite recovery.",
      },
      es: {
        name: "Cámara Hiperbárica",
        tagline: "Diseñada por RETO",
        cat: "Hardware de Recuperación",
        short: "Oxigenoterapia hiperbárica de carcasa rígida, diseñada por RETO para recuperación de élite.",
      },
    },
    {
      id: "book",
      slot: "img-book",
      kind: "book",
      hero: false,
      en: {
        name: "The RETO Method",
        tagline: "The book",
        cat: "Protocol Guide",
        short: "The preventive-medicine protocol behind elite longevity and performance.",
      },
      es: {
        name: "El Método RETO",
        tagline: "El libro",
        cat: "Guía de Protocolo",
        short: "El protocolo de medicina preventiva detrás de la longevidad y el rendimiento de élite.",
      },
    },
  ];

  // ---- i18n copy dictionary ----
  const T = {
    en: {
      // nav
      "nav.shop": "Shop", "nav.science": "Science", "nav.method": "Method", "nav.clinics": "Clinics", "nav.contact": "Contact",
      "nav.region": "Region", "nav.cart": "Cart",
      // tagline
      "brand.triad": "Strength · Recovery · Clarity",
      "brand.mantra": "The future of health, today.",
      "brand.locations": "Miami · Madrid",
      // home
      "home.eyebrow": "Preventive medicine · Longevity · Performance",
      "home.h1a": "The future of", "home.h1b": "health, today.",
      "home.sub": "Premium preventive medicine for longevity, recovery and elite performance. Built with the athletes who define their sports.",
      "home.cta": "Enter the store", "home.cta2": "The science",
      "home.science.k": "The science", "home.science.h": "Engineered recovery, measured outcomes.",
      "home.science.b": "RETO unifies hyperbaric oxygen, diagnostics and protocol into one system — the same one trusted inside elite locker rooms.",
      "home.s1.h": "Hyperbaric oxygen", "home.s1.b": "Hard-shell chambers, designed by RETO, for cellular recovery under pressure.",
      "home.s2.h": "Biomarker diagnostics", "home.s2.b": "Full-panel blood, hormonal and metabolic mapping to set your baseline.",
      "home.s3.h": "Longevity protocol", "home.s3.b": "A measurable plan across recovery, sleep, strength and clarity.",
      "home.proof.k": "Trusted by elite performers",
      "home.proof.b": "Programs run with athletes across the NBA, LaLiga and the UFC, and the clinicians who keep them at the top.",
      "home.products.k": "The store", "home.products.h": "Own the system.",
      "home.products.cta": "View all products",
      "home.clinics.k": "Clinics", "home.clinics.h": "Miami & Madrid",
      "home.clinics.b": "Two flagship clinics. One standard. Visit a RETO suite or bring the system home.",
      "home.cta.final": "Begin your protocol",
      // shop
      "shop.k": "Marketplace", "shop.h": "The store", "shop.hero.k": "Flagship",
      "shop.all": "All", "shop.hardware": "Hardware", "shop.books": "Protocol",
      "shop.from": "From", "shop.region.note": "Pricing shown for",
      "shop.view": "View product", "shop.featured": "Featured",
      // product common
      "p.add": "Add to cart", "p.buy": "Buy now", "p.request": "Request · Contact",
      "p.finance": "Financing available", "p.specs": "Specifications", "p.benefits": "Benefits",
      "p.included": "Worldwide shipping included · Customs & duties payable by buyer",
      "p.trust.ship": "Shipping included", "p.trust.warranty": "2-year warranty", "p.trust.install": "White-glove install",
      "p.trust.secure": "Secure checkout", "p.trust.support": "Concierge support",
      "p.onrequest": "Price on request", "p.gallery": "Gallery",
      "p.overview": "Overview", "p.inthebox": "In the box", "p.qty": "Quantity",
      // chamber specifics
      "ch.benefit1.h": "Cellular recovery", "ch.benefit1.b": "Elevated oxygen under pressure accelerates tissue repair and reduces inflammation.",
      "ch.benefit2.h": "Cognitive clarity", "ch.benefit2.b": "Improved oxygen delivery supports focus, mood and neural recovery.",
      "ch.benefit3.h": "Performance endurance", "ch.benefit3.b": "Faster turnaround between sessions for athletes operating at the limit.",
      "ch.cta.note": "High-ticket purchase — our concierge team will guide installation, logistics and financing.",
      // book specifics
      "bk.about.h": "Inside the book", "bk.about.b": "The complete preventive-medicine protocol — recovery, longevity, training and clarity — distilled into a single method.",
      "bk.format": "Hardcover · 312 pages", "bk.ship": "Ships in 3–5 business days",
      // checkout
      "co.k": "Secure checkout", "co.h": "Checkout", "co.contact": "Contact",
      "co.fname": "First name", "co.lname": "Last name", "co.phone": "Phone", "co.email": "Email", "co.dob": "Date of birth",
      "co.billing": "Billing address", "co.shipping": "Shipping address", "co.same": "Same as billing",
      "co.addr": "Address", "co.addr2": "Apartment, suite (optional)", "co.city": "City", "co.state": "State / Province",
      "co.zip": "Postal code", "co.country": "Country",
      "co.payment": "Payment", "co.card": "Card number", "co.exp": "Expiry", "co.cvc": "CVC", "co.cardname": "Name on card",
      "co.summary": "Order summary", "co.subtotal": "Subtotal", "co.shipfee": "Shipping", "co.tax": "Estimated tax",
      "co.total": "Total", "co.free": "Included", "co.pay": "Pay securely", "co.placing": "Processing…",
      "co.secure.note": "256-bit encrypted · We never store card data", "co.back": "Back to product",
      "co.duties": "Customs & duties payable by buyer on delivery.",
      "co.req.title": "Request this product", "co.req.note": "Tell us about your space and timeline — concierge replies within 24h.",
      "co.req.msg": "Message (optional)", "co.req.send": "Send request",
      // confirmation
      "cf.k": "Order confirmed", "cf.h": "You're in.", "cf.b": "Your protocol begins now. A confirmation has been sent to your email.",
      "cf.order": "Order", "cf.eta": "Estimated delivery", "cf.next": "What happens next",
      "cf.n1": "Concierge confirmation within 24 hours.", "cf.n2": "Logistics & install scheduled to your calendar.", "cf.n3": "Onboarding into your RETO protocol.",
      "cf.req.h": "Request received.", "cf.req.b": "Our concierge team will contact you within 24 hours to design your installation and financing.",
      "cf.home": "Back to home", "cf.shop": "Continue browsing",
      // footer
      "ft.tag": "The future of health, today.", "ft.rights": "© 2026 RETO Health & Performance",
    },
    es: {
      "nav.shop": "Tienda", "nav.science": "Ciencia", "nav.method": "Método", "nav.clinics": "Clínicas", "nav.contact": "Contacto",
      "nav.region": "Región", "nav.cart": "Carrito",
      "brand.triad": "Fuerza · Recuperación · Claridad",
      "brand.mantra": "El futuro de la salud, hoy.",
      "brand.locations": "Miami · Madrid",
      "home.eyebrow": "Medicina preventiva · Longevidad · Rendimiento",
      "home.h1a": "El futuro de la", "home.h1b": "salud, hoy.",
      "home.sub": "Medicina preventiva premium para longevidad, recuperación y rendimiento de élite. Construida junto a los atletas que definen su deporte.",
      "home.cta": "Entrar a la tienda", "home.cta2": "La ciencia",
      "home.science.k": "La ciencia", "home.science.h": "Recuperación diseñada, resultados medidos.",
      "home.science.b": "RETO unifica oxígeno hiperbárico, diagnóstico y protocolo en un solo sistema — el mismo en el que confían los vestuarios de élite.",
      "home.s1.h": "Oxígeno hiperbárico", "home.s1.b": "Cámaras de carcasa rígida, diseñadas por RETO, para recuperación celular bajo presión.",
      "home.s2.h": "Diagnóstico de biomarcadores", "home.s2.b": "Mapeo completo: sangre, hormonal y metabólico para fijar tu línea base.",
      "home.s3.h": "Protocolo de longevidad", "home.s3.b": "Un plan medible en recuperación, sueño, fuerza y claridad.",
      "home.proof.k": "La confianza de la élite",
      "home.proof.b": "Programas con atletas de la NBA, LaLiga y la UFC, y los clínicos que los mantienen en la cima.",
      "home.products.k": "La tienda", "home.products.h": "Hazte con el sistema.",
      "home.products.cta": "Ver todos los productos",
      "home.clinics.k": "Clínicas", "home.clinics.h": "Miami y Madrid",
      "home.clinics.b": "Dos clínicas insignia. Un solo estándar. Visita una suite RETO o lleva el sistema a casa.",
      "home.cta.final": "Comienza tu protocolo",
      "shop.k": "Marketplace", "shop.h": "La tienda", "shop.hero.k": "Producto estrella",
      "shop.all": "Todo", "shop.hardware": "Hardware", "shop.books": "Protocolo",
      "shop.from": "Desde", "shop.region.note": "Precios mostrados para",
      "shop.view": "Ver producto", "shop.featured": "Destacado",
      "p.add": "Añadir al carrito", "p.buy": "Comprar ahora", "p.request": "Solicitar · Contactar",
      "p.finance": "Financiación disponible", "p.specs": "Especificaciones", "p.benefits": "Beneficios",
      "p.included": "Envío mundial incluido · Aduanas a cargo del comprador",
      "p.trust.ship": "Envío incluido", "p.trust.warranty": "Garantía de 2 años", "p.trust.install": "Instalación premium",
      "p.trust.secure": "Pago seguro", "p.trust.support": "Soporte concierge",
      "p.onrequest": "Precio bajo consulta", "p.gallery": "Galería",
      "p.overview": "Descripción", "p.inthebox": "Incluye", "p.qty": "Cantidad",
      "ch.benefit1.h": "Recuperación celular", "ch.benefit1.b": "El oxígeno elevado bajo presión acelera la reparación de tejidos y reduce la inflamación.",
      "ch.benefit2.h": "Claridad cognitiva", "ch.benefit2.b": "Mejor aporte de oxígeno que favorece foco, ánimo y recuperación neuronal.",
      "ch.benefit3.h": "Resistencia y rendimiento", "ch.benefit3.b": "Menor tiempo de recuperación entre sesiones para atletas al límite.",
      "ch.cta.note": "Compra de alto ticket — nuestro equipo concierge guía instalación, logística y financiación.",
      "bk.about.h": "Dentro del libro", "bk.about.b": "El protocolo completo de medicina preventiva — recuperación, longevidad, entrenamiento y claridad — destilado en un solo método.",
      "bk.format": "Tapa dura · 312 páginas", "bk.ship": "Envío en 3–5 días hábiles",
      "co.k": "Pago seguro", "co.h": "Checkout", "co.contact": "Contacto",
      "co.fname": "Nombre", "co.lname": "Apellidos", "co.phone": "Teléfono", "co.email": "Email", "co.dob": "Fecha de nacimiento",
      "co.billing": "Dirección de facturación", "co.shipping": "Dirección de envío", "co.same": "Igual que facturación",
      "co.addr": "Dirección", "co.addr2": "Piso, puerta (opcional)", "co.city": "Ciudad", "co.state": "Provincia / Estado",
      "co.zip": "Código postal", "co.country": "País",
      "co.payment": "Pago", "co.card": "Número de tarjeta", "co.exp": "Caducidad", "co.cvc": "CVC", "co.cardname": "Titular de la tarjeta",
      "co.summary": "Resumen del pedido", "co.subtotal": "Subtotal", "co.shipfee": "Envío", "co.tax": "Impuestos estimados",
      "co.total": "Total", "co.free": "Incluido", "co.pay": "Pagar de forma segura", "co.placing": "Procesando…",
      "co.secure.note": "Cifrado de 256 bits · Nunca almacenamos datos de tarjeta", "co.back": "Volver al producto",
      "co.duties": "Aduanas e impuestos a cargo del comprador en la entrega.",
      "co.req.title": "Solicitar este producto", "co.req.note": "Cuéntanos sobre tu espacio y plazos — concierge responde en 24h.",
      "co.req.msg": "Mensaje (opcional)", "co.req.send": "Enviar solicitud",
      "cf.k": "Pedido confirmado", "cf.h": "Estás dentro.", "cf.b": "Tu protocolo comienza ahora. Hemos enviado una confirmación a tu email.",
      "cf.order": "Pedido", "cf.eta": "Entrega estimada", "cf.next": "Qué sigue ahora",
      "cf.n1": "Confirmación de concierge en menos de 24 horas.", "cf.n2": "Logística e instalación agendadas en tu calendario.", "cf.n3": "Onboarding a tu protocolo RETO.",
      "cf.req.h": "Solicitud recibida.", "cf.req.b": "Nuestro equipo concierge te contactará en menos de 24 horas para diseñar tu instalación y financiación.",
      "cf.home": "Volver al inicio", "cf.shop": "Seguir explorando",
      "ft.tag": "El futuro de la salud, hoy.", "ft.rights": "© 2026 RETO Health & Performance",
    },
  };

  // Chamber specifications (shared, with bilingual labels)
  const CHAMBER_SPECS = [
    { en: ["Pressure", "Up to 2.0 ATA"], es: ["Presión", "Hasta 2.0 ATA"] },
    { en: ["Oxygen concentration", "Up to 95% O₂"], es: ["Concentración de O₂", "Hasta 95% O₂"] },
    { en: ["Shell", "Hard-shell steel & glass"], es: ["Carcasa", "Acero y vidrio rígidos"] },
    { en: ["Capacity", "1 person · seated/recline"], es: ["Capacidad", "1 persona · sentado/recostado"] },
    { en: ["Dimensions", "230 × 95 × 120 cm"], es: ["Dimensiones", "230 × 95 × 120 cm"] },
    { en: ["Control", "Touchscreen + RETO app"], es: ["Control", "Pantalla táctil + app RETO"] },
    { en: ["Install", "White-glove, included"], es: ["Instalación", "Premium, incluida"] },
    { en: ["Warranty", "2 years, parts & service"], es: ["Garantía", "2 años, piezas y servicio"] },
  ];

  window.RETO_DATA = { REGIONS, REGION_ORDER, PRICES, PRODUCTS, T, CHAMBER_SPECS };
})();
