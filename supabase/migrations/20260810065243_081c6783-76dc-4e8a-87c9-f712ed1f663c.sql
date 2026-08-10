CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'));
$$;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS brands_staff_write ON public.brands;
CREATE POLICY brands_staff_write ON public.brands FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS categories_staff_write ON public.categories;
CREATE POLICY categories_staff_write ON public.categories FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS products_staff_write ON public.products;
CREATE POLICY products_staff_write ON public.products FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS promotions_staff_write ON public.promotions;
CREATE POLICY promotions_staff_write ON public.promotions FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS site_content_staff_write ON public.site_content;
CREATE POLICY site_content_staff_write ON public.site_content FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS testimonials_staff_delete ON public.testimonials;
CREATE POLICY testimonials_staff_delete ON public.testimonials FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS testimonials_staff_update ON public.testimonials;
CREATE POLICY testimonials_staff_update ON public.testimonials FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS testimonials_public_read ON public.testimonials;
CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT TO anon, authenticated
  USING ((is_approved = true) OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS profiles_select_self ON public.profiles;
CREATE POLICY profiles_select_self ON public.profiles FOR SELECT TO authenticated
  USING ((id = auth.uid()) OR private.is_staff(auth.uid()));

DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS user_roles_select ON public.user_roles;
CREATE POLICY user_roles_select ON public.user_roles FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS user_roles_admin_write ON public.user_roles;
CREATE POLICY user_roles_admin_write ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS media_staff_read ON storage.objects;
CREATE POLICY media_staff_read ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND private.is_staff(auth.uid()));
DROP POLICY IF EXISTS media_staff_insert ON storage.objects;
CREATE POLICY media_staff_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND private.is_staff(auth.uid()));
DROP POLICY IF EXISTS media_staff_update ON storage.objects;
CREATE POLICY media_staff_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND private.is_staff(auth.uid()));
DROP POLICY IF EXISTS media_staff_delete ON storage.objects;
CREATE POLICY media_staff_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND private.is_staff(auth.uid()));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;