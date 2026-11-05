-- Publish navigation as one tenant-scoped database transaction.
create or replace function public.publish_site_navigation()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_church_id uuid;
  v_updated integer := 0;
  v_deleted integer := 0;
begin
  if auth.uid() is null or not public.is_admin() then
    raise insufficient_privilege using message = 'Web Manager hanya untuk Admin/Superadmin';
  end if;

  select church_id into v_church_id
  from public.profiles
  where id = auth.uid();

  if v_church_id is null then
    raise exception 'Church profile tidak ditemukan';
  end if;

  delete from public.site_nav_items
  where church_id = v_church_id and draft is null;
  get diagnostics v_deleted = row_count;

  update public.site_nav_items
  set
    label = coalesce(draft->>'label', label),
    href = coalesce(draft->>'href', href),
    visible = coalesce((draft->>'visible')::boolean, visible),
    sort_order = coalesce((draft->>'sort_order')::integer, sort_order),
    published = draft,
    state = 'published'
  where church_id = v_church_id and draft is not null;
  get diagnostics v_updated = row_count;

  return jsonb_build_object('ok', true, 'updated_nav', v_updated, 'deleted_nav', v_deleted);
end;
$$;

revoke all on function public.publish_site_navigation() from public, anon;
grant execute on function public.publish_site_navigation() to authenticated;
