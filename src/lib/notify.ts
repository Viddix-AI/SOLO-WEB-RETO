import "server-only";

/**
 * Owner notification — the safety net for leads when QuickBooks is unreachable.
 * Uses Resend (HTTP API) when RESEND_API_KEY + OWNER_EMAIL are configured;
 * otherwise logs the content so the lead is never silently lost.
 */
export async function notifyOwner(subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL ?? "RETO <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (res.ok) return true;
      console.error("[RETO] Resend error:", res.status, await res.text());
    } catch (err) {
      console.error("[RETO] Resend exception:", err instanceof Error ? err.message : err);
    }
  }

  // Fallback: log so the lead is recoverable from server logs.
  console.error(`[RETO] OWNER NOTIFY (email not configured) — ${subject}\n${html}`);
  return false;
}
