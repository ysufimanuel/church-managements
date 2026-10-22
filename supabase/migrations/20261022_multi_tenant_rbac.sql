-- Multi-tenant church isolation + role enforcement.
-- Existing data is assigned to the first/default church.

create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  alamat text,
  kota text,
  telepon text,
  email text,
  created_at timestamptz not null default now()
);

insert into public.churches (slug, nama, alamat, kota, telepon, email)
select 'gereja-kristen-indonesia', nama, alamat, kota, telepon, email
from public.church_profile where id = 1
and not exists (select 1 from public.churches);

insert into public.churches (slug, nama)
select 'gereja-kristen-indonesia', 'Gereja Kristen Indonesia'
where not exists (select 1 from public.churches);

alter table public.churches enable row level security;
drop policy if exists "churches public read" on public.churches;
create policy "churches public read" on public.churches for select using (true);

DO $$
declare
  t text;
  v_church_id uuid;
  tables text[] := array[
    'profiles','members','families','family_members','groups','group_members',
    'events','event_participants','attendance','donors','donations',
    'volunteers','volunteer_assignments','announcements','messages','broadcasts',
    'activities','notifications','finance_settings','finance_categories',
    'finance_transactions','approval_history','site_nav_items','site_theme',
    'site_media','site_sections'
  ];
begin
  select id into v_church_id from public.churches order by created_at, id limit 1;

  alter table public.church_profile add column if not exists church_id uuid;
  update public.church_profile set church_id = v_church_id where church_id is null;
  alter table public.church_profile drop constraint if exists single_row;
  alter table public.church_profile drop constraint if exists church_profile_pkey;
  alter table public.church_profile add constraint church_profile_pkey primary key (church_id);
  alter table public.church_profile alter column church_id set not null;
  alter table public.church_profile add constraint church_profile_church_fk foreign key (church_id) references public.churches(id) on delete cascade;
  alter table public.church_profile add constraint church_profile_church_unique unique (church_id);

  foreach t in array tables loop
    execute format('alter table public.%I add column if not exists church_id uuid', t);
    execute format('update public.%I set church_id = $1 where church_id is null', t) using v_church_id;
    execute format('alter table public.%I alter column church_id set not null', t);
    begin
      execute format('alter table public.%I add constraint %I foreign key (church_id) references public.churches(id) on delete cascade not valid', t, t || '_church_fk');
    exception when duplicate_object then null;
    end;
    execute format('create index if not exists %I on public.%I(church_id)', t || '_church_id_idx', t);
  end loop;

  alter table public.finance_settings drop constraint if exists single_row;
  alter table public.finance_settings drop constraint if exists finance_settings_pkey;
  alter table public.finance_settings add constraint finance_settings_pkey primary key (church_id, id);

  alter table public.site_theme drop constraint if exists single_row;
  alter table public.site_theme drop constraint if exists site_theme_pkey;
  alter table public.site_theme add constraint site_theme_pkey primary key (church_id, id);
end $$;

create or replace function public.my_church_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select church_id from public.profiles where id = auth.uid();
$$;

create or replace function public.my_role()
returns public.app_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('admin','superadmin'), false);
$$;

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'superadmin', false);
$$;

DO $$
declare p record; t text;
  tables text[] := array[
    'profiles','members','families','family_members','groups','group_members',
    'events','event_participants','attendance','donors','donations','volunteers',
    'volunteer_assignments','announcements','messages','broadcasts','activities',
    'notifications','finance_settings','finance_categories','finance_transactions',
    'approval_history','site_nav_items','site_theme','site_media','site_sections'
  ];
begin
  for p in select tablename, policyname from pg_policies where schemaname='public' and (tablename = any(tables) or tablename='church_profile') loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;

  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
    if t = 'profiles' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_tenant_read', t);
      execute format('create policy %I on public.%I for update to authenticated using (id = auth.uid() and church_id = public.my_church_id()) with check (id = auth.uid() and church_id = public.my_church_id() and role = public.my_role())', t||'_self_update', t);
      execute format('create policy %I on public.%I for all to authenticated using (public.is_superadmin() and church_id = public.my_church_id()) with check (public.is_superadmin() and church_id = public.my_church_id())', t||'_super', t);
    elsif t = 'messages' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id() and (sender_id = auth.uid() or receiver_id = auth.uid()))', t||'_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and sender_id = auth.uid() and receiver_id <> auth.uid())', t||'_insert', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and receiver_id = auth.uid()) with check (church_id = public.my_church_id() and receiver_id = auth.uid())', t||'_read_mark', t);
    elsif t = 'notifications' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id() and (user_id is null or user_id = auth.uid()))', t||'_read', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and (user_id is null or user_id = auth.uid())) with check (church_id = public.my_church_id() and (user_id is null or user_id = auth.uid()))', t||'_update', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_admin())', t||'_insert_admin', t);
      execute format('create policy %I on public.%I for delete to authenticated using (church_id = public.my_church_id() and public.is_superadmin())', t||'_delete_super', t);
    elsif t = 'finance_settings' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_read', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and public.is_superadmin()) with check (church_id = public.my_church_id() and public.is_superadmin())', t||'_update_super', t);
    elsif t = 'finance_categories' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_admin())', t||'_insert', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and public.is_admin()) with check (church_id = public.my_church_id() and public.is_admin())', t||'_update', t);
      execute format('create policy %I on public.%I for delete to authenticated using (church_id = public.my_church_id() and public.is_superadmin())', t||'_delete', t);
    elsif t = 'finance_transactions' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_admin() and status = ''pending'')', t||'_insert', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and ((public.is_admin() and status = ''pending'') or public.is_superadmin())) with check (church_id = public.my_church_id() and ((public.is_admin() and status = ''pending'') or public.is_superadmin()))', t||'_update', t);
      execute format('create policy %I on public.%I for delete to authenticated using (church_id = public.my_church_id() and public.is_superadmin())', t||'_delete', t);
    elsif t = 'approval_history' then
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_superadmin())', t||'_insert', t);
    elsif t in ('site_nav_items','site_theme','site_media','site_sections') then
      if t = 'site_sections' then execute format('create policy %I on public.%I for select to anon using (published is not null and enabled)', t||'_public_read', t);
      else execute format('create policy %I on public.%I for select to anon using (state = ''published'')', t||'_public_read', t); end if;
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_tenant_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_admin())', t||'_insert', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and public.is_admin()) with check (church_id = public.my_church_id() and public.is_admin())', t||'_update', t);
      execute format('create policy %I on public.%I for delete to authenticated using (church_id = public.my_church_id() and public.is_superadmin())', t||'_delete', t);
    else
      execute format('create policy %I on public.%I for select to authenticated using (church_id = public.my_church_id())', t||'_read', t);
      execute format('create policy %I on public.%I for insert to authenticated with check (church_id = public.my_church_id() and public.is_admin())', t||'_insert', t);
      execute format('create policy %I on public.%I for update to authenticated using (church_id = public.my_church_id() and public.is_admin()) with check (church_id = public.my_church_id() and public.is_admin())', t||'_update', t);
      execute format('create policy %I on public.%I for delete to authenticated using (church_id = public.my_church_id() and public.is_superadmin())', t||'_delete', t);
    end if;
  end loop;
  alter table public.church_profile enable row level security;
  create policy "church_profile_public_read" on public.church_profile for select using (true);
  create policy "church_profile_admin_update" on public.church_profile for update to authenticated using (church_id = public.my_church_id() and public.is_admin()) with check (church_id = public.my_church_id() and public.is_admin());
end $$;

create or replace function public.set_current_church_id()
returns trigger language plpgsql security definer set search_path = '' as $$
declare cid uuid;
begin
  cid := public.my_church_id();
  if cid is null then
    if new.church_id is null then raise exception 'Church context tidak ditemukan'; end if;
    return new;
  end if;
  if new.church_id is null then new.church_id := cid;
  elsif new.church_id <> cid then raise exception 'Cross-church mutation ditolak'; end if;
  if tg_op = 'UPDATE' and old.church_id <> new.church_id then raise exception 'Church context tidak boleh diubah'; end if;
  return new;
end $$;

DO $$
declare t text;
 tables text[] := array['members','families','family_members','groups','group_members','events','event_participants','attendance','donors','donations','volunteers','volunteer_assignments','announcements','messages','broadcasts','activities','notifications','finance_settings','finance_categories','finance_transactions','approval_history','site_nav_items','site_theme','site_media','site_sections'];
begin
 foreach t in array tables loop
  execute format('drop trigger if exists trg_set_current_church on public.%I', t);
  execute format('create trigger trg_set_current_church before insert or update on public.%I for each row execute function public.set_current_church_id()', t);
 end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_church uuid; v_role public.app_role;
begin
  v_church := nullif(new.raw_app_meta_data->>'church_id','')::uuid;
  if v_church is null then select id into v_church from public.churches order by created_at, id limit 1; end if;
  if v_church is null then raise exception 'Church belum tersedia untuk user baru'; end if;
  v_role := case when (new.raw_app_meta_data->>'role') in ('admin','superadmin') then (new.raw_app_meta_data->>'role')::public.app_role else 'user'::public.app_role end;
  insert into public.profiles (id,nama,username,email,role,church_id) values (new.id,coalesce(new.raw_user_meta_data->>'nama',split_part(coalesce(new.email,''),'@',1)),coalesce(new.raw_user_meta_data->>'username',split_part(coalesce(new.email,''),'@',1)||'_'||left(new.id::text,8)),new.email,v_role,v_church)
  on conflict (id) do update set church_id=excluded.church_id,email=excluded.email;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

DO $$
declare t text; tables text[] := array['messages','notifications','activities','members','events','groups','donations','finance_transactions','announcements','site_sections','site_media','site_nav_items','site_theme'];
begin foreach t in array tables loop begin execute format('alter publication supabase_realtime add table public.%I',t); exception when duplicate_object then null; end; end loop; end $$;

update public.profiles set role = 'admin' where username = 'admintest';
