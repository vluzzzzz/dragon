import { s1, makeLenis } from './m/m1.js';
import { s2 } from './m/m2.js';
import { s3 } from './m/m3.js';
import { s4 } from './m/m4.js';
import { initCart } from './m/cart.js';
import { initCheckout } from './m/checkout.js';
import { initLogo3D } from './m/logo3d.js';
import { initDevControls } from './m/dev-controls.js';
s1(); s2(); s3(); s4();
var Cart = initCart();
Cart.init();
window.Cart = Cart;
var Checkout = initCheckout();
Checkout.init();
window.Checkout = Checkout;

var _catOpen = false;
var _ventajasOpen = false;

window.scrollTo(0, 0);

if (s3._st) s3._st.disable();
if (s1._l) s1._l.stop();
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

var _loaderSafety = setTimeout(function () {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  var _ld2 = document.getElementById('loader');
  if (_ld2) _ld2.style.display = 'none';
  if (s1._l) s1._l.start();
  if (s3._st) { s3._st.enable(); s3._st.refresh(); }
}, 10000);

(function () {
  var _ld = document.getElementById('loader');
  var _pct = document.getElementById('loaderPct');
  var _bar = document.getElementById('loaderBar');
  var _tip = document.getElementById('loaderTip');
  var _hc = document.getElementById('heroContent');
  var _st = document.querySelector('.sticky');
  var _nv = document.getElementById('mainNav');
  if (!_ld || !_pct || !_bar) return;
  if (_hc) { gsap.set(_hc, { y: '-110%' }); }

  var _obj = { v: 0 };
  var _ldr = gsap.timeline({
    onUpdate: function () {
      _pct.textContent = Math.round(_obj.v) + '%';
      _bar.style.width = _obj.v + '%';
      if (_tip) { _tip.style.left = _obj.v + '%'; }
    },
    onComplete: function () {
      clearTimeout(_loaderSafety);
      setTimeout(function () {
        var _np = _nv?.parentNode;
        if (_nv && _hc) { _hc.appendChild(_nv); _nv.style.position = 'absolute'; _nv.style.zIndex = '100'; _nv.classList.add('no-glass'); }
        if (_st) { _st.style.zIndex = '10000'; _st.style.overflow = 'visible'; }
        var _tl = gsap.timeline({
          onComplete: function () {
            _ld.style.display = 'none';
            gsap.set(_hc, { y: 0, clearProps: 'transform' });
            if (_st) { _st.style.zIndex = ''; _st.style.overflow = ''; }
            if (_nv && _np) { _np.appendChild(_nv); _nv.style.position = ''; _nv.style.zIndex = ''; _nv.classList.remove('no-glass'); }
            if (s3._st) s3._st.kill();
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                s3._init();
              });
            });
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
window.scrollTo(0, 0);

(function _setVH() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
  document.documentElement.style.setProperty('--svh', vh + 'px');
  window.addEventListener('resize', function () {
    var vh2 = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh2 + 'px');
    document.documentElement.style.setProperty('--svh', vh2 + 'px');
  });
})();
            if (s1._l) { s1._l.start(); s1._l.scrollTo(0, { immediate: true }); }
            var _env2 = document.querySelector('.envio-section');
            var _eh = document.querySelector('.envio-horiz');
            // En movil alargamos MUCHO el recorrido del envio para que el scroll
            // horizontal dure varios flicks. Se chequea el ancho en cada refresh
            // (robusto si cambias a modo movil despues de cargar). PC sin cambios.
            // >>> PERILLA: subi/baja este 6 para mas/menos largo <<<
            var _envEnd = function () { return window.innerWidth <= 768 ? '+=' + Math.round(window.innerHeight * 6) : 'bottom top'; };
            if (_env2) {
              gsap.set('#productos', { y: 0 });
              gsap.to('#productos', {
                y: function () { return window.innerHeight * -0.8; },
                scrollTrigger: {
                  trigger: _env2,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              });
            }
            if (_eh) {
              // Distancia horizontal real del track. Como funcion para que
              // invalidateOnRefresh la recalcule (clave en movil: la medida
              // inicial dentro del loader puede estar mal).
              var _getDx = function () { return Math.max(0, _eh.offsetWidth - window.innerWidth); };
              gsap.to(_eh, {
                x: function () { return -_getDx(); },
                ease: 'none',
                scrollTrigger: {
                  trigger: '.envio-section',
                  start: 'top top',
                  end: _envEnd,
                  pin: '.envio-section',
                  pinSpacing: true,
                  anticipatePin: 1,
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              });
              var _df = document.querySelector('.envio-fondo');
              if (_df) {
                gsap.set(_df, { x: 0 });
                gsap.to(_df, {
                  x: function () { return -_getDx() * 0.3; },
                  ease: 'none',
                  scrollTrigger: {
                    trigger: '.envio-section',
                    start: 'top top',
                    end: _envEnd,
                    scrub: 1,
                    invalidateOnRefresh: true
                  }
                });
              }
            }
            var _ec = document.getElementById('envioCarroWrap');
            if (_ec) {
              gsap.set(_ec, { left: '20vw' });
              gsap.to(_ec, {
                left: '80vw',
                scrollTrigger: {
                  trigger: '.envio-section',
                  start: 'top top',
                  end: _envEnd,
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              });
            }
            var _rw = document.querySelectorAll('.rueda');
            if (_rw.length) {
              gsap.set(_rw, { rotation: 0 });
              gsap.to(_rw, {
                rotation: 1080,
                scrollTrigger: {
                  trigger: '.envio-section',
                  start: 'top top',
                  end: _envEnd,
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              });
            }

            ScrollTrigger.refresh();
            setTimeout(function () { ScrollTrigger.refresh(true); }, 400);
          }
        });
        _tl.to([_ld, _hc], { y: '+=26%', duration: 0.35, ease: 'power2.in' }, 0)
           .to([_ld, _hc], { y: '-=5%', duration: 0.20, ease: 'power3.out' })
           .to([_ld, _hc], { y: '+=28%', duration: 0.35, ease: 'power2.in' })
           .to([_ld, _hc], { y: '-=5%', duration: 0.22, ease: 'power3.out' })
           .to([_ld, _hc], { y: '+=66%', duration: 0.40, ease: 'power3.in' });
      }, 300);
    }
  });
  _ldr.to(_obj, { v: 50, duration: 0.7, ease: 'none' })
      .to(_obj, { v: 85, duration: 1.0, ease: 'power1.in' })
      .to(_obj, { v: 100, duration: 1.2, ease: 'power2.in' });
})();


(function _navWatch() {
  var _nav = document.getElementById('mainNav');
  if (_nav) {
    // Nav blanco SOLO mientras la barra superior esta sobre la seccion de
    // envio (fondo oscuro). Atado a la posicion real de la seccion para que
    // calce igual en PC y movil (no a un % aproximado). Negro el resto.
    var _white = false;
    if (!_catOpen && !_ventajasOpen) {
      var _env = document.querySelector('.envio-section');
      if (_env) {
        var _nr = _nav.getBoundingClientRect();
        var _navMid = _nr.top + _nr.height / 2;
        var _er = _env.getBoundingClientRect();
        _white = _er.top <= _navMid && _er.bottom > _navMid;
      }
    }
    _nav.querySelectorAll('.nav-links a').forEach(function (a) { a.style.color = _white ? '#fff' : ''; });
    var _cartSvg = _nav.querySelector('.nav-cart-btn svg');
    if (_cartSvg) _cartSvg.style.color = _white ? '#fff' : '';
  }
  requestAnimationFrame(_navWatch);
})();

document.getElementById('catalogoBtn').addEventListener('click', function () {
  _catOpen = true;
  if (s3._st) s3._st.disable();
  if (s1._l) { s1._l.destroy(); s1._l = null; }
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  ScrollTrigger.refresh();
  gsap.set('#catalogoReveal', { display: '', y: '100%' });
  document.getElementById('catalogoReveal').scrollTop = 0;
  gsap.to('#catalogoReveal', { y: 0, duration: 0.7, ease: 'power3.inOut', onComplete: function () {
    _resizeTicker();
  } });
});

function _resizeTicker() {
  var _tb = document.querySelector('.cat-ticker-bg');
  if (!_tb) return;
  _tb.style.height = 'auto';
  var _h = 0;
  var _hd = document.querySelector('.productos-header');
  if (_hd) _h += _hd.offsetHeight;
  var _fl = document.getElementById('productosFiltros');
  if (_fl) _h += _fl.offsetHeight;
  var _grid = document.getElementById('productosGrid');
  if (_grid) _h += _grid.offsetHeight;
  var _cta = document.querySelector('.catalogo-cta-wrap');
  if (_cta) _h += _cta.offsetHeight;
  _h = Math.max(_h, window.innerHeight);
  _tb.style.height = _h + 'px';
  _tb.querySelectorAll('.cat-ticker-col').forEach(function (col) {
    col.style.height = _h + 'px';
  });
}

function _closeCatalogo(what, onDone) {
  ProductModal.close();
  _catOpen = false;
  window.scrollTo(0, 0);

  if (!s1._l) {
    s1._l = makeLenis();
    s1._l.stop();
  }

  var _sticky = document.querySelector('.sticky');
  var _envio = document.querySelector('.envio-section');
  var _productos = document.querySelector('.productos-section');
  if (_sticky) { _sticky.style.zIndex = '300'; _sticky.style.overflow = 'visible'; _sticky.style.background = '#fff'; }
  if (_envio) _envio.style.overflow = 'visible';
  if (_productos) _productos.style.visibility = 'hidden';
  if (_envio) _envio.style.visibility = 'hidden';

  gsap.to('#catalogoReveal', { y: '100%', duration: 0.6, ease: 'power3.in' });
  gsap.set(what, { y: '-100vh', scale: 1, opacity: '' });
  var _nav = document.getElementById('mainNav');
  var _navParent = _nav ? _nav.parentElement : null;
  if (_nav) {
    document.querySelector('.sticky').appendChild(_nav);
    _nav.style.position = 'absolute';
    _nav.style.top = '12px';
    _nav.style.left = '20px';
    _nav.style.width = 'calc(100% - 40px)';
    _nav.style.zIndex = '100';
    _nav.querySelectorAll('.nav-links a').forEach(function (a) { a.style.color = '#444'; });
    var _csv = _nav.querySelector('.nav-cart-btn svg');
    if (_csv) _csv.style.color = '#444';
  }
  gsap.to(what, { y: 0, duration: 0.8, ease: 'power4.out' });

  var _clean = gsap.timeline({ delay: 0.85 });
  _clean.call(function () {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    gsap.set(what, { clearProps: 'y,scale,opacity' });
    if (s1._l) s1._l.start();
    if (_nav && _navParent) {
      _navParent.appendChild(_nav);
      _nav.style.position = '';
      _nav.style.top = '';
      _nav.style.left = '';
      _nav.style.width = '';
      _nav.style.zIndex = '';
      _nav.querySelectorAll('.nav-links a').forEach(function (a) { a.style.color = ''; });
      var _csv2 = _nav.querySelector('.nav-cart-btn svg');
      if (_csv2) _csv2.style.color = '';
    }
    gsap.set('#catalogoReveal', { y: '100%', display: 'none' });
    if (_sticky) { _sticky.style.zIndex = ''; _sticky.style.overflow = ''; _sticky.style.background = ''; }
    if (_envio) { _envio.style.overflow = ''; _envio.style.visibility = ''; }
    if (_productos) _productos.style.visibility = '';
    requestAnimationFrame(function () {
      if (s3._st) { s3._st.enable(); s3._st.refresh(); }
      if (s1._l) { s1._l.start(); }
      if (onDone) { requestAnimationFrame(function () { onDone(); }); }
    });
  });
}

function _closeVentajas(onDone) {
  if (!_ventajasOpen) { if (onDone) onDone(); return; }
  _ventajasOpen = false;
  ProductModal.close();
  gsap.to('#belowFold', { y: '100%', duration: 0.5, ease: 'power3.in', onComplete: function () {
    gsap.set('#belowFold', { y: '100%' });
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (!s1._l) {
      s1._l = makeLenis();
    }
    if (s3._st) { s3._st.enable(); s3._st.refresh(); }
    if (s1._l) s1._l.start();
    if (onDone) onDone();
  }});
}

function _openVentajas(scrollTo) {
  if (_ventajasOpen) {
    if (scrollTo) document.querySelector(scrollTo).scrollIntoView({ behavior: 'smooth' });
    return;
  }
  ProductModal.close();
  _ventajasOpen = true;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  if (s3._st) s3._st.disable();
  if (s1._l) { s1._l.destroy(); s1._l = null; }
  ScrollTrigger.refresh();
  gsap.set('#belowFold', { y: '100%' });
  gsap.to('#belowFold', { y: 0, duration: 0.6, ease: 'power3.inOut', onComplete: function () {
    if (_catOpen) {
      _catOpen = false;
      gsap.set('#catalogoReveal', { y: '100%', display: 'none' });
    }
    if (scrollTo) {
      setTimeout(function () {
        document.querySelector(scrollTo).scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }});
}

document.getElementById('inicioBtn').addEventListener('click', function (e) {
  e.preventDefault();
  if (_catOpen) {
    _closeCatalogo('#heroFrame', function () {
      if (s1._l) s1._l.scrollTo(0, { duration: 0.6 });
    });
    return;
  }
  if (_ventajasOpen) {
    _closeVentajas(function () {
      if (s1._l) s1._l.scrollTo(0, { duration: 0.6 });
    });
    return;
  }
  if (s1._l) s1._l.scrollTo(0, { duration: 0.8 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('catalogoNavBtn').addEventListener('click', function (e) {
  e.preventDefault();
  if (_catOpen) {
    gsap.to('#catalogoReveal', {
      y: '100%',
      duration: 0.8,
      ease: 'power4.in',
      onComplete: function () {
        _catOpen = false;
        gsap.set('#catalogoReveal', { y: '100%', display: 'none' });
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        requestAnimationFrame(function () {
          if (s3._st) { s3._st.enable(); }
          if (!s1._l) {
            s1._l = makeLenis();
          }
          var _nav2 = document.getElementById('mainNav');
          if (_nav2) {
            _nav2.querySelectorAll('.nav-links a').forEach(function (a) { a.style.color = '#fff'; });
            var _cs2 = _nav2.querySelector('.nav-cart-btn svg');
            if (_cs2) _cs2.style.color = '#fff';
          }
        });
      }
    });
    return;
  }
  if (_ventajasOpen) {
    _closeVentajas(function () {
      if (s1._l) s1._l.scrollTo('.envio-section', { offset: window.innerHeight * 1.5, duration: 1.5 });
    });
    return;
  }
  if (s1._l) s1._l.scrollTo('.envio-section', { offset: window.innerHeight * 1.5, duration: 1.5 });
});

var _catProducts = [
  { tag:'Audio', name:'AirPods Pro 2', price:'$26.000', rawPrice:26000, desc:'Sonido profesional en un formato compacto. Pensados para quienes buscan una experiencia de audio superior y comodidad durante todo el día.', image:'./images/airpods-pro-2.webp', featureKey:'airpods-pro-2', imgScale:0.85, category:'audio' },
  { tag:'Audio', name:'AirPods 4', price:'$30.000', rawPrice:30000, desc:'Sonido espléndido en formato compacto. Modelo "Improved Fit" — si tus airpods lisos se resbalaban, estos vinieron a cambiarlo todo.', image:'./images/airpods-4gen.webp', featureKey:'airpods-4gen', imgScale:0.85, category:'audio' },
  { tag:'Audio · Nuevo', name:'AirPods Pro 3 · ANC', price:'$37.990', rawPrice:37990, desc:'Los audífonos pequeños con el sonido más espectacular. Acústica renovada, mejor ajuste y traductor en vivo.', image:'./images/airpods-3gen.webp', featureKey:'airpods-pro-3', imgScale:0.85, category:'audio' },
  { tag:'Audio', name:'AirPods Max Básico', price:'$47.000', rawPrice:47000, desc:'Eleva tu forma de escuchar música. Diseñados para quienes buscan una experiencia de sonido inmersiva y comodidad superior.', image:'./images/max-magneticos.webp', featureKey:'max-basico', imgScale:0.85, category:'audio' },
  { tag:'Audio · Premium', name:'AirPods Max 1:1', price:'$195.000', rawPrice:195000, desc:'Disponible en 5 colores. Este modelo es realmente idéntico. Modo reposo en estuche, sensores dinámicos, acabados de lujo.', image:'./images/max-magneticos.webp', featureKey:'max-1-1', imgScale:0.85, category:'audio' },
  { tag:'Watch · Nuevo', name:'Apple Watch Ultra 3', price:'$54.990', rawPrice:54990, desc:'Potencia, estilo y control desde tu muñeca. Combina un diseño imponente con funciones inteligentes.', image:'./images/apple-watch-ultra-3.webp', featureKey:'apple-watch-ultra-3', imgScale:0.75, category:'watch' },
  { tag:'Watch · Nuevo', name:'Apple Watch Serie 11', price:'$54.990', rawPrice:54990, desc:'Elegancia, estilo y control desde tu muñeca. Combina un diseño sutil con funciones inteligentes.', image:'./images/serie-10.webp', featureKey:'apple-watch-serie-11', imgScale:0.75, category:'watch' },
  { tag:'Accesorios · Nuevo', name:'Apple Pencil 1° Gen', price:'$29.990', rawPrice:29990, desc:'Precisión profesional en cada trazo. Diseñado para escribir, dibujar y crear con máxima fluidez.', image:'./images/pencil.webp', featureKey:'apple-pencil', imgScale:0.75, category:'accesorios' },
  { tag:'Accesorios · Nuevo', name:'Cargador 35W USB-C', price:'$16.000', rawPrice:16000, desc:'Carga al instante con este cargador rápido compatible con iPhone y cualquier dispositivo USB-C. 35W, 1mt de longitud.', image:'./images/cargador-tipo-c.webp', featureKey:'cargador-35w', imgScale:0.75, category:'accesorios' },
  { tag:'Accesorios', name:'Batería MagSafe', price:'$22.000', rawPrice:22000, desc:'Olvídate de quedarte sin batería. La batería MagSafe inalámbrica es tu aliada perfecta para viajar o salir sin preocuparte.', image:'./images/bateria-magsafe.webp', featureKey:'bateria-magsafe', imgScale:0.75, category:'accesorios' },
  { tag:'Watch · Nuevo', name:'Correa Milanese', price:'$13.000', rawPrice:13000, desc:'La pulsera Milanese Loop de malla de acero inoxidable confeccionada con máquinas italianas. Se adapta como un guante a tu muñeca y su cierre magnético se ajusta perfectamente a cualquier talla.', image:'./images/milaneseplata.webp', featureKey:'correa-milanese', imgScale:0.85, category:'watch' },
  { tag:'Watch · Nuevo', name:'Correa Sport', price:'$10.000', rawPrice:10000, desc:'Hecha de fluoroelastómero de alto rendimiento. Duradera, resistente y muy suave. Su material compacto y liso envuelve con elegancia tu muñeca.', image:'./images/cosportstarlight.webp', featureKey:'correa-sport', imgScale:0.85, category:'watch' },
  { tag:'Watch · Nuevo', name:'Correa Trail', price:'$10.000', rawPrice:10000, desc:'Ultra delgada y liviana con tejido de nylon flexible de alta elasticidad. Incluye tira para ajuste rápido e hilos reflectantes en los bordes.', image:'./images/coblack.webp', featureKey:'correa-trail', imgScale:0.85, category:'watch' },
  { tag:'Watch · Nuevo', name:'Correa Sport 2', price:'$10.000', rawPrice:10000, desc:'Liviana y elástica con fragmentos de colores combinados de forma aleatoria que le dan un toque único. Ideal para pista, montaña o gimnasio.', image:'./images/cosport2blanca.webp', featureKey:'correa-sport-2', imgScale:0.85, category:'watch' }
];

var _FEATURES = {
  'airpods-pro-2': ['Incluye cable tipo C','Reconocimiento inmediato','Duración batería 6-8 horas','Control táctil','Compatibles iOS & Android','Incluye 3 pares de almohadillas XS/S/L'],
  'airpods-4gen': ['No incluye cable de carga','Reconocimiento inmediato','Duración batería 6-8 horas','Control táctil','Compatibles iOS & Android','Excelentes graves'],
  'airpods-pro-3': ['Cancelación de ruido activa','Traductor en vivo (iOS26+)','No incluye cable de carga','Reconocimiento inmediato','Duración batería 6-8 horas','Control táctil','Compatibles iOS & Android','Incluye 4 pares XXS/XS/S/L'],
  'max-basico': ['Sin cancelación de ruido activa','Incluye cable carga USB-A','Incluye estuche Smartcase','Reconocimiento inmediato iOS','Duración batería 10-12 horas','Almohadillas imantadas','Almohadillas desmontables','Compatibles iOS & Android'],
  'max-1-1': ['Cancelación de ruido activa','Incluye cable carga USB-C','Duración batería hasta 12 horas','Compatible audio espacial iOS','Compatible Siri','Compatible iOS & Android','Sonido alta fidelidad','Incluye estuche 1:1','Starlight · Midnight · Orange · Blue · Purple'],
  'apple-watch-ultra-3': ['Cuerpo silver / correa negra','Incluye cable carga USB-A','Duración batería hasta 8 horas','Vinculación App XRFIT','Compatible iOS & Android','Compatible Apple Health','Llamadas, notificaciones, SMS','Métricas: calorías / ritmo / distancia / O2'],
  'apple-watch-serie-11': ['Cuerpo negro / correa negra','Incluye cable carga USB-A','Duración batería hasta 8 horas','Vinculación App XRFIT','Compatible iOS & Android','Compatible Apple Health','Llamadas, notificaciones, SMS','Métricas: calorías / ritmo / distancia / O2'],
  'apple-pencil': ['Tecnología táctil','Carga Lightning en iPad','Respuesta rápida sin latencia','Duración batería 6-8 horas'],
  'cargador-35w': ['Cable tipo cordón (no goma)','Carga USB-C','Carga rápida 35W','1mt de largo','Compatible dispositivos USB-C'],
  'bateria-magsafe': ['Carga inalámbrica imantada','Potencia 5.000mAh','Diseño delgado fácil de transportar','Compatible desde iPhone 12','Carga a través de Lightning','No incluye cable de carga'],
  'correa-milanese': ['Malla de acero inoxidable','Cierre magnético ajustable','Acabado italiano','Compatible Apple Watch','Talla universal'],
  'correa-sport': ['Fluoroelastómero de alto rendimiento','Duradera y resistente','Cierre de encastre innovador','Compatible Apple Watch'],
  'correa-trail': ['Nylon flexible de alta elasticidad','Tira de ajuste rápido','Hilos reflectantes','Ultra delgada y liviana','Compatible Apple Watch'],
  'correa-sport-2': ['Elástica y liviana','Diseño perforado','Fragmentos de colores aleatorios','Compatible Apple Watch']
};

var _PRODUCT_IMAGES = {
  'airpods-pro-2': ['./images/airpods-pro-2.webp','./images/airpods-pro-2-v2.webp','./images/airpods-pro-2-v3.webp'],
  'airpods-4gen': ['./images/airpods-4gen.webp','./images/airpods-4ta-generacion-v2.webp','./images/airpods-4ta-generacion-v3.webp'],
  'airpods-pro-3': ['./images/airpods-3gen.webp','./images/airpods-3ra-generacion-v2.webp','./images/airpods-3ra-generacion-v3.webp'],
  'max-basico': ['./images/max-magneticos.webp'],
  'max-1-1': ['./images/max-negros.webp','./images/max-blanco.webp','./images/max-naranja.webp','./images/max-morado.webp','./images/max-azul.webp'],
  'apple-watch-ultra-3': ['./images/apple-watch-ultra-3.webp','./images/apple-watch-ultra-3-v2.webp','./images/apple-watch-ultra-3-v3.webp'],
  'apple-watch-serie-11': ['./images/serie-10.webp','./images/apple-watch-serie-10-v2.webp','./images/apple-watch-serie-10-v3.webp'],
  'apple-pencil': ['./images/pencil.webp','./images/pencilv2.webp'],
  'cargador-35w': ['./images/cargador-tipo-c.webp','./images/cargador-tipo-c-completo-v2.webp'],
  'bateria-magsafe': ['./images/bateria-magsafe.webp','./images/bateria-magsafe-v2.webp'],
  'correa-milanese': [],
  'correa-sport': [],
  'correa-trail': [],
  'correa-sport-2': []
};

var _COLOR_VARIANTS = {
  'max-1-1': [
    { name:'Midnight',  hex:'#1A1A1A', img:'./images/max-negros.webp', swatch:'./images/black.png', thumb:'./images/miblack.webp' },
    { name:'Starlight', hex:'#F5F0E8', img:'./images/max-blanco.webp', swatch:'./images/starlight.png', thumb:'./images/miblanco.webp' },
    { name:'Orange',    hex:'#F26513', img:'./images/max-naranja.webp', swatch:'./images/orange.png', thumb:'./images/miorange.webp' },
    { name:'Purple',    hex:'#9B59B6', img:'./images/max-morado.webp', swatch:'./images/purple.webp', thumb:'./images/mipurple.webp' },
    { name:'Blue',      hex:'#3498DB', img:'./images/max-azul.webp', swatch:'./images/blue.png', thumb:'./images/miblue.webp' }
  ],
  'correa-milanese': [
    { name:'Plata',   hex:'#C0C0C0', img:'./images/milaneseplata.webp', swatch:'./images/mplata.webp', thumb:'./images/mplata.webp' },
    { name:'Vintage', hex:'#C9A96E', img:'./images/milanesevintage.webp', swatch:'./images/mvintage.webp', thumb:'./images/mvintage.webp' },
    { name:'Black',   hex:'#1A1A1A', img:'./images/milaneseblack.webp', swatch:'./images/mblack.webp', thumb:'./images/mblack.webp' }
  ],
  'correa-sport': [
    { name:'Starlight', hex:'#F5F0E8', img:'./images/cosportstarlight.webp', swatch:'./images/mstarlight.webp', thumb:'./images/mstarlight.webp' },
    { name:'Black',     hex:'#1A1A1A', img:'./images/cosportblack.webp', swatch:'./images/mblack.webp', thumb:'./images/mblack.webp' },
    { name:'Menta',     hex:'#98D8C8', img:'./images/cosportmenta.webp', swatch:'./images/mmenta.webp', thumb:'./images/mmenta.webp' },
    { name:'Olivia',    hex:'#6B8E23', img:'./images/cosportolivia.webp', swatch:'./images/molivia.webp', thumb:'./images/molivia.webp' },
    { name:'Rosa',      hex:'#F4A7B9', img:'./images/cosportrosa.webp', swatch:'./images/mrosa.webp', thumb:'./images/mrosa.webp' }
  ],
  'correa-trail': [
    { name:'Black',      hex:'#1A1A1A', img:'./images/coblack.webp', swatch:'./images/mblack.webp', thumb:'./images/mblack.webp' },
    { name:'Beige-Rosa', hex:'#D4A99A', img:'./images/cobeigerosa.webp', swatch:'./images/mbeigerosa.webp', thumb:'./images/mbeigerosa.webp' },
    { name:'Roja',       hex:'#C41E3A', img:'./images/coroja.webp', swatch:'./images/mroja.webp', thumb:'./images/mroja.webp' },
    { name:'Sunshine',   hex:'#F5C542', img:'./images/cosunhine.webp', swatch:'./images/msunshine.webp', thumb:'./images/msunshine.webp' },
    { name:'Gris',       hex:'#9E9E9E', img:'./images/cogris.webp', swatch:'./images/mgris.webp', thumb:'./images/mgris.webp' }
  ],
  'correa-sport-2': [
    { name:'Blanca',  hex:'#FAFAFA', img:'./images/cosport2blanca.webp', swatch:'./images/mblanca.webp', thumb:'./images/mblanca.webp' },
    { name:'Negra',   hex:'#1A1A1A', img:'./images/cosport3black.webp', swatch:'./images/mblack.webp', thumb:'./images/mblack.webp' },
    { name:'N-Verde', hex:'#4CAF50', img:'./images/cosport2nverde.webp', swatch:'./images/mverde.webp', thumb:'./images/mverde.webp' },
    { name:'Rosa',    hex:'#F4A7B9', img:'./images/cosport2rosa.webp', swatch:'./images/mrosa.webp', thumb:'./images/mrosa.webp' },
    { name:'Caqui',   hex:'#8B7355', img:'./images/cosport2caqui.webp', swatch:'./images/mcaqui.webp', thumb:'./images/mcaqui.webp' }
  ]
};

(function _renderCatalogo() {
  var _grid = document.getElementById('productosGrid');
  if (!_grid) return;
  _catProducts.forEach(function (p, i) {
    var _card = document.createElement('div');
    _card.className = 'product-card';
    _card.setAttribute('data-name', p.name);
    _card.setAttribute('data-price', p.rawPrice);
    _card.setAttribute('data-desc', p.desc);
    _card.setAttribute('data-img-scale', p.imgScale);
    _card.setAttribute('data-feature-key', p.featureKey);
    _card.setAttribute('data-category', p.category);
    var imgHtml = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"><svg class="card-img-placeholder" style="display:none" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>'
      : '<svg class="card-img-placeholder" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
    var cv = _COLOR_VARIANTS[p.featureKey];
    var colorDotsHtml = '';
    if (cv) {
      colorDotsHtml = '<div class="card-colors">' + cv.map(function (v) { return '<span class="card-color-dot">' + (v.swatch ? '<img src="' + v.swatch + '" alt="' + v.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">' : '<span style="display:block;width:100%;height:100%;border-radius:50%;background:' + v.hex + '"></span>') + '</span>'; }).join('') + '</div>';
    }
    _card.innerHTML = '<div class="card-img-wrap">' + imgHtml + '</div><div class="card-info"><p class="card-name">' + p.name + '</p><div class="card-price-row"><p class="card-price">' + p.price + ' <span class="card-unit">c/u</span></p>' + colorDotsHtml + '</div><button class="card-btn">Ver más</button></div>';
    _card.style.setProperty('--card-img-scale', p.imgScale);
    _card.addEventListener('click', function () { ProductModal.open(_card); });
    _grid.appendChild(_card);
  });
})();

document.getElementById('productosFiltros').addEventListener('click', function (e) {
  var btn = e.target.closest('.filtro-btn');
  if (!btn) return;
  var cat = btn.dataset.cat;
  this.querySelectorAll('.filtro-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var cards = document.querySelectorAll('.product-card');
  cards.forEach(function (card) {
    card.style.display = (cat === 'todos' || card.dataset.category === cat) ? '' : 'none';
  });
  setTimeout(_resizeTicker, 50);
});

var ProductModal = (function () {
  var isOpen = false, originCard = null, originRect = null, qty = 1, currentProduct = null;
  var imgIndex = 0, imgList = [], isTemp = false, _colorPicked = false, _awaitingColorConfirm = false;
  var ppage = document.getElementById('ppage'), overlay = document.getElementById('ppageOverlay');
  var fmt = function (n) { return '$' + Number(n).toLocaleString('es-CL'); };
  var getCardImg = function (c) { return c ? c.querySelector('.card-img-wrap img') || null : null; };
  var lockScroll = function () { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; };
  var unlockScroll = function () { if (!_catOpen) { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; } };

  function _needsColor() {
    if (!currentProduct) return false;
    var vars = _COLOR_VARIANTS[currentProduct.featureKey];
    return vars && !_colorPicked;
  }

  function _isColorNav() {
    if (!currentProduct) return false;
    return !!_COLOR_VARIANTS[currentProduct.featureKey];
  }

  function _shakeColor() {
    _awaitingColorConfirm = true;
    var row = document.getElementById('ppageColorsRow');
    var hint = document.getElementById('ppageColorHint');
    if (row) {
      row.classList.remove('shake');
      void row.offsetWidth;
      row.classList.add('shake');
    }
    if (hint) hint.classList.add('show');
  }

  function _cartKey() {
    if (!currentProduct) return '';
    var vars = _COLOR_VARIANTS[currentProduct.featureKey];
    return vars ? currentProduct.featureKey + '::' + imgIndex : currentProduct.featureKey;
  }

  function _currentColorName() {
    if (!currentProduct) return '';
    var vars = _COLOR_VARIANTS[currentProduct.featureKey];
    return vars && vars[imgIndex] ? vars[imgIndex].name : '';
  }

  function _buildCartItem(oQty) {
    var vars = _COLOR_VARIANTS[currentProduct.featureKey];
    var ci = vars && vars[imgIndex];
    var img = '';
    if (ci) img = ci.img || ci.thumb || currentProduct.image;
    else img = currentProduct.image;
    return {
      key: _cartKey(),
      name: currentProduct.name,
      price: currentProduct.price,
      rawPrice: currentProduct.rawPrice,
      image: img,
      colorName: ci ? ci.name : '',
      qty: oQty || qty
    };
  }

  function cleanAllVT(card) {
    var ci = getCardImg(card), pi = document.getElementById('ppageImg');
    if (card) { card.style.viewTransitionName = ''; card.style.visibility = ''; }
    if (ci) { ci.style.viewTransitionName = ''; ci.style.transition = ''; }
    ppage.style.viewTransitionName = '';
    if (pi) { pi.style.viewTransitionName = ''; pi.style.transition = ''; pi.style.opacity = ''; }
  }

  function buildImgList(key) {
    var list = _PRODUCT_IMAGES[key] || [];
    if (!list.length) {
      var vars = _COLOR_VARIANTS[key];
      if (vars) return vars.map(function (v) { return v.img; }).filter(function (src) { return src; });
      return [currentProduct.image].filter(Boolean);
    }
    return list.filter(function (src) { return src; });
  }

  var _IMG_SCALES = {
    'airpods-pro-2': [1, 1, 1], 'airpods-4gen': [1, 1, 1], 'airpods-pro-3': [1, 1, 1],
    'max-basico': [1], 'max-1-1': [1, 1, 1, 1, 1],
    'apple-watch-ultra-3': [1, 1, 1], 'apple-watch-serie-11': [1, 1, .75],
    'apple-pencil': [1, 1],     'cargador-35w': [1, 1], 'bateria-magsafe': [1, 1],
    'correa-milanese': [1, 1, 1], 'correa-sport': [1, 1, 1, 1, 1],
    'correa-trail': [1, 1, 1, 1, 1], 'correa-sport-2': [1, 1, 1, 1, 1]
  };

  function renderDots() {
    var w = document.getElementById('ppageImgDots');
    if (!w) return;
    if (_isColorNav()) { w.innerHTML = ''; return; }
    w.innerHTML = imgList.map(function (_, i) { return '<div class="ppage-img-dot' + (i === imgIndex ? ' active' : '') + '"></div>'; }).join('');
    w.querySelectorAll('.ppage-img-dot').forEach(function (d, i) { d.addEventListener('click', function () { goToImg(i); }); });
  }

  function updateArrow() {
    var b = document.getElementById('ppageImgNext');
    if (b) b.classList.toggle('hidden', _isColorNav() || isTemp || imgIndex >= imgList.length - 1);
  }

  function renderTempThumbs() {
    var w = document.getElementById('ppageThumbs');
    if (!w) return;
    w.innerHTML = '';
    imgList.forEach(function (src, i) {
      var t = document.createElement('div');
      t.className = 'ppage-thumb';
      t.dataset.index = i;
      t.innerHTML = '<img src="' + src + '" alt="">';
      gsap.set(t, { opacity: 0, y: 20, scale: .8 });
      w.appendChild(t);
      gsap.to(t, { opacity: 1, y: 0, scale: 1, duration: .35, delay: i * .06, ease: 'back.out(1.5)' });
      t.addEventListener('click', function () { activateFromTemp(i); });
    });
  }

  function activateFromTemp(ni) {
    isTemp = false;
    var ie = document.getElementById('ppageImg'), iw = document.getElementById('ppageImgWrap');
    var w = document.getElementById('ppageThumbs'); w.innerHTML = '';
    for (var i = 0; i < ni; i++) addThumb(imgList[i], i);
    imgIndex = ni;
    gsap.to(iw, { opacity: 0, scale: .88, duration: .25, ease: 'power3.in', onComplete: function () {
      ie.src = imgList[imgIndex];
      var scales = _IMG_SCALES[currentProduct.featureKey] || [1, 1, 1];
      var s = scales[imgIndex] || 1;
      document.getElementById('ppageImgWrap').style.setProperty('--ppage-img-scale', s);
      gsap.fromTo(iw, { opacity: 0, scale: .88 }, { opacity: 1, scale: 1, duration: .4, ease: 'power3.out' });
    }});
    renderDots(); updateArrow();
    _updateColorActive();
  }
  function addThumb(src, fi) {
    var w = document.getElementById('ppageThumbs');
    if (!w || w.querySelector('[data-index="' + fi + '"]')) return;
    var t = document.createElement('div');
    t.className = 'ppage-thumb'; t.dataset.index = fi;
    t.innerHTML = '<img src="' + src + '" alt="">';
    gsap.set(t, { opacity: 0, y: 20, scale: .8 });
    w.appendChild(t);
    gsap.to(t, { opacity: 1, y: 0, scale: 1, duration: .35, ease: 'back.out(1.5)' });
    t.addEventListener('click', function () { goToImg(fi); });
  }

  var isAnimImg = false;
  function goToImgDirectly(ni) {
    if (ni === imgIndex || ni < 0 || ni >= imgList.length) return;
    imgIndex = ni;
    document.getElementById('ppageImg').src = imgList[ni];
    var scales = _IMG_SCALES[currentProduct.featureKey] || [1, 1, 1];
    document.getElementById('ppageImgWrap').style.setProperty('--ppage-img-scale', scales[ni] || 1);
    renderDots();
    _updateColorActive();
    var vars = _COLOR_VARIANTS[currentProduct.featureKey];
    if (vars && vars[ni]) {
      currentProduct.image = vars[ni].img;
      currentProduct.thumb = vars[ni].thumb;
    }
    var b = document.getElementById('ppageImgNext');
    if (b) b.classList.add('hidden');
  }
  function goToImg(ni) {
    if (_isColorNav()) return;
    if (ni === imgIndex || isTemp || isAnimImg || ni < 0 || ni >= imgList.length) return;
    var ie = document.getElementById('ppageImg'), iw = document.getElementById('ppageImgWrap');
    var dir = ni > imgIndex ? 1 : -1, pi = ie.src, pI = imgIndex;
    var pre = new Image(); pre.src = imgList[ni];
    function go() {
      isAnimImg = true;
      if (dir > 0) addThumb(pi, pI);
      else { var wt = document.getElementById('ppageThumbs'); if (wt) wt.querySelectorAll('.ppage-thumb').forEach(function (t) { if (Number(t.dataset.index) >= ni) gsap.to(t, { opacity: 0, y: 20, scale: .8, duration: .25, ease: 'power2.in', onComplete: function () { t.remove(); } }); }); }
      imgIndex = ni;
      gsap.to(iw, { x: dir > 0 ? -60 : 60, opacity: 0, scale: .88, duration: .3, ease: 'power3.in', onComplete: function () {
        ie.src = imgList[imgIndex];
        var scales = _IMG_SCALES[currentProduct.featureKey] || [1, 1, 1];
        var s = scales[imgIndex] || 1;
        document.getElementById('ppageImgWrap').style.setProperty('--ppage-img-scale', s);
        gsap.fromTo(iw, { x: dir > 0 ? 80 : -80, opacity: 0, scale: .88 }, { x: 0, opacity: 1, scale: 1, duration: .45, ease: 'power3.out', onComplete: function () { isAnimImg = false; } });
      }});
      renderDots(); updateArrow();
      _updateColorActive();
    }
    if (pre.complete) go(); else { pre.onload = go; pre.onerror = go; }
  }

  function resetCarousel(key) {
    imgIndex = 0;
    imgList = buildImgList(key);
    var w = document.getElementById('ppageThumbs'); if (w) w.innerHTML = '';
    document.getElementById('ppageImgWrap').style.setProperty('--ppage-img-scale', '1');
    renderDots(); updateArrow();
    _updateColorActive();
  }

  function updateTotal() {
    var u = currentProduct.rawPrice;
    document.getElementById('ppageTotal').textContent = fmt(u * qty);
  }

  function renderFeatures(key) {
    var f = _FEATURES[key] || [];
    var i = document.getElementById('ppage-features-inner');
    if (i) i.innerHTML = '<ul>' + f.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
  }

  function _updateColorActive() {
    var row = document.getElementById('ppageColorsRow');
    if (!row) return;
    row.querySelectorAll('.ppage-color-swatch').forEach(function (s, i) {
      s.classList.toggle('active', i === imgIndex);
    });
    var label = document.getElementById('ppageColorName');
    var vars = _COLOR_VARIANTS[currentProduct && currentProduct.featureKey] || [];
    if (label && vars[imgIndex]) label.textContent = vars[imgIndex].name;
  }

  function renderColors(key) {
    var wrap = document.getElementById('ppageColors');
    var row = document.getElementById('ppageColorsRow');
    var vars = _COLOR_VARIANTS[key];
    if (!wrap || !row) return;
    if (!vars) { wrap.style.display = 'none'; return; }
    wrap.style.display = '';
    row.innerHTML = vars.map(function (v, i) {
      return '<button class="ppage-color-swatch' + (i === imgIndex ? ' active' : '') + '" data-index="' + i + '" title="' + v.name + '" aria-label="' + v.name + '" style="' + (v.swatch ? '' : 'background:' + v.hex) + '">' + (v.swatch ? '<img src="' + v.swatch + '" alt="' + v.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">' : '') + '</button>';
    }).join('');
    row.querySelectorAll('.ppage-color-swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        if (_awaitingColorConfirm) {
          _colorPicked = true;
          _awaitingColorConfirm = false;
          var hint = document.getElementById('ppageColorHint');
          if (hint) hint.classList.remove('show');
          var row = document.getElementById('ppageColorsRow');
          if (row) row.classList.remove('shake');
        }
        goToImgDirectly(Number(this.dataset.index));
      });
    });
    var label = document.getElementById('ppageColorName');
    if (label && vars[imgIndex]) label.textContent = vars[imgIndex].name;
  }

  function populate(card) {
    var ci = getCardImg(card);
    var key = card.dataset.featureKey;
    var p = _catProducts.find(function (x) { return x.featureKey === key; });
    if (!p) return;
    currentProduct = { name: p.name, price: p.price, rawPrice: p.rawPrice, image: ci ? ci.src : '', featureKey: key };
    document.getElementById('ppageImg').src = currentProduct.image;
    document.getElementById('ppageImg').alt = currentProduct.name;
    document.getElementById('ppageName').textContent = currentProduct.name;
    document.getElementById('ppageDesc').textContent = card.dataset.desc || '';
    document.getElementById('ppageQtyNum').textContent = '1';
    qty = 1;
    updateTotal();
    renderFeatures(key);
    renderColors(key);
    resetCarousel(key);
    var fb = document.getElementById('ppage-features-body'), fc = document.getElementById('ppage-features-chev');
    if (fb) fb.style.height = '0'; if (fc) fc.classList.remove('open');
    var db = document.getElementById('ppage-delivery-body'), dc = document.getElementById('ppage-delivery-chev');
    if (db) db.style.height = '0'; if (dc) dc.classList.remove('open');
    isTemp = false;
    _colorPicked = false;
    _awaitingColorConfirm = false;
  }

  function open(card) {
    if (isOpen) return;
    isOpen = true; originCard = card; qty = 1;
    populate(card);
    originRect = card.getBoundingClientRect();
    var cardImg = getCardImg(card), ppageImgEl = document.getElementById('ppageImg'), ppageInfo = document.getElementById('ppageInfo');

    if (!document.startViewTransition) {
      var cx = (originRect.left + originRect.width / 2) / window.innerWidth * 100;
      var cy = (originRect.top + originRect.height / 2) / window.innerHeight * 100;
      ppage.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:0;right:0;bottom:0;left:0;width:100vw;max-width:100vw;height:100dvh;margin:0;padding:0;border-radius:0;overflow:hidden;transform-origin:' + cx.toFixed(2) + '% ' + cy.toFixed(2) + '%;';
      if (ppageInfo) ppageInfo.style.opacity = '1';
      lockScroll(); ppage.classList.add('active'); overlay.classList.add('active'); overlay.style.opacity = '0';
      card.style.visibility = 'hidden';
      gsap.to(overlay, { opacity: 1, duration: .4, ease: 'power2.out' });
      gsap.fromTo(ppage, { scale: 0 }, { scale: 1, duration: .52, ease: 'expo.out', onComplete: function () { ppage.style.transformOrigin = ''; ppage.style.transform = ''; } });
      return;
    }

    if (ppageInfo) { ppageInfo.style.opacity = '0'; ppageInfo.style.transform = 'scale(1.28) translateY(32px)'; }
    var ppageBack = document.getElementById('ppageBack');
    if (ppageBack) { ppageBack.style.opacity = '0'; ppageBack.style.transform = 'scale(1.04) translateY(-10px)'; }

    card.style.viewTransitionName = 'card-container';
    if (cardImg) { cardImg.style.transition = 'none'; void cardImg.offsetHeight; cardImg.style.viewTransitionName = 'product-hero'; }

    var vt = document.startViewTransition(function () {
      card.style.viewTransitionName = '';
      if (cardImg) { cardImg.style.viewTransitionName = ''; cardImg.style.transition = ''; }
      card.style.visibility = 'hidden';
      ppage.style.display = 'flex'; ppage.style.position = 'fixed'; ppage.style.inset = '0';
      ppage.style.width = '100vw'; ppage.style.height = '100dvh';
      ppage.style.margin = '0'; ppage.style.padding = '0'; ppage.style.borderRadius = '0'; ppage.style.overflow = 'hidden';
      ppage.style.transform = ''; ppage.style.transformOrigin = '';
      ppage.style.viewTransitionName = 'card-container';
      ppageImgEl.style.transition = 'none';
      ppageImgEl.style.viewTransitionName = 'product-hero';
      ppage.classList.add('active'); overlay.classList.add('active'); overlay.style.opacity = '1';
      lockScroll();
    });

    vt.ready.then(function () {
      if (ppageInfo) gsap.to(ppageInfo, { opacity: 1, scale: 1, y: 0, duration: .38, ease: 'power3.out' });
      var els = [
        ppageInfo && ppageInfo.querySelector('.ppage-name'),
        ppageInfo && ppageInfo.querySelector('.ppage-desc'),
        document.getElementById('ppageActionsWrap'),
        document.getElementById('ppageAccordions')
      ].filter(Boolean);
      gsap.set(els, { opacity: 0, y: 14 });
      gsap.to(els, { opacity: 1, y: 0, duration: .30, ease: 'power2.out', stagger: .06, delay: .10 });
      if (ppageBack) gsap.to(ppageBack, { opacity: 1, scale: 1, y: 0, duration: .24, ease: 'power2.out', delay: .06 });
    }).catch(function () {
      if (ppageInfo) { ppageInfo.style.opacity = '1'; ppageInfo.style.transform = ''; }
      if (ppageBack) { ppageBack.style.opacity = '1'; ppageBack.style.transform = ''; }
    });

    vt.finished.then(function () {
      ppage.style.viewTransitionName = '';
      ppageImgEl.style.viewTransitionName = ''; ppageImgEl.style.transition = '';
      if (ppageInfo) { ppageInfo.style.opacity = '1'; ppageInfo.style.transform = ''; }
      if (ppageBack) { ppageBack.style.opacity = '1'; ppageBack.style.transform = ''; }
    }).catch(function () {
      cleanAllVT(card); isOpen = false; currentProduct = null; originCard = null; unlockScroll();
      if (ppageInfo) { ppageInfo.style.opacity = '1'; ppageInfo.style.transform = ''; }
    });
  }

  function close() {
    if (!isOpen || !originRect) return;
    var card = originCard;
    var isProdCard = card && card.classList.contains('prod-card');
    var cardImg = isProdCard ? card.querySelector('.card-prod') : getCardImg(card);
    var ppageImgEl = document.getElementById('ppageImg'), iw = document.getElementById('ppageImgWrap');
    gsap.killTweensOf(iw); gsap.killTweensOf(ppageImgEl);
    if (iw) { iw.style.transform = ''; iw.style.opacity = ''; iw.style.setProperty('--ppage-img-scale', '1'); }

    if (!document.startViewTransition) {
      var r = originRect;
      if (card) { var f = card.getBoundingClientRect(); if (f.width > 0) r = f; }
      var cx = (r.left + r.width / 2) / window.innerWidth * 100, cy = (r.top + r.height / 2) / window.innerHeight * 100;
      ppage.style.transformOrigin = cx.toFixed(2) + '% ' + cy.toFixed(2) + '%';
      gsap.to(overlay, { opacity: 0, duration: .3, ease: 'power2.in' });
      gsap.to(ppage, { scale: 0, duration: .42, ease: 'expo.in', onComplete: function () {
        ppage.classList.remove('active'); overlay.classList.remove('active'); overlay.style.opacity = '0';
        ppage.style.display = 'none'; ppage.style.transform = ''; ppage.style.transformOrigin = '';
        if (card) card.style.visibility = '';
        isOpen = false; currentProduct = null; originCard = null; isTemp = false;
        unlockScroll();
      }});
      return;
    }

    var ppageInfo = document.getElementById('ppageInfo');
    var ppageBack = document.getElementById('ppageBack');

    document.documentElement.classList.add('vt-closing-card');
    ppage.style.viewTransitionName = 'card-container';
    ppageImgEl.style.viewTransitionName = 'product-hero';

    var vt = document.startViewTransition(function () {
      ppageImgEl.style.opacity = '0';
      ppageImgEl.style.viewTransitionName = ''; ppageImgEl.style.transition = '';
      if (iw) iw.style.setProperty('--ppage-img-scale', '1');
      ppage.style.viewTransitionName = '';
      ppage.classList.remove('active'); overlay.classList.remove('active'); overlay.style.opacity = '0';
      ppage.style.display = 'none'; ppage.style.transform = ''; ppage.style.borderRadius = '';
      if (card) {
        card.style.visibility = '';
        card.style.viewTransitionName = 'card-container';
        if (cardImg) { cardImg.style.transition = 'none'; cardImg.style.viewTransitionName = 'product-hero'; }
      }
      unlockScroll();
      isOpen = false; currentProduct = null; originCard = null; isTemp = false;
      if (ppageInfo) { ppageInfo.style.removeProperty('opacity'); ppageInfo.style.removeProperty('transform'); }
      if (ppageBack) { ppageBack.style.removeProperty('opacity'); ppageBack.style.removeProperty('transform'); }
    });

    vt.finished.then(function () {
      document.documentElement.classList.remove('vt-closing-card');
      if (card) card.style.viewTransitionName = '';
      if (cardImg) { cardImg.style.viewTransitionName = ''; cardImg.style.transition = ''; }
      if (ppageImgEl) ppageImgEl.style.opacity = '';
    }).catch(function () {
      document.documentElement.classList.remove('vt-closing-card');
      cleanAllVT(card);
      if (ppageImgEl) ppageImgEl.style.opacity = '';
      isOpen = false; currentProduct = null; originCard = null; unlockScroll();
    });
  }

  function openAccordion(id) {
    var b = document.getElementById(id + '-body'), c = document.getElementById(id + '-chev');
    if (!b || !c) return;
    var o = b.style.height !== '0px' && b.style.height !== '';
    if (o) { b.style.height = '0'; c.classList.remove('open'); }
    else { b.style.height = b.scrollHeight + 'px'; c.classList.add('open'); }
  }

  function init() {
    ppage.style.display = 'none'; overlay.style.opacity = '0';
    document.getElementById('ppageBack').addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    var panel = document.getElementById('ppageImgPanel');
    if (panel) {
      var tx = 0, ty = 0;
      panel.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
      panel.addEventListener('touchend', function (e) {
        if (_isColorNav()) return;
        var dx = tx - e.changedTouches[0].clientX, dy = ty - e.changedTouches[0].clientY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goToImg(dx > 0 ? imgIndex + 1 : imgIndex - 1);
      }, { passive: true });
    }

    document.getElementById('ppageQtyMinus').addEventListener('click', function () { if (qty > 1) { qty--; document.getElementById('ppageQtyNum').textContent = qty; updateTotal(); } });
    document.getElementById('ppageQtyPlus').addEventListener('click', function () { qty++; document.getElementById('ppageQtyNum').textContent = qty; updateTotal(); });

    document.getElementById('ppageWaBtn').addEventListener('click', function () {
      if (!currentProduct) return;
      if (_needsColor()) { _shakeColor(); return; }
      var u = currentProduct.rawPrice, t = u * qty;
      var cn = _currentColorName();
      var msg = ['*\u00a1Hola!* Me interesa este producto:', '', '\u25b8 ' + qty + 'x ' + currentProduct.name];
      if (cn) msg.push('  Color: ' + cn);
      msg.push('  Precio: ' + fmt(u) + ' c/u', '  Total: *' + fmt(t) + '*', '', '\u00bfTienen stock disponible?');
      window.open('https://wa.me/56942348587?text=' + encodeURIComponent(msg.join('\n')), '_blank');
    });

    document.getElementById('ppageCartBtn').addEventListener('click', function () {
      if (!currentProduct) return;
      if (_needsColor()) { _shakeColor(); return; }
      Cart.setItem(_buildCartItem());
      var b = document.getElementById('ppageCartBtn');
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      setTimeout(function () { b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.5c.8 0 1.5-.5 1.7-1.2l3-7H6.2L5.3 3H1v2h3l3.6 7.6-1.3 2.4c-.1.2-.2.5-.2.8 0 1.1.9 2 2 2h12v-2H8.4c-.1 0-.2-.1-.2-.2l.03-.12L9.1 14z"/></svg>'; }, 1800);
    });

    document.getElementById('ppageMpBtn').addEventListener('click', function () {
      if (!currentProduct) return;
      if (_needsColor()) { _shakeColor(); return; }
      Cart.setItem(_buildCartItem());
      window._ppageCheckout = true;
      if (window.Checkout) window.Checkout.open();
    });

    document.getElementById('ppage-features-header').addEventListener('click', function () { openAccordion('ppage-features'); });
    document.getElementById('ppage-delivery-header').addEventListener('click', function () { openAccordion('ppage-delivery'); });
    document.getElementById('ppageImgNext').addEventListener('click', function () { goToImg(imgIndex + 1); });

    document.querySelectorAll('.card-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.stopPropagation(); ProductModal.open(btn.closest('.product-card')); });
    });
  }

  function openFromCarousel(prodCard) {
    var _ci = prodCard.querySelector('.card-prod');
    var _key = prodCard.dataset.featureKey;
    var _cat = _catProducts.find(function (x) { return x.featureKey === _key; });

    if (_cat) {
      currentProduct = { name: _cat.name, price: _cat.price, rawPrice: _cat.rawPrice, image: _ci.src, featureKey: _key };
      document.getElementById('ppageName').textContent = _cat.name;
      document.getElementById('ppageDesc').textContent = _cat.desc || '';
    } else {
      var _nm = prodCard.querySelector('.prod-name').textContent.trim();
      var _ps = prodCard.querySelector('.prod-price').textContent;
      var _rp = parseInt(_ps.replace(/[^0-9]/g, ''));
      currentProduct = { name: _nm, price: '$' + _rp.toLocaleString('es-CL'), rawPrice: _rp, image: _ci.src, featureKey: null };
      document.getElementById('ppageName').textContent = _nm;
      document.getElementById('ppageDesc').textContent = '';
    }

    qty = 1;
    document.getElementById('ppageImg').src = _ci.src;
    document.getElementById('ppageQtyNum').textContent = '1';
    updateTotal();

    if (_key) {
      imgList = buildImgList(_key);
      renderFeatures(_key);
      renderColors(_key);
    } else {
      imgList = [_ci.src];
      var _fi2 = document.getElementById('ppage-features-inner');
      if (_fi2) _fi2.innerHTML = '';
    }
    imgIndex = 0;
    var _tw = document.getElementById('ppageThumbs');
    if (_tw) _tw.innerHTML = '';
    renderDots(); updateArrow();

    var _fb = document.getElementById('ppage-features-body');
    if (_fb) _fb.style.height = '0';
    var _fc = document.getElementById('ppage-features-chev');
    if (_fc) _fc.classList.remove('open');
    var _db = document.getElementById('ppage-delivery-body');
    if (_db) _db.style.height = '0';
    var _dc = document.getElementById('ppage-delivery-chev');
    if (_dc) _dc.classList.remove('open');

    isOpen = true;
    originCard = prodCard;
    originRect = prodCard.getBoundingClientRect();
    isTemp = false;
    _colorPicked = false;
    _awaitingColorConfirm = false;

    prodCard.style.viewTransitionName = 'card-container';
    _ci.style.transition = 'none';
    void _ci.offsetHeight;
    _ci.style.viewTransitionName = 'product-hero';

    var _pp = document.getElementById('ppage');
    var _pi = document.getElementById('ppageImg');
    var _po = document.getElementById('ppageOverlay');
    var _info = document.getElementById('ppageInfo');

    if (!document.startViewTransition) {
      _pp.style.cssText = 'display:flex;position:fixed;inset:0;width:100vw;height:100dvh;';
      _pp.classList.add('active'); _po.classList.add('active'); _po.style.opacity = '1';
      lockScroll();
      prodCard.style.visibility = 'hidden';
      return;
    }

    if (_info) { _info.style.opacity = '0'; _info.style.transform = 'scale(1.28) translateY(32px)'; }

    var vt = document.startViewTransition(function() {
      prodCard.style.viewTransitionName = '';
      _ci.style.viewTransitionName = ''; _ci.style.transition = '';
      prodCard.style.visibility = 'hidden';
      _pp.style.display = 'flex'; _pp.style.position = 'fixed'; _pp.style.inset = '0';
      _pp.style.width = '100vw'; _pp.style.height = '100dvh'; _pp.style.margin = '0';
      _pp.style.viewTransitionName = 'card-container';
      _pi.style.transition = 'none';
      _pi.style.viewTransitionName = 'product-hero';
      _pp.classList.add('active'); _po.classList.add('active'); _po.style.opacity = '1';
      lockScroll();
    });

    vt.finished.then(function() {
      _pp.style.viewTransitionName = '';
      _pi.style.viewTransitionName = ''; _pi.style.transition = '';
      if (_info) { _info.style.opacity = '1'; _info.style.transform = ''; }
    }).catch(function() {
      cleanAllVT(prodCard);
      isOpen = false; currentProduct = null; originCard = null;
      unlockScroll();
    });
  }

  return { init: init, close: close, open: open, openFromCarousel: openFromCarousel };
})();

window.ProductModal = ProductModal;

ProductModal.init();

initLogo3D();

initDevControls();

(function _initBeneficios() {
  var cards = document.querySelectorAll('.beneficio-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var wasActive = card.classList.contains('active');
      cards.forEach(function (c) { c.classList.remove('active'); });
      if (!wasActive) card.classList.add('active');
    });
  });
})();

document.getElementById('ventajasBtn').addEventListener('click', function () {
  _openVentajas('#beneficios');
});

document.getElementById('contactoBtn').addEventListener('click', function (e) {
  e.preventDefault();
  if (_catOpen) {
    _openVentajas('#contacto');
    return;
  }
  if (_ventajasOpen) {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  _openVentajas('#contacto');
});

// Refresh extra cuando todo el layout (imagenes/fuentes) ya cargo, para que
// las medidas de los pin se tomen con la pagina asentada (clave en movil).
window.addEventListener('load', function () {
  if (!_catOpen && !_ventajasOpen) {
    requestAnimationFrame(function () { ScrollTrigger.refresh(); });
  }
});
