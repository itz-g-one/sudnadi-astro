const createServerFn = ({method}) => ({ inputValidator: () => ({ handler: (fn) => fn }) });
import { getSupabaseAdmin } from "../supabase.server";
import { sendEmail } from "../email/send-email.server";
import { contactAdminNotification, contactAutoReply } from "../email/templates";
import { contactFormSchema } from "../validations";
import { getServerConfig } from "../config.server";

/**
 * Submit a contact message.
 *
 * 1. Validates input
 * 2. Inserts into contact_messages table
 * 3. Sends admin notification email
 * 4. Sends auto-reply to user
 * 5. Logs to audit_logs
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactFormSchema)
  .handler(async ({ data }) => {
    const db = getSupabaseAdmin();
    const config = getServerConfig();

    // 1. Insert contact message
    const { data: message, error: insertError } = await db
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        topic: data.topic,
        message: data.message,
        status: "new" as const,
      })
      .select("id")
      .single();

    if (insertError || !message) {
      console.error("[contact] Insert failed:", insertError);
      throw new Error("Failed to save your message. Please try again.");
    }

    const messageId = (message as { id: string }).id;

    // 2. Send admin notification (non-blocking — don't fail the request if email fails)
    const adminEmail = config.adminEmail || "Erssuman18@gmail.com";
    sendEmail({
      to: adminEmail,
      subject: `New contact: ${data.topic} — ${data.name}`,
      html: contactAdminNotification(data),
      replyTo: data.email,
    }).catch((err) => console.error("[contact] Admin email failed:", err));

    // 3. Send auto-reply to user
    sendEmail({
      to: data.email,
      subject: "We received your message — Astrosuman",
      html: contactAutoReply({ name: data.name }),
    }).catch((err) => console.error("[contact] Auto-reply failed:", err));

    // 4. Audit log
    db.from("audit_logs")
      .insert({
        action: "contact_message_created",
        entity_type: "contact_messages",
        entity_id: messageId,
        details: { name: data.name, email: data.email, topic: data.topic },
      })
      .then(({ error }) => {
        if (error) console.error("[contact] Audit log failed:", error);
      });

    return { success: true as const, messageId };
  });
