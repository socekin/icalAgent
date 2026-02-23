-- Enable RLS on remaining tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Policies for subscriptions (direct user_id)
-- ============================================================
CREATE POLICY "Users can select own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Policies for user_profiles (user_id is PK)
-- ============================================================
CREATE POLICY "Users can select own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Policies for api_keys (direct user_id, RLS already enabled)
-- ============================================================
CREATE POLICY "Users can select own api_keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api_keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api_keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api_keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Policies for events (indirect via subscription_id)
-- ============================================================
CREATE POLICY "Users can select own events"
  ON public.events FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Policies for sync_runs (indirect via subscription_id)
-- ============================================================
CREATE POLICY "Users can select own sync_runs"
  ON public.sync_runs FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sync_runs"
  ON public.sync_runs FOR INSERT
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sync_runs"
  ON public.sync_runs FOR UPDATE
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );
