# Panel de administración — Puesta en marcha (10 min)

La web pública funciona **igual que siempre** hasta que completes esto. Sin
configurar Supabase, usa el contenido actual (no se rompe nada).

## 1. Crear el proyecto Supabase
1. Entrá a https://supabase.com → **New project** (plan free).
2. Elegí nombre y contraseña de base de datos. Esperá ~2 min a que cree.

## 2. Cargar el esquema y el contenido actual
1. En el proyecto: **SQL Editor → New query**.
2. Pegá todo `supabase/schema.sql` → **Run**.
3. Nueva query → pegá todo `supabase/seed.sql` → **Run**.
   (Esto crea la temporada **Default** con los 5 destacados y todo el catálogo
   actual, para que la web se vea idéntica.)

## 3. Storage (imágenes)
El `schema.sql` ya crea el bucket **site-images** público. Si no aparece:
**Storage → New bucket → nombre `site-images` → Public.**

## 4. Crear el usuario del cliente
1. **Authentication → Users → Add user** → email + contraseña (se la pasás al cliente).
2. **Authentication → Providers → Email** → desactivá **"Allow new users to sign up"**
   (así nadie más se puede registrar; solo entran los usuarios que vos creés).

## 5. Conectar la web
1. **Settings → API**: copiá **Project URL** y **anon public key**.
2. Pegalas en `js/supabase-config.js`:
   ```js
   export const SUPABASE_URL = 'https://xxxx.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```
   (La anon key es **pública** y segura: la escritura está protegida por RLS.)
3. Commit + push → Vercel redeploya.

## 6. Usar
- **Público:** `tusitio.com` — ahora lee el contenido desde Supabase (con fallback).
- **Admin (link para el cliente):** `tusitio.com/admin` → login → editar.
  - **Títulos:** textos de las secciones.
  - **Temporadas:** crear/duplicar/activar (ej: Navidad). Cada una con sus 5 destacados e imágenes. Solo una activa a la vez.
  - **Catálogo:** precios, nombres, características, imágenes y colores.
- Los cambios se ven **al instante** al recargar la web (sin redeploy).

## Notas
- La sección "Productos Destacados" usa **siempre 5 slots**. Para una temporada
  nueva, "Duplicar" parte de una que ya funciona.
- Si Supabase se cae o tarda, la web cae sola al contenido fijo (no se rompe).
- Para revertir todo: dejá `SUPABASE_URL`/`SUPABASE_ANON_KEY` vacíos en `supabase-config.js`.
