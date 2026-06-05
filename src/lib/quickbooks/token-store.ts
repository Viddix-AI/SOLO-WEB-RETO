import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * QuickBooks OAuth token persistence. No DB (Supabase parked) → tokens live in a
 * gitignored file under .data/ (owner-readable), which survives restarts and
 * supports refresh. This is a sandbox/dev store; on serverless/production swap
 * it for a real secret store / DB (the get/save interface stays the same).
 */
export interface StoredTokens {
  realmId: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
  createdAt: number; // epoch ms
}

const FILE = path.join(process.cwd(), ".data", "qbo-tokens.json");

export function getStoredTokens(): StoredTokens | null {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as StoredTokens;
  } catch {
    return null;
  }
}

export function saveStoredTokens(tokens: StoredTokens): void {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(tokens, null, 2), { encoding: "utf8", mode: 0o600 });
}

export function clearStoredTokens(): void {
  try {
    fs.rmSync(FILE);
  } catch {
    /* ignore */
  }
}

export function isQboConnected(): boolean {
  return getStoredTokens() !== null;
}
