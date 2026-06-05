import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCodeAndStore } from "@/lib/quickbooks/client";

export const runtime = "nodejs";

/**
 * OAuth2 redirect target. Verifies the CSRF state, exchanges the code for tokens
 * (incl. refresh + realmId) and persists them server-side.
 */
export async function GET(req: NextRequest) {
  const stateCookie = req.cookies.get("qbo_oauth_state")?.value;
  const stateParam = req.nextUrl.searchParams.get("state");
  if (!stateCookie || stateCookie !== stateParam) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  try {
    const stored = await exchangeCodeAndStore(req.url);
    const res = new NextResponse(
      `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui,sans-serif;background:#000;color:#F4F4F2;padding:48px;max-width:560px;margin:0 auto">
        <h1 style="font-weight:700">QuickBooks conectado ✓</h1>
        <p style="color:#B6B6B4">Company realmId: <code>${stored.realmId}</code></p>
        <p style="color:#B6B6B4">Ya puedes cerrar esta pestaña. Las facturas de las solicitudes de cámara se crearán en esta company.</p>
      </body>`,
      { headers: { "content-type": "text/html; charset=utf-8" } },
    );
    res.cookies.delete("qbo_oauth_state");
    return res;
  } catch (err) {
    console.error("[RETO] QBO callback error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
  }
}
