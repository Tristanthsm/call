-- Provisionnement Auth / profils pour Supabase (projet https://btnruneapntfneomhvao.supabase.co)
-- À exécuter dans le SQL Editor de Supabase.

create extension if not exists "uuid-ossp";

-- Table profil liée à auth.users
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client', 'expert', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists profiles_role_idx on public.profiles (role);

create table if not exists public.sessions (
  token uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create index if not exists sessions_user_id_idx on public.sessions (user_id);

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;

-- Lecture/écriture limitée à l'utilisateur connecté
create policy if not exists "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy if not exists "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

create policy if not exists "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy if not exists "Users can view own sessions" on public.sessions
  for select using (auth.uid() = user_id);

create policy if not exists "Users can manage own sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Fonction pratique pour alimenter profiles lors de la création d'un compte
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'client');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
