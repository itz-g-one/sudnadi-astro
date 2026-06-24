-- ============================================================
-- Astrosuman — Supabase Storage Buckets
-- ============================================================

-- ─── Create buckets ─────────────────────────────────────────

-- Public bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Public bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Private bucket for generated PDF reports
INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false);

-- ─── Storage Policies ───────────────────────────────────────

-- Public can read service images
CREATE POLICY "Public read access for service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

-- Public can read blog images
CREATE POLICY "Public read access for blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Admin can upload/manage service images
CREATE POLICY "Admin manage service images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'service-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'service-images' AND public.is_admin());

-- Admin can upload/manage blog images
CREATE POLICY "Admin manage blog images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'blog-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());

-- Admin can manage reports
CREATE POLICY "Admin manage reports"
  ON storage.objects FOR ALL
  USING (bucket_id = 'reports' AND public.is_admin())
  WITH CHECK (bucket_id = 'reports' AND public.is_admin());
