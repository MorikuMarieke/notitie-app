-- Run in Supabase SQL Editor or via supabase db push
-- Tables: categories, notes + RLS

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint categories_user_name_unique unique (user_id, name)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_user_id_idx on public.notes (user_id);
create index notes_user_updated_idx on public.notes (user_id, updated_at desc);

create or replace function public.set_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_set_updated_at
before update on public.notes
for each row
execute procedure public.set_notes_updated_at();

alter table public.categories enable row level security;
alter table public.notes enable row level security;

create policy "categories_select_own"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "categories_insert_own"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "categories_update_own"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "categories_delete_own"
  on public.categories for delete
  using (auth.uid() = user_id);

create policy "notes_select_own"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "notes_insert_own"
  on public.notes for insert
  with check (
    auth.uid() = user_id
    and (
      category_id is null
      or exists (
        select 1
        from public.categories c
        where c.id = category_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy "notes_update_own"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      category_id is null
      or exists (
        select 1
        from public.categories c
        where c.id = category_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy "notes_delete_own"
  on public.notes for delete
  using (auth.uid() = user_id);
