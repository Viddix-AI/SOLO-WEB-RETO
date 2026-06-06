import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getRegion, isRegionId } from "@/lib/regions";
import { bookChargeAmount, toMinorUnits } from "@/lib/checkout";
import { savePendingOrder } from "@/lib/orders";

export const runtime = "nodejs";

interface AddressInput {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string; // ISO 3166-1 alpha-2
}

interface CustomerInput {
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  dob?: string;
  billing?: AddressInput;
  shipping?: AddressInput;
}

interface Body {
  region?: string;
  qty?: number;
  customer?: CustomerInput;
}

function cleanAddress(a?: AddressInput): Stripe.AddressParam | undefined {
  if (!a) return undefined;
  return {
    line1: a.line1 || undefined,
    line2: a.line2 || undefined,
    city: a.city || undefined,
    state: a.state || undefined,
    postal_code: a.postal_code || undefined,
    country: a.country || undefined,
  };
}

/**
 * Create a Stripe PaymentIntent for the book order (deferred flow). The amount
 * is computed SERVER-SIDE from the region price book — the client only sends the
 * region + qty + buyer details, never the price. We create or reuse a Stripe
 * Customer (matched by email) and store only Stripe ids (never the card number).
 */
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.region || !isRegionId(body.region)) {
    return NextResponse.json({ error: "Invalid region" }, { status: 400 });
  }
  const region = getRegion(body.region);
  const c = body.customer ?? {};
  const email = c.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Server-authoritative amount from the price book.
  const charge = bookChargeAmount(region, Number(body.qty) || 1);
  const amountMinor = toMinorUnits(charge.amount);

  const fullName = [c.fname, c.lname].filter(Boolean).join(" ").trim() || undefined;
  const billing = cleanAddress(c.billing);
  const shipping = cleanAddress(c.shipping);

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Payments not configured" }, { status: 500 });
  }

  try {
    // Create or reuse a Customer (matched by email).
    const customerParams: Stripe.CustomerCreateParams = {
      name: fullName,
      email,
      phone: c.phone || undefined,
      address: billing,
      shipping: shipping ? { name: fullName ?? email, phone: c.phone || undefined, address: shipping } : undefined,
      metadata: { dob: c.dob ?? "", region: region.id },
    };

    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0]
      ? await stripe.customers.update(existing.data[0].id, customerParams)
      : await stripe.customers.create(customerParams);

    const intent = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency: charge.currencyCode.toLowerCase(),
      customer: customer.id,
      receipt_email: email,
      description: "Péptidos: La Nueva Era de la Longevidad — book",
      automatic_payment_methods: { enabled: true },
      metadata: {
        region: region.id,
        qty: String(charge.qty),
        product: "book",
        dob: c.dob ?? "",
      },
    });

    savePendingOrder({
      paymentIntentId: intent.id,
      customerId: customer.id,
      paymentMethodId: null,
      buyerEmail: email,
      amount: charge.amount,
      currency: charge.currencyCode,
      region: region.id,
      qty: charge.qty,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("[RETO] create-payment-intent error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not start payment" }, { status: 502 });
  }
}
