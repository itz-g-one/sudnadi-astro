const createServerFn = ({method}) => ({ inputValidator: () => ({ handler: (fn) => fn }) });
import { z } from "zod";
import { getSupabaseAdmin } from "../supabase.server";
import { getServerConfig } from "../config.server";
import { sendEmail } from "../email/send-email.server";
import {
  bookingConfirmation,
  bookingAdminAlert,
  paymentFailureNotice,
} from "../email/templates";
import {
  generatePayUHash,
  verifyPayUReverseHash,
  getPayUUrl,
  getPayUConfig,
} from "./payu.server";
import { payuCallbackSchema } from "../validations";

// ─── Create PayU Order ──────────────────────────────────────

export const createPayUOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      bookingId: z.string().uuid(),
      orderId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseAdmin();
    const config = getServerConfig();
    const payu = getPayUConfig();

    // Look up booking
    const { data: bookingData, error: bErr } = await db
      .from("bookings")
      .select("id, public_ref, customer_name, customer_email, customer_phone, amount, status")
      .eq("id", data.bookingId)
      .single();

    if (bErr || !bookingData) {
      throw new Error("Booking not found.");
    }

    const booking = bookingData as {
      id: string;
      public_ref: string;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      amount: number;
      status: string;
    };

    if (booking.status !== "pending_payment") {
      throw new Error(`Booking status is "${booking.status}" — cannot initiate payment.`);
    }

    const { data: orderData, error: oErr } = await db
      .from("orders")
      .select("id, status")
      .eq("id", data.orderId)
      .eq("booking_id", data.bookingId)
      .single();

    if (oErr || !orderData) {
      throw new Error("Order not found.");
    }

    const order = orderData as { id: string; status: string };

    // Look up service name for productinfo
    const { data: bookingWithService } = await db
      .from("bookings")
      .select("services(name)")
      .eq("id", data.bookingId)
      .single();

    const svcRef = bookingWithService as { services: { name: string } | null } | null;
    const serviceName = svcRef?.services?.name ?? "Astrology Reading";

    // Build PayU parameters
    const txnid = order.id.replace(/-/g, "").slice(0, 25);
    const amount = Number(booking.amount).toFixed(2);
    const successUrl = `${config.appUrl}/api/payu-callback`;
    const failureUrl = `${config.appUrl}/api/payu-callback`;

    const hash = generatePayUHash({
      key: payu.key,
      txnid,
      amount,
      productinfo: serviceName,
      firstname: booking.customer_name,
      email: booking.customer_email,
      salt: payu.salt,
      udf1: booking.public_ref,
    });

    // Update order with hash and raw request
    const formFields: Record<string, string> = {
      key: payu.key,
      txnid,
      amount,
      productinfo: serviceName,
      firstname: booking.customer_name,
      email: booking.customer_email,
      phone: booking.customer_phone,
      surl: successUrl,
      furl: failureUrl,
      hash,
      udf1: booking.public_ref,
      service_provider: "payu_paisa",
    };

    await db
      .from("orders")
      .update({
        gateway_txn_id: txnid,
        hash,
        status: "pending" as const,
        raw_request: formFields as unknown as Record<string, unknown>,
      })
      .eq("id", order.id);

    return {
      success: true as const,
      payuUrl: getPayUUrl(payu.mode),
      formFields,
    };
  });

// ─── Verify PayU Payment (Callback) ────────────────────────

export const verifyPayUPayment = createServerFn({ method: "POST" })
  .inputValidator(payuCallbackSchema)
  .handler(async ({ data: callbackData }) => {
    const db = getSupabaseAdmin();
    const config = getServerConfig();
    const payu = getPayUConfig();

    // 1. Verify reverse hash
    const isValid = verifyPayUReverseHash({
      salt: payu.salt,
      status: callbackData.status,
      email: callbackData.email,
      firstname: callbackData.firstname,
      productinfo: callbackData.productinfo,
      amount: callbackData.amount,
      txnid: callbackData.txnid,
      key: callbackData.key,
      udf1: callbackData.udf1,
      udf2: callbackData.udf2,
      udf3: callbackData.udf3,
      udf4: callbackData.udf4,
      udf5: callbackData.udf5,
      additionalCharges: callbackData.additionalCharges,
      receivedHash: callbackData.hash,
    });

    if (!isValid) {
      console.error("[payu] Hash verification failed for txnid:", callbackData.txnid);
      await db.from("audit_logs").insert({
        action: "payu_hash_verification_failed",
        entity_type: "orders",
        entity_id: callbackData.txnid,
        details: { txnid: callbackData.txnid, status: callbackData.status },
      });
      throw new Error("Payment verification failed — invalid hash.");
    }

    // 2. Find the order by txnid
    const { data: orderData, error: orderErr } = await db
      .from("orders")
      .select("id, booking_id, status")
      .eq("gateway_txn_id", callbackData.txnid)
      .single();

    if (orderErr || !orderData) {
      console.error("[payu] Order not found for txnid:", callbackData.txnid);
      throw new Error("Order not found for this transaction.");
    }

    const order = orderData as { id: string; booking_id: string; status: string };

    // 3. Idempotency: if order is already success, don't process again
    if (order.status === "success") {
      return {
        success: true as const,
        publicRef: callbackData.udf1 || "",
        status: "already_processed" as const,
        paymentStatus: "success" as const,
      };
    }

    // 4. Determine result
    const isSuccess = callbackData.status.toLowerCase() === "success";
    const newOrderStatus = isSuccess ? ("success" as const) : ("failure" as const);
    const newBookingStatus = isSuccess ? ("paid" as const) : ("failed" as const);

    // 5. Update order
    await db
      .from("orders")
      .update({
        status: newOrderStatus,
        gateway_mihpayid: callbackData.mihpayid,
        raw_response: callbackData as unknown as Record<string, unknown>,
      })
      .eq("id", order.id);

    // 6. Update booking
    await db
      .from("bookings")
      .update({ status: newBookingStatus })
      .eq("id", order.booking_id);

    // 7. Log payment event
    await db.from("payments").insert({
      order_id: order.id,
      event_type: "payu_callback",
      event_status: callbackData.status,
      raw_payload: callbackData as unknown as Record<string, unknown>,
    });

    // 8. Send emails based on result
    if (isSuccess) {
      const { data: bookingData } = await db
        .from("bookings")
        .select("public_ref, customer_name, customer_email, customer_phone, amount, question, services(name, delivery_text)")
        .eq("id", order.booking_id)
        .single();

      if (bookingData) {
        const bk = bookingData as {
          public_ref: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          amount: number;
          question: string | null;
          services: { name: string; delivery_text: string } | null;
        };

        sendEmail({
          to: bk.customer_email,
          subject: `Booking confirmed — ${bk.services?.name ?? "Your Reading"} · ${bk.public_ref}`,
          html: bookingConfirmation({
            customerName: bk.customer_name,
            serviceName: bk.services?.name ?? "Astrology Reading",
            publicRef: bk.public_ref,
            amount: Number(bk.amount),
            deliveryText: bk.services?.delivery_text ?? "3–5 business days",
            transactionId: callbackData.mihpayid,
          }),
        }).catch((err) => console.error("[payu] Confirmation email failed:", err));

        const adminEmail = config.adminEmail || "Erssuman18@gmail.com";
        sendEmail({
          to: adminEmail,
          subject: `✅ Payment received — ${bk.public_ref} · ₹${bk.amount}`,
          html: bookingAdminAlert({
            customerName: bk.customer_name,
            customerEmail: bk.customer_email,
            customerPhone: bk.customer_phone,
            serviceName: bk.services?.name ?? "Astrology Reading",
            publicRef: bk.public_ref,
            amount: Number(bk.amount),
            question: bk.question ?? undefined,
          }),
        }).catch((err) => console.error("[payu] Admin alert email failed:", err));
      }
    } else {
      const { data: bookingData } = await db
        .from("bookings")
        .select("public_ref, customer_name, customer_email, amount, services(name)")
        .eq("id", order.booking_id)
        .single();

      if (bookingData) {
        const bk = bookingData as {
          public_ref: string;
          customer_name: string;
          customer_email: string;
          amount: number;
          services: { name: string } | null;
        };

        sendEmail({
          to: bk.customer_email,
          subject: `Payment not completed — ${bk.public_ref}`,
          html: paymentFailureNotice({
            customerName: bk.customer_name,
            serviceName: bk.services?.name ?? "Astrology Reading",
            publicRef: bk.public_ref,
            amount: Number(bk.amount),
            error: callbackData.error_Message,
          }),
        }).catch((err) => console.error("[payu] Failure email failed:", err));
      }
    }

    // 9. Audit log
    await db.from("audit_logs").insert({
      action: isSuccess ? "payment_success" : "payment_failure",
      entity_type: "orders",
      entity_id: order.id,
      details: {
        txnid: callbackData.txnid,
        mihpayid: callbackData.mihpayid,
        amount: callbackData.amount,
        status: callbackData.status,
        bookingRef: callbackData.udf1,
      },
    });

    return {
      success: true as const,
      publicRef: callbackData.udf1 || "",
      paymentStatus: newOrderStatus,
    };
  });

// ─── Fetch Booking by Public Ref ────────────────────────────

export const getBookingByRef = createServerFn({ method: "POST" })
  .inputValidator(z.object({ publicRef: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getSupabaseAdmin();

    const { data: bookingData, error } = await db
      .from("bookings")
      .select(
        "id, public_ref, customer_name, customer_email, amount, currency, status, question, created_at, services(name, delivery_text, slug), orders(id, status, gateway_txn_id, gateway_mihpayid, amount)",
      )
      .eq("public_ref", data.publicRef)
      .single();

    if (error || !bookingData) {
      return { success: false as const, error: "Booking not found." };
    }

    const booking = bookingData as {
      id: string;
      public_ref: string;
      customer_name: string;
      customer_email: string;
      amount: number;
      currency: string;
      status: string;
      question: string | null;
      created_at: string;
      services: { name: string; delivery_text: string; slug: string } | null;
      orders: Array<{
        id: string;
        status: string;
        gateway_txn_id: string | null;
        gateway_mihpayid: string | null;
        amount: number;
      }>;
    };

    const latestOrder = booking.orders?.[0] ?? null;

    return {
      success: true as const,
      booking: {
        publicRef: booking.public_ref,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        amount: Number(booking.amount),
        currency: booking.currency,
        status: booking.status,
        createdAt: booking.created_at,
        serviceName: booking.services?.name ?? "Astrology Reading",
        serviceSlug: booking.services?.slug ?? "",
        deliveryText: booking.services?.delivery_text ?? "3–5 business days",
      },
      order: latestOrder
        ? {
            status: latestOrder.status,
            transactionId: latestOrder.gateway_txn_id,
            mihpayid: latestOrder.gateway_mihpayid,
          }
        : null,
    };
  });
