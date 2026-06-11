/* #t */
export function s3() { s3._init(); }

s3._init = function () {
  var _t = document.querySelector('.sticky-outer');
  var _h = document.querySelector('#heroFrame');
  if (!_t || !_h) return;
  // Solo en movil: "snap" para que al hacer scroll con el dedo se enganche en
  // el hero o en productos destacados, y no se pase de largo de un solo flick.
  var _isMob = window.matchMedia('(max-width: 768px)').matches;
  var _tw = gsap.to(_h, {
    scale: 0.35,
    y: -120,
    scrollTrigger: {
      trigger: _t,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: '.sticky',
      pinSpacing: false,
      anticipatePin: 1,
      snap: _isMob ? { snapTo: [0, 1], duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' } : false,
      onUpdate: function (self) {
        if (self.progress > 0.75) { _h.style.opacity = '0'; }
        else { _h.style.opacity = ''; }
        var _cta = document.getElementById('cta');
        if (_cta) { _cta.style.opacity = self.progress > 0.02 ? '0' : '1'; }
      }
    }
  });
  s3._st = _tw.scrollTrigger;
  s3._tw = _tw;
};
