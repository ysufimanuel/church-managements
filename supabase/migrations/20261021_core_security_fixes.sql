-- Core security fixes for the active Church CMS schema.
-- Apply once in the Supabase SQL Editor or through the project's migration pipeline.

-- Never allow public signup metadata to assign privileged roles.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, username, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    'user'::public.app_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger functions are invoked by PostgreSQL triggers, not by client RPC calls.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.log_activity() from public, anon, authenticated;
revoke all on function public.notify_new_message() from public, anon, authenticated;

-- Role helper functions are needed by authenticated RLS policies, but not by anon.
revoke all on function public.my_role() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_superadmin() from public, anon;
grant execute on function public.my_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_superadmin() to authenticated;

-- A recipient may mark a message as read, but may not edit its content or sender.
drop policy if exists "messages mark read" on public.messages;
create policy "messages mark read" on public.messages
  for update to authenticated
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

revoke all on table public.messages from anon, authenticated;
grant select, insert on table public.messages to authenticated;
grant update (read) on table public.messages to authenticated;

-- Keep identity sequences aligned with seeded IDs; safe to rerun.
select setval(pg_get_serial_sequence('public.members','id'), coalesce((select max(id) from public.members), 1), true);
select setval(pg_get_serial_sequence('public.groups','id'), coalesce((select max(id) from public.groups), 1), true);
select setval(pg_get_serial_sequence('public.families','id'), coalesce((select max(id) from public.families), 1), true);
select setval(pg_get_serial_sequence('public.events','id'), coalesce((select max(id) from public.events), 1), true);
select setval(pg_get_serial_sequence('public.donors','id'), coalesce((select max(id) from public.donors), 1), true);
select setval(pg_get_serial_sequence('public.volunteers','id'), coalesce((select max(id) from public.volunteers), 1), true);
select setval(pg_get_serial_sequence('public.finance_categories','id'), coalesce((select max(id) from public.finance_categories), 1), true);
