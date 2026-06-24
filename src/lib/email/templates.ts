/**
 * Branded email templates for Astrosuman.
 *
 * All templates use inline CSS for maximum email client compatibility.
 * Colours match the Astrosuman brand palette.
 */

const BRAND = {
  saffron: "#F4854A",
  indigo: "#13133A",
  cream: "#FAF7F2",
  gold: "#C89B3C",
  whatsappGreen: "#25D366",
  whatsappLink: "https://wa.me/919717691644",
  supportEmail: "Erssuman18@gmail.com",
};

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e1d5;">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND.indigo};padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:24px;color:${BRAND.cream};font-weight:600;letter-spacing:0.5px;">✦ Astrosuman</h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f5f0e8;border-top:1px solid #e8e1d5;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#666;">
              <a href="${BRAND.whatsappLink}" style="color:${BRAND.saffron};text-decoration:none;">WhatsApp</a> · 
              <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.saffron};text-decoration:none;">Email</a>
            </p>
            <p style="margin:0;font-size:11px;color:#999;">© Astrosuman · Personalised astrology by Sudhansu Suman</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Contact Form: Admin Notification ───────────────────────

export function contactAdminNotification(data: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.indigo};">📩 New Contact Message</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;width:100px;">Name</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};font-weight:500;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Email</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;"><a href="mailto:${data.email}" style="color:${BRAND.saffron};">${data.email}</a></td>
      </tr>
      ${data.phone ? `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Phone</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};">${data.phone}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Topic</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};">${data.topic}</td>
      </tr>
    </table>
    <div style="background:${BRAND.cream};border-radius:8px;padding:16px;border:1px solid #e8e1d5;">
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
    </div>
  `);
}

// ─── Contact Form: Auto-Reply to User ───────────────────────

export function contactAutoReply(data: { name: string }): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.indigo};">Thank you, ${data.name}.</h2>
    <p style="font-size:14px;color:#333;line-height:1.7;">
      Your message has been received. Sudhansu will reply within 24 hours.
    </p>
    <p style="font-size:14px;color:#333;line-height:1.7;">
      For a quicker response, you can also reach out directly on WhatsApp:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="background:${BRAND.whatsappGreen};border-radius:24px;">
          <a href="${BRAND.whatsappLink}" style="display:inline-block;padding:12px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
            💬 Message on WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;color:#888;">This is an automated message — no need to reply to this email.</p>
  `);
}

// ─── Booking Confirmation (after payment success) ───────────

export function bookingConfirmation(data: {
  customerName: string;
  serviceName: string;
  publicRef: string;
  amount: number;
  deliveryText: string;
  transactionId?: string;
}): string {
  return baseLayout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:60px;height:60px;border-radius:50%;background:#e6f9ed;line-height:60px;font-size:28px;">✓</div>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:${BRAND.indigo};text-align:center;">Booking Confirmed</h2>
    <p style="text-align:center;font-size:14px;color:#666;margin:0 0 24px;">
      Thank you, ${data.customerName}. Your reading is being prepared.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:8px;padding:4px;margin-bottom:24px;border:1px solid #e8e1d5;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:13px;color:#888;">Booking Ref</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:14px;color:${BRAND.indigo};font-weight:600;text-align:right;">${data.publicRef}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:13px;color:#888;">Reading</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:14px;color:${BRAND.indigo};text-align:right;">${data.serviceName}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:13px;color:#888;">Amount Paid</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:14px;color:${BRAND.gold};font-weight:600;text-align:right;">₹${data.amount}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:13px;color:#888;">Delivery</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:14px;color:${BRAND.indigo};text-align:right;">${data.deliveryText}</td>
      </tr>
      ${data.transactionId ? `<tr>
        <td style="padding:12px 16px;font-size:13px;color:#888;">Transaction ID</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.indigo};text-align:right;font-family:monospace;">${data.transactionId}</td>
      </tr>` : ""}
    </table>
    <h3 style="margin:0 0 12px;font-size:16px;color:${BRAND.indigo};">What happens next</h3>
    <ol style="padding-left:20px;font-size:14px;color:#333;line-height:1.8;">
      <li>Sudhansu reviews your birth details for accuracy.</li>
      <li>Your reading is prepared by hand — no templates.</li>
      <li>The PDF report arrives in your inbox within <strong>${data.deliveryText}</strong>.</li>
    </ol>
    <p style="font-size:14px;color:#333;line-height:1.7;margin-top:20px;">
      Have a question? Reach out on WhatsApp — one round of follow-up is included.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr>
        <td style="background:${BRAND.whatsappGreen};border-radius:24px;">
          <a href="${BRAND.whatsappLink}" style="display:inline-block;padding:12px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
            💬 WhatsApp Sudhansu
          </a>
        </td>
      </tr>
    </table>
  `);
}

// ─── Booking: Admin Alert ───────────────────────────────────

export function bookingAdminAlert(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  publicRef: string;
  amount: number;
  question?: string;
}): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.indigo};">🆕 New Booking Received</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;width:120px;">Reference</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};font-weight:600;">${data.publicRef}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Customer</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};">${data.customerName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Email</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;"><a href="mailto:${data.customerEmail}" style="color:${BRAND.saffron};">${data.customerEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Phone</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};">${data.customerPhone}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Service</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.indigo};">${data.serviceName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:13px;color:#888;">Amount</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:${BRAND.gold};font-weight:600;">₹${data.amount}</td>
      </tr>
    </table>
    ${data.question ? `
    <div style="background:${BRAND.cream};border-radius:8px;padding:16px;border:1px solid #e8e1d5;">
      <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Customer's question</p>
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.question}</p>
    </div>` : ""}
  `);
}

// ─── Payment Failure Notice ─────────────────────────────────

export function paymentFailureNotice(data: {
  customerName: string;
  serviceName: string;
  publicRef: string;
  amount: number;
  error?: string;
}): string {
  return baseLayout(`
    <h2 style="margin:0 0 8px;font-size:22px;color:${BRAND.indigo};text-align:center;">Payment could not be processed</h2>
    <p style="text-align:center;font-size:14px;color:#666;margin:0 0 24px;">
      Hi ${data.customerName}, your payment for <strong>${data.serviceName}</strong> was not completed.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:8px;padding:4px;margin-bottom:24px;border:1px solid #e8e1d5;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:13px;color:#888;">Booking Ref</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e1d5;font-size:14px;color:${BRAND.indigo};text-align:right;">${data.publicRef}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#888;">Amount</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.indigo};text-align:right;">₹${data.amount}</td>
      </tr>
    </table>
    ${data.error ? `<p style="font-size:13px;color:#c0392b;margin-bottom:16px;">Reason: ${data.error}</p>` : ""}
    <p style="font-size:14px;color:#333;line-height:1.7;">
      You can try again from the checkout page, or reach out to us directly if you need help.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr>
        <td style="background:${BRAND.saffron};border-radius:24px;">
          <a href="${BRAND.whatsappLink}" style="display:inline-block;padding:12px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
            💬 Get help on WhatsApp
          </a>
        </td>
      </tr>
    </table>
  `);
}
