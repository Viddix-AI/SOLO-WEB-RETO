import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthorizeUrl } from "@/lib/quickbooks/client";
import { isQboConfigured } from "@/lib/quickbooks/config";

export const runtime = "nodejs";

/**
 * Start the Intuit OAuth2 flow — the owner visits this once to connect the
 * QuickBooks (sandbox) company. Redirects to Intuit's consent screen.
 */
export async function GET() {
  if (!isQboConfigured()) {
    return NextResponse.json(
      { error: "QuickBooks not configured. Set QBO_CLIENT_ID, QBO_CLIENT_SECRET and QBO_REDIRECT_URI in .env.local." },
      { status: 500 },
    );
  }

  const state = randomUUID();
  const res = NextResponse.redirect(getAuthorizeUrl(state));
  res.cookies.set("qbo_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  return res;
}
