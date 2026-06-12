export function s2() {
  'use strict';
  var _s = document.getElementById('cardStage');
  var _d = Array.from(_s.querySelectorAll('.prod-card'));
  var _b = Array.from(document.querySelectorAll('.prod-bg'));
  function _v(name) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0; }
  function _vs(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function _p(slot) {
    var S = {
      center: { w: _v('--center-w'), x: _v('--center-x'), y: _v('--center-y'), r: _v('--center-r'), op: _v('--center-op'), z: 10 },
      left: { w: _v('--left-w'), x: _v('--left-x'), y: _v('--left-y'), r: _v('--left-r'), op: _v('--left-op'), z: 5 },
      right: { w: _v('--right-w'), x: _v('--right-x'), y: _v('--right-y'), r: _v('--right-r'), op: _v('--right-op'), z: 5 },
      'hidden-l': { w: _v('--left-w'), x: _v('--left-x') - 250, y: _v('--left-y'), r: _v('--left-r'), op: 0, z: 1 },
      'hidden-r': { w: _v('--right-w'), x: _v('--right-x') + 250, y: _v('--right-y'), r: _v('--right-r'), op: 0, z: 1 }
    };
    return S[slot] || S['hidden-l'];
  }
  function _a(card, slot, animate) {
    var p = _p(slot); var _c = slot === 'center'; var h = p.w / 2; var D = 0.55;
    card.classList.toggle('is-center', _c);
    var props = { width: p.w + 'px', x: p.x - h, y: -(p.w * 0.65) + p.y, rotation: p.r, opacity: p.op, zIndex: p.z };
    if (animate) gsap.to(card, Object.assign({}, props, { duration: D, ease: 'power2.inOut' })); else gsap.set(card, props);
    var ci = card.querySelector('.card-color');
    if (ci) gsap.to(ci, { opacity: _c ? 1 : 0, duration: animate ? 0.4 : 0 });
    var pi = card.querySelector('.card-prod');
    if (pi) {
      var pW = _vs(card.dataset.pw) || '80%';
      var pX = _v(card.dataset.px); var pY = _v(card.dataset.py);
      pi.style.width = pW;
      pi.style.left = 'calc(50% - ' + pW + ' / 2 + ' + pX + 'px)';
      pi.style.top = 'calc(10% + ' + pY + 'px)';
      pi.style.height = '70%'; pi.style.opacity = '1';
    }
    var ae = card.querySelector('.card-arrow');
    if (ae) {
      var aW = _v(card.dataset.aw); var aX = _v(card.dataset.ax);
      var aY = _v(card.dataset.ay); var aR = _v(card.dataset.ar);
      var ap = { opacity: _c ? 1 : 0, width: (aW || 55) + 'px', x: -(aW || 55) / 2 + aX, y: p.w * 1.35 * 0.65 + aY, rotation: aR, zIndex: 20 };
      if (animate) gsap.to(ae, Object.assign({}, ap, { duration: D, ease: 'power2.inOut' })); else gsap.set(ae, ap);
    }
  }
  function _bg() { var color = _d[_o[0]].dataset.color; _b.forEach(function (bg) { bg.classList.toggle('active', bg.dataset.bg === color); }); }
  var _o = [0, 1, 2, 3, 4]; var _an = false;
  var _sn = ['center','right','hidden-r','hidden-l','left'];
  function _i() { _o.forEach(function (ci, pos) { _a(_d[ci], _sn[pos], false); }); _bg(); }
  function _aa() { _o.forEach(function (ci, pos) { _a(_d[ci], _sn[pos], true); }); _bg(); }
  function _sw(dir) {
    if (_an) return; _an = true;
    if (dir === 'left') _o.push(_o.shift()); else _o.unshift(_o.pop());
    _aa(); setTimeout(function () { _an = false; }, 580);
  }
  _d.forEach(function (card) {
    card.addEventListener('click', function () {
      if (_dr) return;
      var pos = _o.indexOf(parseInt(card.dataset.idx));
      console.log('CLICK CARRUSEL', { pos: pos, idx: card.dataset.idx, _o: _o, hasPM: !!window.ProductModal });
      if (pos === 0 && window.ProductModal) {
        window.ProductModal.openFromCarousel(card);
        return;
      }
      if (pos === 1) _sw('left');
      if (pos === 4) _sw('right');
    });
  });
  var _sx = 0, _lx = 0, _dr = false; var _st = Math.min(60, window.innerWidth * 0.12);
  function _sd(e, x) { if (_an) return; _sx = x; _lx = x; _dr = true; _s.classList.add('dragging'); document.body.style.userSelect = 'none'; document.body.style.webkitUserSelect = 'none'; }
  function _md(e, x) { if (!_dr) return; var d = x - _lx; if (d < -_st) { _sw('left'); _lx = x; } else if (d > _st) { _sw('right'); _lx = x; } }
  function _ed() { if (!_dr) return; _dr = false; _s.classList.remove('dragging'); document.body.style.userSelect = ''; document.body.style.webkitUserSelect = ''; }
  _s.addEventListener('mousedown', function (e) { e.preventDefault(); _sd(e, e.clientX); });
  _s.addEventListener('touchstart', function (e) { _sd(e, e.touches[0].clientX); }, { passive: false });
  window.addEventListener('mousemove', function (e) { _md(e, e.clientX); });
  _s.addEventListener('touchmove', function (e) { _md(e, e.touches[0].clientX); }, { passive: false });
  window.addEventListener('mouseup', _ed);
  _s.addEventListener('touchend', _ed);
  _s.addEventListener('dragstart', function (e) { e.preventDefault(); });

  _i();
}
