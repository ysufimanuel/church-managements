-- Publish Web Manager atomically for the current church.
-- SECURITY INVOKER keeps the caller's RLS policies in force.
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
    and (p_page is null or page = p_page or draft_page = p_page);

  get diagnostics v_updated = row_count;
  return jsonb_build_object('ok', true, 'updated_sections', v_updated);
end;
$$;

create or replace function public.publish_web_manager()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_church_id uuid;
  v_nav_updated integer := 0;
  v_nav_deleted integer := 0;
  v_theme_updated integer := 0;
  v_sections jsonb;
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
  get diagnostics v_nav_deleted = row_count;

  update public.site_nav_items
  set
    label = coalesce(draft->>'label', label),
    href = coalesce(draft->>'href', href),
    visible = coalesce((draft->>'visible')::boolean, visible),
    sort_order = coalesce((draft->>'sort_order')::integer, sort_order),
    published = draft,
    state = 'published'
  where church_id = v_church_id and draft is not null;
  get diagnostics v_nav_updated = row_count;

  update public.site_theme
  set
    primary_color = coalesce(draft->>'primary_color', primary_color),
    font_family = coalesce(draft->>'font_family', font_family),
    published = coalesce(draft, published, jsonb_build_object(
      'primary_color', primary_color,
      'font_family', font_family
    )),
    draft = coalesce(draft, published, jsonb_build_object(
      'primary_color', primary_color,
      'font_family', font_family
    )),
    state = 'published'
  where church_id = v_church_id and id = 1;
  get diagnostics v_theme_updated = row_count;

  if v_theme_updated <> 1 then
    raise exception 'Tema gereja tidak ditemukan; publikasi dibatalkan';
  end if;

  v_sections := public.publish_site_sections(null);

  return jsonb_build_object(
    'ok', true,
    'updated_nav', v_nav_updated,
    'deleted_nav', v_nav_deleted,
    'updated_theme', v_theme_updated,
    'sections', v_sections
  );
end;
$$;

revoke all on function public.publish_site_sections(text) from public, anon;
revoke all on function public.publish_web_manager() from public, anon;
grant execute on function public.publish_site_sections(text) to authenticated;
grant execute on function public.publish_web_manager() to authenticated;
