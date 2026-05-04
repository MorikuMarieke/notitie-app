-- Standalone checklists + items (RLS)

create table public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.checklists (id) on delete cascade,
  body text not null default '',
  checked boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index checklists_user_updated_idx on public.checklists (user_id, updated_at desc);
create index checklist_items_checklist_sort_idx on public.checklist_items (checklist_id, sort_order);

create or replace function public.set_checklists_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger checklists_set_updated_at
before update on public.checklists
for each row
execute procedure public.set_checklists_updated_at();

create or replace function public.set_checklist_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger checklist_items_set_updated_at
before update on public.checklist_items
for each row
execute procedure public.set_checklist_items_updated_at();

alter table public.checklists enable row level security;
alter table public.checklist_items enable row level security;

create policy "checklists_select_own"
  on public.checklists for select
  using (auth.uid() = user_id);

create policy "checklists_insert_own"
  on public.checklists for insert
  with check (auth.uid() = user_id);

create policy "checklists_update_own"
  on public.checklists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "checklists_delete_own"
  on public.checklists for delete
  using (auth.uid() = user_id);

create policy "checklist_items_select_own"
  on public.checklist_items for select
  using (
    exists (
      select 1
      from public.checklists c
      where c.id = checklist_id
        and c.user_id = auth.uid()
    )
  );

create policy "checklist_items_insert_own"
  on public.checklist_items for insert
  with check (
    exists (
      select 1
      from public.checklists c
      where c.id = checklist_id
        and c.user_id = auth.uid()
    )
  );

create policy "checklist_items_update_own"
  on public.checklist_items for update
  using (
    exists (
      select 1
      from public.checklists c
      where c.id = checklist_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.checklists c
      where c.id = checklist_id
        and c.user_id = auth.uid()
    )
  );

create policy "checklist_items_delete_own"
  on public.checklist_items for delete
  using (
    exists (
      select 1
      from public.checklists c
      where c.id = checklist_id
        and c.user_id = auth.uid()
    )
  );

create or replace function public.touch_checklist_parent_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.checklists
  set updated_at = now()
  where id = coalesce(new.checklist_id, old.checklist_id);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger checklist_items_touch_parent_updated_at
after insert or update or delete on public.checklist_items
for each row
execute procedure public.touch_checklist_parent_updated_at();
