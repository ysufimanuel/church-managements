create or replace function public.process_finance_transaction(
  p_transaction_id bigint,
  p_action text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_church_id uuid;
  v_user_id uuid;
begin
  v_user_id := (select auth.uid());

  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_action not in ('approved', 'rejected') then
    raise exception 'INVALID_ACTION';
  end if;

  if (select public.my_role()) is distinct from 'superadmin'::public.app_role then
    raise exception 'SUPERADMIN_REQUIRED';
  end if;

  select ft.church_id
    into v_church_id
  from public.finance_transactions as ft
  where ft.id = p_transaction_id
    and ft.church_id = (select public.my_church_id())
    and ft.status = 'pending'
  for update;

  if v_church_id is null then
    raise exception 'TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED';
  end if;

  update public.finance_transactions
  set status = p_action::public.approval_status,
      approved_by = v_user_id,
      approved_at = pg_catalog.now()
  where id = p_transaction_id
    and church_id = v_church_id
    and status = 'pending';

  if not found then
    raise exception 'TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED';
  end if;

  insert into public.approval_history (transaction_id, action, by_user, church_id)
  values (p_transaction_id, p_action, v_user_id, v_church_id);
end;
$function$;

revoke all on function public.process_finance_transaction(bigint, text) from public, anon;
grant execute on function public.process_finance_transaction(bigint, text) to authenticated;

create or replace function public.create_broadcast_with_notifications(
  p_subject text,
  p_message text,
  p_recipients text,
  p_send boolean
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_user_id uuid;
  v_church_id uuid;
  v_broadcast_id bigint;
begin
  v_user_id := (select auth.uid());
  v_church_id := (select public.my_church_id());

  if v_user_id is null or v_church_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not (select public.is_admin()) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if pg_catalog.btrim(coalesce(p_subject, '')) = ''
     or pg_catalog.btrim(coalesce(p_message, '')) = '' then
    raise exception 'SUBJECT_AND_MESSAGE_REQUIRED';
  end if;

  if p_recipients is distinct from 'all' then
    raise exception 'UNSUPPORTED_RECIPIENT_TARGET';
  end if;

  insert into public.broadcasts (
    subject, message, recipients, group_ids, status, sent_at, created_by, church_id
  )
  values (
    p_subject,
    p_message,
    'all',
    null,
    case when p_send then 'sent' else 'draft' end,
    case when p_send then pg_catalog.now() else null end,
    v_user_id,
    v_church_id
  )
  returning id into v_broadcast_id;

  if p_send then
    insert into public.notifications (user_id, title, message, type, read, church_id)
    select
      p.id,
      p_subject,
      pg_catalog.left(p_message, 120),
      'broadcast',
      false,
      v_church_id
    from public.profiles as p
    where p.church_id = v_church_id
      and p.status = 'aktif';
  end if;

  return v_broadcast_id;
end;
$function$;

revoke all on function public.create_broadcast_with_notifications(text, text, text, boolean) from public, anon;
grant execute on function public.create_broadcast_with_notifications(text, text, text, boolean) to authenticated;
