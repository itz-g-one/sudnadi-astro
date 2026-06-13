import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { services } from "@/data/services";
import { Check, MessageCircle } from "lucide-react";
import { z } from "zod";

const search = z.object({
  id: z.string().optional(),
  service: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/order-success")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Booking confirmed — Astrosuman" }, { name: "robots", content: "noindex" }] }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { id, service: slug, name, email } = Route.useSearch();
  const service = services.find((s) => s.slug === slug);

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-success/15 text-success inline-flex items-center justify-center">
            <Check size={40} strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mt-7 font-display text-[40px] md:text-[52px] text-indigo-deep font-semibold leading-tight">
            Booking confirmed.
          </h1>
          <p className="mt-3 text-text-body">
            Thank you{name ? `, ${name}` : ""}. Sudhansu has received your request and will begin preparing your reading.
          </p>

          <div className="mt-10 bg-white border border-border-light rounded-lg p-7 text-left shadow-warm">
            <div className="flex items-center justify-between pb-4 border-b border-border-light">
              <span className="text-xs uppercase tracking-widest text-text-muted font-mono">Order</span>
              <span className="font-mono text-sm text-indigo-deep">#{id ?? "—"}</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {service && (
                <Row label="Reading" value={service.name} />
              )}
              {service && <Row label="Amount" value={`₹${service.price}`} />}
              {service && <Row label="Delivery" value={service.delivery} />}
              {email && <Row label="Delivered to" value={email} />}
            </dl>
          </div>

          <h2 className="mt-12 font-display text-[26px] md:text-[30px] text-indigo-deep font-semibold">
            What happens next
          </h2>
          <ol className="mt-6 space-y-4 text-left">
            {[
              { n: 1, title: "Sudhansu reviews your details", text: "He'll cross-check your birth time and place to ensure accuracy." },
              { n: 2, title: "Your reading is prepared by hand", text: "Drawn from your specific chart — no templates." },
              { n: 3, title: "PDF arrives in your inbox", text: `Within ${service?.delivery ?? "1–5 business days"}.` },
            ].map((s) => (
              <li key={s.n} className="flex gap-4 bg-cream-warm/60 border border-border-warm rounded-md p-4">
                <span className="w-9 h-9 rounded-full bg-saffron text-white inline-flex items-center justify-center font-display font-semibold shrink-0">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-indigo-deep">{s.title}</p>
                  <p className="text-sm text-text-body mt-0.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/919717691644"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold"
            >
              <MessageCircle size={16} aria-hidden /> Message on WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center bg-white border border-border-light px-6 py-3 rounded-full font-semibold text-indigo-deep hover:border-saffron"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-indigo-deep text-right">{value}</dd>
    </div>
  );
}
