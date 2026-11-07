/* =========================================================
   DEZYNVIA — main.js
   Shared behaviour on every page: mobile menu, services dropdown,
   scroll reveal, footer year, WhatsApp links, social links,
   contact placeholders.
   ========================================================= */
(function () {
  'use strict';

  var cfg = window.DEZYNVIA_CONFIG || {};
  document.documentElement.classList.add('js');

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setMenu(false);
        document.querySelectorAll('.has-dropdown.is-open').forEach(function (d) { closeDropdown(d); });
      }
    });
    // Close menu when a link inside it is clicked
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* ---------- Services dropdown (click / keyboard) ---------- */
  function closeDropdown(item) {
    item.classList.remove('is-open');
    var btn = item.querySelector('.dropdown-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var btn = item.querySelector('.dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (d) {
      if (!d.contains(e.target)) closeDropdown(d);
    });
  });

  /* ---------- Highlight the current page in the nav ---------- */
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
      var parent = a.closest('.has-dropdown');
      if (parent) {
        var t = parent.querySelector('.dropdown-toggle');
        if (t) t.classList.add('active');
      }
    }
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- WhatsApp links ---------- */
  function whatsappConfigured() {
    return /^\d{8,15}$/.test(String(cfg.whatsappNumber || ''));
  }
  function whatsappUrl(extraText) {
    var text = (extraText || cfg.whatsappMessage || '');
    return 'https://wa.me/' + cfg.whatsappNumber + '?text=' + encodeURIComponent(text);
  }
  window.DezynviaWhatsApp = { configured: whatsappConfigured, url: whatsappUrl };

  document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
    if (whatsappConfigured()) {
      a.href = whatsappUrl();
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {
      // Not configured yet: do not open a broken link; explain what to do.
      a.href = 'contact.html';
      a.title = 'WhatsApp is not set up yet. Add your number in js/config.js';
      a.addEventListener('click', function (e) {
        if (!a.hasAttribute('data-wa-noalert')) {
          e.preventDefault();
          alert('WhatsApp is not configured yet.\nOpen js/config.js and set whatsappNumber to your business number.');
        }
      });
    }
  });

  /* ---------- Social links & contact placeholders ---------- */
  document.querySelectorAll('[data-social]').forEach(function (a) {
    var url = (cfg.social || {})[a.getAttribute('data-social')];
    if (url) {
      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.title = 'Link coming soon';
      a.style.opacity = '.55';
      a.style.cursor = 'default';
    }
  });

  document.querySelectorAll('[data-contact]').forEach(function (el) {
    var key = el.getAttribute('data-contact');
    var val = (cfg.contact || {})[key];
    if (!val) return; // keep the visible placeholder text
    el.classList.remove('placeholder');
    if (key === 'email') {
      var a = document.createElement('a');
      a.href = 'mailto:' + val; a.textContent = val;
      el.textContent = ''; el.appendChild(a);
    } else {
      el.textContent = val;
    }
  });

  /* ---------- Pre-select a service from the URL (?service=...) ---------- */
  var params = new URLSearchParams(location.search);
  var svc = params.get('service');
  var select = document.getElementById('service');
  if (svc && select) {
    Array.prototype.forEach.call(select.options, function (o) {
      if (o.value === svc) select.value = svc;
    });
  }
})();
