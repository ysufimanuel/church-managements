-- Superadmin may create immediately-approved finance transactions; admin creates pending ones.
drop policy if exists finance_transactions_insert on public.finance_transactions;
create policy finance_transactions_insert on public.finance_transactions
for insert to authenticated
with check (
  church_id = public.my_church_id()
  and public.is_admin()
  and (public.is_superadmin() or status = 'pending')
);
