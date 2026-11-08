-- Finalize Draft deletions through UPDATE, not DELETE.
-- Admins may publish Draft changes, while RLS intentionally reserves DELETE for Superadmins.
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

  -- Keep a tombstone row, but clear the published snapshot so public rendering hides it.
  update public.site_nav_items
  set published = null, state = 'draft'
  where church_id = v_church_id
    and draft is null
    and published is not null;
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

  -- Finalize only tombstones in the requested Draft page. Keep the marker so
  -- deleted rows cannot reappear in the editor after a refresh.
  update public.site_sections
  set published = null,
      enabled = false,
      draft_enabled = false,
      updated_at = now()
  where church_id = v_church_id
    and draft_deleted
    and published is not null
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

  update public.site_nav_items
  set published = null, state = 'draft'
  where church_id = v_church_id
    and draft is null
    and published is not null;
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

revoke all on function public.publish_site_navigation() from public, anon;
revoke all on function public.publish_site_sections(text) from public, anon;
revoke all on function public.publish_web_manager() from public, anon;
grant execute on function public.publish_site_navigation() to authenticated;
grant execute on function public.publish_site_sections(text) to authenticated;
grant execute on function public.publish_web_manager() to authenticated;
