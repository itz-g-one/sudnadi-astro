import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMemo, useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services } from "@/data/services";
import { ShieldCheck, Clock, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { createBooking } from "@/lib/api/booking.functions";
import { createPayUOrder } from "@/lib/api/payment.functions";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Checkout — Astrosuman" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

type FormValues = {
  serviceSlug: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  question: string;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { service: presetSlug } = Route.useSearch();
  const defaultSlug = useMemo(
    () => services.find((s) => s.slug === presetSlug)?.slug ?? services[0].slug,
    [presetSlug],
  );

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "booking" | "payment" | "redirecting">("idle");
  const payuFormRef = useRef<HTMLFormElement>(null);
  const [payuData, setPayuData] = useState<{
    payuUrl: string;
    formFields: Record<string, string>;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { serviceSlug: defaultSlug },
  });

  const currentSlug = watch("serviceSlug");
  const current = services.find((s) => s.slug === currentSlug) ?? services[0];

  // Auto-submit PayU form when data is ready
  useEffect(() => {
    if (payuData && payuFormRef.current) {
      setCheckoutStep("redirecting");
      payuFormRef.current.submit();
    }
  }, [payuData]);

  const onSubmit = handleSubmit(async (data) => {
    setCheckoutError(null);

    try {
      // Step 1: Create booking
      setCheckoutStep("booking");
      const bookingResult = await createBooking({ data });

      if (!bookingResult.success) {
        throw new Error("Failed to create booking.");
      }

      // Step 2: Create PayU order
      setCheckoutStep("payment");
      const payuResult = await createPayUOrder({
        data: {
          bookingId: bookingResult.bookingId,
          orderId: bookingResult.orderId,
        },
      });

      if (!payuResult.success) {
        throw new Error("Failed to initiate payment.");
      }

      // Step 3: Set PayU data — auto-submit will trigger via useEffect
      setPayuData({
        payuUrl: payuResult.payuUrl,
        formFields: payuResult.formFields as unknown as Record<string, string>,
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckoutError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setCheckoutStep("idle");
    }
  });

  const isProcessing = checkoutStep !== "idle";

  const stepLabels = ["Reading", "You", "Birth details", "Confirm"];

  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <Header />
      <main id="main" className="flex-1 py-10 md:py-16 pb-32 lg:pb-16">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <Link to="/services" className="text-sm text-saffron font-semibold hover:underline inline-flex items-center gap-1">
            ← Continue browsing readings
          </Link>
          <h1 className="mt-3 font-display text-[34px] md:text-[44px] text-indigo-deep font-semibold">
            Complete your booking
          </h1>
          <p className="text-text-body mt-2 max-w-xl">
            Share your birth details so Sudhansu can prepare your reading personally. Everything below is kept private.
          </p>

          {/* Stepper */}
          <ol className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] font-medium" aria-label="Booking steps">
            {stepLabels.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-saffron text-white text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-indigo-deep">{label}</span>
                {i < stepLabels.length - 1 && (
                  <span className="hidden sm:inline-block w-8 h-px bg-border-warm" aria-hidden />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-8 grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <form onSubmit={onSubmit} className="bg-white border border-border-light rounded-lg p-6 md:p-8 shadow-warm space-y-8" noValidate>
              {checkoutError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700" role="alert">
                  {checkoutError}
                </div>
              )}

              <fieldset className="space-y-4" disabled={isProcessing}>
                <legend className="font-display text-xl text-indigo-deep">1. Choose your reading</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const checked = currentSlug === s.slug;
                    return (
                      <label
                        key={s.slug}
                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-md border cursor-pointer transition-colors ${
                          checked
                            ? "border-saffron bg-saffron-ghost"
                            : "border-border-light hover:border-saffron-border"
                        }`}
                      >
                        <input type="radio" value={s.slug} {...register("serviceSlug")} className="sr-only" />
                        <span className="text-sm font-medium text-indigo-deep">{s.name}</span>
                        <span className="text-sm font-semibold text-gold shrink-0">₹{s.price}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-4" disabled={isProcessing}>
                <legend className="font-display text-xl text-indigo-deep">2. Your details</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name (as on documents)" error={errors.name?.message}>
                    <input id="name" type="text" autoComplete="name" {...register("name", { required: "Required.", minLength: { value: 2, message: "Too short." } })} className={inputCls(!!errors.name)} />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input id="email" type="email" autoComplete="email" {...register("email", { required: "Required.", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email." } })} className={inputCls(!!errors.email)} />
                  </Field>
                  <Field label="Mobile (10 digits)" error={errors.phone?.message}>
                    <input id="phone" type="tel" inputMode="numeric" autoComplete="tel" {...register("phone", { required: "Required.", pattern: { value: /^\d{10}$/, message: "Enter 10 digits." } })} className={inputCls(!!errors.phone)} />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="space-y-4" disabled={isProcessing}>
                <legend className="font-display text-xl text-indigo-deep">3. Birth details</legend>
                <p className="text-[13px] text-text-muted -mt-1">
                  Tip: an exact birth time (from hospital records) gives the most accurate reading.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Date of birth" error={errors.dateOfBirth?.message}>
                    <input id="dateOfBirth" type="date" {...register("dateOfBirth", { required: "Required." })} className={inputCls(!!errors.dateOfBirth)} />
                  </Field>
                  <Field label="Time of birth (24h)" error={errors.birthTime?.message}>
                    <input id="birthTime" type="time" {...register("birthTime", { required: "Required." })} className={inputCls(!!errors.birthTime)} />
                  </Field>
                  <Field label="Place of birth (city, state, country)" error={errors.birthPlace?.message}>
                    <input id="birthPlace" type="text" {...register("birthPlace", { required: "Required.", minLength: { value: 3, message: "Too short." } })} className={inputCls(!!errors.birthPlace)} />
                  </Field>
                </div>
                <Field label="Specific question or context (optional)" error={errors.question?.message}>
                  <textarea id="question" rows={4} {...register("question")} className={inputCls(false) + " resize-y"} placeholder="Anything specific you'd like Sudhansu to focus on…" />
                </Field>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="font-display text-xl text-indigo-deep">4. Confirm & pay</legend>
                <button
                  type="submit"
                  disabled={isProcessing || isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-saffron text-white h-14 rounded-full font-semibold text-[16px] hover:bg-saffron-hover transition-colors disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden />
                      {checkoutStep === "booking" && "Creating booking…"}
                      {checkoutStep === "payment" && "Preparing payment…"}
                      {checkoutStep === "redirecting" && "Redirecting to PayU…"}
                    </>
                  ) : (
                    <>{`Confirm booking · ₹${current.price}`} <ArrowRight size={18} aria-hidden /></>
                  )}
                </button>
                <p className="text-xs text-text-muted text-center">
                  <ShieldCheck size={12} className="inline mr-1 text-saffron" aria-hidden /> Secure payment via PayU. Your details are encrypted.
                </p>
              </fieldset>
            </form>

            {/* Sticky summary */}
            <aside className="lg:sticky lg:top-28 self-start bg-parchment-grain border border-border-warm rounded-lg p-6">
              <h2 className="font-display text-xl text-indigo-deep">Order summary</h2>
              <div className="mt-4 pb-4 border-b border-border-warm">
                <p className="font-semibold text-indigo-deep">{current.name}</p>
                <p className="text-sm text-text-muted mt-1">{current.tagline}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Reading fee" value={`₹${current.price}`} />
                <Row label="Delivery" value={current.delivery} />
                <Row label="Follow-up" value="1 round included" />
              </div>
              <div className="mt-5 pt-4 border-t border-border-warm flex items-center justify-between">
                <span className="font-display text-lg text-indigo-deep">Total</span>
                <span className="font-display text-2xl text-gold font-semibold">₹{current.price}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-[13px] text-text-body">
                <li className="flex items-start gap-2"><Clock size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden /> Report emailed within {current.delivery}.</li>
                <li className="flex items-start gap-2"><ShieldCheck size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden /> Birth details kept strictly private.</li>
                <li className="flex items-start gap-2"><ArrowRight size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden /> One round of WhatsApp follow-up included.</li>
              </ul>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile sticky submit bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-border-light shadow-[0_-4px_20px_rgba(19,19,58,0.06)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono">Total</p>
          <p className="font-display text-xl text-gold font-semibold leading-none">₹{current.price}</p>
        </div>
        <button
          type="button"
          onClick={() => document.querySelector<HTMLFormElement>("form")?.requestSubmit()}
          disabled={isProcessing || isSubmitting}
          className="flex-1 max-w-[240px] inline-flex items-center justify-center gap-2 bg-saffron text-white h-12 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-colors disabled:opacity-60"
        >
          {isProcessing ? (
            <><Loader2 size={16} className="animate-spin" aria-hidden /> Processing…</>
          ) : (
            <>Confirm booking <ArrowRight size={16} aria-hidden /></>
          )}
        </button>
      </div>

      {/* Hidden PayU redirect form */}
      {payuData && (
        <form
          ref={payuFormRef}
          method="POST"
          action={payuData.payuUrl}
          style={{ display: "none" }}
        >
          {Object.entries(payuData.formFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-text-body">
      <span>{label}</span>
      <span className="font-medium text-indigo-deep">{value}</span>
    </div>
  );
}

function inputCls(invalid: boolean) {
  return `w-full px-4 py-3 rounded-md bg-cream border ${
    invalid ? "border-error" : "border-border-light"
  } text-[16px] text-indigo-text focus:outline-none focus:border-saffron`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = (children as React.ReactElement<{ id?: string }>).props.id;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-indigo-deep mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
