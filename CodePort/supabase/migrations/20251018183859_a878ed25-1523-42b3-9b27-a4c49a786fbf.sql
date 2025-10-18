-- Allow authenticated merchants to view all payments
CREATE POLICY "Merchants can view all payments"
  ON public.payments FOR SELECT
  USING (auth.role() = 'authenticated');