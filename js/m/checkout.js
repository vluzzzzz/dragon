export function initCheckout() {
  var isOpen = false;
  var f = function (n) { return '$' + Number(n).toLocaleString('es-CL'); };

  function getEmail() {
    var u = document.getElementById('chkEmailUser');
    var d = document.getElementById('edsValue');
    return (u ? u.value.trim() : '') + (d ? d.textContent : '@gmail.com');
  }
  function getPhone() {
    var n = document.getElementById('chkPhone');
    return '+56 ' + (n ? n.value.trim() : '');
  }
  function getRaw(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function isValid() {
    return getRaw('chkName') && getEmail() && getRaw('chkPhone') && getRaw('chkCity');
  }

  function updatePayBtn() {
    var btn = document.getElementById('checkoutPayBtn');
    if (!btn) return;
    var cart = window.Cart ? window.Cart.getCart() : [];
    btn.disabled = !isValid() || !cart.length;
  }

  function calcTotal() {
    var cart = window.Cart ? window.Cart.getCart() : [];
    return cart.reduce(function (s, i) { return s + i.rawPrice * i.qty; }, 0);
  }

  function renderItems() {
    var itemsEl = document.getElementById('checkoutItems');
    var totalEl = document.getElementById('checkoutTotal');
    var cart = window.Cart ? window.Cart.getCart() : [];

    if (!cart.length) {
      if (itemsEl) itemsEl.innerHTML = '<p style="text-align:center;color:#6e6e73;padding:20px 0">Carrito vacio</p>';
      return;
    }

    if (itemsEl) {
      itemsEl.innerHTML = cart.map(function (item) {
        return '<div class="checkout-item" data-id="' + item.key + '">' +
          '<img class="checkout-item-img" src="' + (item.image || '') + '" alt="' + item.name + '">' +
          '<div class="checkout-item-info"><div class="checkout-item-name">' + item.name + '</div><div class="checkout-item-unit-price">' + f(item.rawPrice) + ' c/u</div></div>' +
          '<div class="checkout-item-qty-wrap">' +
            '<button class="checkout-qty-btn" data-id="' + item.key + '" data-delta="-1">-</button>' +
            '<span class="checkout-qty-num">' + item.qty + '</span>' +
            '<button class="checkout-qty-btn" data-id="' + item.key + '" data-delta="1">+</button>' +
          '</div>' +
          '<div class="checkout-item-subtotal">' + f(item.rawPrice * item.qty) + '</div>' +
          '<button class="checkout-item-remove" data-id="' + item.key + '" aria-label="Eliminar">&times;</button>' +
        '</div>';
      }).join('');

      itemsEl.querySelectorAll('.checkout-qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (window.Cart) window.Cart.changeQty(btn.dataset.id, Number(btn.dataset.delta));
          renderItems();
          if (totalEl) totalEl.textContent = f(calcTotal());
          updatePayBtn();
          if (window.Cart.getCart().length === 0) close();
        });
      });

      itemsEl.querySelectorAll('.checkout-item-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (window.Cart) window.Cart.changeQty(btn.dataset.id, -999);
          renderItems();
          if (totalEl) totalEl.textContent = f(calcTotal());
          updatePayBtn();
          if (window.Cart.getCart().length === 0) close();
        });
      });
    }

    if (totalEl) totalEl.textContent = f(calcTotal());
  }

  function formatRut(v) {
    var d = v.replace(/[^0-9kK]/g, '').toUpperCase();
    if (d.length <= 1) return d;
    var body = d.slice(0, -1), checker = d.slice(-1);
    var formatted = '';
    for (var i = 0; i < body.length; i++) {
      if (i > 0 && (body.length - i) % 3 === 0) formatted += '.';
      formatted += body[i];
    }
    return formatted + '-' + checker;
  }

  function clearForm() {
    ['chkName','chkRut','chkCity','chkAddress'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
    var eu = document.getElementById('chkEmailUser');
    if (eu) eu.value = '';
    var ev = document.getElementById('edsValue');
    if (ev) ev.textContent = '@gmail.com';
    var ph = document.getElementById('chkPhone');
    if (ph) ph.value = '';
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    var modal = document.getElementById('checkoutModal');
    var panel = document.querySelector('.checkout-panel');
    if (!modal) return;

    renderItems();
    updatePayBtn();
    clearForm();

    gsap.killTweensOf(modal);
    gsap.set(modal, { display: 'flex', opacity: 1 });
    if (panel) { gsap.killTweensOf(panel); gsap.set(panel, { x: '100%' }); gsap.to(panel, { x: '0%', duration: 0.4, ease: 'power3.out' }); }
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    var wasFromPpage = window._ppageCheckout;
    window._ppageCheckout = false;
    var modal = document.getElementById('checkoutModal');
    var panel = document.querySelector('.checkout-panel');
    if (panel) {
      gsap.killTweensOf(panel);
      gsap.to(panel, { x: '100%', duration: 0.4, ease: 'power4.in', onComplete: function () {
        if (modal) { modal.style.display = 'none'; gsap.set(modal, { opacity: '' }); }
        gsap.set(panel, { x: '100%' });
      }});
      if (modal) gsap.to(modal, { opacity: 0, duration: 0.25, delay: 0.15, ease: 'power2.in' });
    }
    if (!wasFromPpage) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  async function pay() {
    if (!isValid()) return;
    var cart = window.Cart ? window.Cart.getCart() : [];
    if (!cart.length) return;

    var btn = document.getElementById('checkoutPayBtn');
    if (btn) { btn.disabled = true; btn.classList.add('loading'); btn.textContent = 'Procesando...'; }

    try {
      var customer = {
        name: getRaw('chkName'),
        email: getEmail(),
        phone: getPhone(),
        rut: getRaw('chkRut'),
        city: getRaw('chkCity'),
        address: getRaw('chkAddress')
      };

      var items = cart.map(function (item) {
        return { name: item.name, qty: item.qty, price: item.rawPrice };
      });

      var res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items, customer: customer })
      });
      var data = await res.json();
      if (data.init_point) {
        window.open(data.init_point, '_blank');
        if (btn) { btn.textContent = 'Pagar con Mercado Pago'; btn.disabled = false; btn.classList.remove('loading'); }
      } else {
        throw new Error(data.error || 'Error al crear preferencia');
      }
    } catch (e) {
      if (btn) { btn.textContent = 'Error, intenta de nuevo'; btn.disabled = false; btn.classList.remove('loading'); }
    }
  }

  function init() {
    var modal = document.getElementById('checkoutModal');
    if (!modal) return;

    document.getElementById('checkoutClose').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    ['chkName','chkEmailUser','chkPhone','chkCity','chkAddress'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', updatePayBtn);
    });

    var rutEl = document.getElementById('chkRut');
    if (rutEl) {
      rutEl.addEventListener('input', function () {
        var s = this.selectionStart || 0;
        var c = this.value.length;
        this.value = formatRut(this.value);
        var d = this.value.length - c;
        this.setSelectionRange(s + d, s + d);
      });
    }

    var eds = document.getElementById('eds');
    var trigger = document.getElementById('edsTrigger');
    var menu = document.getElementById('edsMenu');
    var value = document.getElementById('edsValue');
    if (eds && trigger && menu) {
      var edsOpen = false;
      function closeMenu() {
        if (!edsOpen) return;
        edsOpen = false;
        gsap.to(menu, { opacity: 0, y: -6, duration: 0.15, ease: 'power2.out', onComplete: function () {
          menu.classList.remove('open');
        }});
        var chev = document.querySelector('.eds-chevron');
        if (chev) chev.classList.remove('open');
      }
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (edsOpen) { closeMenu(); return; }
        edsOpen = true;
        menu.classList.add('open');
        gsap.set(menu, { opacity: 0, y: -6 });
        gsap.to(menu, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
        var chev = document.querySelector('.eds-chevron');
        if (chev) chev.classList.add('open');
      });
      menu.querySelectorAll('.eds-opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (value) value.textContent = opt.dataset.value;
          menu.querySelectorAll('.eds-opt').forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
          closeMenu();
          updatePayBtn();
        });
      });
      document.addEventListener('click', function (e) { if (!eds.contains(e.target)) closeMenu(); });
    }

    var payBtn = document.getElementById('checkoutPayBtn');
    if (payBtn) payBtn.addEventListener('click', pay);

    var waBtn = document.getElementById('checkoutWaBtn');
    if (waBtn) {
      waBtn.addEventListener('click', function (e) {
        e.preventDefault();
        close();
        var cart = window.Cart ? window.Cart.getCart() : [];
        if (!cart.length) return;
        var lines = cart.map(function (item) {
          return '\u25b8 ' + item.qty + 'x ' + item.name + '\n  ' + f(item.rawPrice) + ' c/u = *' + f(item.rawPrice * item.qty) + '*';
        });
        var total = cart.reduce(function (s, i) { return s + i.rawPrice * i.qty; }, 0);
        var msg = ['*\u00a1Hola!* Me interesa hacer un pedido:', '', lines.join('\n'), '', 'Total: *' + f(total) + '*', '', '\u00bfTienen stock disponible?'].join('\n');
        window.open('https://wa.me/56942348587?text=' + encodeURIComponent(msg), '_blank');
      });
    }
  }

  return { init: init, open: open, close: close };
}
