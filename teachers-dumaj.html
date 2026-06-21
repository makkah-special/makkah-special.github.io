-- سياسات آمنة لجدول profiles بدون تكرار أو تعارض
-- شغل هذا الملف في Supabase SQL Editor إذا ظهرت مشكلة صلاحيات عند تسجيل الدخول.

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
