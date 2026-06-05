import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRegion, isRegionId } from "@/lib/regions";
import { priceFor, getProduct, productCopy } from "@/lib/products";
import { createInvoiceWithLink } from "@/lib/quickbooks/invoice";
import { isQboConnected } from "@/lib/quickbooks/token-store";
import { notifyOwner } from "@/lib/notify";
import { submitLeadMock, type Lead } from "@/lib/leads";

export const runtime = "nodejs";

function leadHtml(lead: Lead, ref: string, note: string): string {
  const a = lead.address;
  return `<h2>Nueva solicitud de cámara — ${ref}</h2>
    <p>${note}</p>
    <ul>
      <li><b>Nombre:</b> ${lead.fname} ${lead.lname}</li>
      <li><b>Email:</b> ${lead.email}</li>
      <li><b>Teléfono:</b> ${lead.phone}</li>
      <li><b>Región:</b> ${lead.region}</li>
      <li><b>País:</b> ${lead.country}</li>
      <li><b>Envío:</b> ${[a.addr, a.addr2, a.city, a.state, a.zip].filter(Boolean).join(", ")}</li>
      ${lead.message ? `<li><b>Mensaje:</b> ${lead.message}</li>` : ""}
    </ul>`;
}

/**
 * Chamber concierge lead → QuickBooks. Creates a Customer + Invoice (online pay
 * link for US; offline/concierge for EU & LATAM) and lets QBO email it.
 * Safety net: if QBO is unreachable, email the owner so the lead is never lost.
 */
export async function POST(req: NextRequest) {
  let lead: Lead;
  try {
    lead = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!lead?.region || !isRegionId(lead.region) || !lead.email) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }

  // Always record the lead (mock log) before anything else.
  submitLeadMock(lead);

  const region = getRegion(lead.region);
  const lang = region.lang;
  const chamber = getProduct("chamber")!;
  const copy = productCopy(chamber, lang);
  const price = priceFor("chamber", region.id);
  const allowOnlinePayment = region.id === "US";
  const ref = ("RH" + Date.now().toString(36) + Math.floor(Math.random() * 900 + 100)).toUpperCase();

  const memo =
    region.id === "US"
      ? lang === "es"
        ? "Incluye link de pago online."
        : "Includes an online payment link."
      : price.onRequest
        ? lang === "es"
          ? "Precio bajo consulta — el equipo concierge confirmará el importe. Cobro offline."
          : "Price on request — concierge will confirm the amount. Offline payment."
        : lang === "es"
          ? "Cobro offline gestionado por concierge."
          : "Offline payment handled by concierge.";

  if (isQboConnected()) {
    try {
      const invoice = await createInvoiceWithLink({
        customer: {
          fname: lead.fname,
          lname: lead.lname,
          email: lead.email,
          phone: lead.phone,
          country: lead.country,
          address: lead.address,
        },
        itemName: "RETO Hyperbaric Chamber",
        description: copy.name + (price.onRequest ? (lang === "es" ? " — precio bajo consulta" : " — price on request") : ""),
        unitPrice: price.value ?? 0,
        qty: 1,
        currency: region.currency,
        billEmail: lead.email,
        allowOnlinePayment,
        docNumber: ref,
        memo,
      });
      return NextResponse.json({ ok: true, via: "quickbooks", ref, invoiceId: invoice.invoiceId });
    } catch (err) {
      console.error("[RETO] QBO invoice failed, using email backup:", err instanceof Error ? err.message : err);
      await notifyOwner(
        `RETO — solicitud de cámara (${ref}) · QBO falló`,
        leadHtml(lead, ref, "No se pudo crear la factura en QuickBooks; sigue el lead manualmente."),
      );
      return NextResponse.json({ ok: true, via: "email-backup", ref });
    }
  }

  // QBO not connected → safety net only.
  await notifyOwner(
    `RETO — solicitud de cámara (${ref})`,
    leadHtml(lead, ref, "QuickBooks no está conectado; lead enviado por respaldo."),
  );
  return NextResponse.json({ ok: true, via: "email-backup", ref });
}
