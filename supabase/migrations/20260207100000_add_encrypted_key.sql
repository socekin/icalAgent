-- 添加加密密钥列，用于支持后续复制完整密钥
alter table public.api_keys add column if not exists encrypted_key text null;
