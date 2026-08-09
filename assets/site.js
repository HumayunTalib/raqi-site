/* ============================================================
   RAQI — Shared site behavior (scroll reveal, image fallback,
   cart, nav menus). Included on every page. Defensive against
   missing DOM elements so it's safe on pages that don't use a
   given feature yet.
   ============================================================ */

// ---------- Scroll reveal ----------
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();

// ---------- Image fallback loader ----------
// Only swaps in an external product photo if it actually loads, so a
// missing/not-yet-uploaded image never flashes a broken-image icon —
// it falls back to the clean placeholder mark already in the DOM.
(function () {
  document.querySelectorAll('[data-src]').forEach(function (box) {
    var src = box.getAttribute('data-src');
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = src;
      img.alt = box.getAttribute('data-alt') || '';
      img.loading = 'lazy';
      box.insertBefore(img, box.firstChild);
      box.classList.add('has-image');
    };
    probe.src = src;
  });
})();

// ---------- Reusable: render every real color across all products into a container ----------
// Used by the homepage "Shop by Color" teaser and (later) shop.html's color filter.
// Renders real swatches only — never invents a color that isn't in RAQI_PRODUCTS.
function renderColorWall(containerId, onClickHref) {
  var box = document.getElementById(containerId);
  if (!box || typeof RAQI_PRODUCTS === 'undefined') return;
  var html = '';
  RAQI_PRODUCTS.forEach(function (p) {
    p.colors.forEach(function (c) {
      var href = typeof onClickHref === 'function' ? onClickHref(p, c) : '#codes';
      html += '<a class="swatch-tile" href="' + href + '" title="' + c.name + ' — ' + p.code + '" style="background:' + c.hex + '"></a>';
    });
  });
  box.innerHTML = html;
}

// ---------- Nav: mega-menu (desktop hover/focus) + mobile full-screen menu ----------
(function () {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.getElementById('mobile-menu-close');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      var first = menu.querySelector('a, button');
      if (first) first.focus();
    });
  }
  function closeMobileMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.focus();
  }
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) closeMobileMenu();
  });

  // Mark current page in nav
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();

// ---------- Selection cart (localStorage-backed, shared across pages) ----------
var RaqiCart = (function () {
  var STORAGE_KEY = 'raqi_cart_v1';
  var SCHEMA_VERSION = 1;
  var listeners = [];

  function readRaw() {
    try {
      if (typeof localStorage === 'undefined') return null;
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.items)) return null;
      // Shape-validate: only code strings, nothing else — never trust stored PII.
      var items = parsed.items.filter(function (c) { return typeof c === 'string'; });
      return { version: SCHEMA_VERSION, items: items };
    } catch (e) {
      return null;
    }
  }

  var memoryFallback = { version: SCHEMA_VERSION, items: [] };
  var storageAvailable = (function () {
    try {
      if (typeof localStorage === 'undefined') return false;
      var t = '__raqi_test__';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    } catch (e) { return false; }
  })();

  function getCart() {
    if (!storageAvailable) return memoryFallback;
    return readRaw() || { version: SCHEMA_VERSION, items: [] };
  }

  function saveCart(cart) {
    if (!storageAvailable) { memoryFallback = cart; notify(); return; }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* storage full/unavailable — silently no-op, cart just won't persist */ }
    notify();
  }

  function notify() {
    var cart = getCart();
    listeners.forEach(function (fn) { fn(cart); });
  }

  // Cross-tab sync
  if (storageAvailable) {
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) notify();
    });
  }

  function toggle(code) {
    var cart = getCart();
    var idx = cart.items.indexOf(code);
    if (idx === -1) cart.items.push(code);
    else cart.items.splice(idx, 1);
    saveCart(cart);
    return idx === -1; // true if now added
  }

  function has(code) {
    return getCart().items.indexOf(code) !== -1;
  }

  function remove(code) {
    var cart = getCart();
    var idx = cart.items.indexOf(code);
    if (idx !== -1) { cart.items.splice(idx, 1); saveCart(cart); }
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  return { getCart: getCart, toggle: toggle, has: has, remove: remove, onChange: onChange };
})();

// ---------- Wire cart UI (quick-add buttons, floating bar, drawer) present on the page ----------
(function () {
  var PHONE = '923218230266';
  var ICON_PLUS  = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var cartBar   = document.getElementById('cart-bar');
  var cartCount = document.getElementById('cart-count');
  var cartView  = document.getElementById('cart-view');
  var drawer    = document.getElementById('cart-drawer');
  var backdrop  = document.getElementById('cart-backdrop');
  var closeBtn  = document.getElementById('cart-close');
  var itemsBox  = document.getElementById('cart-items');
  var sendBtn   = document.getElementById('cart-drawer-send');
  var codeField = document.getElementById('r-code');

  function productByCode(code) {
    if (typeof RAQI_PRODUCTS === 'undefined') return null;
    for (var i = 0; i < RAQI_PRODUCTS.length; i++) {
      if (RAQI_PRODUCTS[i].code === code) return RAQI_PRODUCTS[i];
    }
    return null;
  }

  function setButtonState(code, added) {
    var btn = document.querySelector('.store-quickadd[data-code="' + code + '"]');
    if (!btn) return;
    btn.innerHTML = added ? ICON_CHECK : ICON_PLUS;
    btn.classList.toggle('is-added', added);
    btn.setAttribute('aria-label', (added ? 'Remove ' : 'Add ') + code + (added ? ' from selection' : ' to selection'));
  }

  function renderItems(items) {
    if (!itemsBox) return;
    if (!items.length) {
      itemsBox.innerHTML = '<p class="cart-drawer-empty">No codes selected yet.</p>';
      return;
    }
    itemsBox.innerHTML = items.map(function (code) {
      var p = productByCode(code) || {};
      return '<div class="cart-item">' +
        '<div class="cart-item-thumb"><img src="' + (p.image || '') + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
        '<div class="cart-item-info"><div class="cart-item-name">' + code + '</div><div class="cart-item-sub">' + (p.season || '') + '</div></div>' +
        '<button type="button" class="cart-item-remove" data-code="' + code + '" aria-label="Remove ' + code + ' from selection">&times;</button>' +
      '</div>';
    }).join('');
  }

  function render() {
    var cart = RaqiCart.getCart();
    var n = cart.items.length;
    if (cartCount) cartCount.textContent = n;
    if (cartBar) cartBar.classList.toggle('visible', n > 0);
    if (codeField) codeField.value = cart.items.join(', ');
    renderItems(cart.items);
    if (sendBtn && n > 0) {
      var msg = "Hello RAQI, I'd like more details on: " + cart.items.join(', ') + '.';
      sendBtn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    }
    // Sync every quick-add button's visual state to the current cart, since
    // a page can load with items already selected from a previous page.
    document.querySelectorAll('.store-quickadd').forEach(function (btn) {
      var code = btn.getAttribute('data-code');
      setButtonState(code, cart.items.indexOf(code) !== -1);
    });
  }

  document.querySelectorAll('.store-quickadd').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.getAttribute('data-code');
      RaqiCart.toggle(code);
    });
  });

  if (itemsBox) {
    itemsBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.cart-item-remove');
      if (btn) RaqiCart.remove(btn.getAttribute('data-code'));
    });
  }

  if (cartView && drawer && backdrop) {
    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('visible');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('visible');
      drawer.setAttribute('aria-hidden', 'true');
    }
    cartView.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  RaqiCart.onChange(render);
  render();
})();

// Auto-render the color wall if this page has one (homepage teaser, shop.html filter, etc.)
renderColorWall('color-wall');
