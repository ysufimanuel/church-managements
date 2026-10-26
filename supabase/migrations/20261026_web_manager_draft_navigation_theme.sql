alter table public.site_nav_items add column if not exists draft jsonb;
alter table public.site_nav_items add column if not exists published jsonb;
alter table public.site_sections add column if not exists draft_deleted boolean not null default false;

update public.site_nav_items
set published = coalesce(published, jsonb_build_object('label', label, 'href', href, 'visible', visible, 'sort_order', sort_order)),
    draft = coalesce(draft, jsonb_build_object('label', label, 'href', href, 'visible', visible, 'sort_order', sort_order));

update public.site_theme
set draft = jsonb_build_object(
  'primary_color', coalesce(draft->>'primary_color', primary_color),
  'secondary_color', coalesce(draft->>'secondary_color', primary_color),
  'accent_color', coalesce(draft->>'accent_color', primary_color),
  'font_family', coalesce(draft->>'font_family', font_family)
);

update public.site_theme
set published = coalesce(published, draft);
