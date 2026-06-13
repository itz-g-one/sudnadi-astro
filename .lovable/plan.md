
# Astrosuman — Warm Celestial Editorial Website

A premium, mobile-first astrology services site for Sudhansu Suman built on the project's existing stack (TanStack Start + React 19 + Tailwind v4), adapting your spec to the framework's conventions.

## Stack adaptation note

Your prompt assumes Vite + React Router + `tailwind.config.js` + `globals.css`. This project runs **TanStack Start with file-based routing** and **Tailwind v4 (CSS-first, no JS config)**. I'll preserve every design decision (tokens, fonts, layouts, copy, behavior) but wire them the TanStack/Tailwind v4 way:
- Routes as files in `src/routes/` (e.g. `services.tsx`, `services.$slug.tsx`, `blog.$slug.tsx`)
- Design tokens in `src/styles.css` under `@theme` (not `tailwind.config.js`)
- `<Link>` from `@tanstack/react-router` (not `react-router-dom`)
- Fonts loaded via `<link>` in `__root.tsx` head (not `@import url(...)` — that breaks Lightning CSS builds)

## What I'll build

### Design system (`src/styles.css`)
Saffron / indigo / gold / cream / parchment tokens, Fraunces + Plus Jakarta Sans + DM Mono, custom radii + shadows (warm/tilt/float), scroll-animate utilities, reduced-motion fallback.

### Shared shell
- `Header` — sticky, top contact strip (desktop), logo + nav, "Book Now" CTA, mobile hamburger → indigo drawer
- `Footer` — indigo-deep, brand + nav + contact columns
- `FloatingCTAs` — WhatsApp (all devices) + Phone (mobile)
- `Toaster` for form feedback
- `useScrollAnimation`, `useCountUp` hooks

### Pages
1. **Home (`/`)** — Hero (asymmetric, constellation SVG, mandala ring, social proof) → Services grid (6 cards, tilt on hover) → Trust stats (animated counters on indigo) → About teaser → Testimonials carousel (parchment cards) → Blog preview (3) → WhatsApp band
2. **Services (`/services`)** — Category tabs + search, filtered grid, empty state
3. **Service detail (`/services/$slug`)** — NEW per your feedback: hero with illustrated image, what's covered, what you'll receive, delivery timeline, FAQ, "Book this consultation" CTA → checkout
4. **About (`/about`)** — Mission, bio, specialties, why-choose, credentials, CTA band
5. **Blog (`/blog`)** — Featured post, category filter, grid
6. **Blog post (`/blog/$slug`)** — NEW per your feedback (your current build links open nothing): full article layout with hero, body, related posts, CTA
7. **Contact (`/contact`)** — Indigo hero, form card + contact panel, inline success state
8. **Checkout (`/checkout`)** — Minimal header, 2-col form + sticky summary, react-hook-form validation, 16px inputs
9. **Order success (`/order-success`)** — Animated checkmark, next-steps timeline

### Service card imagery
Generate **9 warm, illustrated, theme-matched images** (saffron + cream + indigo, hand-drawn editorial feel — lotus / kundli wheel / gemstone / cards / etc.) — one per service — saved to `src/assets/services/` and used in both cards and detail pages. No stock photos, no generic SVG placeholders.

### Copywriting pass
Rewrite all hero subtext, section intros, service descriptions, blog excerpts, about copy, CTA labels with a warm, specific, human voice — not "Find Your Cosmic Clarity" template phrasing. Concrete benefits, Indian cultural specificity, second-person address.

### Accessibility (end-to-end)
- Single `<main>` per page, proper heading order
- All icon-only buttons get `aria-label` (WhatsApp, phone, carousel arrows, hamburger, close)
- Form fields: associated `<label>`, `aria-invalid`, `aria-describedby` for errors, inline error text
- Focus-visible rings on every interactive element (saffron, 2px)
- Carousel: keyboard arrows + `aria-live="polite"` for slide changes
- Color contrast: body text on cream verified ≥ 4.5:1; saffron-on-cream only on bold/large
- Tap targets ≥ 44×44 on mobile
- `prefers-reduced-motion` respected for tilt, float, counters
- Skip-to-content link in header

### Data
`src/data/services.ts`, `testimonials.ts`, `blogPosts.ts` (full text for each post, not just excerpt, so detail pages render real content).

## Out of scope for this pass
- Razorpay live integration (checkout will collect details + simulate success → order-success; wire real payments in a follow-up once Lovable Cloud + Razorpay keys are added)
- Admin panel (PRD item; needs Lovable Cloud + auth — separate milestone)
- Zustand cart (single-service checkout flow is simpler and matches the booking pattern; can add cart later)

## Technical details
- New deps: `react-hook-form`, `lucide-react` (zustand/axios/helmet not needed on TanStack Start — head via route `head()`, no cart, fetch is built-in)
- Tailwind v4: all tokens in `@theme` block in `src/styles.css`; no `tailwind.config.js`
- Fonts: Google Fonts via `<link>` in `__root.tsx`, families referenced via `--font-display` / `--font-body` / `--font-mono` in `@theme`
- Each route gets its own `head()` with unique title + description + og tags
- Sitemap.xml + robots.txt included

Shall I proceed?
