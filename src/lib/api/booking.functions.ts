const createServerFn = ({method}) => ({ inputValidator: () => ({ handler: (fn) => fn }) });
import { getSupabaseAdmin } from "../supabase.server";
import { bookingFormSchema } from "../validations";

/**
 * Generate a unique public booking reference.
 * Format: AS-XXXXXX (6 alphanumeric characters)
 */
function generatePublicRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let ref = "AS-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

/**
 * Create a new booking.
 *
 * 1. Validates input
 * 2. Looks up service by slug (verifies it exists and is active)
 * 3. Generates a unique public_ref
 * 4. Creates booking row (status = pending_payment)
 * 5. Creates order row (status = created)
 * 6. Returns booking + order data for payment initiation
 */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(bookingFormSchema)
  .handler(async ({ data }) => {
    const db = getSupabaseAdmin();

    // 1. Look up service
    const { data: serviceData, error: svcError } = await db
      .from("services")
      .select("id, slug, name, price, delivery_text")
      .eq("slug", data.serviceSlug)
      .eq("active", true)
      .single();

    if (svcError || !serviceData) {
      throw new Error(
        `Service "${data.serviceSlug}" not found or is no longer available.`,
      );
    }

    const service = serviceData as { id: string; slug: string; name: string; price: number; delivery_text: string };

    // 2. Generate unique public ref (retry if collision)
    let publicRef = generatePublicRef();
    let refAttempts = 0;
    while (refAttempts < 5) {
      const { data: existing } = await db
        .from("bookings")
        .select("id")
        .eq("public_ref", publicRef)
        .maybeSingle();
      if (!existing) break;
      publicRef = generatePublicRef();
      refAttempts++;
    }

    // 3. Create booking
    const { data: bookingData, error: bookingError } = await db
      .from("bookings")
      .insert({
        public_ref: publicRef,
        service_id: service.id,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        date_of_birth: data.dateOfBirth,
        birth_time: data.birthTime,
        birth_place: data.birthPlace,
        question: data.question || null,
        status: "pending_payment" as const,
        amount: service.price,
        currency: "INR",
      })
      .select("id, public_ref, amount")
      .single();

    if (bookingError || !bookingData) {
      console.error("[booking] Insert failed:", bookingError);
      throw new Error("Failed to create booking. Please try again.");
    }

    const booking = bookingData as { id: string; public_ref: string; amount: number };

    // 4. Create order
    const { data: orderData, error: orderError } = await db
      .from("orders")
      .insert({
        booking_id: booking.id,
        gateway: "payu",
        amount: service.price,
        status: "created" as const,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      console.error("[booking] Order insert failed:", orderError);
      throw new Error("Failed to create order. Please try again.");
    }

    const order = orderData as { id: string };

    // 5. Audit log
    db.from("audit_logs")
      .insert({
        action: "booking_created",
        entity_type: "bookings",
        entity_id: booking.id,
        details: {
          publicRef,
          service: service.name,
          email: data.email,
          amount: service.price,
        },
      })
      .then(({ error }) => {
        if (error) console.error("[booking] Audit log failed:", error);
      });

    return {
      success: true as const,
      bookingId: booking.id,
      publicRef: booking.public_ref,
      orderId: order.id,
      amount: Number(service.price),
      serviceName: service.name,
      deliveryText: service.delivery_text,
      customerName: data.name,
      customerEmail: data.email,
    };
  });
