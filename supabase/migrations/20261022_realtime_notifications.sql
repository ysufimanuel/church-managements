-- Realtime in-app notifications for chat and data mutations.

create or replace function public.notify_new_message()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications (user_id,title,message,type,church_id)
  values (new.receiver_id,'Pesan baru',left(new.content,160),'message',new.church_id);
  return new;
end $$;

drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message after insert on public.messages
for each row execute function public.notify_new_message();

create or replace function public.notify_data_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare cid uuid; op text;
begin
  cid := coalesce(new.church_id, old.church_id);
  op := case when tg_op='INSERT' then 'ditambahkan' when tg_op='UPDATE' then 'diperbarui' else 'dihapus' end;
  insert into public.notifications (user_id,title,message,type,church_id)
  values (null,'Perubahan data',format('%s %s',tg_table_name,op),'data',cid);
  if tg_op='DELETE' then return old; else return new; end if;
end $$;

DO $$
declare t text;
  tables text[] := array[
    'profiles','members','families','family_members','groups','group_members',
    'events','event_participants','attendance','donors','donations','volunteers',
    'volunteer_assignments','announcements','broadcasts','finance_settings',
    'finance_categories','finance_transactions','approval_history','site_nav_items',
    'site_theme','site_media','site_sections'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists trg_notify_data_change on public.%I',t);
    execute format('create trigger trg_notify_data_change after insert or update or delete on public.%I for each row execute function public.notify_data_change()',t);
  end loop;
end $$;
