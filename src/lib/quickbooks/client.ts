import "server-only";
import OAuthClient from "intuit-oauth";
import { getQboAppConfig, qboApiBase } from "./config";
import { getStoredTokens, saveStoredTokens, isQboConnected, type StoredTokens } from "./token-store";

export { isQboConnected };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function newClient(token?: any): OAuthClient {
  const cfg = getQboAppConfig();
  if (!cfg) throw new Error("QuickBooks is not configured (QBO_CLIENT_ID / QBO_CLIENT_SECRET / QBO_REDIRECT_URI).");
  return new OAuthClient({
    environment: cfg.environment,
    clientId: cfg.clientId,
    clientSecret: cfg.clientSecret,
    redirectUri: cfg.redirectUri,
    token,
  });
}

/** OAuth2 authorization URL (Accounting scope). */
export function getAuthorizeUrl(state: string): string {
  return newClient().authorizeUri({ scope: [OAuthClient.scopes.Accounting], state });
}

/** Exchange the callback code for tokens and persist them (incl. realmId). */
export async function exchangeCodeAndStore(callbackUrl: string): Promise<StoredTokens> {
  const authResponse = await newClient().createToken(callbackUrl);
  const t = authResponse.getToken();
  const stored: StoredTokens = {
    realmId: t.realmId ?? "",
    access_token: t.access_token ?? "",
    refresh_token: t.refresh_token ?? "",
    expires_in: t.expires_in ?? 3600,
    x_refresh_token_expires_in: t.x_refresh_token_expires_in ?? 8_726_400,
    createdAt: Date.now(),
  };
  saveStoredTokens(stored);
  return stored;
}

/** A client with a fresh access token (refreshing + re-persisting if stale), or null. */
async function authedClient(): Promise<{ client: OAuthClient; realmId: string } | null> {
  const stored = getStoredTokens();
  if (!stored) return null;

  const client = newClient({
    token_type: "bearer",
    access_token: stored.access_token,
    refresh_token: stored.refresh_token,
    expires_in: stored.expires_in,
    x_refresh_token_expires_in: stored.x_refresh_token_expires_in,
    realmId: stored.realmId,
    createdAt: stored.createdAt,
  });

  const ageSeconds = (Date.now() - stored.createdAt) / 1000;
  if (ageSeconds > stored.expires_in - 60) {
    const refreshed = await client.refreshUsingToken(stored.refresh_token);
    const rt = refreshed.getToken();
    const next: StoredTokens = {
      realmId: stored.realmId,
      access_token: rt.access_token ?? stored.access_token,
      refresh_token: rt.refresh_token ?? stored.refresh_token,
      expires_in: rt.expires_in ?? 3600,
      x_refresh_token_expires_in: rt.x_refresh_token_expires_in ?? stored.x_refresh_token_expires_in,
      createdAt: Date.now(),
    };
    saveStoredTokens(next);
    client.setToken({ ...next, token_type: "bearer" });
  }

  return { client, realmId: stored.realmId };
}

/** Authenticated QBO Accounting API call. Throws if not connected or on 4xx/5xx. */
export async function qboApi<T = unknown>(
  pathFragment: string,
  method: "GET" | "POST" = "GET",
  body?: unknown,
): Promise<T> {
  const authed = await authedClient();
  if (!authed) throw new Error("QuickBooks is not connected. Visit /api/quickbooks/connect.");

  const url = `${qboApiBase()}/v3/company/${authed.realmId}/${pathFragment}`;
  const res = await authed.client.makeApiCall({
    url,
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (res.status >= 400) {
    throw new Error(`QBO API ${res.status}: ${(res.body ?? "").slice(0, 400)}`);
  }
  return res.json as T;
}
