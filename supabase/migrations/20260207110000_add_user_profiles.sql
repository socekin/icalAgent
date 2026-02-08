-- 用户档案表：存储每个用户的总体订阅 token
CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  master_feed_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_master_feed_token ON public.user_profiles(master_feed_token);
