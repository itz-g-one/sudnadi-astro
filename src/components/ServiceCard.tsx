import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categoryColors, categoryLabel, type Service } from "@/data/services";

export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const { bg, text } = categoryColors[service.category];
  return (
    <article
      data-animate
      data-animate-delay={delay}
      className="tilt-card group bg-white rounded-lg overflow-hidden border border-border-light shadow-warm flex flex-col"
    >
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-cream-warm">
          <img
            src={service.image}
            alt={`Illustration for ${service.name}`}
            loading="lazy"
            width={800}
            height={640}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span
            className={`absolute top-3 left-3 ${bg} ${text} text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full`}
          >
            {categoryLabel[service.category]}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-[22px] leading-tight text-indigo-deep">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="hover:text-saffron transition-colors"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 text-saffron-hover text-sm italic">{service.tagline}</p>
        <p className="mt-3 text-[14.5px] text-text-body leading-relaxed line-clamp-3">
          {service.desc}
        </p>
        <div className="mt-5 pt-5 border-t border-border-light flex items-center justify-between">
          <span className="font-display text-2xl text-gold font-semibold">
            ₹{service.price}
          </span>
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="inline-flex items-center gap-1 text-saffron font-semibold text-[13.5px] hover:gap-2 transition-all"
          >
            View details <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
