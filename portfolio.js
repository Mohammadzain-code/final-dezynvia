/* =========================================================
   DEZYNVIA — portfolio.js
   Category filters + project detail modal.
   All projects are DEMO / CONCEPT projects (not real clients).
   To add a project: add an object to PROJECTS and a matching
   card in portfolio.html (or index.html) with data-project="id".
   ========================================================= */
(function () {
  'use strict';

  var PROJECTS = {
    'p-web': {
      title: 'Northwind Studio — Concept Website', brand: 'Northwind Studio (fictional demo brand)',
      category: 'Web Development',
      overview: 'A concept multi-section business website showing how Dezynvia structures a clear, fast, responsive site.',
      objective: 'Present a service business clearly and make it easy to request a quote.',
      challenge: 'Fit a lot of information into a layout that stays simple on small screens.',
      solution: 'A card-based layout, clear calls to action and a mobile-first grid.',
      services: ['Web Development', 'Responsive layouts']
    },
    'p-wp': {
      title: 'Greenleaf Cafe — WordPress Concept', brand: 'Greenleaf Cafe (fictional demo brand)',
      category: 'WordPress',
      overview: 'A concept WordPress site layout for a small local business, built around editable pages.',
      objective: 'Let the owner update menu and event pages without touching code.',
      challenge: 'Keep the design on-brand while staying easy to edit.',
      solution: 'A customised theme with reusable page-builder sections.',
      services: ['WordPress Development', 'Theme customization']
    },
    'p-logo': {
      title: 'Orbit Labs — Logo Concept', brand: 'Orbit Labs (fictional demo brand)',
      category: 'Graphic Design',
      overview: 'A concept logo and mini brand sheet for a fictional tech start-up.',
      objective: 'Create a simple, memorable mark that works at small sizes.',
      challenge: 'Balance a modern look with legibility.',
      solution: 'A geometric mark with a restrained two-colour palette.',
      services: ['Graphic Designing', 'Brand identity']
    },
    'p-social': {
      title: 'Fresh Fit — Social Post Set', brand: 'Fresh Fit (fictional demo brand)',
      category: 'Social Media Design',
      overview: 'A concept set of Instagram posts and story covers sharing one visual style.',
      objective: 'Keep a recurring content series visually consistent.',
      challenge: 'Make posts stand out in a busy feed.',
      solution: 'Bold type, a fixed colour system and reusable templates.',
      services: ['Social Media Post Designing', 'Story and reel covers']
    },
    'p-shop': {
      title: 'Urban Threads — Shopify Listing Sample', brand: 'Urban Threads (fictional demo brand)',
      category: 'Shopify',
      overview: 'A sample of how products can be organised: titles, descriptions, variants and collections.',
      objective: 'Show a clean, consistent product catalogue structure.',
      challenge: 'Keep variant and pricing data tidy across many products.',
      solution: 'A standard listing template applied to every product.',
      services: ['Shopify Product Listing', 'Collections setup']
    },
    'p-web2': {
      title: 'Pixel & Pine — Portfolio Concept', brand: 'Pixel & Pine (fictional demo brand)',
      category: 'Web Development',
      overview: 'A concept portfolio website for a freelance creative.',
      objective: 'Showcase work in a fast, image-friendly layout.',
      challenge: 'Display many images without slowing the page.',
      solution: 'A filterable grid with lazy-loaded media.',
      services: ['Web Development', 'Portfolio websites']
    }
  };

  /* ---------- Filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-category') === f;
        c.classList.toggle('is-hidden', !show);
      });
      var live = document.getElementById('filter-status');
      if (live) {
        var n = document.querySelectorAll('.project-card:not(.is-hidden)').length;
        live.textContent = n + (n === 1 ? ' project shown' : ' projects shown');
      }
    });
  });

  /* ---------- Modal ---------- */
  var modal = document.getElementById('project-modal');
  if (!modal) return;
  var content = modal.querySelector('.modal-content');
  var closeBtn = modal.querySelector('.modal-close');
  var lastFocus = null;

  function row(label, text) {
    var d = document.createElement('div');
    var h = document.createElement('h4'); h.textContent = label;
    var p = document.createElement('p'); p.textContent = text;
    d.appendChild(h); d.appendChild(p);
    return d;
  }

  function openProject(id, thumbHtml) {
    var p = PROJECTS[id];
    if (!p) return;
    lastFocus = document.activeElement;
    content.textContent = '';

    var badge = document.createElement('span'); badge.className = 'badge badge--warn';
    badge.textContent = 'Demo / concept project';
    var h = document.createElement('h2'); h.id = 'modal-title'; h.textContent = p.title;
    var cat = document.createElement('p'); cat.textContent = p.category + ' · ' + p.brand;

    var gallery = document.createElement('div'); gallery.className = 'modal-gallery';
    // Gallery uses the same CSS-drawn preview (no external images needed)
    gallery.innerHTML = thumbHtml + thumbHtml;
    gallery.querySelectorAll('svg').forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });

    var grid = document.createElement('div'); grid.className = 'detail-grid';
    grid.appendChild(row('Overview', p.overview));
    grid.appendChild(row('Objective', p.objective));
    grid.appendChild(row('Challenge', p.challenge));
    grid.appendChild(row('Solution', p.solution));
    grid.appendChild(row('Services used', p.services.join(', ')));
    grid.appendChild(row('Verified results', 'Not applicable: this is a demonstration project, so no real results are claimed.'));

    var cta = document.createElement('a');
    cta.className = 'btn btn-primary';
    // Map the portfolio category to the matching option in the contact form
    var SERVICE_MAP = {
      'Web Development': 'Web Development', 'WordPress': 'WordPress Development',
      'Graphic Design': 'Graphic Designing', 'Social Media Design': 'Social Media Post Designing',
      'Shopify': 'Shopify Product Listing'
    };
    cta.href = 'contact.html?service=' + encodeURIComponent(SERVICE_MAP[p.category] || '');
    cta.textContent = 'Request a similar project';

    content.appendChild(badge); content.appendChild(h); content.appendChild(cat);
    content.appendChild(gallery); content.appendChild(grid);
    var wrap = document.createElement('p'); wrap.style.marginTop = '1.5rem'; wrap.appendChild(cta);
    content.appendChild(wrap);

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeProject() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-project]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.project-card');
      var thumb = card ? card.querySelector('.project-thumb') : null;
      openProject(btn.getAttribute('data-project'), thumb ? thumb.innerHTML : '');
    });
  });
  closeBtn.addEventListener('click', closeProject);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeProject(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeProject();
  });
})();
