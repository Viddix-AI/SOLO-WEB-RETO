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
      tagline: "Designed by RETO",
      cat: "Recovery Hardware",
      short: "Hard-shell hyperbaric oxygen therapy, engineered in-house for elite recovery.",
    },
    es: {
      name: "Cámara Hiperbárica",
      tagline: "Diseñada por RETO",
      cat: "Hardware de Recuperación",
      short:
        "Oxigenoterapia hiperbárica de carcasa rígida, diseñada por RETO para recuperación de élite.",
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
      short:
        "El protocolo de medicina preventiva detrás de la longevidad y el rendimiento de élite.",
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

export const CHAMBER_SPECS: ChamberSpec[] = [
  { en: ["Pressure", "Up to 2.0 ATA"], es: ["Presión", "Hasta 2.0 ATA"] },
  { en: ["Oxygen concentration", "Up to 95% O₂"], es: ["Concentración de O₂", "Hasta 95% O₂"] },
  { en: ["Shell", "Hard-shell steel & glass"], es: ["Carcasa", "Acero y vidrio rígidos"] },
  { en: ["Capacity", "1 person · seated/recline"], es: ["Capacidad", "1 persona · sentado/recostado"] },
  { en: ["Dimensions", "230 × 95 × 120 cm"], es: ["Dimensiones", "230 × 95 × 120 cm"] },
  { en: ["Control", "Touchscreen + RETO app"], es: ["Control", "Pantalla táctil + app RETO"] },
  { en: ["Install", "White-glove, included"], es: ["Instalación", "Premium, incluida"] },
  { en: ["Warranty", "2 years, parts & service"], es: ["Garantía", "2 años, piezas y servicio"] },
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
