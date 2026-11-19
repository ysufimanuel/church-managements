create index if not exists announcements_author_id_idx on public.announcements (author_id);
create index if not exists broadcasts_created_by_idx on public.broadcasts (created_by);

alter policy profiles_self_update on public.profiles
  using (id = (select auth.uid()) and church_id = (select public.my_church_id()))
  with check (
    id = (select auth.uid())
    and church_id = (select public.my_church_id())
    and role = (select public.my_role())
  );

alter policy messages_insert on public.messages
  with check (
    church_id = (select public.my_church_id())
    and sender_id = (select auth.uid())
    and receiver_id <> (select auth.uid())
  );

alter policy messages_read on public.messages
  using (
    church_id = (select public.my_church_id())
    and (sender_id = (select auth.uid()) or receiver_id = (select auth.uid()))
  );

alter policy messages_read_mark on public.messages
  using (
    church_id = (select public.my_church_id())
    and receiver_id = (select auth.uid())
  )
  with check (
    church_id = (select public.my_church_id())
    and receiver_id = (select auth.uid())
  );

alter policy notifications_read on public.notifications
  using (
    church_id = (select public.my_church_id())
    and (user_id is null or user_id = (select auth.uid()))
  );

alter policy notifications_read_update on public.notifications
  using (
    church_id = (select public.my_church_id())
    and (user_id is null or user_id = (select auth.uid()))
  )
  with check (
    church_id = (select public.my_church_id())
    and (user_id is null or user_id = (select auth.uid()))
  );
