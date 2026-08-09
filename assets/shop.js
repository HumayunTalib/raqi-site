/* ============================================================
   RAQI — shop.html filtering and grid rendering.
   Renders only real products/colors from RAQI_PRODUCTS — filters
   never invent a facet value that doesn't exist in the data.
   ============================================================ */
(function () {
  'use strict';
  if (typeof RAQI_PRODUCTS === 'undefined') return;

  var PHONE = '923218230266';
  var SEASONS = [
    { tag: 'summer', label: 'Summer' },
    { tag: 'winter', label: 'Winter' },
    { tag: 'all-season', label: 'All-Season' }
  ];
  var CHARACTERS = [
    { tag: 'standing', label: 'Standing' },
    { tag: 'fluid', label: 'Fluid' },
    { tag: 'structural', label: 'Structural' },
    { tag: 'neutral', label: 'Neutral' }
  ];

  // Unique colors across all products, deduped by hex (Waqar's "Midnight
  // Blue" and Daim's "Deep Navy" share a hex — the filter groups them by
  // visual color; each product card still shows its own real color name).
  var uniqueColors = (function () {
    var seen = {};
    var list = [];
    RAQI_PRODUCTS.forEach(function (p) {
      p.colors.forEach(function (c) {
        if (!seen[c.hex]) {
          seen[c.hex] = { hex: c.hex, names: [c.name] };
          list.push(seen[c.hex]);
        } else if (seen[c.hex].names.indexOf(c.name) === -1) {
          seen[c.hex].names.push(c.name);
        }
      });
    });
    return list;
  })();

  function getParams() {
    var sp = new URLSearchParams(window.location.search);
    return {
      season: sp.get('season'),
      character: sp.get('character'),
      color: sp.get('color')
    };
  }

  var state = getParams();

  function setParams() {
    var sp = new URLSearchParams();
    if (state.season) sp.set('season', state.season);
    if (state.character) sp.set('character', state.character);
    if (state.color) sp.set('color', state.color);
    var qs = sp.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '');
    window.history.replaceState(null, '', url);
  }

  function matches(p) {
    if (state.season && p.seasonTag !== state.season) return false;
    if (state.character && p.characterTag !== state.character) return false;
    if (state.color && !p.colors.some(function (c) { return c.hex.toLowerCase() === state.color.toLowerCase(); })) return false;
    return true;
  }

  function pillGroup(groupId, label, options, activeVal, key) {
    var html = '<div class="filter-group"><div class="filter-group-label">' + label + '</div><div class="filter-pills">';
    html += '<button type="button" class="filter-pill' + (!activeVal ? ' active' : '') + '" data-key="' + key + '" data-val="">All</button>';
    options.forEach(function (o) {
      html += '<button type="button" class="filter-pill' + (activeVal === o.tag ? ' active' : '') + '" data-key="' + key + '" data-val="' + o.tag + '">' + o.label + '</button>';
    });
    html += '</div></div>';
    return html;
  }

  function colorGroup(activeVal) {
    var html = '<div class="filter-group"><div class="filter-group-label">Color</div><div class="shop-color-filter">';
    uniqueColors.forEach(function (c) {
      var isActive = activeVal && activeVal.toLowerCase() === c.hex.toLowerCase();
      html += '<button type="button" class="swatch-tile' + (isActive ? ' active' : '') + '" data-key="color" data-val="' + c.hex + '" ' +
        'style="background:' + c.hex + '" title="' + c.names.join(' / ') + '" aria-label="Filter by ' + c.names.join(' / ') + '"></button>';
    });
    html += '</div></div>';
    return html;
  }

  function renderFilters() {
    var html = pillGroup('season', 'Season', SEASONS, state.season, 'season') +
               pillGroup('character', 'Character', CHARACTERS, state.character, 'character') +
               colorGroup(state.color) +
               '<a href="shop.html" class="filter-clear" id="filter-clear-link">Clear filters</a>';
    document.getElementById('filters-desktop').innerHTML = html;
    document.getElementById('filters-mobile').innerHTML = html;
  }

  function productCardHTML(p) {
    var swatches = p.colors.map(function (c) {
      return '<span class="swatch" style="background:' + c.hex + '" title="' + c.name + '"></span>';
    }).join('');
    var waMsg = encodeURIComponent("Hello RAQI, I'd like to ask about the " + p.code + " code.");
    var pageHref = 'product-' + p.slug + '.html';
    return (
      '<div class="store-card">' +
        '<div class="store-img" data-src="' + p.image + '" data-alt="RAQI ' + p.code + '">' +
          '<div class="store-img-fallback"><span class="diamond outline"></span><span>' + p.id + '</span></div>' +
          '<a href="' + pageHref + '" class="store-img-link" aria-label="View ' + p.code + '"></a>' +
          '<button type="button" class="store-quickadd" data-code="' + p.code + '" aria-label="Add ' + p.code + ' to selection">' +
            '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="store-body">' +
          '<h3 class="store-name"><a href="' + pageHref + '" style="color:inherit;">' + p.code + '</a></h3>' +
          '<div class="store-sub">' + p.season + ' — ' + p.tagline + '</div>' +
          '<div class="store-code">' + p.id + ' &middot; ' + p.gsm + ' GSM</div>' +
          '<div class="store-price">Rs. ' + p.price + ' / metre</div>' +
          '<div class="store-swatches">' + swatches + '</div>' +
          '<a href="' + pageHref + '" class="store-ask">View Fabric →</a>' +
          '<a href="https://wa.me/' + PHONE + '?text=' + waMsg + '" target="_blank" rel="noopener noreferrer" class="store-ask" style="display:block;margin-top:8px;">Ask about this code →</a>' +
          '<details class="store-details">' +
            '<summary>Details</summary>' +
            '<div class="store-details-body">' +
              '<p class="code-desc">' + p.desc + '</p>' +
              '<div class="code-specs-inline"><span>Sett ' + p.sett + '</span><span>Drape ' + p.character + '</span></div>' +
              '<div class="code-source">' + p.source + '</div>' +
              '<div class="in-stock">In Stock — Ready to Cut</div>' +
            '</div>' +
          '</details>' +
        '</div>' +
      '</div>'
    );
  }

  function renderGrid() {
    var grid = document.getElementById('shop-grid');
    var filtered = RAQI_PRODUCTS.filter(matches);
    var countEl = document.getElementById('shop-count');
    if (!filtered.length) {
      grid.innerHTML = '<p class="shop-empty">No fabrics match this combination right now. <a href="shop.html" style="color:var(--gold);">Clear filters</a> to see everything.</p>';
    } else {
      grid.innerHTML = filtered.map(productCardHTML).join('');
    }
    if (countEl) countEl.textContent = filtered.length + (filtered.length === 1 ? ' fabric' : ' fabrics');
    applyImageFallback(grid);
    if (window.RaqiCartUI) window.RaqiCartUI.refresh();
  }

  document.addEventListener('click', function (e) {
    var pill = e.target.closest('.filter-pill[data-key]');
    if (pill) {
      var key = pill.getAttribute('data-key');
      var val = pill.getAttribute('data-val');
      state[key] = val || null;
      setParams();
      renderFilters();
      renderGrid();
      return;
    }
    var swatch = e.target.closest('.swatch-tile[data-key]');
    if (swatch) {
      var val2 = swatch.getAttribute('data-val');
      state.color = (state.color === val2) ? null : val2;
      setParams();
      renderFilters();
      renderGrid();
      return;
    }
    if (e.target.id === 'filter-clear-link') {
      e.preventDefault();
      state = { season: null, character: null, color: null };
      setParams();
      renderFilters();
      renderGrid();
    }
  });

  // Mobile filter drawer
  var filtersToggle = document.getElementById('filters-toggle');
  var filterDrawer = document.getElementById('filter-drawer');
  var filterBackdrop = document.getElementById('filter-backdrop');
  var filterDrawerClose = document.getElementById('filter-drawer-close');
  if (filtersToggle && filterDrawer && filterBackdrop) {
    function openFilters() {
      filterDrawer.classList.add('open');
      filterBackdrop.classList.add('visible');
      filterDrawer.setAttribute('aria-hidden', 'false');
      if (filterDrawerClose) filterDrawerClose.focus();
    }
    function closeFilters() {
      filterDrawer.classList.remove('open');
      filterBackdrop.classList.remove('visible');
      filterDrawer.setAttribute('aria-hidden', 'true');
      filtersToggle.focus();
    }
    filtersToggle.addEventListener('click', openFilters);
    if (filterDrawerClose) filterDrawerClose.addEventListener('click', closeFilters);
    filterBackdrop.addEventListener('click', closeFilters);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && filterDrawer.classList.contains('open')) closeFilters();
    });
  }

  renderFilters();
  renderGrid();
})();
