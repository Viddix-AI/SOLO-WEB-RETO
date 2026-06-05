import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySnsMessage, type SnsMessage } from "@/lib/sns";
import { markConfirmedByIpn } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Amazon Pay async notifications (IPN), delivered via Amazon SNS. The SNS
 * signature is verified before any payload is trusted; on a verified charge /
 * checkout-session notification we mark the payment confirmed (mock; DB later).
 */
export async function POST(req: NextRequest) {
  let message: SnsMessage;
  try {
    message = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const verified = await verifySnsMessage(message);
  if (!verified) {
    console.error("[RETO] Amazon Pay IPN: SNS signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Auto-confirm the SNS subscription handshake.
  if (message.Type === "SubscriptionConfirmation" && message.SubscribeURL) {
    try {
      await fetch(message.SubscribeURL);
    } catch (err) {
      console.error("[RETO] IPN subscribe confirm failed:", err instanceof Error ? err.message : err);
    }
    return NextResponse.json({ received: true });
  }

  if (message.Type === "Notification") {
    try {
      const inner = JSON.parse(message.Message);
      const objectType: string = inner?.ObjectType ?? "";
      const objectId: string = inner?.ObjectId ?? "";
      if (objectId && (objectType === "CHARGE" || objectType === "CHECKOUT_SESSION")) {
        markConfirmedByIpn(objectType, objectId);
      }
    } catch (err) {
      console.error("[RETO] IPN notification parse error:", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ received: true });
}
