import "server-only";
import fs from "node:fs";
import path from "node:path";
import { WebStoreClient } from "@amazonpay/amazon-pay-api-sdk-nodejs";
import type { Region, RegionId } from "@/lib/regions";

/**
 * Server-only Amazon Pay (Checkout v2) configuration, per region. NEVER import
 * this from a client component — it reads the private key. Book checkout is
 * enabled for a region only when its credentials exist; LATAM never has them
 * (Amazon Pay does not operate there).
 */
export interface RegionCredentials {
  merchantId: string;
  storeId: string;
  publicKeyId: string;
  privateKey: string;
}

/** The private key env var may hold the PEM contents OR a path to a .pem file. */
function resolvePrivateKey(value?: string): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (v.includes("BEGIN")) return v.replace(/\\n/g, "\n");
  try {
    return fs.readFileSync(path.isAbsolute(v) ? v : path.join(process.cwd(), v), "utf8");
  } catch {
    return null;
  }
}

function envCreds(prefix: "US" | "EU"): RegionCredentials | null {
  const merchantId = process.env[`AMAZON_PAY_${prefix}_MERCHANT_ID`];
  const storeId = process.env[`AMAZON_PAY_${prefix}_STORE_ID`];
  const publicKeyId = process.env[`AMAZON_PAY_${prefix}_PUBLIC_KEY_ID`];
  const privateKey = resolvePrivateKey(process.env[`AMAZON_PAY_${prefix}_PRIVATE_KEY`]);
  if (!merchantId || !storeId || !publicKeyId || !privateKey) return null;
  return { merchantId, storeId, publicKeyId, privateKey };
}

export function getRegionCredentials(regionId: RegionId): RegionCredentials | null {
  if (regionId === "US") return envCreds("US");
  if (regionId === "EU") return envCreds("EU");
  return null; // LATAM — Amazon Pay does not operate there
}

/** Book checkout enabled for a region: creds present and not LATAM. */
export function isCheckoutEnabled(regionId: RegionId): boolean {
  return getRegionCredentials(regionId) !== null;
}

export const amazonPaySandbox = (process.env.AMAZON_PAY_SANDBOX ?? "true") !== "false";

function amazonRegionCode(regionId: RegionId): "us" | "eu" {
  return regionId === "EU" ? "eu" : "us";
}

/** Server-side Amazon Pay client for a region, or null if not configured. */
export function getClient(regionId: RegionId): WebStoreClient | null {
  const creds = getRegionCredentials(regionId);
  if (!creds) return null;
  return new WebStoreClient({
    publicKeyId: creds.publicKeyId,
    privateKey: creds.privateKey,
    region: amazonRegionCode(regionId),
    sandbox: amazonPaySandbox,
    algorithm: "AMZN-PAY-RSASSA-PSS-V2",
  });
}

export function checkoutScriptSrc(regionId: RegionId): string {
  return regionId === "EU"
    ? "https://static-eu.payments-amazon.com/checkout.js"
    : "https://static-na.payments-amazon.com/checkout.js";
}

export function checkoutLanguage(region: Region): "en_US" | "es_ES" {
  return region.lang === "es" ? "es_ES" : "en_US";
}

export function ledgerCurrency(region: Region): "USD" | "EUR" {
  return region.currency;
}
