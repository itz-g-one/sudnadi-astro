-- ============================================================
-- Astrosuman — Row Level Security Policies
-- ============================================================
-- Enable RLS on all tables and define access policies.
-- Admin check: user_id exists in admin_profiles.
-- ============================================================

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ─── Enable RLS on all tables ───────────────────────────────

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- PUBLIC READ POLICIES (anonymous access)
-- ═══════════════════════════════════════════════════════════

-- services: public can read active services
CREATE POLICY "Public can read active services"
  ON public.services FOR SELECT
  USING (active = true);

-- blog_posts: public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

-- testimonials: public can read approved testimonials
CREATE POLICY "Public can read approved testimonials"
  ON public.testimonials FOR SELECT
  USING (approved = true);

-- site_settings: public can read selected keys
CREATE POLICY "Public can read public site settings"
  ON public.site_settings FOR SELECT
  USING (
    key IN (
      'whatsapp_number',
      'support_email',
      'social_links',
      'footer_text',
      'seo_defaults',
      'site_name'
    )
  );

-- ═══════════════════════════════════════════════════════════
-- PUBLIC WRITE POLICIES (anonymous insert)
-- ═══════════════════════════════════════════════════════════

-- contact_messages: anyone can submit a contact form
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Note: bookings and orders are created via server functions
-- using the service role key, which bypasses RLS entirely.
-- No public insert policy needed for those tables.

-- ═══════════════════════════════════════════════════════════
-- ADMIN POLICIES (full access for authenticated admins)
-- ═══════════════════════════════════════════════════════════

-- services: admin full access
CREATE POLICY "Admin full access to services"
  ON public.services FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- bookings: admin full access
CREATE POLICY "Admin full access to bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- orders: admin full access
CREATE POLICY "Admin full access to orders"
  ON public.orders FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- payments: admin full access
CREATE POLICY "Admin full access to payments"
  ON public.payments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- contact_messages: admin can read/update (already has insert for everyone)
CREATE POLICY "Admin full access to contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- blog_posts: admin full access
CREATE POLICY "Admin full access to blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- testimonials: admin full access
CREATE POLICY "Admin full access to testimonials"
  ON public.testimonials FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_settings: admin full access
CREATE POLICY "Admin full access to site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- admin_profiles: admin can read own and manage
CREATE POLICY "Admin can read admin profiles"
  ON public.admin_profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage admin profiles"
  ON public.admin_profiles FOR ALL
  USING (public.is_admin() AND (SELECT role FROM public.admin_profiles WHERE user_id = auth.uid()) = 'admin')
  WITH CHECK (public.is_admin());

-- audit_logs: admin read only (inserts via service role)
CREATE POLICY "Admin can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());
