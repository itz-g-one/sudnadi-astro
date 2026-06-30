

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a transactional email via Resend.
 *
 * Server-only — the `.server.ts` suffix keeps the API key out of the
 * client bundle. Falls back gracefully if RESEND_API_KEY is missing
 * (logs a warning instead of crashing).
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email not sent:", opts.subject);
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Astrosuman <noreply@sudnadiastro.com>",
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("[email] Resend API error:", res.status, errorBody);
      return { success: false, error: `Resend API ${res.status}: ${errorBody}` };
    }

    const data = (await res.json()) as { id: string };
    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Send failed:", message);
    return { success: false, error: message };
  }
}
