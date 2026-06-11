export function initDevControls() {

  var cols = document.querySelectorAll('.cat-ticker-col');
  if (!cols.length) return;

  var groups = [];
  cols.forEach(function (col, i) {
    var n = col.dataset.col || (i + 1);
    var dir = col.querySelector('.cat-ticker-up') ? 'up' : 'down';
    groups.push({
      group: 'Ticker ' + n + ' (' + dir + ')',
      el: col,
      props: [
        { key: 'left',  label: 'X (left)',   unit: '%', min: 0,  max: 100, step: 1, def: 7 + (i * 13) },
        { key: 'top',   label: 'Y (top)',     unit: '%', min: -100, max: 100, step: 1, def: 0 },
        { key: 'opacity', label: 'Opacidad', unit: '',  min: 0,   max: 1,    step: 0.01, def: 0.03 }
      ]
    });
  });

  function getRaw(el, key) {
    return el.style[key] || getComputedStyle(el)[key] || '';
  }

  function buildHTML() {
    var html = '';
    groups.forEach(function (g) {
      html += '<div class="dc-group"><div class="dc-group-title">' + g.group + '</div>';
      g.props.forEach(function (p) {
        var cur = getRaw(g.el, p.key);
        var num = parseFloat(cur) || p.def;
        html += '<div class="dc-row"><label class="dc-label">' + p.label + '</label><input class="dc-range" type="range" data-col="' + g.el.dataset.col + '" data-key="' + p.key + '" min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + num + '"><span class="dc-val">' + num + p.unit + '</span></div>';
      });
      html += '</div>';
    });

    html += '<div class="dc-actions"><button class="dc-btn dc-btn-copy" id="dcCopy">Copiar Valores</button><button class="dc-btn dc-btn-reset" id="dcReset">Reset</button></div>';

    var panel = document.createElement('div');
    panel.id = 'devControlsPanel';
    panel.innerHTML = '<div class="dc-header"><span>Controles Ticker</span><button id="dcToggle" class="dc-collapse">_</button></div><div class="dc-body" id="dcBody">' + html + '</div>';
    document.body.appendChild(panel);
  }

  function bindEvents() {
    document.getElementById('dcBody').addEventListener('input', function (e) {
      if (!e.target.matches('.dc-range')) return;
      var inp = e.target;
      var colNum = inp.dataset.col;
      var key = inp.dataset.key;
      var col = document.querySelector('.cat-ticker-col[data-col="' + colNum + '"]');
      if (!col) return;
      var unit = inp.dataset.key === 'opacity' ? '' : '%';
      var val = inp.value + unit;
      col.style[key] = val;
      inp.nextElementSibling.textContent = val;
    });

    document.getElementById('dcToggle').addEventListener('click', function () {
      var b = document.getElementById('dcBody');
      b.classList.toggle('dc-collapsed');
      this.textContent = b.classList.contains('dc-collapsed') ? '+' : '_';
    });

    document.getElementById('dcCopy').addEventListener('click', function () {
      var out = '';
      groups.forEach(function (g) {
        g.props.forEach(function (p) {
          var val = g.el.style[p.key];
          if (!val) {
            var defStyle = getComputedStyle(g.el)[p.key];
            val = defStyle || (p.key === 'left' ? p.def + '%' : (p.key === 'opacity' ? '0.03' : '0%'));
          }
          out += g.group + '\n' + p.label + '\n\n' + parseFloat(val) + (p.unit || '') + '\n\n';
        });
      });
      navigator.clipboard.writeText(out).then(function () {
        alert('Valores copiados al portapapeles');
      });
    });

    document.getElementById('dcReset').addEventListener('click', function () {
      groups.forEach(function (g) {
        g.props.forEach(function (p) {
          g.el.style[p.key] = p.key === 'left' ? p.def + '%' : (p.key === 'opacity' ? '' : '');
          if (p.key === 'opacity') g.el.style.opacity = '';
        });
      });
      var inputs = document.querySelectorAll('#dcBody .dc-range');
      inputs.forEach(function (inp) {
        var key = inp.dataset.key;
        var colNum = inp.dataset.col;
        var g = groups.find(function (x) { return x.el.dataset.col === colNum; });
        if (!g) return;
        var p = g.props.find(function (x) { return x.key === key; });
        if (!p) return;
        inp.value = p.def;
        inp.nextElementSibling.textContent = p.def + (p.unit || '');
      });
    });
  }

  buildHTML();
  bindEvents();
}
