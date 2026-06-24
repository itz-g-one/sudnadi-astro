-- ============================================================
-- Astrosuman — Initial Database Schema
-- ============================================================
-- Run in Supabase SQL Editor or via supabase db push.
-- All tables use UUIDs and include created_at / updated_at.
-- ============================================================

-- ─── Helper: auto-update updated_at ─────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── ENUM TYPES ─────────────────────────────────────────────

CREATE TYPE public.booking_status AS ENUM (
  'draft',
  'pending_payment',
  'paid',
  'processing',
  'completed',
  'cancelled',
  'failed'
);

CREATE TYPE public.order_status AS ENUM (
  'created',
  'pending',
  'success',
  'failure',
  'refunded'
);

CREATE TYPE public.contact_status AS ENUM (
  'new',
  'read',
  'replied',
  'closed'
);

CREATE TYPE public.admin_role AS ENUM (
  'admin',
  'editor'
);

-- ─── 1. services ────────────────────────────────────────────

CREATE TABLE public.services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  price         numeric(10,2) NOT NULL DEFAULT 0,
  category      text NOT NULL DEFAULT 'personal',
  tagline       text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  delivery_text text NOT NULL DEFAULT '',
  image_url     text,
  covers        jsonb NOT NULL DEFAULT '[]'::jsonb,
  receive       jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs          jsonb NOT NULL DEFAULT '[]'::jsonb,
  active        boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  seo_title     text,
  seo_description text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_services_slug ON public.services (slug);
CREATE INDEX idx_services_active ON public.services (active) WHERE active = true;

-- ─── 2. bookings ────────────────────────────────────────────

CREATE TABLE public.bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_ref      text NOT NULL UNIQUE,
  service_id      uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  customer_name   text NOT NULL,
  customer_email  text NOT NULL,
  customer_phone  text NOT NULL,
  date_of_birth   date NOT NULL,
  birth_time      time NOT NULL,
  birth_place     text NOT NULL,
  question        text,
  status          public.booking_status NOT NULL DEFAULT 'draft',
  amount          numeric(10,2) NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'INR',
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_bookings_public_ref ON public.bookings (public_ref);
CREATE INDEX idx_bookings_status ON public.bookings (status);
CREATE INDEX idx_bookings_email ON public.bookings (customer_email);
CREATE INDEX idx_bookings_created ON public.bookings (created_at DESC);

-- ─── 3. orders ──────────────────────────────────────────────

CREATE TABLE public.orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  gateway         text NOT NULL DEFAULT 'payu',
  gateway_txn_id  text,
  gateway_mihpayid text,
  hash            text,
  amount          numeric(10,2) NOT NULL DEFAULT 0,
  status          public.order_status NOT NULL DEFAULT 'created',
  raw_request     jsonb,
  raw_response    jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_orders_booking ON public.orders (booking_id);
CREATE INDEX idx_orders_txn ON public.orders (gateway_txn_id);
CREATE INDEX idx_orders_status ON public.orders (status);

-- ─── 4. payments (event log) ────────────────────────────────

CREATE TABLE public.payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type    text NOT NULL,
  event_status  text NOT NULL,
  raw_payload   jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_order ON public.payments (order_id);

-- ─── 5. contact_messages ────────────────────────────────────

CREATE TABLE public.contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  topic       text NOT NULL,
  message     text NOT NULL,
  status      public.contact_status NOT NULL DEFAULT 'new',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_contact_status ON public.contact_messages (status);
CREATE INDEX idx_contact_created ON public.contact_messages (created_at DESC);

-- ─── 6. blog_posts ──────────────────────────────────────────

CREATE TABLE public.blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE,
  title           text NOT NULL,
  category        text NOT NULL DEFAULT '',
  excerpt         text NOT NULL DEFAULT '',
  body            text NOT NULL DEFAULT '',
  read_time       integer NOT NULL DEFAULT 5,
  published       boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  hero_image_url  text,
  seo_title       text,
  seo_description text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_blog_slug ON public.blog_posts (slug);
CREATE INDEX idx_blog_published ON public.blog_posts (published, published_at DESC) WHERE published = true;

-- ─── 7. testimonials ────────────────────────────────────────

CREATE TABLE public.testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  location    text NOT NULL DEFAULT '',
  rating      smallint NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review      text NOT NULL,
  approved    boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_testimonials_approved ON public.testimonials (approved, sort_order) WHERE approved = true;

-- ─── 8. site_settings ───────────────────────────────────────

CREATE TABLE public.site_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  value       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 9. admin_profiles ──────────────────────────────────────

CREATE TABLE public.admin_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.admin_role NOT NULL DEFAULT 'admin',
  full_name   text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 10. audit_logs ─────────────────────────────────────────

CREATE TABLE public.audit_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   uuid,
  action          text NOT NULL,
  entity_type     text NOT NULL,
  entity_id       text,
  details         jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_created ON public.audit_logs (created_at DESC);
