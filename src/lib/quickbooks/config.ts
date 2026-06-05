import "server-only";

export type QboEnvironment = "sandbox" | "production";

export function qboEnvironment(): QboEnvironment {
  return process.env.QBO_ENVIRONMENT === "production" ? "production" : "sandbox";
}

/** QuickBooks Accounting API base (sandbox first). */
export function qboApiBase(): string {
  return qboEnvironment() === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";
}

export interface QboAppConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: QboEnvironment;
}

/** App credentials from env, or null when not configured. */
export function getQboAppConfig(): QboAppConfig | null {
  const clientId = process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QBO_CLIENT_SECRET;
  const redirectUri = process.env.QBO_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { clientId, clientSecret, redirectUri, environment: qboEnvironment() };
}

export function isQboConfigured(): boolean {
  return getQboAppConfig() !== null;
}
