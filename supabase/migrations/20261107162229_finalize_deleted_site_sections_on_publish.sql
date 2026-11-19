-- Finalize deleted sections only when their Draft page is published.
-- Tombstones are hidden immediately in Draft; physical deletion happens at Publish,
-- so the public snapshot remains intact until the user explicitly publishes.
create or replace function public.publish_site_sections(p_page text default null)
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

  if p_page is not null and length(trim(p_page)) = 0 then
    raise exception 'Page tidak valid';
  end if;

  -- A deleted published section must not be reset to draft_deleted=false.
  -- Remove its tombstone after its target Draft page is published.
  delete from public.site_sections
  where church_id = v_church_id
    and draft_deleted
    and (p_page is null or draft_page = p_page);
  get diagnostics v_deleted = row_count;

  update public.site_sections
  set
    page = coalesce(draft_page, page),
    draft_page = coalesce(draft_page, page),
    type = coalesce(draft_type, type),
    draft_type = coalesce(draft_type, type),
    sort_order = coalesce(draft_sort_order, sort_order),
    draft_sort_order = coalesce(draft_sort_order, sort_order),
    published = content,
    enabled = draft_enabled,
    updated_at = now()
  where church_id = v_church_id
    and not draft_deleted
    and (p_page is null or draft_page = p_page);

  get diagnostics v_updated = row_count;
  return jsonb_build_object('ok', true, 'updated_sections', v_updated, 'deleted_sections', v_deleted);
end;
$$;

revoke all on function public.publish_site_sections(text) from public, anon;
grant execute on function public.publish_site_sections(text) to authenticated;
