/* Panel de ajuste en vivo. Aparece SOLO si la URL trae ?dev (o #dev),
   asi los visitantes normales nunca lo ven.
   Mueve elementos cambiando sus variables CSS en tiempo real.
   Arrastrable desde la cabecera. Boton "Copiar CSS" para pegar los valores. */
export function initDevControls() {
  // Aparece SIEMPRE en local (localhost / 127.0.0.1 / file:// / red LAN) para
  // desarrollar comodo, y en produccion (Vercel) solo si la URL trae ?dev.
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '' ||
                host.indexOf('192.168.') === 0 || host.indexOf('10.') === 0;
  var q = window.location.search + window.location.hash;
  var hasDev = /(?:[?#&]|^)dev\b/.test(q) || q.indexOf('dev') !== -1;
  if (!isLocal && !hasDev) return;

  var ROOT = document.documentElement;

  var GROUPS = [
    { title: 'Ojos', sel: null, vars: [
      { v: '--ojos-x', label: 'X', unit: 'px', min: -150, max: 150, step: 1 },
      { v: '--ojos-y', label: 'Y', unit: 'px', min: -150, max: 150, step: 1 },
      { v: '--ojos-w', label: 'Ancho', unit: '', min: 1, max: 60, step: 0.5 },
      { v: '--ojos-h', label: 'Alto', unit: '', min: 1, max: 60, step: 0.5 }
    ]},
    { title: 'Nubes', sel: null, vars: [
      { v: '--nubes-y', label: 'Y', unit: 'px', min: -300, max: 600, step: 1 },
      { v: '--nubes-h', label: 'Alto', unit: '%', min: 0, max: 80, step: 0.5 },
      { v: '--nubes-scale', label: 'Escala', unit: '', min: 0.2, max: 5, step: 0.05 }
    ]},
    { title: 'Rueda Izq', sel: null, vars: [
      { v: '--ri-x', label: 'X', unit: 'px', min: -150, max: 250, step: 0.5 },
      { v: '--ri-y', label: 'Y', unit: '%', min: -60, max: 60, step: 0.5 },
      { v: '--ri-s', label: 'Tamano', unit: 'px', min: 2, max: 140, step: 1 }
    ]},
    { title: 'Rueda Der', sel: null, vars: [
      { v: '--rd-x', label: 'X', unit: 'px', min: -150, max: 250, step: 0.5 },
      { v: '--rd-y', label: 'Y', unit: 'px', min: -150, max: 150, step: 0.5 },
      { v: '--rd-s', label: 'Tamano', unit: 'px', min: 2, max: 140, step: 1 }
    ]},
    { title: 'Carro', sel: null, vars: [
      { v: '--carro-y', label: 'Y', unit: 'px', min: -150, max: 500, step: 1 },
      { v: '--carro-scale', label: 'Escala', unit: '', min: 0.5, max: 8, step: 0.05 }
    ]},
    { title: 'Texto: Envios', sel: '.envio-item-logo', vars: [
      { v: '--logo-w', label: 'Ancho', unit: 'px', min: 50, max: 1400, step: 5 },
      { v: '--logo-x', label: 'X', unit: 'px', min: -800, max: 800, step: 2 },
      { v: '--logo-y', label: 'Y', unit: 'px', min: -800, max: 800, step: 2 }
    ]},
    { title: 'Texto: Calidad', sel: '.envio-item-img', vars: [
      { v: '--img2-w', label: 'Ancho', unit: 'px', min: 50, max: 1400, step: 5 },
      { v: '--img2-x', label: 'X', unit: 'px', min: -800, max: 800, step: 2 },
      { v: '--img2-y', label: 'Y', unit: 'px', min: -800, max: 800, step: 2 }
    ]},
    { title: 'Texto: Catalogo', sel: '.envio-item-catalogo', vars: [
      { v: '--cat-w', label: 'Ancho', unit: 'px', min: 50, max: 1500, step: 5 },
      { v: '--cat-x', label: 'X', unit: 'px', min: -800, max: 800, step: 2 },
      { v: '--cat-y', label: 'Y', unit: 'px', min: -800, max: 800, step: 2 }
    ]},
    { title: 'Boton VER', sel: '.envio-item-catalogo', vars: [
      { v: '--btn-x', label: 'X', unit: 'px', min: -400, max: 400, step: 2 },
      { v: '--btn-y', label: 'Y', unit: 'px', min: -400, max: 400, step: 2 },
      { v: '--btn-scale', label: 'Escala', unit: '', min: 0.4, max: 3, step: 0.05 },
      { v: '--btn-w', label: 'Ancho', unit: 'px', min: 60, max: 400, step: 5 }
    ]}
  ];

  function targetEl(g) { return g.sel ? document.querySelector(g.sel) : ROOT; }
  function readVal(g, vr) {
    var el = targetEl(g) || ROOT;
    var n = parseFloat(getComputedStyle(el).getPropertyValue(vr.v));
    return isNaN(n) ? vr.min : n;
  }
  function setVal(g, vr, n) {
    var el = targetEl(g) || ROOT;
    if (el) el.style.setProperty(vr.v, n + vr.unit);
  }

  var css =
    '#devPanel{position:fixed;top:80px;left:50%;transform:translateX(-50%);width:262px;max-height:78vh;'
    + 'background:rgba(20,20,24,.94);color:#fff;font-family:system-ui,sans-serif;border:1px solid rgba(255,255,255,.15);'
    + 'border-radius:14px;z-index:999999;box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(8px);'
    + 'display:flex;flex-direction:column;overflow:hidden;font-size:12px}'
    + '#devPanel .dvp-head{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;'
    + 'background:rgba(255,255,255,.07);cursor:grab;touch-action:none;font-weight:700;font-size:12.5px;user-select:none}'
    + '#devPanel .dvp-head:active{cursor:grabbing}'
    + '#devPanel .dvp-head button{width:24px;height:24px;border:none;border-radius:6px;background:rgba(255,255,255,.12);'
    + 'color:#fff;font-size:14px;cursor:pointer;margin-left:5px;line-height:1}'
    + '#devPanel .dvp-body{overflow-y:auto;padding:8px 10px 4px;-webkit-overflow-scrolling:touch}'
    + '#devPanel .dvp-body.hide{display:none}'
    + '#devPanel .dvp-group{margin-bottom:9px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:7px}'
    + '#devPanel .dvp-gtitle{font-weight:700;color:#7dd3fc;margin-bottom:5px;font-size:11.5px;letter-spacing:.02em}'
    + '#devPanel .dvp-row{display:flex;align-items:center;gap:6px;margin-bottom:5px}'
    + '#devPanel .dvp-lbl{width:42px;flex:none;color:#cbd5e1}'
    + '#devPanel .dvp-range{flex:1;min-width:0;accent-color:#38bdf8;height:18px}'
    + '#devPanel .dvp-num{width:52px;flex:none;background:#000;color:#fff;border:1px solid rgba(255,255,255,.2);'
    + 'border-radius:5px;padding:3px 4px;font-size:11px;text-align:right}'
    + '#devPanel .dvp-unit{width:18px;flex:none;color:#64748b;font-size:10px}'
    + '#devPanel .dvp-scroll{padding:8px 12px;background:#0ea5e9;color:#04222e;font-family:monospace;font-weight:700;font-size:14px;text-align:center;letter-spacing:.03em}'
    + '#devPanel .dvp-foot{padding:8px 10px;border-top:1px solid rgba(255,255,255,.12)}'
    + '#devPanel .dvp-copy{width:100%;padding:9px;border:none;border-radius:8px;background:#38bdf8;color:#04222e;'
    + 'font-weight:700;font-size:12.5px;cursor:pointer}'
    + '#devPanel .dvp-copy:active{background:#0ea5e9}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var panel = document.createElement('div');
  panel.id = 'devPanel';
  panel.setAttribute('data-lenis-prevent', '');
  var html = '<div class="dvp-head" id="dvpHead"><span>Controles (arrastrame)</span>'
    + '<span><button id="dvpMin" title="Minimizar">_</button><button id="dvpClose" title="Cerrar">x</button></span></div>'
    + '<div class="dvp-scroll" id="dvpScroll">scrollY: 0</div>'
    + '<div class="dvp-body" id="dvpBody">';
  GROUPS.forEach(function (g, gi) {
    html += '<div class="dvp-group"><div class="dvp-gtitle">' + g.title + '</div>';
    g.vars.forEach(function (vr, vi) {
      var cur = readVal(g, vr);
      html += '<div class="dvp-row"><span class="dvp-lbl">' + vr.label + '</span>'
        + '<input class="dvp-range" type="range" data-g="' + gi + '" data-v="' + vi + '" min="' + vr.min + '" max="' + vr.max + '" step="' + vr.step + '" value="' + cur + '">'
        + '<input class="dvp-num" type="number" data-g="' + gi + '" data-v="' + vi + '" step="' + vr.step + '" value="' + cur + '">'
        + '<span class="dvp-unit">' + (vr.unit || '-') + '</span></div>';
    });
    html += '</div>';
  });
  html += '</div><div class="dvp-foot"><button class="dvp-copy" id="dvpCopy">Copiar CSS</button></div>';
  panel.innerHTML = html;
  document.body.appendChild(panel);

  // Lector de scroll en vivo (para coordinar las anclas del snap). Muestra el
  // scrollY arriba del panel y lo loguea en consola cuando el scroll se detiene.
  (function () {
    var el = document.getElementById('dvpScroll');
    var last = -1, logT = null;
    (function tick() {
      var y = Math.round(window.scrollY || window.pageYOffset || 0);
      if (y !== last) {
        last = y;
        el.textContent = 'scrollY: ' + y + '   (vh ' + window.innerHeight + ')';
        if (logT) clearTimeout(logT);
        logT = setTimeout(function () {
          console.log('%c[POS] scrollY=' + y + '  vh=' + window.innerHeight, 'color:#0ea5e9;font-weight:bold;font-size:13px');
        }, 220);
      }
      requestAnimationFrame(tick);
    })();
  })();

  function onInput(e) {
    var inp = e.target;
    if (!inp.classList.contains('dvp-range') && !inp.classList.contains('dvp-num')) return;
    var gi = +inp.dataset.g, vi = +inp.dataset.v, val = inp.value;
    setVal(GROUPS[gi], GROUPS[gi].vars[vi], val);
    // sincronizar el slider con el numero y viceversa
    panel.querySelectorAll('[data-g="' + gi + '"][data-v="' + vi + '"]').forEach(function (o) {
      if (o !== inp) o.value = val;
    });
  }
  panel.addEventListener('input', onInput);

  document.getElementById('dvpMin').addEventListener('click', function () {
    document.getElementById('dvpBody').classList.toggle('hide');
  });
  document.getElementById('dvpClose').addEventListener('click', function () { panel.remove(); });

  document.getElementById('dvpCopy').addEventListener('click', function () {
    var out = '';
    GROUPS.forEach(function (g) {
      out += '/* ' + g.title + ' -> ' + (g.sel || ':root movil') + ' */\n';
      g.vars.forEach(function (vr) {
        var el = targetEl(g) || ROOT;
        var val = (el.style.getPropertyValue(vr.v) || getComputedStyle(el).getPropertyValue(vr.v)).trim();
        out += vr.v + ': ' + val + ';\n';
      });
      out += '\n';
    });
    var btn = this;
    function done() { btn.textContent = 'Copiado!'; setTimeout(function () { btn.textContent = 'Copiar CSS'; }, 1200); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out).then(done, function () { window.prompt('Copia manual:', out); });
    } else { window.prompt('Copia manual:', out); }
  });

  // arrastrar desde la cabecera
  var head = document.getElementById('dvpHead');
  var drag = false, sx = 0, sy = 0, px = 0, py = 0;
  head.addEventListener('pointerdown', function (e) {
    if (e.target.tagName === 'BUTTON') return;
    drag = true; sx = e.clientX; sy = e.clientY;
    var r = panel.getBoundingClientRect();
    px = r.left; py = r.top;
    panel.style.transform = 'none'; panel.style.left = px + 'px'; panel.style.top = py + 'px';
    try { head.setPointerCapture(e.pointerId); } catch (err) {}
  });
  head.addEventListener('pointermove', function (e) {
    if (!drag) return;
    panel.style.left = (px + e.clientX - sx) + 'px';
    panel.style.top = (py + e.clientY - sy) + 'px';
  });
  head.addEventListener('pointerup', function () { drag = false; });
}
