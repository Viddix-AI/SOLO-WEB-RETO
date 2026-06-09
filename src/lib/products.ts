import type { Lang } from "@/lib/i18n/dictionary";
import type { RegionId } from "@/lib/regions";

/**
 * Products + price book — ported from _design/reto-data.js
 * (PRODUCTS, PRICES, CHAMBER_SPECS).
 *
 * chamber: US $64,900 / EU €69.900 / LATAM "bajo consulta" (onRequest, no price)
 * book:    US $29.99  / EU €29,99  / LATAM $29.99 USD
 */

export type ProductId = "chamber" | "book";
export type ProductKind = "hardware" | "book";

export interface ProductCopy {
  name: string;
  tagline: string;
  cat: string;
  short: string;
}

export interface Product {
  id: ProductId;
  slot: string;
  kind: ProductKind;
  hero: boolean;
  en: ProductCopy;
  es: ProductCopy;
}

export const PRODUCTS: Product[] = [
  {
    id: "chamber",
    slot: "img-chamber",
    kind: "hardware",
    hero: true,
    en: {
      name: "Hyperbaric Chamber",
      tagline: "Oxify × RETO",
      cat: "Recovery Hardware",
      short:
        "Hard-shell, medical-grade hyperbaric oxygen therapy — engineered by Oxify × RETO for elite recovery.",
    },
    es: {
      name: "Cámara Hiperbárica",
      tagline: "Oxify × RETO",
      cat: "Hardware de Recuperación",
      short:
        "Oxigenoterapia hiperbárica de carcasa rígida y grado médico — ingeniería de Oxify × RETO para recuperación de élite.",
    },
  },
  {
    id: "book",
    slot: "img-book",
    kind: "book",
    hero: false,
    // Real published book — Amazon ASIN B0GY9PGFCR. Spanish-only edition (no
    // English edition exists), so the US/en copy keeps the Spanish title and
    // adds a "(Spanish edition)" descriptor for the buyer.
    en: {
      name: "Péptidos: La Nueva Era de la Longevidad (Spanish edition)",
      tagline: "By Jaime Casado and the RETO Health medical team",
      cat: "Protocol Guide",
      // TODO: blurb oficial pendiente — placeholder original (NO copiado de Amazon)
      short: "Peptides and longevity, explained by RETO's medical team — cutting-edge science made practical.",
    },
    es: {
      name: "Péptidos: La Nueva Era de la Longevidad",
      tagline: "Por Jaime Casado y el equipo médico de RETO Health",
      cat: "Guía de Protocolo",
      // TODO: blurb oficial pendiente — placeholder original (NO copiado de Amazon)
      short:
        "Péptidos y longevidad, explicados por el equipo médico de RETO: ciencia de vanguardia llevada a la práctica.",
    },
  },
];

export interface Price {
  /** Formatted price string, or null when sold on request. */
  display: string | null;
  /** Currency note (e.g. "USD"), or null when on request. */
  note: string | null;
  /** True for the LATAM chamber: contact-to-buy, no public price. */
  onRequest: boolean;
  /** Numeric value for downstream payment logic (Bloque D), or null. */
  value: number | null;
}

export const PRICES: Record<ProductId, Record<RegionId, Price>> = {
  chamber: {
    US: { display: "$64,900", note: "USD", onRequest: false, value: 64900 },
    EU: { display: "€69.900", note: "EUR", onRequest: false, value: 69900 },
    LATAM: { display: null, note: null, onRequest: true, value: null },
  },
  book: {
    US: { display: "$29.99", note: "USD", onRequest: false, value: 29.99 },
    EU: { display: "€29,99", note: "EUR", onRequest: false, value: 29.99 },
    LATAM: { display: "$29.99 USD", note: "USD", onRequest: false, value: 29.99 },
  },
};

export interface ChamberSpec {
  en: [label: string, value: string];
  es: [label: string, value: string];
}

/** Title + body card (chamber highlights & features). Bilingual like ChamberSpec. */
export interface ChamberCard {
  en: { h: string; b: string };
  es: { h: string; b: string };
}

// Real Oxify × RETO chamber data (provided by the client). Imperial + metric.
export const CHAMBER_SPECS: ChamberSpec[] = [
  { en: ["Working Pressure", "2.0 ATA"], es: ["Presión de Trabajo", "2.0 ATA"] },
  {
    en: ["Dimensions", "79″ × 37″ × 60″ (200.6 × 94 × 152.4 cm)"],
    es: ["Dimensiones", "79″ × 37″ × 60″ (200,6 × 94 × 152,4 cm)"],
  },
  { en: ["Weight", "1323 lbs (600 kg)"], es: ["Peso", "600 kg (1323 lbs)"] },
  {
    en: ["Door Clearance", "Fits through 34″ doorways with the exterior panels removed"],
    es: ["Ajuste en Puertas", "Cabe por entradas de 34″ retirando los paneles exteriores"],
  },
  {
    en: ["Chamber Material", "Medical-grade stainless steel"],
    es: ["Material de la Cámara", "Acero inoxidable de grado médico"],
  },
  {
    en: ["Window Material", "Polycarbonate (Bayer)"],
    es: ["Material de Ventanas", "Policarbonato (Bayer)"],
  },
  {
    en: ["Windows", "2 high-strength transparent windows"],
    es: ["Ventanas", "2 ventanas transparentes de alta resistencia"],
  },
  { en: ["Oxygen Purity", "90–97%"], es: ["Pureza de Oxígeno", "90–97%"] },
];

// All-in-one machine (compressor + concentrator + sterilization) specs.
export const UNIT_SPECS: ChamberSpec[] = [
  {
    en: [
      "Components",
      "Air compressor, 10L oxygen concentrator, 2 cooling machines, anion generator, time alarm, oxygen meter and air filters",
    ],
    es: [
      "Componentes",
      "Compresor de aire, concentrador de oxígeno 10L, 2 máquinas de enfriamiento, generador de aniones, alarma de tiempo, medidor de oxígeno y filtros de aire",
    ],
  },
  {
    en: ["Machine Dimensions", "27.56″ × 13.78″ × 29.53″ (70 × 35 × 75 cm)"],
    es: ["Dimensiones de la Máquina", "27,56″ × 13,78″ × 29,53″ (70 × 35 × 75 cm)"],
  },
  { en: ["Machine Weight", "176 lbs (79.8 kg)"], es: ["Peso de la Máquina", "79,8 kg (176 lbs)"] },
  {
    en: ["Nano Ion Technology", "Pure air with antivirus disinfection system"],
    es: ["Tecnología Nano Ion", "Aire puro con sistema de desinfección antivirus"],
  },
  {
    en: ["Sterilization Rate", "99% effectiveness"],
    es: ["Tasa de Esterilización", "99% de efectividad"],
  },
];

// Top selling-point cards (replaces the old health-claim "benefits").
export const CHAMBER_HIGHLIGHTS: ChamberCard[] = [
  {
    en: {
      h: "Guaranteed Excellence by Oxify × RETO",
      b: "2-year factory warranty and lifetime technical support.",
    },
    es: {
      h: "Excelencia Garantizada por Oxify × RETO",
      b: "2 años de garantía de fábrica y soporte técnico vitalicio.",
    },
  },
  {
    en: {
      h: "Precision Engineering",
      b: "FORGE 2.0 technology optimized for longevity and cellular regeneration.",
    },
    es: {
      h: "Ingeniería de Precisión",
      b: "Tecnología FORGE 2.0 optimizada para longevidad y regeneración celular.",
    },
  },
  {
    en: {
      h: "Medical-Grade Pressure",
      b: "Up to 2.0 ATA for maximum biological efficacy with total safety.",
    },
    es: {
      h: "Presión de Grado Médico",
      b: "Hasta 2.0 ATA para máxima eficacia biológica con seguridad total.",
    },
  },
  {
    en: {
      h: "Premium Shipping & Installation",
      b: "Shipping, white-glove service and setup by specialized technicians.",
    },
    es: {
      h: "Envío e Instalación Premium",
      b: "Envío, servicio de guante blanco y configuración por técnicos especializados.",
    },
  },
  {
    en: {
      h: "Recognitions",
      b: "Endorsed as a leading technology in the Life Sciences sector and recognized by Miami-Dade County.",
    },
    es: {
      h: "Reconocimientos",
      b: "Avalada como tecnología líder en el sector de Life Sciences y reconocida por el Condado de Miami-Dade.",
    },
  },
];

// Feature cards (interior comfort + control systems).
export const CHAMBER_FEATURES: ChamberCard[] = [
  {
    en: {
      h: "Multifunctional Luxury Reclining Chair",
      b: "An ergonomically designed reclining chair that lets users sit or recline in total comfort during sessions. Its adjustable design provides enhanced support for prolonged hyperbaric treatments.",
    },
    es: {
      h: "Sillón Reclinable de Lujo Multifuncional",
      b: "Sillón reclinable de diseño ergonómico que permite sentarse o reclinarse con total comodidad durante las sesiones; su diseño ajustable da soporte mejorado para tratamientos hiperbáricos prolongados.",
    },
  },
  {
    en: {
      h: "Air Conditioning System",
      b: "The integrated climate system helps regulate the chamber's interior temperature, keeping a cool and comfortable environment during every session.",
    },
    es: {
      h: "Sistema de Aire Acondicionado",
      b: "El sistema de climatización integrado regula la temperatura interior de la cámara, manteniendo un ambiente fresco y confortable en cada sesión.",
    },
  },
  {
    en: {
      h: "Red Light Therapy",
      b: "A built-in photobiomodulation system designed to complement hyperbaric sessions by boosting circulation, cellular activity and overall wellbeing.",
    },
    es: {
      h: "Terapia de Luz Roja (Red Light Therapy)",
      b: "Sistema de fotobiomodulación incorporado para complementar las sesiones hiperbáricas potenciando circulación, actividad celular y bienestar integral.",
    },
  },
  {
    en: {
      h: "All-In-One Integrated System",
      b: "A fully integrated hyperbaric platform that combines pressure control, oxygen supply and climate control in one streamlined unit for simple operation and efficient sessions.",
    },
    es: {
      h: 'Sistema Integral "All-In-One"',
      b: "Plataforma hiperbárica totalmente integrada que combina control de presión, suministro de oxígeno y climatización en una unidad aerodinámica para una operación sencilla y sesiones eficientes.",
    },
  },
  {
    en: {
      h: "Large Viewing Windows",
      b: "Large transparent windows that create a brighter interior and provide clear visibility, reducing the feeling of claustrophobia and improving overall comfort.",
    },
    es: {
      h: "Amplios Ventanales de Visualización",
      b: "Ventanas transparentes de gran tamaño que crean un interior más luminoso y dan visibilidad clara, reduciendo la sensación de claustrofobia y mejorando la comodidad.",
    },
  },
  {
    en: {
      h: "Dual Control System",
      b: "Lets you operate the chamber from both inside and outside, with dual digital displays showing temperature, humidity and oxygen purity for precise monitoring.",
    },
    es: {
      h: "Sistema de Control Dual",
      b: "Permite operar la cámara desde el interior y el exterior, con pantallas digitales duales que muestran temperatura, humedad y pureza del oxígeno para un monitoreo preciso.",
    },
  },
];

export function getProduct(id: ProductId): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Localized copy for a product. */
export function productCopy(product: Product, lang: Lang): ProductCopy {
  return product[lang];
}

/** Price for a product in a region. */
export function priceFor(id: ProductId, region: RegionId): Price {
  return PRICES[id][region];
}

/** Localized [label, value] for a chamber spec. */
export function chamberSpec(spec: ChamberSpec, lang: Lang): [string, string] {
  return spec[lang];
}

/** Localized { h, b } for a chamber card (highlight / feature). */
export function chamberCard(card: ChamberCard, lang: Lang): { h: string; b: string } {
  return card[lang];
}
