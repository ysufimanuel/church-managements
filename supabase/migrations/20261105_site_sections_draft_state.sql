alter table public.site_sections add column if not exists draft_type text;
alter table public.site_sections add column if not exists draft_sort_order integer;
alter table public.site_sections add column if not exists draft_enabled boolean;

update public.site_sections
set draft_type = coalesce(draft_type, type),
    draft_sort_order = coalesce(draft_sort_order, sort_order),
    draft_enabled = coalesce(draft_enabled, enabled);

alter table public.site_sections alter column draft_type set not null;
alter table public.site_sections alter column draft_sort_order set not null;
alter table public.site_sections alter column draft_enabled set not null;

create index if not exists site_sections_church_draft_page_order_idx
  on public.site_sections (church_id, draft_page, draft_sort_order);
