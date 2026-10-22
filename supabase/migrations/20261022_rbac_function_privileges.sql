-- Restrict SECURITY DEFINER helper functions to the roles that actually need them.
revoke all on function public.set_current_church_id() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.notify_new_message() from public, anon, authenticated;
revoke all on function public.notify_data_change() from public, anon, authenticated;
revoke all on function public.my_church_id() from public, anon, authenticated;
revoke all on function public.my_role() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.is_superadmin() from public, anon, authenticated;

grant execute on function public.my_church_id() to authenticated;
grant execute on function public.my_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_superadmin() to authenticated;
