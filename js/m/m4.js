/* #n */
export function s4() {
  var _b = document.getElementById('cartToggle');
  if (!_b) return;
  _b.addEventListener('click', function () {
    if (window.Cart) window.Cart.open();
  });
}
