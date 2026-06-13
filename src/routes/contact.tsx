import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SiteShell } from "@/components/SiteShell";
import { ConstellationBg, SectionEyebrow } from "@/components/Ornaments";
import { Phone, Mail, MessageCircle, MapPin, Check, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sudhansu Suman — Astrosuman" },
      {
        name: "description",
        content: "Talk to Sudhansu directly — WhatsApp, phone, email, or the message form.",
      },
      { property: "og:title", content: "Contact — Astrosuman" },
      { property: "og:description", content: "Get in touch with Sudhansu Suman." },
    ],
  }),
  component: ContactPage,
});

type FormValues = { name: string; email: string; phone: string; topic: string; message: string };

function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit = handleSubmit(async (data) => {
    // No backend wired yet — simulate send.
    await new Promise((r) => setTimeout(r, 600));
    console.log("Contact submission:", data);
    setSent(true);
    reset();
  });

  return (
    <SiteShell>
      <section className="relative bg-indigo-deep text-cream pt-16 md:pt-24 pb-16 overflow-hidden">
        <ConstellationBg color="#F4854A" className="opacity-25" />
        <div className="relative mx-auto max-w-3xl px-5 md:px-6 text-center">
          <SectionEyebrow>Get in touch</SectionEyebrow>
          <h1 className="font-display text-[40px] md:text-[58px] leading-[1.05] text-cream font-semibold">
            Talk to Sudhansu directly.
          </h1>
          <p className="mt-4 text-cream/75 max-w-xl mx-auto">
            Quickest reply on WhatsApp. Detailed questions are welcome by email or through the form below.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-6 grid lg:grid-cols-[1.4fr_1fr] gap-10">
          {/* FORM */}
          <div className="bg-white border-t-4 border-saffron border-x border-b border-border-light rounded-lg p-7 md:p-10 shadow-warm">
            {sent ? (
              <div className="text-center py-10">
                <div className="mx-auto w-14 h-14 rounded-full bg-success/15 text-success inline-flex items-center justify-center">
                  <Check size={28} aria-hidden />
                </div>
                <h2 className="mt-5 font-display text-[28px] text-indigo-deep">Message sent.</h2>
                <p className="mt-2 text-text-body">Sudhansu will reply within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-saffron font-semibold border-b-2 border-saffron-border hover:border-saffron pb-0.5"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <h2 className="font-display text-[26px] text-indigo-deep">Send a message</h2>
                <Field label="Your name" error={errors.name?.message}>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register("name", { required: "Please share your name.", minLength: { value: 2, message: "At least 2 characters." } })}
                    className={inputCls(!!errors.name)}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register("email", {
                        required: "Email is required.",
                        pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email." },
                      })}
                      className={inputCls(!!errors.email)}
                    />
                  </Field>
                  <Field label="Phone (optional)" error={errors.phone?.message}>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      {...register("phone", { pattern: { value: /^[0-9 +-]{7,}$/, message: "Enter a valid number." } })}
                      className={inputCls(!!errors.phone)}
                    />
                  </Field>
                </div>
                <Field label="What's this about?" error={errors.topic?.message}>
                  <select
                    id="topic"
                    {...register("topic", { required: "Pick one." })}
                    className={inputCls(!!errors.topic)}
                  >
                    <option value="">Select a topic</option>
                    <option>General question</option>
                    <option>Recommend a reading for me</option>
                    <option>Custom consultation</option>
                    <option>Existing booking</option>
                  </select>
                </Field>
                <Field label="Your message" error={errors.message?.message}>
                  <textarea
                    id="message"
                    rows={5}
                    aria-invalid={!!errors.message}
                    {...register("message", { required: "A short message helps.", minLength: { value: 10, message: "At least 10 characters." } })}
                    className={inputCls(!!errors.message) + " resize-y"}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-saffron text-white px-7 py-3.5 rounded-full font-semibold hover:bg-saffron-hover transition-colors disabled:opacity-60"
                >
                  <Send size={16} aria-hidden /> {isSubmitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* SIDE */}
          <aside className="space-y-4">
            <ContactItem
              icon={MessageCircle}
              label="WhatsApp — fastest"
              value="+91 97176 91644"
              href="https://wa.me/919717691644"
            />
            <ContactItem icon={Phone} label="Call" value="+91 97176 91644" href="tel:+919717691644" />
            <ContactItem icon={Mail} label="Email" value="Erssuman18@gmail.com" href="mailto:Erssuman18@gmail.com" />
            <div className="bg-cream-warm border border-border-warm rounded-lg p-6 flex items-start gap-3">
              <MapPin size={18} className="text-saffron mt-0.5 shrink-0" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted font-mono">Based in</p>
                <p className="font-display text-lg text-indigo-deep mt-0.5">Delhi NCR · serving worldwide</p>
                <p className="text-sm text-text-body mt-1">All readings delivered digitally by email.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
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

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 bg-white border border-border-light rounded-lg p-5 hover:border-saffron hover:shadow-warm transition-all"
    >
      <span className="w-11 h-11 rounded-full bg-saffron-ghost text-saffron inline-flex items-center justify-center shrink-0">
        <Icon size={18} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-text-muted font-mono">{label}</p>
        <p className="font-semibold text-indigo-deep truncate">{value}</p>
      </div>
    </a>
  );
}
