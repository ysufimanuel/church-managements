-- Enforce tenant-consistent foreign keys across church-owned records.
-- Existing data was checked before this migration; inspected cross-tenant counts were zero.

alter table public.profiles add constraint profiles_id_church_key unique (id, church_id);
alter table public.members add constraint members_id_church_key unique (id, church_id);
alter table public.groups add constraint groups_id_church_key unique (id, church_id);
alter table public.families add constraint families_id_church_key unique (id, church_id);
alter table public.events add constraint events_id_church_key unique (id, church_id);
alter table public.donors add constraint donors_id_church_key unique (id, church_id);
alter table public.volunteers add constraint volunteers_id_church_key unique (id, church_id);
alter table public.finance_categories add constraint finance_categories_id_church_key unique (id, church_id);
alter table public.finance_transactions add constraint finance_transactions_id_church_key unique (id, church_id);

alter table public.families drop constraint families_kepala_id_fkey;
alter table public.groups drop constraint groups_leader_id_fkey;
alter table public.members drop constraint members_group_fk;
alter table public.family_members drop constraint family_members_family_id_fkey;
alter table public.family_members drop constraint family_members_member_id_fkey;
alter table public.group_members drop constraint group_members_group_id_fkey;
alter table public.group_members drop constraint group_members_member_id_fkey;
alter table public.event_participants drop constraint event_participants_event_id_fkey;
alter table public.event_participants drop constraint event_participants_member_id_fkey;
alter table public.attendance drop constraint attendance_event_id_fkey;
alter table public.attendance drop constraint attendance_member_id_fkey;
alter table public.donations drop constraint donations_donor_id_fkey;
alter table public.volunteers drop constraint volunteers_member_id_fkey;
alter table public.volunteer_assignments drop constraint volunteer_assignments_event_id_fkey;
alter table public.volunteer_assignments drop constraint volunteer_assignments_volunteer_id_fkey;
alter table public.finance_transactions drop constraint finance_transactions_donatur_id_fkey;
alter table public.finance_transactions drop constraint finance_transactions_kategori_id_fkey;
alter table public.finance_transactions drop constraint finance_transactions_created_by_fkey;
alter table public.finance_transactions drop constraint finance_transactions_approved_by_fkey;
alter table public.approval_history drop constraint approval_history_by_user_fkey;
alter table public.approval_history drop constraint approval_history_transaction_id_fkey;
alter table public.messages drop constraint messages_sender_id_fkey;
alter table public.messages drop constraint messages_receiver_id_fkey;
alter table public.notifications drop constraint notifications_user_id_fkey;

alter table public.families add constraint families_head_same_church_fk foreign key (kepala_id, church_id) references public.members(id, church_id) on delete set null (kepala_id) not valid;
alter table public.groups add constraint groups_leader_same_church_fk foreign key (leader_id, church_id) references public.members(id, church_id) on delete set null (leader_id) not valid;
alter table public.members add constraint members_group_same_church_fk foreign key (group_id, church_id) references public.groups(id, church_id) on delete set null (group_id) not valid;
alter table public.family_members add constraint family_members_family_same_church_fk foreign key (family_id, church_id) references public.families(id, church_id) on delete cascade not valid;
alter table public.family_members add constraint family_members_member_same_church_fk foreign key (member_id, church_id) references public.members(id, church_id) on delete cascade not valid;
alter table public.group_members add constraint group_members_group_same_church_fk foreign key (group_id, church_id) references public.groups(id, church_id) on delete cascade not valid;
alter table public.group_members add constraint group_members_member_same_church_fk foreign key (member_id, church_id) references public.members(id, church_id) on delete cascade not valid;
alter table public.event_participants add constraint event_participants_event_same_church_fk foreign key (event_id, church_id) references public.events(id, church_id) on delete cascade not valid;
alter table public.event_participants add constraint event_participants_member_same_church_fk foreign key (member_id, church_id) references public.members(id, church_id) on delete cascade not valid;
alter table public.attendance add constraint attendance_event_same_church_fk foreign key (event_id, church_id) references public.events(id, church_id) on delete cascade not valid;
alter table public.attendance add constraint attendance_member_same_church_fk foreign key (member_id, church_id) references public.members(id, church_id) on delete cascade not valid;
alter table public.donations add constraint donations_donor_same_church_fk foreign key (donor_id, church_id) references public.donors(id, church_id) on delete set null (donor_id) not valid;
alter table public.volunteers add constraint volunteers_member_same_church_fk foreign key (member_id, church_id) references public.members(id, church_id) on delete set null (member_id) not valid;
alter table public.volunteer_assignments add constraint volunteer_assignments_event_same_church_fk foreign key (event_id, church_id) references public.events(id, church_id) on delete set null (event_id) not valid;
alter table public.volunteer_assignments add constraint volunteer_assignments_volunteer_same_church_fk foreign key (volunteer_id, church_id) references public.volunteers(id, church_id) on delete cascade not valid;
alter table public.finance_transactions add constraint finance_transactions_donor_same_church_fk foreign key (donatur_id, church_id) references public.donors(id, church_id) on delete set null (donatur_id) not valid;
alter table public.finance_transactions add constraint finance_transactions_category_same_church_fk foreign key (kategori_id, church_id) references public.finance_categories(id, church_id) on delete set null (kategori_id) not valid;
alter table public.finance_transactions add constraint finance_transactions_creator_same_church_fk foreign key (created_by, church_id) references public.profiles(id, church_id) on delete set null (created_by) not valid;
alter table public.finance_transactions add constraint finance_transactions_approver_same_church_fk foreign key (approved_by, church_id) references public.profiles(id, church_id) on delete set null (approved_by) not valid;
alter table public.approval_history add constraint approval_history_user_same_church_fk foreign key (by_user, church_id) references public.profiles(id, church_id) on delete set null (by_user) not valid;
alter table public.approval_history add constraint approval_history_transaction_same_church_fk foreign key (transaction_id, church_id) references public.finance_transactions(id, church_id) on delete cascade not valid;
alter table public.messages add constraint messages_sender_same_church_fk foreign key (sender_id, church_id) references public.profiles(id, church_id) on delete cascade not valid;
alter table public.messages add constraint messages_receiver_same_church_fk foreign key (receiver_id, church_id) references public.profiles(id, church_id) on delete cascade not valid;
alter table public.notifications add constraint notifications_user_same_church_fk foreign key (user_id, church_id) references public.profiles(id, church_id) on delete cascade not valid;

alter table public.families validate constraint families_head_same_church_fk;
alter table public.groups validate constraint groups_leader_same_church_fk;
alter table public.members validate constraint members_group_same_church_fk;
alter table public.family_members validate constraint family_members_family_same_church_fk;
alter table public.family_members validate constraint family_members_member_same_church_fk;
alter table public.group_members validate constraint group_members_group_same_church_fk;
alter table public.group_members validate constraint group_members_member_same_church_fk;
alter table public.event_participants validate constraint event_participants_event_same_church_fk;
alter table public.event_participants validate constraint event_participants_member_same_church_fk;
alter table public.attendance validate constraint attendance_event_same_church_fk;
alter table public.attendance validate constraint attendance_member_same_church_fk;
alter table public.donations validate constraint donations_donor_same_church_fk;
alter table public.volunteers validate constraint volunteers_member_same_church_fk;
alter table public.volunteer_assignments validate constraint volunteer_assignments_event_same_church_fk;
alter table public.volunteer_assignments validate constraint volunteer_assignments_volunteer_same_church_fk;
alter table public.finance_transactions validate constraint finance_transactions_donor_same_church_fk;
alter table public.finance_transactions validate constraint finance_transactions_category_same_church_fk;
alter table public.finance_transactions validate constraint finance_transactions_creator_same_church_fk;
alter table public.finance_transactions validate constraint finance_transactions_approver_same_church_fk;
alter table public.approval_history validate constraint approval_history_user_same_church_fk;
alter table public.approval_history validate constraint approval_history_transaction_same_church_fk;
alter table public.messages validate constraint messages_sender_same_church_fk;
alter table public.messages validate constraint messages_receiver_same_church_fk;
alter table public.notifications validate constraint notifications_user_same_church_fk;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_church uuid;
  v_role public.app_role;
begin
  v_church := nullif(new.raw_app_meta_data->>'church_id', '')::uuid;
  if v_church is null then
    raise exception 'church_id wajib diisi pada app_metadata untuk user baru';
  end if;
  if not exists (select 1 from public.churches c where c.id = v_church) then
    raise exception 'church_id tidak valid untuk user baru';
  end if;
  v_role := case
    when new.raw_app_meta_data->>'role' in ('admin', 'superadmin')
      then (new.raw_app_meta_data->>'role')::public.app_role
    else 'user'::public.app_role
  end;
  insert into public.profiles (id, nama, username, email, role, church_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(coalesce(new.email, ''), '@', 1) || '_' || left(new.id::text, 8)),
    new.email, v_role, v_church
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$function$;
