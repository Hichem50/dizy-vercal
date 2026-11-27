-- Dizy — schéma de base de données (à exécuter dans Supabase → SQL Editor)
-- Tables en snake_case, exposées via l'API Supabase (PostgREST).
-- Toutes les écritures privilégiées passent par le serveur (clé service_role).

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'BUYER' check (role in ('BUYER','SELLER','ADMIN')),
  phone text,
  email_verified boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_fr text not null,
  name_ar text not null,
  slug text unique not null
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique not null references public.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id),
  description text,
  logo_url text,
  banner_url text,
  status text not null default 'PENDING' check (status in ('PENDING','ACTIVE','SUSPENDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid unique not null references public.stores(id) on delete cascade,
  amount integer not null default 4000,
  status text not null default 'NONE' check (status in ('NONE','PENDING','ACTIVE','EXPIRED')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  method text not null check (method in ('CCP','BARIDIMOB','RIP','REDOTPAY')),
  reference text not null,
  receipt_url text,
  status text not null default 'PENDING' check (status in ('PENDING','CONFIRMED','REJECTED')),
  confirmed_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  title text not null,
  description text,
  price integer not null,
  category_id uuid references public.categories(id),
  file_path text,
  preview_urls text[] default '{}',
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  views integer not null default 0,
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.users(id),
  total integer not null,
  status text not null default 'PENDING' check (status in ('PENDING','PAID','REFUNDED')),
  payment_method text not null check (payment_method in ('CCP','BARIDIMOB','RIP','REDOTPAY')),
  reference text,
  receipt_url text,
  confirmed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  price integer not null
);

create table if not exists public.download_tokens (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid unique not null references public.order_items(id) on delete cascade,
  buyer_id uuid not null references public.users(id),
  token text unique not null,
  expires_at timestamptz not null,
  used_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  amount integer not null,
  method text not null check (method in ('CCP','BARIDIMOB','RIP','REDOTPAY')),
  account_info text not null,
  status text not null default 'REQUESTED' check (status in ('REQUESTED','PAID')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid not null references public.users(id),
  rating integer not null,
  comment text,
  seller_reply text,
  created_at timestamptz not null default now(),
  unique (product_id, buyer_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  from_id uuid,
  to_id uuid,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  target_table text not null,
  target_id text,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_settings (
  id text primary key default 'singleton',
  subscription_price integer not null default 4000,
  admin_accounts jsonb not null default '{}',
  verify_window_hours integer not null default 48,
  updated_at timestamptz not null default now()
);

-- Active RLS partout : le navigateur (clé anon) ne peut rien lire/écrire par défaut ;
-- seules les routes serveur (clé service_role) accèdent aux données.
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.stores enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_payments enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.download_tokens enable row level security;
alter table public.payouts enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_messages enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;

-- Réglages initiaux
insert into public.platform_settings (id) values ('singleton') on conflict (id) do nothing;
