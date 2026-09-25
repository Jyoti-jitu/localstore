-- ==============================================================================
-- Schema for LocalStore (Bhubaneswar Hyperlocal Marketplace)
-- Compatible with Supabase Postgres & Best Practices
-- ==============================================================================

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  label text not null,
  icon text,
  image text,
  description text,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Allow public read access on categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- 2. LOCALITIES TABLE
create table if not exists public.localities (
  id text primary key,
  name text not null,
  landmark text,
  distance_text text,
  created_at timestamptz default now()
);

alter table public.localities enable row level security;

create policy "Allow public read access on localities"
  on public.localities
  for select
  to anon, authenticated
  using (true);

-- 3. SHOPS TABLE
create table if not exists public.shops (
  id text primary key,
  name text not null,
  category text,
  category_label text,
  rating numeric(3,2) default 0,
  review_count int default 0,
  distance_km numeric(4,2),
  distance_text text,
  locality text,
  address text,
  delivery_time text,
  delivery_fee numeric(6,2) default 0,
  is_open boolean default true,
  opening_hours text,
  closes_at text,
  product_count int default 0,
  min_order numeric(6,2) default 0,
  featured boolean default false,
  image text,
  cover_image text,
  avatar text,
  description text,
  owner_name text,
  phone text,
  tags text[] default '{}',
  catalog_categories text[] default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_shops_category on public.shops(category);
create index if not exists idx_shops_featured on public.shops(featured) where featured = true;

alter table public.shops enable row level security;

create policy "Allow public read access on shops"
  on public.shops
  for select
  to anon, authenticated
  using (true);

-- 4. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  shop_id text not null references public.shops(id) on delete cascade,
  name text not null,
  brand text,
  quantity text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  discount_percent int default 0,
  category text,
  store_category text,
  in_stock boolean default true,
  rating numeric(3,2) default 0,
  reviews_count int default 0,
  popular boolean default false,
  image text,
  description text,
  information jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_products_shop_id on public.products(shop_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_popular on public.products(popular) where popular = true;

alter table public.products enable row level security;

create policy "Allow public read access on products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- 5. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  shop_id text references public.shops(id) on delete set null,
  shop_name text,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  payment_method text,
  status text default 'placed',
  delivery_address jsonb default '{}'::jsonb,
  customer_name text,
  customer_phone text,
  created_at timestamptz default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_shop_id on public.orders(shop_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

alter table public.orders enable row level security;

-- Authenticated users can view their own orders
create policy "Users can view own orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Anyone (guests + logged-in users) can place orders
create policy "Allow placing orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Allow reading placed order by ID (for guest checkout order confirmation)
create policy "Allow guest reading order by id"
  on public.orders
  for select
  to anon
  using (true);
