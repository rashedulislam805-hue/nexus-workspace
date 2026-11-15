-- Nexus Workspace initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'bn' check (locale in ('bn','en')),
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','guest')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  parent_id uuid references public.pages(id) on delete cascade,
  title text not null default 'Untitled',
  icon text,
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  due_at timestamptz,
  assignee_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists pages_workspace_idx on public.pages(workspace_id);
create index if not exists tasks_workspace_due_idx on public.tasks(workspace_id, due_at);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = target_workspace and m.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.pages enable row level security;
alter table public.tasks enable row level security;

create policy "profile read own" on public.profiles for select using (id = auth.uid());
create policy "profile insert own" on public.profiles for insert with check (id = auth.uid());
create policy "profile update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "workspace members can read workspace" on public.workspaces
for select using (public.is_workspace_member(id));
create policy "authenticated users can create workspace" on public.workspaces
for insert with check (owner_id = auth.uid());
create policy "owner can update workspace" on public.workspaces
for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner can delete workspace" on public.workspaces
for delete using (owner_id = auth.uid());

create policy "members can read membership" on public.workspace_members
for select using (user_id = auth.uid() or public.is_workspace_member(workspace_id));
create policy "workspace owner can add members" on public.workspace_members
for insert with check (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));
create policy "workspace owner can remove members" on public.workspace_members
for delete using (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));

create policy "members can read pages" on public.pages
for select using (public.is_workspace_member(workspace_id));
create policy "members can create pages" on public.pages
for insert with check (public.is_workspace_member(workspace_id) and created_by = auth.uid());
create policy "members can update pages" on public.pages
for update using (public.is_workspace_member(workspace_id));
create policy "members can delete pages" on public.pages
for delete using (public.is_workspace_member(workspace_id));

create policy "members can read tasks" on public.tasks
for select using (public.is_workspace_member(workspace_id));
create policy "members can create tasks" on public.tasks
for insert with check (public.is_workspace_member(workspace_id) and created_by = auth.uid());
create policy "members can update tasks" on public.tasks
for update using (public.is_workspace_member(workspace_id));
create policy "members can delete tasks" on public.tasks
for delete using (public.is_workspace_member(workspace_id));

-- Create a starter workspace/profile after a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare new_workspace_id uuid;
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name',''))
  on conflict (id) do nothing;

  insert into public.workspaces(name, owner_id)
  values ('My Workspace', new.id)
  returning id into new_workspace_id;

  insert into public.workspace_members(workspace_id, user_id, role)
  values (new_workspace_id, new.id, 'owner');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
