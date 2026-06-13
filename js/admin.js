// Panel de administración — Dune Dragon
// Login (Supabase Auth) + Temporadas de destacados + Catálogo.
import { getClient, isConfigured } from './supabase-config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const show = s => $(s).classList.remove('hidden');
const hide = s => $(s).classList.add('hidden');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const priceToNum = s => parseInt(String(s || '').replace(/\D/g, ''), 10) || 0;

let sb = null;
let _catalogKeys = [];   // [{feature_key, name}] para el dropdown de destacados

const COLORS = ['rosa', 'amarillo', 'celeste'];
const CATS = [{ v: 'audio', l: 'Audífonos' }, { v: 'watch', l: 'Relojes' }, { v: 'accesorios', l: 'Accesorios' }];
const TAG_FROM_CAT = { audio: 'Audio', watch: 'Relojes', accesorios: 'Accesorios' };

// Valores originales (seed) para "Restablecer original" — nivel producto.
const ORIGINALS = {
  'airpods-pro-2': { name: 'AirPods Pro 2', price: '$26.000', descr: 'Sonido profesional en un formato compacto. Pensados para quienes buscan una experiencia de audio superior y comodidad durante todo el día.', image_url: './images/airpods-pro-2.webp', img_scale: 0.85, category: 'audio' },
  'airpods-4gen': { name: 'AirPods 4', price: '$30.000', descr: 'Sonido espléndido en formato compacto. Modelo "Improved Fit" — si tus airpods lisos se resbalaban, estos vinieron a cambiarlo todo.', image_url: './images/airpods-4gen.webp', img_scale: 0.85, category: 'audio' },
  'airpods-pro-3': { name: 'AirPods Pro 3 · ANC', price: '$37.990', descr: 'Los audífonos pequeños con el sonido más espectacular. Acústica renovada, mejor ajuste y traductor en vivo.', image_url: './images/airpods-3gen.webp', img_scale: 0.85, category: 'audio' },
  'max-basico': { name: 'AirPods Max Básico', price: '$47.000', descr: 'Eleva tu forma de escuchar música. Diseñados para quienes buscan una experiencia de sonido inmersiva y comodidad superior.', image_url: './images/max-magneticos.webp', img_scale: 0.85, category: 'audio' },
  'max-1-1': { name: 'AirPods Max 1:1', price: '$195.000', descr: 'Disponible en 5 colores. Este modelo es realmente idéntico. Modo reposo en estuche, sensores dinámicos, acabados de lujo.', image_url: './images/max-magneticos.webp', img_scale: 0.85, category: 'audio' },
  'apple-watch-ultra-3': { name: 'Apple Watch Ultra 3', price: '$54.990', descr: 'Potencia, estilo y control desde tu muñeca. Combina un diseño imponente con funciones inteligentes.', image_url: './images/apple-watch-ultra-3.webp', img_scale: 0.75, category: 'watch' },
  'apple-watch-serie-11': { name: 'Apple Watch Serie 11', price: '$54.990', descr: 'Elegancia, estilo y control desde tu muñeca. Combina un diseño sutil con funciones inteligentes.', image_url: './images/serie-10.webp', img_scale: 0.75, category: 'watch' },
  'apple-pencil': { name: 'Apple Pencil 1° Gen', price: '$29.990', descr: 'Precisión profesional en cada trazo. Diseñado para escribir, dibujar y crear con máxima fluidez.', image_url: './images/pencil.webp', img_scale: 0.75, category: 'accesorios' },
  'cargador-35w': { name: 'Cargador 35W USB-C', price: '$16.000', descr: 'Carga al instante con este cargador rápido compatible con iPhone y cualquier dispositivo USB-C. 35W, 1mt de longitud.', image_url: './images/cargador-tipo-c.webp', img_scale: 0.75, category: 'accesorios' },
  'bateria-magsafe': { name: 'Batería MagSafe', price: '$22.000', descr: 'Olvídate de quedarte sin batería. La batería MagSafe inalámbrica es tu aliada perfecta para viajar o salir sin preocuparte.', image_url: './images/bateria-magsafe.webp', img_scale: 0.75, category: 'accesorios' },
  'correa-milanese': { name: 'Correa Milanese', price: '$13.000', descr: 'La pulsera Milanese Loop de malla de acero inoxidable confeccionada con máquinas italianas. Se adapta como un guante a tu muñeca y su cierre magnético se ajusta perfectamente a cualquier talla.', image_url: './images/milaneseplata.webp', img_scale: 0.85, category: 'watch' },
  'correa-sport': { name: 'Correa Sport', price: '$10.000', descr: 'Hecha de fluoroelastómero de alto rendimiento. Duradera, resistente y muy suave. Su material compacto y liso envuelve con elegancia tu muñeca.', image_url: './images/cosportstarlight.webp', img_scale: 0.85, category: 'watch' },
  'correa-trail': { name: 'Correa Trail', price: '$10.000', descr: 'Ultra delgada y liviana con tejido de nylon flexible de alta elasticidad. Incluye tira para ajuste rápido e hilos reflectantes en los bordes.', image_url: './images/coblack.webp', img_scale: 0.85, category: 'watch' },
  'correa-sport-2': { name: 'Correa Sport 2', price: '$10.000', descr: 'Liviana y elástica con fragmentos de colores combinados de forma aleatoria que le dan un toque único. Ideal para pista, montaña o gimnasio.', image_url: './images/cosport2blanca.webp', img_scale: 0.85, category: 'watch' }
};

const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

function toast(msg, isErr) {
  const t = document.createElement('div');
  t.className = 'toast' + (isErr ? ' err' : '');
  t.innerHTML = '<span class="check">' + (isErr ? '!' : CHECK_SVG) + '</span><span>' + esc(msg) + '</span>';
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 280); }, 2300);
}
const ok = (m) => toast(m || 'Guardado', false);
const fail = (m) => toast(m || 'Error al guardar', true);

function uniqueBy(arr, keyFn) {
  const seen = new Set(); const out = [];
  arr.forEach(x => { const k = keyFn(x); if (!seen.has(k)) { seen.add(k); out.push(x); } });
  return out;
}

async function uploadImage(file, folder) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
  const { error } = await sb.storage.from('site-images').upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  return sb.storage.from('site-images').getPublicUrl(path).data.publicUrl;
}

function wireUpload(fileInput, urlInput, preview, folder) {
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    fileInput.disabled = true;
    try {
      const url = await uploadImage(f, folder);
      urlInput.value = url;
      if (preview) preview.src = url;
      ok('Imagen subida');
    } catch (e) { fail('Error subiendo imagen'); }
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
  $('#loginForm').onsubmit = async (e) => {
    e.preventDefault();
    $('#loginErr').textContent = '';
    $('#loginBtn').disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
    $('#loginBtn').disabled = false;
    if (error) $('#loginErr').textContent = 'No se pudo entrar: ' + error.message;
  };
}

let _started = false;
async function showApp() {
  hide('#login'); show('#app');
  $('#logoutBtn').onclick = () => sb.auth.signOut();
  if (_started) return;
  _started = true;
  $$('.tab').forEach(t => t.onclick = () => switchTab(t.dataset.tab));
  const { data } = await sb.from('catalog_products').select('feature_key,name').order('sort_order');
  _catalogKeys = data || [];
  renderCampaigns();
  renderCatalog();
}

function switchTab(tab) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['campaigns', 'catalog'].forEach(v => $('#view-' + v).classList.toggle('hidden', v !== tab));
}

// ───────────────────────── Temporadas ─────────────────────────
async function renderCampaigns() {
  const view = $('#view-campaigns');
  view.innerHTML = '<div class="spinner">Cargando…</div>';
  const { data } = await sb.from('campaigns').select('*').order('sort_order').order('name');
  const camps = data || [];

  view.innerHTML = '<div class="head"><p class="eyebrow">Productos Destacados</p><h2 class="title">Temporadas</h2></div>';
  const top = document.createElement('div');
  top.className = 'panel';
  top.innerHTML = '<p class="mut" style="margin:0 0 12px">Activá la temporada que querés mostrar en la web. Cada una tiene sus 5 destacados.</p>';
  const newBtn = document.createElement('button');
  newBtn.className = 'btn'; newBtn.textContent = '+ Crear temporada';
  newBtn.onclick = () => createCampaign(camps);
  top.appendChild(newBtn);
  view.appendChild(top);

  camps.forEach(c => {
    const item = document.createElement('div');
    item.className = 'card-item';
    item.innerHTML = '<div class="item-head"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="item-title">' + esc(c.name) + '</span>'
      + (c.is_active ? '<span class="badge">ACTIVA</span>' : '')
      + (c.is_default ? '<span class="pill-mut">default</span>' : '')
      + '</div><div class="row" style="flex:0 0 auto"></div></div>';
    const btns = $('.row', item);
    if (!c.is_active) { const a = document.createElement('button'); a.className = 'btn btn-sm'; a.textContent = 'Activar'; a.onclick = () => activateCampaign(c.id); btns.appendChild(a); }
    const e = document.createElement('button'); e.className = 'btn-ghost btn-sm'; e.textContent = 'Editar destacados'; e.onclick = () => toggleEditor(item, c); btns.appendChild(e);
    const d = document.createElement('button'); d.className = 'btn-ghost btn-sm'; d.textContent = 'Duplicar'; d.onclick = () => duplicateCampaign(c, camps); btns.appendChild(d);
    if (!c.is_default) { const x = document.createElement('button'); x.className = 'btn-danger btn-sm'; x.textContent = 'Eliminar'; x.onclick = () => deleteCampaign(c); btns.appendChild(x); }
    view.appendChild(item);
  });
}

async function activateCampaign(id) {
  await sb.from('campaigns').update({ is_active: false }).eq('is_active', true);
  const { error } = await sb.from('campaigns').update({ is_active: true }).eq('id', id);
  error ? fail('Error al activar') : ok('Temporada activada');
  renderCampaigns();
}
async function createCampaign(camps) {
  const name = prompt('Nombre de la temporada (ej: Navidad, Black Friday):');
  if (!name) return;
  const { data, error } = await sb.from('campaigns').insert({ name, sort_order: camps.length }).select().single();
  if (error) { fail('Error al crear'); return; }
  const src = camps.find(c => c.is_default) || camps.find(c => c.is_active) || camps[0];
  src ? await cloneItems(src.id, data.id) : await seedBlankItems(data.id);
  ok('Temporada creada'); renderCampaigns();
}
async function duplicateCampaign(c, camps) {
  const { data, error } = await sb.from('campaigns').insert({ name: c.name + ' (copia)', sort_order: camps.length }).select().single();
  if (error) { fail('Error al duplicar'); return; }
  await cloneItems(c.id, data.id);
  ok('Temporada duplicada'); renderCampaigns();
}
async function deleteCampaign(c) {
  if (!confirm('¿Eliminar la temporada "' + c.name + '"?')) return;
  const { error } = await sb.from('campaigns').delete().eq('id', c.id);
  error ? fail('Error al eliminar') : ok('Temporada eliminada');
  renderCampaigns();
}
async function cloneItems(fromId, toId) {
  const { data } = await sb.from('featured_items').select('*').eq('campaign_id', fromId).order('position');
  const rows = (data || []).map(r => { const o = Object.assign({}, r); delete o.id; delete o.updated_at; o.campaign_id = toId; return o; });
  rows.length ? await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' }) : await seedBlankItems(toId);
}
async function seedBlankItems(campaignId) {
  const rows = [0, 1, 2, 3, 4].map(p => ({ campaign_id: campaignId, position: p, name: 'Producto ' + (p + 1), price: '$ 0', product_image_url: './images/prod-pro2.webp', color: COLORS[p % 3] }));
  await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' });
}

async function toggleEditor(itemEl, c) {
  let editor = itemEl.querySelector('.featured-editor');
  if (editor) { editor.remove(); return; }
  editor = document.createElement('div');
  editor.className = 'featured-editor sub';
  editor.innerHTML = '<div class="spinner">Cargando destacados…</div>';
  itemEl.appendChild(editor);

  let { data } = await sb.from('featured_items').select('*').eq('campaign_id', c.id).order('position');
  let items = data || [];
  if (items.length < 5) { await seedBlankItems(c.id); items = (await sb.from('featured_items').select('*').eq('campaign_id', c.id).order('position')).data || []; }
  items = items.slice(0, 5);

  const titleBlock = document.createElement('div');
  titleBlock.className = 'panel';
  titleBlock.innerHTML = '<label>Imagen de título de la temporada (opcional)</label>'
    + '<div class="upload-row"><img class="thumb" src="' + esc(c.title_image_url || '') + '"><input type="text" class="t-url" value="' + esc(c.title_image_url || '') + '" placeholder="URL imagen"><input type="file" accept="image/*" class="t-file" style="max-width:150px"></div>';
  wireUpload($('.t-file', titleBlock), $('.t-url', titleBlock), $('.thumb', titleBlock), 'campaigns');
  editor.innerHTML = '';
  editor.appendChild(titleBlock);

  const opts = _catalogKeys.map(k => '<option value="' + esc(k.feature_key) + '">' + esc(k.name) + '</option>').join('');
  items.forEach((it, idx) => {
    const box = document.createElement('div');
    box.className = 'panel'; box.dataset.pos = it.position;
    box.innerHTML = '<div class="item-title" style="margin-bottom:10px">Destacado ' + (idx + 1) + '</div>'
      + '<div class="row"><div class="field"><label>Nombre</label><input class="f-name" value="' + esc(it.name) + '"></div><div class="field"><label>Precio</label><input class="f-price" value="' + esc(it.price) + '"></div></div>'
      + '<div class="row"><div class="field"><label>Color de fondo</label><select class="f-color">' + COLORS.map(co => '<option value="' + co + '"' + (co === it.color ? ' selected' : '') + '>' + co + '</option>').join('') + '</select></div>'
      + '<div class="field"><label>Producto vinculado (detalle)</label><select class="f-fk"><option value="">— ninguno —</option>' + opts + '</select></div></div>'
      + '<div class="field"><label>Imagen del producto</label><div class="upload-row"><img class="thumb f-prev" src="' + esc(it.product_image_url) + '"><input type="text" class="f-img" value="' + esc(it.product_image_url) + '" placeholder="URL"><input type="file" accept="image/*" class="f-file" style="max-width:150px"></div></div>'
      + '<div class="collapse-h">⚙ Ajuste de imagen (avanzado)</div>'
      + '<div class="f-adv hidden"><div class="row"><div class="field"><label>Ancho</label><input class="f-iw" value="' + esc(it.img_w) + '"></div><div class="field"><label>X</label><input type="number" class="f-ix" value="' + (it.img_x || 0) + '"></div><div class="field"><label>Y</label><input type="number" class="f-iy" value="' + (it.img_y || 0) + '"></div></div>'
      + '<div class="row"><div class="field"><label>Flecha ancho</label><input type="number" class="f-aw" value="' + (it.arrow_w || 55) + '"></div><div class="field"><label>Flecha X</label><input type="number" class="f-ax" value="' + (it.arrow_x || 0) + '"></div><div class="field"><label>Flecha Y</label><input type="number" class="f-ay" value="' + (it.arrow_y || -250) + '"></div><div class="field"><label>Flecha rot</label><input type="number" class="f-ar" value="' + (it.arrow_r || 0) + '"></div></div></div>';
    if (it.feature_key) $('.f-fk', box).value = it.feature_key;
    $('.collapse-h', box).onclick = () => $('.f-adv', box).classList.toggle('hidden');
    wireUpload($('.f-file', box), $('.f-img', box), $('.f-prev', box), 'featured');
    editor.appendChild(box);
  });

  const save = document.createElement('button');
  save.className = 'btn'; save.textContent = 'Guardar destacados';
  save.onclick = async () => {
    save.disabled = true;
    const rows = $$('.panel[data-pos]', editor).map(box => ({
      campaign_id: c.id, position: parseInt(box.dataset.pos, 10),
      name: $('.f-name', box).value, price: $('.f-price', box).value, color: $('.f-color', box).value,
      feature_key: $('.f-fk', box).value || null, product_image_url: $('.f-img', box).value,
      img_w: $('.f-iw', box).value || '90%', img_x: parseInt($('.f-ix', box).value, 10) || 0, img_y: parseInt($('.f-iy', box).value, 10) || 0,
      arrow_w: parseInt($('.f-aw', box).value, 10) || 55, arrow_x: parseInt($('.f-ax', box).value, 10) || 0, arrow_y: parseInt($('.f-ay', box).value, 10) || -250, arrow_r: parseInt($('.f-ar', box).value, 10) || 0
    }));
    const e1 = (await sb.from('featured_items').upsert(rows, { onConflict: 'campaign_id,position' })).error;
    const e2 = (await sb.from('campaigns').update({ title_image_url: $('.t-url', titleBlock).value || null }).eq('id', c.id)).error;
    save.disabled = false;
    (e1 || e2) ? fail() : ok('Destacados guardados');
  };
  editor.appendChild(save);
}

// ───────────────────────── Catálogo ─────────────────────────
async function renderCatalog() {
  const view = $('#view-catalog');
  view.innerHTML = '<div class="spinner">Cargando…</div>';
  const { data } = await sb.from('catalog_products').select('*').order('sort_order');
  const prods = data || [];

  view.innerHTML = '<div class="head"><p class="eyebrow">Tecnología Fácil</p><h2 class="title">Catálogo</h2></div>';
  const top = document.createElement('div');
  top.className = 'panel';
  top.innerHTML = '<div class="item-title" style="margin-bottom:4px">Nuevo producto</div><p class="mut" style="margin:0">Se agrega al final del catálogo en la web, y arriba acá para que lo edites enseguida.</p>'
    + '<div class="new-form"><div class="field"><label>Nombre</label><input id="np-name" placeholder="Ej: AirPods Pro 2"></div><button class="btn" id="np-btn">Crear producto</button></div>';
  view.appendChild(top);

  const list = document.createElement('div');
  list.id = 'catList';
  view.appendChild(list);
  prods.forEach(p => list.appendChild(productCard(p)));

  $('#np-btn', view).onclick = () => createProduct(prods.length, list, $('#np-name', view));
}

async function createProduct(order, listEl, nameInput) {
  const name = (nameInput.value || '').trim();
  if (!name) { nameInput.focus(); return; }
  const base = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fk = base + '-' + Math.random().toString(36).slice(2, 5);
  const { data, error } = await sb.from('catalog_products').insert({ feature_key: fk, name, price: '$0', raw_price: 0, category: 'accesorios', tag: 'Accesorios', sort_order: order }).select().single();
  if (error) { fail('Error al crear'); return; }
  nameInput.value = '';
  const card = productCard(data);
  listEl.insertBefore(card, listEl.firstChild);   // arriba para editarlo enseguida
  card.classList.add('flash');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  ok('Producto creado');
}

function productCard(p) {
  const box = document.createElement('div');
  box.className = 'card-item';
  box.innerHTML =
    '<div class="item-head"><span class="item-title c-title">' + esc(p.name) + '</span><span class="pill-mut">' + esc(p.feature_key) + '</span></div>'
    + '<div class="field"><label>Nombre</label><input class="c-name" value="' + esc(p.name) + '"></div>'
    + '<div class="row"><div class="field"><label>Precio</label><input class="c-price" value="' + esc(p.price) + '" placeholder="$26.000"></div>'
    + '<div class="field"><label>Categoría</label><select class="c-cat">' + CATS.map(ct => '<option value="' + ct.v + '"' + (ct.v === p.category ? ' selected' : '') + '>' + ct.l + '</option>').join('') + '</select></div></div>'
    + '<div class="field"><label>Descripción</label><textarea class="c-desc" rows="2">' + esc(p.descr || '') + '</textarea></div>'
    + '<div class="field"><label>Imagen principal</label><div class="upload-row"><img class="thumb c-prev" src="' + esc(p.image_url || '') + '"><input type="text" class="c-img" value="' + esc(p.image_url || '') + '" placeholder="URL"><input type="file" accept="image/*" class="c-file" style="max-width:150px"></div></div>'
    + '<div class="row"><div class="field"><label>Escala imagen</label><input type="number" step="0.05" class="c-scale" value="' + (p.img_scale || 0.85) + '"></div>'
    + '<div class="field"><label>Visible en la web</label><select class="c-vis"><option value="true"' + (p.is_visible ? ' selected' : '') + '>Sí</option><option value="false"' + (!p.is_visible ? ' selected' : '') + '>No</option></select></div></div>'
    + '<div class="collapse-h c-more">▸ Características, imágenes y colores</div>'
    + '<div class="c-sub hidden"></div>'
    + '<div class="actions-row"><button class="btn c-save">Guardar producto</button>'
    + '<button class="btn-ghost btn-sm c-undo">Deshacer cambios</button>'
    + (ORIGINALS[p.feature_key] ? '<button class="btn-ghost btn-sm c-orig">Restablecer original</button>' : '')
    + '<button class="btn-danger btn-sm c-del" style="margin-left:auto">Eliminar</button></div>';

  // snapshot de lo último guardado (para "Deshacer cambios")
  let snap = { name: p.name, price: p.price, descr: p.descr || '', image_url: p.image_url || '', img_scale: p.img_scale || 0.85, category: p.category, is_visible: p.is_visible };
  const fill = (v) => {
    if (v.name != null) $('.c-name', box).value = v.name;
    if (v.price != null) $('.c-price', box).value = v.price;
    if (v.descr != null) $('.c-desc', box).value = v.descr;
    if (v.image_url != null) { $('.c-img', box).value = v.image_url; $('.c-prev', box).src = v.image_url; }
    if (v.img_scale != null) $('.c-scale', box).value = v.img_scale;
    if (v.category != null) $('.c-cat', box).value = v.category;
    if (v.is_visible != null) $('.c-vis', box).value = String(v.is_visible);
  };

  wireUpload($('.c-file', box), $('.c-img', box), $('.c-prev', box), 'catalog');
  $('.c-more', box).onclick = () => {
    const sub = $('.c-sub', box);
    if (!sub.classList.contains('hidden')) { sub.classList.add('hidden'); return; }
    sub.classList.remove('hidden');
    if (!sub.dataset.loaded) { loadSubEditors(sub, p.feature_key); sub.dataset.loaded = '1'; }
  };
  $('.c-undo', box).onclick = () => { fill(snap); ok('Cambios deshechos'); };
  const origBtn = $('.c-orig', box);
  if (origBtn) origBtn.onclick = () => { fill(ORIGINALS[p.feature_key]); ok('Valores originales restablecidos'); };

  $('.c-save', box).onclick = async () => {
    const price = $('.c-price', box).value;
    const category = $('.c-cat', box).value;
    const upd = {
      feature_key: p.feature_key, name: $('.c-name', box).value, price, raw_price: priceToNum(price),
      category, tag: TAG_FROM_CAT[category] || '', descr: $('.c-desc', box).value,
      image_url: $('.c-img', box).value, img_scale: parseFloat($('.c-scale', box).value) || 0.85,
      is_visible: $('.c-vis', box).value === 'true'
    };
    const { error } = await sb.from('catalog_products').upsert(upd, { onConflict: 'feature_key' });
    if (error) { fail(); return; }
    snap = { name: upd.name, price: upd.price, descr: upd.descr, image_url: upd.image_url, img_scale: upd.img_scale, category: upd.category, is_visible: upd.is_visible };
    $('.c-title', box).textContent = upd.name;
    ok('Producto guardado');
  };
  $('.c-del', box).onclick = async () => {
    if (!confirm('¿Eliminar "' + p.name + '"?')) return;
    const { error } = await sb.from('catalog_products').delete().eq('feature_key', p.feature_key);
    if (error) { fail('Error al eliminar'); return; }
    box.remove(); ok('Producto eliminado');
  };
  return box;
}

async function loadSubEditors(sub, fk) {
  sub.innerHTML = '<div class="spinner">Cargando…</div>';
  const [feat, imgs, cols] = await Promise.all([
    sb.from('catalog_features').select('*').eq('feature_key', fk).order('sort_order'),
    sb.from('catalog_images').select('*').eq('feature_key', fk).order('sort_order'),
    sb.from('catalog_color_variants').select('*').eq('feature_key', fk).order('sort_order')
  ]);
  // dedupe defensivo (por si quedaron duplicados viejos en la base)
  const featData = uniqueBy(feat.data || [], r => r.text);
  const imgData = uniqueBy(imgs.data || [], r => r.image_url);
  const colData = uniqueBy(cols.data || [], r => r.name);
  sub.innerHTML = '';

  // Características
  const fp = document.createElement('div'); fp.className = 'panel';
  fp.innerHTML = '<label>Características</label><div class="feat-list"></div><button class="btn-ghost btn-sm feat-add">+ Agregar característica</button>';
  const addFeat = (v) => {
    const r = document.createElement('div'); r.className = 'sublist-row';
    r.innerHTML = '<input class="feat-v" value="' + esc(v || '') + '"><button class="btn-danger btn-sm">✕</button>';
    r.querySelector('button').onclick = () => r.remove();
    $('.feat-list', fp).appendChild(r);
  };
  featData.forEach(f => addFeat(f.text));
  $('.feat-add', fp).onclick = () => addFeat('');
  sub.appendChild(fp);

  // Imágenes
  const ip = document.createElement('div'); ip.className = 'panel';
  ip.innerHTML = '<label>Galería de imágenes</label><div class="img-list"></div><div class="upload-row" style="margin-top:8px"><input type="file" accept="image/*" class="img-file" style="max-width:180px"><span class="mut" style="font-size:12px">subir y agregar</span></div>';
  const addImg = (url) => {
    const r = document.createElement('div'); r.className = 'sublist-row';
    r.innerHTML = '<img class="thumb" src="' + esc(url || '') + '"><input class="img-v" value="' + esc(url || '') + '"><button class="btn-danger btn-sm">✕</button>';
    r.querySelector('button').onclick = () => r.remove();
    $('.img-list', ip).appendChild(r);
  };
  imgData.forEach(i => addImg(i.image_url));
  $('.img-file', ip).addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    e.target.disabled = true;
    try { addImg(await uploadImage(f, 'catalog')); ok('Imagen agregada'); } catch (_) { fail('Error'); }
    e.target.disabled = false; e.target.value = '';
  });
  sub.appendChild(ip);

  // Colores
  const cp = document.createElement('div'); cp.className = 'panel';
  cp.innerHTML = '<label>Variantes de color</label><p class="mut" style="margin:-2px 0 10px;font-size:12px">Solo agregalas si este producto tiene colores. Si no, dejalo vacío.</p><div class="col-list"></div><button class="btn-ghost btn-sm col-add">+ Agregar color</button>';
  const addCol = (c) => {
    c = c || {};
    const r = document.createElement('div'); r.className = 'card-item'; r.style.margin = '0 0 12px';
    r.innerHTML = '<div class="row"><div class="field"><label>Nombre</label><input class="col-name" value="' + esc(c.name || '') + '"></div><div class="field"><label>Hex</label><input class="col-hex" value="' + esc(c.hex || '#cccccc') + '"></div></div>'
      + '<div class="field"><label>Imagen producto</label><div class="upload-row"><img class="thumb col-prev" src="' + esc(c.img_url || '') + '"><input class="col-img" value="' + esc(c.img_url || '') + '"><input type="file" accept="image/*" class="col-file" style="max-width:140px"></div></div>'
      + '<div class="row"><div class="field"><label>Swatch (puntito)</label><input class="col-sw" value="' + esc(c.swatch_url || '') + '"></div><div class="field"><label>Thumb</label><input class="col-th" value="' + esc(c.thumb_url || '') + '"></div></div>'
      + '<button class="btn-danger btn-sm" style="margin-top:8px">Quitar color</button>';
    r.querySelector('.btn-danger').onclick = () => r.remove();
    wireUpload($('.col-file', r), $('.col-img', r), $('.col-prev', r), 'catalog');
    $('.col-list', cp).appendChild(r);
  };
  colData.forEach(addCol);
  $('.col-add', cp).onclick = () => addCol({});
  sub.appendChild(cp);

  const save = document.createElement('button');
  save.className = 'btn'; save.textContent = 'Guardar características/imágenes/colores';
  save.onclick = async () => {
    save.disabled = true;
    const featRows = uniqueBy($$('.feat-v', fp).map(i => i.value).filter(v => v.trim()), v => v).map((text, idx) => ({ feature_key: fk, text, sort_order: idx }));
    const imgRows = uniqueBy($$('.img-v', ip).map(i => i.value).filter(v => v.trim()), v => v).map((image_url, idx) => ({ feature_key: fk, image_url, sort_order: idx }));
    const colRowsRaw = $$('.col-list .card-item', cp).map(r => ({ feature_key: fk, name: $('.col-name', r).value, hex: $('.col-hex', r).value, img_url: $('.col-img', r).value, swatch_url: $('.col-sw', r).value, thumb_url: $('.col-th', r).value })).filter(r => r.name.trim());
    const colRows = uniqueBy(colRowsRaw, r => r.name).map((r, idx) => Object.assign(r, { sort_order: idx }));
    await sb.from('catalog_features').delete().eq('feature_key', fk);
    await sb.from('catalog_images').delete().eq('feature_key', fk);
    await sb.from('catalog_color_variants').delete().eq('feature_key', fk);
    const e1 = featRows.length ? (await sb.from('catalog_features').insert(featRows)).error : null;
    const e2 = imgRows.length ? (await sb.from('catalog_images').insert(imgRows)).error : null;
    const e3 = colRows.length ? (await sb.from('catalog_color_variants').insert(colRows)).error : null;
    save.disabled = false;
    (e1 || e2 || e3) ? fail() : ok('Guardado');
  };
  sub.appendChild(save);
}
