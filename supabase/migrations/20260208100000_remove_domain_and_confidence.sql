-- 移除 subscriptions.domain 和 events.confidence 字段
alter table public.subscriptions drop column if exists domain;
alter table public.events drop column if exists confidence;
