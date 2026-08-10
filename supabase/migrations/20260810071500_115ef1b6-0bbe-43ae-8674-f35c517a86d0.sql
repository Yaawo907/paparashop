ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS price numeric(12,2),
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'XOF',
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku text;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('PS-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  country text NOT NULL DEFAULT 'Bénin',
  city text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XOF',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider text NOT NULL DEFAULT 'kkiapay',
  transaction_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text NOT NULL,
  image_url text,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_public_insert ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (payment_status = 'pending' AND status = 'pending');
CREATE POLICY orders_staff_select ON public.orders FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY orders_staff_update ON public.orders FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY orders_staff_delete ON public.orders FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE POLICY order_items_public_insert ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY order_items_staff_select ON public.order_items FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY order_items_staff_update ON public.order_items FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY order_items_staff_delete ON public.order_items FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();