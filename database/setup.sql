-- Provision complète pour la table profiles (à exécuter dans le SQL Editor Supabase)
-- Collez tout, exécutez : la table, RLS, politiques et trigger seront créés.

create extension if not exists "uuid-ossp";

-- Table profils
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_type text not null default 'client' check (user_type in ('client', 'expert')),
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_user_type_idx on public.profiles(user_type);

-- Trigger pour maintenir updated_at
create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_profiles_updated_at();

-- RLS
alter table public.profiles enable row level security;

-- Politiques
create policy if not exists "Users can select own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy if not exists "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy if not exists "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Fonction pour peupler profiles à la création d'un compte
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_first text := coalesce(new.raw_user_meta_data->>'first_name', '');
  v_last text := coalesce(new.raw_user_meta_data->>'last_name', '');
begin
  insert into public.profiles (user_id, user_type, first_name, last_name, email, avatar_url, onboarding_completed)
  values (
    new.id,
    'client',
    nullif(v_first, ''),
    nullif(v_last, ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger sur auth.users pour créer automatiquement un profil
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
