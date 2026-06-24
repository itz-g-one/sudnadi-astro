import { z } from "zod";

/**
 * Shared Zod validation schemas.
 *
 * Used on both client (react-hook-form) and server (createServerFn input validation).
 */

// ─── Contact Form ───────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .regex(/^[0-9 +\-]{7,20}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  topic: z.string().min(1, "Please select a topic."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ─── Booking / Checkout Form ────────────────────────────────

export const bookingFormSchema = z.object({
  serviceSlug: z.string().min(1, "Please select a service."),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  birthTime: z.string().min(1, "Birth time is required."),
  birthPlace: z
    .string()
    .min(3, "Birth place must be at least 3 characters.")
    .max(200, "Birth place is too long."),
  question: z
    .string()
    .max(5000, "Question is too long.")
    .optional()
    .or(z.literal("")),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// ─── PayU Callback ──────────────────────────────────────────

export const payuCallbackSchema = z.object({
  mihpayid: z.string(),
  status: z.string(),
  txnid: z.string(),
  amount: z.string(),
  productinfo: z.string(),
  firstname: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  hash: z.string(),
  key: z.string(),
  error: z.string().optional(),
  error_Message: z.string().optional(),
  udf1: z.string().optional(), // booking public_ref
  udf2: z.string().optional(),
  udf3: z.string().optional(),
  udf4: z.string().optional(),
  udf5: z.string().optional(),
  additionalCharges: z.string().optional(),
});

export type PayUCallbackData = z.infer<typeof payuCallbackSchema>;
