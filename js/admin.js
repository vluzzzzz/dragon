// Panel de administración — Dune Dragon
// Login (Supabase Auth) + edición de títulos, temporadas de destacados y catálogo.
import { getClient, isConfigured } from './supabase-config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const show = s => $(s).classList.remove('hidden');
const hide = s => $(s).classList.add('hidden');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let sb = null;
let _catalogKeys = [];   // [{feature_key, name}]

const CONTENT_LABELS = {
  beneficios_subtitle: 'Elegirnos: subtítulo (arriba del 3D)',
  beneficios_title: 'Elegirnos: título',
  contacto_eyebrow: 'Contacto: bajada',
  contacto_title: 'Contacto: título',
  contacto_cta_title: 'Contacto: título del recuadro',
  contacto_cta_text: 'Contacto: texto del recuadro',
  contacto_whatsapp: 'Contacto: WhatsApp',
  contacto_zona: 'Contacto: zona de despacho',
  contacto_horario: 'Contacto: horario'
};
const COLORS = ['rosa', 'amarillo', 'celeste'];

function toast(msg, isErr) {
  const t = document.createElement('div');
  t.className = 'toast' + (isErr ? ' err' : '');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

async function uploadImage(file, folder) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
  const { error } = await sb.storage.from('site-images').upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  return sb.storage.from('site-images').getPublicUrl(path).data.publicUrl;
}

// Conecta un <input type=file> + <img preview> + un input de texto con la URL.
function wireUpload(fileInput, urlInput, preview, folder) {
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    fileInput.disabled = true;
    try {
      const url = await uploadImage(f, folder);
      urlInput.value = url;
      if (preview) preview.src = url;
      toast('Imagen subida');
    } catch (e) { toast('Error subiendo imagen', true); }
    fileInput.disabled = false;
  });
}

// ───────────────────────── Auth ─────────────────────────
init();
async function init() {
  if (!isConfigured()) { show('#notConfigured'); return; }
  sb = await getClient();
  const { data: { session } } = await sb.auth.getSession();
  session ? showApp() : showLogin();
  sb.auth.onAuthStateChange((_e, s) => { s ? showApp() : showLogin(); });
}

function showLogin() {
  hide('#app'); show('#login');
  const form = $('#loginForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    $('#loginErr').textContent = '';
    $('#loginBtn').disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
    $('#loginBtn').disabled = false;
    if (error) $('#loginErr').textContent = 'No se pudo entrar: ' + error.message;
  };
}

async function showApp() {
  hide('#login'); show('#app');
  $('#logoutBtn').onclick = () => sb.auth.signOut();
  $$('.tab').forEach(t => t.onclick = () => switchTab(t.dataset.tab));
  // cache catalog keys for the featured feature_key dropdown
  const { data } = await sb.from('catalog_products').select('feature_key,name').order('sort_order');
  _catalogKeys = data || [];
  renderContent();
  renderCampaigns();
  renderCatalog();
}

function switchTab(tab) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['content', 'campaigns', 'catalog'].forEach(v => $('#view-' + v).classList.toggle('hidden', v !== tab));
}

// ───────────────────────── Tab: Títulos ─────────────────────────
async function renderContent() {
  const view = $('#view-content');
  view.innerHTML = '<div class="spinner">Cargando…</div>';
  const { data } = await sb.from('site_content').select('*').order('id');
  const rows = data || [];
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = '<h3>Títulos y textos del sitio</h3>';
  rows.forEach(r => {
    const f = document.createElement('div');
    f.className = 'field';
    const long = (r.value || '').length > 48;
    f.innerHTML = '<label>' + esc(CONTENT_LABELS[r.id] || r.id) + '</label>'
      + (long
        ? '<textarea rows="2" data-id="' + esc(r.id) + '">' + esc(r.value) + '</textarea>'
        : '<input type="text" data-id="' + esc(r.id) + '" value="' + esc(r.value) + '">');
    panel.appendChild(f);
  });
  const save = document.createElement('button');
  save.className = 'btn';
  save.textContent = 'Guardar títulos';
  save.onclick = async () => {
    const updates = $$('[data-id]', panel).map(i => ({ id: i.dataset.id, value: i.value }));
    save.disabled = true;
    const { error } = await sb.from('site_content').upsert(updates);
    save.disabled = false;
    toast(error ? 'Error al guardar' : 'Títulos guardados', !!error);
  };
  panel.appendChild(save);
  view.innerHTML = '';
  view.appendChild(panel);
}

// ───────────────────────── Tab: Temporadas ─────────────────────────
async function renderCampaigns() {
  const view = $('#view-campaigns');
  view.innerHTML = '<div class="spinner">Cargando…</div>';
  const { data } = await sb.from('campaigns').select('*').order('sort_order').order('name');
  const camps = data || [];

  const top = document.createElement('div');
  top.className = 'panel';
  top.innerHTML = '<h3>Temporadas de "Productos Destacados"</h3>'
    + '<p class="mut">Activá la temporada que querés mostrar. Cada una tiene sus 5 destacados.</p>';
  const newBtn = document.createElement('button');
  newBtn.className = 'btn';
  newBtn.textContent = '+ Crear temporada';
  newBtn.onclick = () => createCampaign(camps);
  top.appendChild(newBtn);

  view.innerHTML = '';
  view.appendChild(top);

  camps.forEach(c => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML =
      '<div class="item-head"><div><b>' + esc(c.name) + '</b> '
      + (c.is_active ? '<span class="badge">ACTIVA</span>' : '')
      + (c.is_default ? ' <span class="mut" style="font-size:12px">(default)</span>' : '')
      + '</div><div class="row" style="flex:0 0 auto"></div></div>';
    const btns = $('.row', item);
    if (!c.is_active) {
      const act = document.createElement('button'); act.className = 'btn btn-sm'; act.textContent = 'Activar';
      act.onclick = () => activateCampaign(c.id);
      btns.appendChild(act);
    }
    const edit = document.createElement('button'); edit.className = 'btn-ghost btn-sm'; edit.textContent = 'Editar destacados';
    edit.onclick = () => toggleEditor(item, c);
    btns.appendChild(edit);
    const dup = document.createElement('button'); dup.className = 'btn-ghost btn-sm'; dup.textContent = 'Duplicar';
    dup.onclick = () => duplicateCampaign(c, camps);
    btns.appendChild(dup);
    if (!c.is_default) {
      const del = document.createElement('button'); del.className = 'btn-danger btn-sm'; del.textContent = 'Eliminar';
      del.onclick = () => deleteCampaign(c);
      btns.appendChild(del);
    }
    view.appendChild(item);
  });
}

async function activateCampaign(id) {
  await sb.from('campaigns').update({ is_active: false }).eq('is_active', true);
  const { error } = await sb.from('campaigns').update({ is_active: true }).eq('id', id);
  toast(error ? 'Error al activar' : 'Temporada activada', !!error);
  renderCampaigns();
}

async function createCampaign(camps) {
  const name = prompt('Nombre de la temporada (ej: Navidad, Black Friday):');
  if (!name) return;
  const order = camps.length;
  const { data, error } = await sb.from('campaigns').insert({ name: name, sort_order: order }).select().single();
  if (error) { toast('Error al crear', true); return; }
  // clonar los 5 destacados desde la default (o la activa) como punto de partida
  const src = camps.find(c => c.is_default) || camps.find(c => c.is_active) || camps[0];
  if (src) await cloneItems(src.id, data.id);
  else await seedBlankItems(data.id);
  toast('Temporada creada');
  renderCampaigns();
}

async function duplicateCampaign(c, camps) {
  const { data, error } = await sb.from('campaigns').insert({ name: c.name + ' (copia)', sort_order: camps.length }).select().single();
  if (error) { toast('Error al duplicar', true); return; }
  await cloneItems(c.id, data.id);
  toast('Temporada duplicada');
  renderCampaigns();
}

async function deleteCampaign(c) {
  if (!confirm('¿Eliminar la temporada "' + c.name + '"? (sus destacados se borran)')) return;
  const { error } = await sb.from('campaigns').delete().eq('id', c.id);
  toast(error ? 'Error al eliminar' : 'Temporada eliminada', !!error);
  renderCampaigns();
}

async function cloneItems(fromId, toId) {
  const { data } = await sb.from('featured_items').select('*').eq('campaign_id', fromId).order('position');
  const rows = (data || []).map(r => {
    const o = Object.assign({}, r); delete o.id; delete o.updated_at; o.campaign_id = toId; return o;
  });
  if (rows.length) await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' });
  else await seedBlankItems(toId);
}

async function seedBlankItems(campaignId) {
  const rows = [0, 1, 2, 3, 4].map(p => ({
    campaign_id: campaignId, position: p, name: 'Producto ' + (p + 1), price: '$ 0',
    product_image_url: './images/prod-pro2.webp', color: COLORS[p % 3]
  }));
  await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' });
}

// Editor de los 5 destacados de una temporada (se despliega bajo el item)
async function toggleEditor(itemEl, c) {
  let editor = itemEl.querySelector('.featured-editor');
  if (editor) { editor.remove(); return; }
  editor = document.createElement('div');
  editor.className = 'featured-editor';
  editor.style.marginTop = '12px';
  editor.innerHTML = '<div class="spinner">Cargando destacados…</div>';
  itemEl.appendChild(editor);

  let { data } = await sb.from('featured_items').select('*').eq('campaign_id', c.id).order('position');
  let items = data || [];
  if (items.length < 5) { await seedBlankItems(c.id); items = (await sb.from('featured_items').select('*').eq('campaign_id', c.id).order('position')).data || []; }
  items = items.slice(0, 5);

  // imagen de título de la temporada (opcional)
  const titleBlock = document.createElement('div');
  titleBlock.className = 'panel';
  titleBlock.innerHTML = '<label>Imagen de título de la temporada (opcional, reemplaza "Productos Destacados")</label>'
    + '<div class="upload-row"><img class="thumb" src="' + esc(c.title_image_url || '') + '"><input type="text" class="t-url" value="' + esc(c.title_image_url || '') + '" placeholder="URL imagen"><input type="file" accept="image/*" class="t-file" style="max-width:160px"></div>';
  wireUpload($('.t-file', titleBlock), $('.t-url', titleBlock), $('.thumb', titleBlock), 'campaigns');
  editor.innerHTML = '';
  editor.appendChild(titleBlock);

  const opts = _catalogKeys.map(k => '<option value="' + esc(k.feature_key) + '">' + esc(k.name) + '</option>').join('');
  items.forEach((it, idx) => {
    const box = document.createElement('div');
    box.className = 'panel';
    box.dataset.pos = it.position;
    box.innerHTML =
      '<b>Destacado ' + (idx + 1) + '</b>'
      + '<div class="row" style="margin-top:8px"><div class="field"><label>Nombre</label><input class="f-name" value="' + esc(it.name) + '"></div>'
      + '<div class="field"><label>Precio</label><input class="f-price" value="' + esc(it.price) + '"></div></div>'
      + '<div class="row"><div class="field"><label>Color de fondo</label><select class="f-color">' + COLORS.map(co => '<option value="' + co + '"' + (co === it.color ? ' selected' : '') + '>' + co + '</option>').join('') + '</select></div>'
      + '<div class="field"><label>Producto vinculado (para el detalle)</label><select class="f-fk"><option value="">— ninguno —</option>' + opts + '</select></div></div>'
      + '<div class="field"><label>Imagen del producto</label><div class="upload-row"><img class="thumb f-prev" src="' + esc(it.product_image_url) + '"><input type="text" class="f-img" value="' + esc(it.product_image_url) + '" placeholder="URL imagen"><input type="file" accept="image/*" class="f-file" style="max-width:150px"></div></div>'
      + '<div class="collapse-h">⚙ Ajuste de imagen (avanzado)</div>'
      + '<div class="f-adv hidden"><div class="row"><div class="field"><label>Ancho</label><input class="f-iw" value="' + esc(it.img_w) + '"></div><div class="field"><label>X</label><input type="number" class="f-ix" value="' + (it.img_x || 0) + '"></div><div class="field"><label>Y</label><input type="number" class="f-iy" value="' + (it.img_y || 0) + '"></div></div>'
      + '<div class="row"><div class="field"><label>Flecha ancho</label><input type="number" class="f-aw" value="' + (it.arrow_w || 55) + '"></div><div class="field"><label>Flecha X</label><input type="number" class="f-ax" value="' + (it.arrow_x || 0) + '"></div><div class="field"><label>Flecha Y</label><input type="number" class="f-ay" value="' + (it.arrow_y || -250) + '"></div><div class="field"><label>Flecha rot</label><input type="number" class="f-ar" value="' + (it.arrow_r || 0) + '"></div></div></div>';
    const fk = $('.f-fk', box); if (it.feature_key) fk.value = it.feature_key;
    $('.collapse-h', box).onclick = () => $('.f-adv', box).classList.toggle('hidden');
    wireUpload($('.f-file', box), $('.f-img', box), $('.f-prev', box), 'featured');
    editor.appendChild(box);
  });

  const save = document.createElement('button');
  save.className = 'btn';
  save.textContent = 'Guardar destacados';
  save.onclick = async () => {
    save.disabled = true;
    const rows = $$('.panel[data-pos]', editor).map(box => ({
      campaign_id: c.id,
      position: parseInt(box.dataset.pos, 10),
      name: $('.f-name', box).value,
      price: $('.f-price', box).value,
      color: $('.f-color', box).value,
      feature_key: $('.f-fk', box).value || null,
      product_image_url: $('.f-img', box).value,
      img_w: $('.f-iw', box).value || '90%',
      img_x: parseInt($('.f-ix', box).value, 10) || 0,
      img_y: parseInt($('.f-iy', box).value, 10) || 0,
      arrow_w: parseInt($('.f-aw', box).value, 10) || 55,
      arrow_x: parseInt($('.f-ax', box).value, 10) || 0,
      arrow_y: parseInt($('.f-ay', box).value, 10) || -250,
      arrow_r: parseInt($('.f-ar', box).value, 10) || 0
    }));
    const titleUrl = $('.t-url', titleBlock).value || null;
    const e1 = (await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' })).error;
    const e2 = (await sb.from('campaigns').update({ title_image_url: titleUrl }).eq('id', c.id)).error;
    save.disabled = false;
    toast((e1 || e2) ? 'Error al guardar' : 'Destacados guardados', !!(e1 || e2));
  };
  editor.appendChild(save);
}

// ───────────────────────── Tab: Catálogo ─────────────────────────
async function renderCatalog() {
  const view = $('#view-catalog');
  view.innerHTML = '<div class="spinner">Cargando…</div>';
  const { data } = await sb.from('catalog_products').select('*').order('sort_order');
  const prods = data || [];

  const top = document.createElement('div');
  top.className = 'panel';
  top.innerHTML = '<h3>Catálogo de productos</h3><p class="mut">Editá precios, nombres, características e imágenes. "Guardar" en cada producto.</p>';
  const nb = document.createElement('button');
  nb.className = 'btn'; nb.textContent = '+ Nuevo producto';
  nb.onclick = () => createProduct(prods.length);
  top.appendChild(nb);

  view.innerHTML = '';
  view.appendChild(top);
  prods.forEach(p => view.appendChild(productCard(p)));
}

async function createProduct(order) {
  const name = prompt('Nombre del producto:');
  if (!name) return;
  const fk = prompt('Identificador único (sin espacios, ej: airpods-pro-2):', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  if (!fk) return;
  const { error } = await sb.from('catalog_products').insert({ feature_key: fk, name: name, price: '$0', raw_price: 0, category: 'accesorios', sort_order: order });
  toast(error ? 'Error (¿id repetido?)' : 'Producto creado', !!error);
  if (!error) renderCatalog();
}

function productCard(p) {
  const box = document.createElement('div');
  box.className = 'item';
  box.innerHTML =
    '<div class="item-head"><b>' + esc(p.name) + '</b><span class="mut" style="font-size:12px">' + esc(p.feature_key) + '</span></div>'
    + '<div class="row"><div class="field"><label>Nombre</label><input class="c-name" value="' + esc(p.name) + '"></div>'
    + '<div class="field"><label>Etiqueta</label><input class="c-tag" value="' + esc(p.tag || '') + '"></div></div>'
    + '<div class="row"><div class="field"><label>Precio (texto)</label><input class="c-price" value="' + esc(p.price) + '"></div>'
    + '<div class="field"><label>Precio (número)</label><input type="number" class="c-raw" value="' + (p.raw_price || 0) + '"></div>'
    + '<div class="field"><label>Categoría</label><select class="c-cat">' + ['audio', 'watch', 'accesorios'].map(ct => '<option' + (ct === p.category ? ' selected' : '') + '>' + ct + '</option>').join('') + '</select></div></div>'
    + '<div class="field"><label>Descripción</label><textarea class="c-desc" rows="2">' + esc(p.descr || '') + '</textarea></div>'
    + '<div class="field"><label>Imagen principal</label><div class="upload-row"><img class="thumb c-prev" src="' + esc(p.image_url || '') + '"><input type="text" class="c-img" value="' + esc(p.image_url || '') + '" placeholder="URL"><input type="file" accept="image/*" class="c-file" style="max-width:150px"></div></div>'
    + '<div class="row"><div class="field"><label>Escala imagen</label><input type="number" step="0.05" class="c-scale" value="' + (p.img_scale || 0.85) + '"></div>'
    + '<div class="field"><label>Visible</label><select class="c-vis"><option value="true"' + (p.is_visible ? ' selected' : '') + '>Sí</option><option value="false"' + (!p.is_visible ? ' selected' : '') + '>No</option></select></div></div>'
    + '<div class="collapse-h c-more">▸ Características, imágenes y colores</div>'
    + '<div class="c-sub hidden"></div>'
    + '<div class="row" style="margin-top:10px"><button class="btn c-save" style="flex:0 0 auto">Guardar producto</button><button class="btn-danger btn-sm c-del" style="flex:0 0 auto">Eliminar</button></div>';

  wireUpload($('.c-file', box), $('.c-img', box), $('.c-prev', box), 'catalog');
  $('.c-more', box).onclick = () => {
    const sub = $('.c-sub', box);
    if (!sub.classList.contains('hidden')) { sub.classList.add('hidden'); return; }
    sub.classList.remove('hidden');
    if (!sub.dataset.loaded) { loadSubEditors(sub, p.feature_key); sub.dataset.loaded = '1'; }
  };
  $('.c-save', box).onclick = async () => {
    const upd = {
      feature_key: p.feature_key,
      name: $('.c-name', box).value, tag: $('.c-tag', box).value,
      price: $('.c-price', box).value, raw_price: parseInt($('.c-raw', box).value, 10) || 0,
      category: $('.c-cat', box).value, descr: $('.c-desc', box).value,
      image_url: $('.c-img', box).value, img_scale: parseFloat($('.c-scale', box).value) || 0.85,
      is_visible: $('.c-vis', box).value === 'true'
    };
    const { error } = await sb.from('catalog_products').upsert(upd, { onConflict: 'feature_key' });
    toast(error ? 'Error al guardar' : 'Producto guardado', !!error);
  };
  $('.c-del', box).onclick = async () => {
    if (!confirm('¿Eliminar "' + p.name + '"?')) return;
    const { error } = await sb.from('catalog_products').delete().eq('feature_key', p.feature_key);
    toast(error ? 'Error al eliminar' : 'Producto eliminado', !!error);
    if (!error) box.remove();
  };
  return box;
}

// Sub-editores: características (texto), imágenes (galería) y colores
async function loadSubEditors(sub, fk) {
  sub.innerHTML = '<div class="spinner">Cargando…</div>';
  const [feat, imgs, cols] = await Promise.all([
    sb.from('catalog_features').select('*').eq('feature_key', fk).order('sort_order'),
    sb.from('catalog_images').select('*').eq('feature_key', fk).order('sort_order'),
    sb.from('catalog_color_variants').select('*').eq('feature_key', fk).order('sort_order')
  ]);
  sub.innerHTML = '';

  // Características
  const fp = document.createElement('div'); fp.className = 'panel';
  fp.innerHTML = '<label>Características (una por línea)</label><div class="feat-list"></div><button class="btn-ghost btn-sm feat-add">+ Agregar</button>';
  const addFeat = (v) => {
    const r = document.createElement('div'); r.className = 'sublist-row';
    r.innerHTML = '<input class="feat-v" value="' + esc(v || '') + '"><button class="btn-danger btn-sm">✕</button>';
    r.querySelector('button').onclick = () => r.remove();
    $('.feat-list', fp).appendChild(r);
  };
  (feat.data || []).forEach(f => addFeat(f.text));
  $('.feat-add', fp).onclick = () => addFeat('');
  sub.appendChild(fp);

  // Imágenes
  const ip = document.createElement('div'); ip.className = 'panel';
  ip.innerHTML = '<label>Galería de imágenes</label><div class="img-list"></div><div class="upload-row" style="margin-top:8px"><input type="file" accept="image/*" class="img-file" style="max-width:170px"><span class="mut" style="font-size:12px">subir y agregar</span></div>';
  const addImg = (url) => {
    const r = document.createElement('div'); r.className = 'sublist-row';
    r.innerHTML = '<img class="thumb" src="' + esc(url || '') + '"><input class="img-v" value="' + esc(url || '') + '"><button class="btn-danger btn-sm">✕</button>';
    r.querySelector('button').onclick = () => r.remove();
    $('.img-list', ip).appendChild(r);
  };
  (imgs.data || []).forEach(i => addImg(i.image_url));
  $('.img-file', ip).addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    e.target.disabled = true;
    try { addImg(await uploadImage(f, 'catalog')); toast('Imagen agregada'); } catch (_) { toast('Error', true); }
    e.target.disabled = false; e.target.value = '';
  });
  sub.appendChild(ip);

  // Colores
  const cp = document.createElement('div'); cp.className = 'panel';
  cp.innerHTML = '<label>Variantes de color</label><div class="col-list"></div><button class="btn-ghost btn-sm col-add">+ Agregar color</button>';
  const addCol = (c) => {
    c = c || {};
    const r = document.createElement('div'); r.className = 'item';
    r.innerHTML = '<div class="row"><div class="field"><label>Nombre</label><input class="col-name" value="' + esc(c.name || '') + '"></div>'
      + '<div class="field"><label>Hex</label><input class="col-hex" value="' + esc(c.hex || '#cccccc') + '"></div></div>'
      + '<div class="field"><label>Imagen producto</label><div class="upload-row"><img class="thumb col-prev" src="' + esc(c.img_url || '') + '"><input class="col-img" value="' + esc(c.img_url || '') + '"><input type="file" accept="image/*" class="col-file" style="max-width:140px"></div></div>'
      + '<div class="row"><div class="field"><label>Swatch (puntito)</label><input class="col-sw" value="' + esc(c.swatch_url || '') + '"></div>'
      + '<div class="field"><label>Thumb</label><input class="col-th" value="' + esc(c.thumb_url || '') + '"></div></div>'
      + '<button class="btn-danger btn-sm">Quitar color</button>';
    r.querySelector('.btn-danger').onclick = () => r.remove();
    wireUpload($('.col-file', r), $('.col-img', r), $('.col-prev', r), 'catalog');
    $('.col-list', cp).appendChild(r);
  };
  (cols.data || []).forEach(addCol);
  $('.col-add', cp).onclick = () => addCol({});
  sub.appendChild(cp);

  // Guardar sub-editores (reemplaza filas hijas)
  const save = document.createElement('button');
  save.className = 'btn'; save.textContent = 'Guardar características/imágenes/colores';
  save.onclick = async () => {
    save.disabled = true;
    const featRows = $$('.feat-v', fp).map((i, idx) => ({ feature_key: fk, text: i.value, sort_order: idx })).filter(r => r.text.trim());
    const imgRows = $$('.img-v', ip).map((i, idx) => ({ feature_key: fk, image_url: i.value, sort_order: idx })).filter(r => r.image_url.trim());
    const colRows = $$('.col-list .item', cp).map((r, idx) => ({
      feature_key: fk, name: $('.col-name', r).value, hex: $('.col-hex', r).value,
      img_url: $('.col-img', r).value, swatch_url: $('.col-sw', r).value, thumb_url: $('.col-th', r).value, sort_order: idx
    })).filter(r => r.name.trim());
    await sb.from('catalog_features').delete().eq('feature_key', fk);
    await sb.from('catalog_images').delete().eq('feature_key', fk);
    await sb.from('catalog_color_variants').delete().eq('feature_key', fk);
    const e1 = featRows.length ? (await sb.from('catalog_features').insert(featRows)).error : null;
    const e2 = imgRows.length ? (await sb.from('catalog_images').insert(imgRows)).error : null;
    const e3 = colRows.length ? (await sb.from('catalog_color_variants').insert(colRows)).error : null;
    save.disabled = false;
    toast((e1 || e2 || e3) ? 'Error al guardar' : 'Guardado', !!(e1 || e2 || e3));
  };
  sub.appendChild(save);
}
