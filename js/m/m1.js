var _stConfigured = false;

export function makeLenis(opts) {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!_stConfigured && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.config({ ignoreMobileResize: true });
    _stConfigured = true;
  }
  var _l = new Lenis(Object.assign({
    lerp: isMobile ? 0.12 : 0.08,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.075,
    touchInertiaMultiplier: 25,
    touchMultiplier: 1.5,
  }, opts || {}));
  if (typeof ScrollTrigger !== 'undefined') {
    _l.on('scroll', ScrollTrigger.update);
  }
  function _r(t) {
    _l.raf(t);
    requestAnimationFrame(_r);
  }
  requestAnimationFrame(_r);
  return _l;
}

export function s1() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  try {
    s1._l = makeLenis();
  } catch (e) {}
}
