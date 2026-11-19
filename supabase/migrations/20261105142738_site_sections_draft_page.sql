alter table public.site_sections add column if not exists draft_page text;

update public.site_sections
set draft_page = page
where draft_page is null;

alter table public.site_sections
  alter column draft_page set not null;

create index if not exists site_sections_church_draft_page_idx
  on public.site_sections (church_id, draft_page);
