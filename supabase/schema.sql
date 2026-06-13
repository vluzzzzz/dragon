-- ════════════════════════════════════════════════════════════════════════════
--  Dune Dragon — Esquema Supabase
--  Pegá TODO esto en: Supabase Dashboard → SQL Editor → New query → Run.
--  Después corré seed.sql para cargar el contenido actual.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Contenido editable (títulos / textos) ───────────────────────────────────
create table if not exists site_content (
  id          text primary key,            -- 'beneficios_title', 'contacto_whatsapp', ...
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

-- ── Temporadas para "Productos Destacados" (activación MANUAL) ───────────────
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  is_active       boolean not null default false,
  is_default      boolean not null default false,
  kind            text not null default 'flyers',   -- 'products' (Default) | 'flyers'
  title_image_url text,
  sort_order      int not null default 0,
  updated_at      timestamptz not null default now()
);
-- Solo una temporada activa a la vez:
create unique index if not exists one_active_campaign on campaigns (is_active) where is_active;

-- Flyers full-screen (banners PC + celular) de una temporada tipo 'flyers'
create table if not exists campaign_flyers (
  id               uuid primary key default gen_random_uuid(),
  campaign_id      uuid not null references campaigns(id) on delete cascade,
  position         int  not null,
  image_pc_url     text,
  image_mobile_url text,
  unique (campaign_id, position)
);

-- ── Los 5 destacados de cada temporada ──────────────────────────────────────
create table if not exists featured_items (
  id                uuid primary key default gen_random_uuid(),
  campaign_id       uuid not null references campaigns(id) on delete cascade,
  position          int  not null,          -- 0..4
  name              text not null,
  price             text not null,
  product_image_url text not null,
  color             text not null default 'rosa',   -- rosa | amarillo | celeste
  feature_key       text,
  img_w   text default '90%',
  img_x   int  default 0,
  img_y   int  default 0,
  arrow_w int  default 55,
  arrow_x int  default 0,
  arrow_y int  default -250,
  arrow_r int  default 0,
  updated_at  timestamptz not null default now(),
  unique (campaign_id, position)
);

-- ── Catálogo editable (espejo de _catProducts y compañía) ────────────────────
create table if not exists catalog_products (
  id          uuid primary key default gen_random_uuid(),
  feature_key text unique not null,
  tag         text,
  name        text not null,
  price       text not null,
  raw_price   int  not null,
  descr       text,
  image_url   text,
  img_scale   numeric default 0.85,
  category    text,
  sort_order  int default 0,
  is_visible  boolean default true,
  updated_at  timestamptz not null default now()
);

create table if not exists catalog_features (
  id          uuid primary key default gen_random_uuid(),
  feature_key text not null references catalog_products(feature_key) on delete cascade,
  text        text not null,
  sort_order  int default 0
);

create table if not exists catalog_images (
  id          uuid primary key default gen_random_uuid(),
  feature_key text not null references catalog_products(feature_key) on delete cascade,
  image_url   text not null,
  sort_order  int default 0
);

create table if not exists catalog_color_variants (
  id          uuid primary key default gen_random_uuid(),
  feature_key text not null references catalog_products(feature_key) on delete cascade,
  name        text not null,
  hex         text,
  img_url     text,
  swatch_url  text,
  thumb_url   text,
  sort_order  int default 0
);

-- Índices únicos: impiden duplicados en las tablas hijas (re-seed seguro).
create unique index if not exists uq_features on catalog_features (feature_key, text);
create unique index if not exists uq_images   on catalog_images   (feature_key, image_url);
create unique index if not exists uq_colors   on catalog_color_variants (feature_key, name);

-- ════════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY  → lectura pública, escritura solo logueado
-- ════════════════════════════════════════════════════════════════════════════
alter table site_content          enable row level security;
alter table campaigns             enable row level security;
alter table featured_items        enable row level security;
alter table catalog_products      enable row level security;
alter table catalog_features      enable row level security;
alter table catalog_images        enable row level security;
alter table catalog_color_variants enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'site_content','campaigns','featured_items','campaign_flyers',
    'catalog_products','catalog_features','catalog_images','catalog_color_variants'
  ] loop
    execute format('drop policy if exists "public_read" on %I;', t);
    execute format('drop policy if exists "auth_write" on %I;', t);
    execute format('create policy "public_read" on %I for select using (true);', t);
    execute format('create policy "auth_write" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
--  STORAGE  → bucket público para imágenes que sube el cliente
--  (Si preferís, creá el bucket "site-images" como PUBLIC desde la UI de Storage
--   y omití este bloque.)
-- ════════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

do $$
begin
  execute 'drop policy if exists "site_images_read" on storage.objects';
  execute 'drop policy if exists "site_images_write" on storage.objects';
  execute $p$create policy "site_images_read" on storage.objects
            for select using (bucket_id = 'site-images')$p$;
  execute $p$create policy "site_images_write" on storage.objects
            for all to authenticated
            using (bucket_id = 'site-images') with check (bucket_id = 'site-images')$p$;
end $$;
