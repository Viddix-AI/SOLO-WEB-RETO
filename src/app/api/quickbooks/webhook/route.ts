import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";
import { notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";

/** Intuit signs the raw body with HMAC-SHA256 (verifier token), base64, in `intuit-signature`. */
function verifySignature(rawBody: string, signature: string | null, verifierToken: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", verifierToken).update(rawBody, "utf8").digest("base64");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * QuickBooks webhook. Verifies Intuit's signature before trusting the payload.
 * On a Payment event (invoice paid) it tracks the customer — for now: log +
 * notify the owner. The "create lobby account" hook is PREPARED but NOT
 * activated (logins ship in another block).
 */
export async function POST(req: NextRequest) {
  const verifierToken = process.env.QBO_WEBHOOK_VERIFIER_TOKEN;
  if (!verifierToken) {
    console.error("[RETO] QBO webhook: QBO_WEBHOOK_VERIFIER_TOKEN not set.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  if (!verifySignature(rawBody, req.headers.get("intuit-signature"), verifierToken)) {
    console.error("[RETO] QBO webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  for (const note of payload?.eventNotifications ?? []) {
    const realmId: string = note?.realmId ?? "";
    for (const entity of note?.dataChangeEvent?.entities ?? []) {
      console.log(`[RETO] QBO webhook — ${entity?.name} ${entity?.operation} id=${entity?.id} realm=${realmId}`);

      // A Payment means an invoice was paid → track the customer (mock: notify owner).
      if (entity?.name === "Payment" && (entity?.operation === "Create" || entity?.operation === "Update")) {
        await notifyOwner(
          "Pago de factura recibido (QuickBooks)",
          `<p>Payment <code>${entity.id}</code> en company <code>${realmId}</code> (${entity.operation}).</p>`,
        );
        // PREPARED, NOT ACTIVATED — create the lobby/login account for this customer.
        // Logins ship in another block, so this hook stays disabled on purpose:
        // await provisionLobbyAccount(realmId, entity.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
