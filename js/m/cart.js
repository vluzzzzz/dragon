export function initCart() {
  function getUnitPrice(key, qty) { return 0; }

  var state = { cart: [], isOpen: false };
  var fmt = function (n) { return '$' + n.toLocaleString('es-CL'); };

  var DOM = {};
  function cacheDOM() {
    DOM.cartDrawer = document.getElementById('cartDrawer');
    DOM.cartOverlay = document.getElementById('cartOverlay');
    DOM.cartItems = document.getElementById('cartItems');
    DOM.cartFooter = document.getElementById('cartFooter');
    DOM.cartTotal = document.getElementById('cartTotal');
    DOM.cartCount = document.getElementById('cartCount');
    DOM.cartToggle = document.getElementById('cartToggle');
    DOM.closeCart = document.getElementById('closeCart');
    DOM.checkoutBtn = document.getElementById('cartCheckoutBtn');
    DOM.mpBtn = document.getElementById('cartMpBtn');
  }

  function updateBadge() {
    var t = state.cart.reduce(function (s, i) { return s + i.qty; }, 0);
    if (DOM.cartCount) {
      DOM.cartCount.textContent = t;
      if (t > 0) DOM.cartCount.classList.add('show');
      else DOM.cartCount.classList.remove('show');
    }
  }

  function render() {
    if (!state.cart.length) {
      if (DOM.cartItems) DOM.cartItems.innerHTML = '<p class="cart-empty">Tu carrito esta vacio</p>';
      if (DOM.cartFooter) DOM.cartFooter.style.display = 'none';
      return;
    }
    if (DOM.cartFooter) DOM.cartFooter.style.display = 'block';
    var total = state.cart.reduce(function (s, i) { return s + i.rawPrice * i.qty; }, 0);
    if (DOM.cartTotal) DOM.cartTotal.textContent = fmt(total);
    if (DOM.cartItems) {
      DOM.cartItems.innerHTML = state.cart.map(function (item) {
        var up = item.rawPrice;
        return '<div class="cart-item" data-id="' + item.key + '">' +
          '<img class="cart-item-img" src="' + (item.image || '') + '" alt="' + item.name + '">' +
          '<div class="cart-item-info"><p class="cart-item-name">' + item.name + (item.colorName ? ' <span class="cart-item-color">' + item.colorName + '</span>' : '') + '</p><p class="cart-item-price">' + fmt(up) + ' c/u</p></div>' +
          '<div class="cart-item-qty"><button class="qty-btn" data-id="' + item.key + '" data-delta="-1">-</button><span>' + item.qty + '</span><button class="qty-btn" data-id="' + item.key + '" data-delta="1">+</button></div>' +
          '</div>';
      }).join('');
      DOM.cartItems.querySelectorAll('.qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { changeQty(btn.dataset.id, Number(btn.dataset.delta)); });
      });
    }
  }

  function open() {
    if (state.isOpen) return;
    state.isOpen = true;
    cacheDOM();
    if (!DOM.cartDrawer) return;
    DOM.cartDrawer.style.display = 'flex';
    DOM.cartDrawer.style.position = 'fixed';
    DOM.cartDrawer.style.top = '0';
    DOM.cartDrawer.style.right = '0';
    DOM.cartDrawer.style.height = '100%';
    DOM.cartDrawer.style.zIndex = '9999';
    DOM.cartDrawer.style.visibility = 'visible';
    void DOM.cartDrawer.offsetHeight;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (DOM.cartOverlay) DOM.cartOverlay.classList.add('show');
    gsap.to(DOM.cartOverlay, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(DOM.cartDrawer, { x: '100%' }, { x: '0%', duration: 0.6, ease: 'power4.out' });
    render();
  }

  function close() {
    if (!state.isOpen) return;
    cacheDOM();
    gsap.to(DOM.cartOverlay, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: function () {
      if (DOM.cartOverlay) DOM.cartOverlay.classList.remove('show');
    }});
    gsap.to(DOM.cartDrawer, { x: '100%', duration: 0.45, ease: 'power4.in', onComplete: function () {
      state.isOpen = false;
      if (DOM.cartDrawer) {
        DOM.cartDrawer.style.zIndex = '';
        DOM.cartDrawer.style.visibility = '';
        DOM.cartDrawer.style.display = '';
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }});
  }

  function addItem(product) {
    var key = product.key || product.featureKey;
    var ex = state.cart.find(function (i) { return i.key === key; });
    if (ex) ex.qty += (product.qty || 1);
    else state.cart.push({ key: key, name: product.name, price: product.price, rawPrice: product.rawPrice, image: product.image, colorName: product.colorName || '', qty: product.qty || 1 });
    updateBadge();
    if (state.isOpen) render();
  }

  function setItem(product) {
    var key = product.key || product.featureKey;
    var ex = state.cart.find(function (i) { return i.key === key; });
    if (ex) ex.qty = product.qty || 1;
    else state.cart.push({ key: key, name: product.name, price: product.price, rawPrice: product.rawPrice, image: product.image, colorName: product.colorName || '', qty: product.qty || 1 });
    updateBadge();
    if (state.isOpen) render();
  }

  function changeQty(id, delta) {
    var item = state.cart.find(function (i) { return i.key === id; });
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) state.cart = state.cart.filter(function (i) { return i.key !== id; });
    updateBadge();
    if (state.isOpen) render();
  }

  function openWhatsApp() {
    if (!state.cart.length) return;
    var lines = state.cart.map(function (item) {
      return '\u25b8 ' + item.qty + 'x ' + item.name + '\n  ' + fmt(item.rawPrice) + ' c/u = *' + fmt(item.rawPrice * item.qty) + '*';
    });
    var total = state.cart.reduce(function (s, i) { return s + i.rawPrice * i.qty; }, 0);
    var msg = ['*\u00a1Hola!* Me interesa hacer un pedido:', '', lines.join('\n'), '', 'Total: *' + fmt(total) + '*', '', '\u00bfTienen stock disponible?'].join('\n');
    window.open('https://wa.me/56942348587?text=' + encodeURIComponent(msg), '_blank');
  }

  function getCart() { return state.cart; }

  function init() {
    cacheDOM();
    if (DOM.cartToggle) DOM.cartToggle.addEventListener('click', open);
    if (DOM.closeCart) DOM.closeCart.addEventListener('click', close);
    if (DOM.cartOverlay) DOM.cartOverlay.addEventListener('click', close);
    if (DOM.checkoutBtn) DOM.checkoutBtn.addEventListener('click', openWhatsApp);
    if (DOM.mpBtn) DOM.mpBtn.addEventListener('click', function () {
      close();
      setTimeout(function () { if (window.Checkout) window.Checkout.open(); }, 400);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  return { init: init, addItem: addItem, setItem: setItem, changeQty: changeQty, open: open, close: close, getCart: getCart, fmt: fmt, _render: render, _updateBadge: updateBadge, _state: state };
}
