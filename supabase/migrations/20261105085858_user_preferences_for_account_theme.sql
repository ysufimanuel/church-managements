create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_object_check check (jsonb_typeof(preferences) = 'object')
);

alter table public.user_preferences enable row level security;

revoke all on table public.user_preferences from anon, authenticated;
grant select, insert, update on table public.user_preferences to authenticated;

create policy user_preferences_select_own
  on public.user_preferences for select to authenticated
  using ((select auth.uid()) = user_id);

create policy user_preferences_insert_own
  on public.user_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy user_preferences_update_own
  on public.user_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
