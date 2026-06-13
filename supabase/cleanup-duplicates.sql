-- ════════════════════════════════════════════════════════════════════════════
--  LIMPIEZA DE DUPLICADOS (correr UNA vez en Supabase → SQL Editor)
--  El seed se corrió más de una vez y duplicó características, imágenes y colores.
--  Esto deja UNA sola copia de cada uno y agrega índices únicos para que NUNCA
--  vuelva a pasar (ni re-corriendo el seed ni editando desde el admin).
-- ════════════════════════════════════════════════════════════════════════════

-- 1) Borrar duplicados (deja el de menor id por grupo)
delete from catalog_features a using catalog_features b
where a.id > b.id and a.feature_key = b.feature_key and a.text = b.text;

delete from catalog_images a using catalog_images b
where a.id > b.id and a.feature_key = b.feature_key and a.image_url = b.image_url;

delete from catalog_color_variants a using catalog_color_variants b
where a.id > b.id and a.feature_key = b.feature_key and a.name = b.name;

-- 2) Índices únicos → impiden duplicados a futuro
create unique index if not exists uq_features on catalog_features (feature_key, text);
create unique index if not exists uq_images   on catalog_images   (feature_key, image_url);
create unique index if not exists uq_colors   on catalog_color_variants (feature_key, name);
