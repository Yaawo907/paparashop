CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text,
  cta_label text NOT NULL DEFAULT 'Découvrir le catalogue',
  cta_url text NOT NULL DEFAULT '/catalogue',
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY hero_slides_public_read ON public.hero_slides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY hero_slides_staff_write ON public.hero_slides FOR ALL TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.trusted_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text NOT NULL DEFAULT '',
  logo_url text,
  url text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trusted_clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trusted_clients TO authenticated;
GRANT ALL ON public.trusted_clients TO service_role;
ALTER TABLE public.trusted_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY trusted_clients_public_read ON public.trusted_clients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY trusted_clients_staff_write ON public.trusted_clients FOR ALL TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE TRIGGER trusted_clients_updated_at BEFORE UPDATE ON public.trusted_clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.hero_slides (title, subtitle, position) VALUES
  ('Appareils Photo Pro', 'Canon, Nikon, Sony • Reflex & Mirrorless', 1),
  ('Caméras Vidéo 4K', 'Caméscopes professionnels • Full HD & Ultra HD', 2),
  ('Accessoires Studio', 'Éclairage LED • Softbox • Réflecteurs', 3),
  ('Objectifs & Lentilles', 'Objectifs premium • Trépieds professionnels', 4),
  ('Équipement Complet', 'Solutions intégrées pour photographes pros', 5);

INSERT INTO public.trusted_clients (name, sector, logo_url, position) VALUES
  ('PORTEO BTP', 'BTP & Infrastructures', '/__l5e/assets-v1/82019ee5-25eb-49c9-9a7e-cce64da5fccd/porteo-btp.png', 1),
  ('CONCENTRIX', 'Services numériques', '/__l5e/assets-v1/0f899e3c-2ad7-41cd-bb36-fda30c6ef842/concentrix.png', 2),
  ('MSFP', 'Institutionnel', '/__l5e/assets-v1/095d206a-e12d-4952-9509-3d3d0682c1a6/msfp.png', 3),
  ('ABMS', 'Santé publique', '/__l5e/assets-v1/691832e7-32ad-4d23-b9f6-b07d5fff2d95/abms.png', 4),
  ('AFRICAN PARKS', 'Conservation & ONG', '/__l5e/assets-v1/7870b8c9-1546-4418-867e-25fba1bd5b5b/african-parks.png', 5),
  ('Bénin Excellence', 'Institutionnel', '/__l5e/assets-v1/fa4195f4-08dd-4f07-a87e-5aedfc32641a/benin-excellence.png', 6),
  ('IUCN', 'Conservation & ONG', '/__l5e/assets-v1/be5189f5-4795-4f7b-93dd-ff14bc5560d4/iucn.jpeg', 7),
  ('SENS Bénin', 'Solidarités Entreprises', '/__l5e/assets-v1/22ac82cb-7f38-4e7c-b502-f870ba68dc16/sens-benin.png', 8),
  ('SIAB', 'Industrie', '/__l5e/assets-v1/21bd9005-6155-4618-82c2-9af2d731d3a4/siab.jpeg', 9),
  ('SCB Lafarge', 'BTP & Matériaux', '/__l5e/assets-v1/6aadf39f-2cf0-487e-b685-0208f25e85f6/scb-lafarge.jpeg', 10),
  ('Golden Tulip', 'Hôtellerie', '/__l5e/assets-v1/00a753a8-9a8b-4e00-8b67-b9ee6bd5c206/golden-tulip.jpeg', 11),
  ('FedaPay', 'Fintech & Paiement', '/__l5e/assets-v1/11dcafc7-372c-4647-a95d-b4afead4404d/fedapay.jpeg', 12),
  ('NETIS', 'Télécoms & Énergie', '/__l5e/assets-v1/207fe381-0999-4b1a-ad74-6c5d62bae0d4/netis.png', 13),
  ('Ordre Hospitalier St Jean de Dieu', 'Santé & Hospitalier', '/__l5e/assets-v1/4bc24e15-8140-4583-a670-48a2160a7023/ordre-st-jean-de-dieu.png', 14),
  ('ESGIS', 'Éducation supérieure', '/__l5e/assets-v1/b192045c-80a9-4a3d-8669-e270d7561bec/esgis.png', 15),
  ('Magic Partner', 'Partenaire technique', '/__l5e/assets-v1/d99fcdb1-7381-4dd4-bfb5-fa63631d8c54/magic-partners.png', 16);