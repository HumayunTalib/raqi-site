/* ============================================================
   RAQI — product detail page logic (color select, quantity,
   order/enquire). Shared across all product-*.html pages; reads
   which product it's on from <main data-product-code="...">.
   ============================================================ */
(function () {
  'use strict';
  if (typeof RAQI_PRODUCTS === 'undefined') return;

  var main = document.querySelector('main[data-product-code]');
  if (!main) return;
  var code = main.getAttribute('data-product-code');
  var product = RAQI_PRODUCTS.filter(function (p) { return p.code === code; })[0];
  if (!product) return;

  var PHONE = '923218230266';
  var swatchRow = document.getElementById('pdp-swatch-row');
  var selectedLabel = document.getElementById('pdp-selected-color');
  var qtyInput = document.getElementById('pdp-qty-input');
  var orderBtn = document.getElementById('pdp-order');
  var enquireLink = document.getElementById('pdp-enquire');

  var selectedColor = product.colors[0];

  function renderColors() {
    if (!swatchRow) return;
    if (product.colors.length === 1) {
      // A selector with exactly one non-optional option reads as broken —
      // show a static label instead of a fake "choice."
      swatchRow.innerHTML = '';
      if (selectedLabel) selectedLabel.textContent = 'Color: ' + product.colors[0].name;
      return;
    }
    swatchRow.innerHTML = product.colors.map(function (c, i) {
      return '<button type="button" class="pdp-swatch' + (i === 0 ? ' active' : '') + '" ' +
        'data-hex="' + c.hex + '" data-name="' + c.name + '" ' +
        'style="background:' + c.hex + '" aria-label="' + c.name + '" title="' + c.name + '"></button>';
    }).join('');
    updateSelectedLabel();
  }

  function updateSelectedLabel() {
    if (selectedLabel) selectedLabel.textContent = 'Selected: ' + selectedColor.name;
  }

  if (swatchRow) {
    swatchRow.addEventListener('click', function (e) {
      var btn = e.target.closest('.pdp-swatch');
      if (!btn) return;
      swatchRow.querySelectorAll('.pdp-swatch').forEach(function (s) { s.classList.remove('active'); });
      btn.classList.add('active');
      selectedColor = { name: btn.getAttribute('data-name'), hex: btn.getAttribute('data-hex') };
      updateSelectedLabel();
    });
  }

  function getQty() {
    var v = parseInt(qtyInput && qtyInput.value, 10);
    if (!v || v < 4) v = 4;
    return v;
  }

  if (orderBtn) {
    orderBtn.addEventListener('click', function () {
      var qty = getQty();
      var msg = "Hello RAQI, I'd like to order: " + product.code + ', ' + selectedColor.name + ', ' + qty + ' metres.';
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  if (enquireLink) {
    enquireLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (!RaqiCart.has(product.code)) RaqiCart.toggle(product.code);
      window.location.href = 'index.html#contact';
    });
  }

  renderColors();
})();
