-- Keep page-scoped publishing isolated to the destination page in Draft.
-- A section moved from page A to page B must not be published when only A is published.
create or replace function public.publish_site_sections(p_page text default null)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_church_id uuid;
  v_updated integer := 0;
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

  if p_page is not null and length(trim(p_page)) = 0 then
    raise exception 'Page tidak valid';
  end if;

  update public.site_sections
  set
    page = coalesce(draft_page, page),
    draft_page = coalesce(draft_page, page),
    type = case when draft_deleted then coalesce(draft_type, 'richtext') else coalesce(draft_type, type) end,
    draft_type = case when draft_deleted then coalesce(draft_type, 'richtext') else coalesce(draft_type, type) end,
    sort_order = coalesce(draft_sort_order, sort_order),
    draft_sort_order = coalesce(draft_sort_order, sort_order),
    published = case when draft_deleted then null else content end,
    enabled = case when draft_deleted then false else draft_enabled end,
    draft_enabled = case when draft_deleted then false else draft_enabled end,
    draft_deleted = false,
    updated_at = now()
  where church_id = v_church_id
    and (p_page is null or draft_page = p_page);

  get diagnostics v_updated = row_count;
  return jsonb_build_object('ok', true, 'updated_sections', v_updated);
end;
$$;

revoke all on function public.publish_site_sections(text) from public, anon;
grant execute on function public.publish_site_sections(text) to authenticated;
