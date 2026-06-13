-- ════════════════════════════════════════════════════════════════════════════
--  MIGRACIÓN: Temporadas tipo "FLYERS" (correr UNA vez en Supabase → SQL Editor)
--  Las temporadas nuevas son banners full-screen (PC + celular) que rotan como
--  carrusel y reemplazan toda la sección de destacados. La "Default" sigue
--  siendo el carrusel de productos de siempre.
-- ════════════════════════════════════════════════════════════════════════════

alter table campaigns add column if not exists kind text not null default 'flyers';
update campaigns set kind = 'products' where is_default;

create table if not exists campaign_flyers (
  id               uuid primary key default gen_random_uuid(),
  campaign_id      uuid not null references campaigns(id) on delete cascade,
  position         int  not null,
  image_pc_url     text,
  image_mobile_url text,
  nav_text_color   text not null default 'white',   -- 'white' | 'black' (color del menú sobre este flyer)
  unique (campaign_id, position)
);
-- Por si ya existía la tabla sin la columna:
alter table campaign_flyers add column if not exists nav_text_color text not null default 'white';

alter table campaign_flyers enable row level security;
drop policy if exists "public_read" on campaign_flyers;
drop policy if exists "auth_write"  on campaign_flyers;
create policy "public_read" on campaign_flyers for select using (true);
create policy "auth_write"  on campaign_flyers for all to authenticated using (true) with check (true);
