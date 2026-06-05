import type { RegionId } from "@/lib/regions";

/** A chamber concierge request. Bloque C = mock only (no DB until Bloque D). */
export interface Lead {
  product: "chamber";
  region: RegionId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  country: string;
  address: { addr: string; addr2?: string; city: string; state?: string; zip: string };
  message?: string;
  createdAt: string; // ISO timestamp
}

// In-memory store (session lifetime). Swapped for Supabase in a later block.
const leads: Lead[] = [];

/** Mock LEAD persistence: keep in memory + log to console. Returns the new count. */
export function submitLeadMock(lead: Lead): number {
  leads.push(lead);
  console.log("[RETO] Nuevo LEAD (mock):", lead);
  return leads.length;
}

export function getLeadsMock(): readonly Lead[] {
  return leads;
}
