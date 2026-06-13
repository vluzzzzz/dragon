// Lectores de datos para la página PÚBLICA.
// Todos devuelven null ante cualquier problema (sin config, error de red, vacío)
// para que la web siempre caiga al contenido hardcodeado (fallback).

import { getClient } from './supabase-config.js';

// { content: {id: value}, campaign: {...}|null, items: [...] } | null
export async function loadActiveContent() {
  try {
    const sb = await getClient();
    if (!sb) return null;

    const [contentRes, campRes] = await Promise.all([
      sb.from('site_content').select('id,value'),
      sb.from('campaigns').select('*').eq('is_active', true).limit(1)
    ]);

    const content = {};
    (contentRes.data || []).forEach(function (r) { content[r.id] = r.value; });

    let campaign = (campRes.data && campRes.data[0]) || null;
    let items = [];
    if (campaign) {
      const itemsRes = await sb
        .from('featured_items')
        .select('*')
        .eq('campaign_id', campaign.id)
        .order('position', { ascending: true });
      items = itemsRes.data || [];
    }
    return { content: content, campaign: campaign, items: items };
  } catch (e) {
    return null;
  }
}

// { products:[...], features:{}, images:{}, colors:{} } en el shape de x0.js | null
export async function loadCatalog() {
  try {
    const sb = await getClient();
    if (!sb) return null;

    const [prodRes, featRes, imgRes, colRes] = await Promise.all([
      sb.from('catalog_products').select('*').eq('is_visible', true).order('sort_order', { ascending: true }),
      sb.from('catalog_features').select('*').order('sort_order', { ascending: true }),
      sb.from('catalog_images').select('*').order('sort_order', { ascending: true }),
      sb.from('catalog_color_variants').select('*').order('sort_order', { ascending: true })
    ]);

    if (!prodRes.data || !prodRes.data.length) return null;

    const products = prodRes.data.map(function (p) {
      return {
        tag: p.tag, name: p.name, price: p.price, rawPrice: p.raw_price,
        desc: p.descr, image: p.image_url, featureKey: p.feature_key,
        imgScale: Number(p.img_scale) || 0.85, category: p.category
      };
    });

    const features = {};
    (featRes.data || []).forEach(function (f) {
      (features[f.feature_key] = features[f.feature_key] || []).push(f.text);
    });

    const images = {};
    (imgRes.data || []).forEach(function (im) {
      (images[im.feature_key] = images[im.feature_key] || []).push(im.image_url);
    });

    const colors = {};
    (colRes.data || []).forEach(function (c) {
      (colors[c.feature_key] = colors[c.feature_key] || []).push({
        name: c.name, hex: c.hex, img: c.img_url, swatch: c.swatch_url, thumb: c.thumb_url
      });
    });

    return { products: products, features: features, images: images, colors: colors };
  } catch (e) {
    return null;
  }
}
