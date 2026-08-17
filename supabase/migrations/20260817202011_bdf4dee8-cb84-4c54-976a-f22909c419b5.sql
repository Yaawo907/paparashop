CREATE TABLE public.order_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.order_status_events TO authenticated;
GRANT ALL ON public.order_status_events TO service_role;

ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_status_events_staff_select ON public.order_status_events
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY order_status_events_staff_insert ON public.order_status_events
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));

CREATE INDEX order_status_events_order_id_idx ON public.order_status_events(order_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_events (order_id, status, changed_by, changed_by_email)
    VALUES (
      NEW.id,
      NEW.status,
      auth.uid(),
      (SELECT email FROM public.profiles WHERE id = auth.uid())
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_status_log AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();