/* ============================================================
   RAQI — Shared form handlers (Formspree). Both are no-ops if
   their form isn't present on the current page.
   ============================================================ */

// ---------- Quote / order form — Formspree submission, WhatsApp fallback on failure ----------
(function () {
  'use strict';
  var FORMSPREE_ID = 'xykardnj';
  var PHONE = '923218230266';
  var form = document.querySelector('form[data-quote-form]');
  if (!form) return;
  var status = document.getElementById('form-status');

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok ? '#8a6d2f' : '#a9432c';
  }

  function waLink(data) {
    var lines = [
      'Hello RAQI, I would like to request the fabric folder.',
      data.name    ? 'Name: ' + data.name : '',
      data.email   ? 'Email: ' + data.email : '',
      data.phone   ? 'Phone: ' + data.phone : '',
      data.code    ? 'Code of interest: ' + data.code : '',
      data.color   ? 'Color: ' + data.color : '',
      data.qty     ? 'Quantity: ' + data.qty + 'm' : '',
      data.message ? 'Message: ' + data.message : ''
    ].filter(Boolean);
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v.toString().trim(); });

    if (!data.name || !data.email) {
      setStatus('Please provide at least your name and email.', false);
      return;
    }

    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus('Sending…', true);

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fd
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        setStatus('Thank you — we will respond within 1 business day.', true);
      } else {
        setStatus('Something went wrong. Opening WhatsApp instead…', false);
        window.open(waLink(data), '_blank', 'noopener');
      }
    }).catch(function () {
      setStatus('Network error. Opening WhatsApp instead…', false);
      window.open(waLink(data), '_blank', 'noopener');
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  });
})();

// ---------- Shade-lot notify signup — email only, same Formspree account, distinct subject ----------
(function () {
  'use strict';
  var FORMSPREE_ID = 'xykardnj';
  var form = document.getElementById('notify-form');
  if (!form) return;
  var status = document.getElementById('notify-status');

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok ? '#4f8a4a' : '#a9432c';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var email = (fd.get('email') || '').toString().trim();
    if (!email) { setStatus('Please enter your email.', false); return; }

    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus('Sending…', true);

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fd
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        setStatus("You're on the list — we'll email you when a new lot opens.", true);
      } else {
        setStatus('Something went wrong. Please try again or message us on WhatsApp.', false);
      }
    }).catch(function () {
      setStatus('Network error. Please try again or message us on WhatsApp.', false);
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  });
})();
