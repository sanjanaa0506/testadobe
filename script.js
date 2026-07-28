/**
 * Picasoo & Threads — SPA script
 * Hash-based routing between views, gallery rendering/filtering,
 * mobile nav, contact form handling, and the stitch-line reveal animation.
 */
(function () {
  'use strict';

  var ROUTES = ['home', 'about', 'gallery', 'process', 'contact'];
  var DEFAULT_ROUTE = 'home';

  var appViews = {};
  ROUTES.forEach(function (route) {
    appViews[route] = document.getElementById('view-' + route);
  });

  var navLinks = document.querySelectorAll('.nav-link, [data-route].logo, [data-route].nav-cta');

  /* ---------------------------------------------------------
     ROUTING
  --------------------------------------------------------- */
  function getRouteFromHash() {
    var hash = window.location.hash.replace('#', '');
    return ROUTES.indexOf(hash) !== -1 ? hash : DEFAULT_ROUTE;
  }

  function renderRoute(route) {
    ROUTES.forEach(function (r) {
      var view = appViews[r];
      if (!view) return;
      if (r === route) {
        view.hidden = false;
      } else {
        view.hidden = true;
      }
    });

    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', isMatch);
      if (link.classList.contains('nav-link')) {
        if (isMatch) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    });

    document.title = route === 'home'
      ? 'Picasoo & Threads — Handmade & Printed Art'
      : 'Picasoo & Threads — ' + route.charAt(0).toUpperCase() + route.slice(1);

    window.scrollTo({ top: 0, behavior: 'auto' });
    closeMobileNav();

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('spa_route_view', { route: route });
    }

    // re-run stitch reveal for the newly visible view
    observeStitchPaths();
  }

  function show(route) {
    if (ROUTES.indexOf(route) === -1) route = DEFAULT_ROUTE;
    if (window.location.hash !== '#' + route) {
      window.location.hash = route;
    } else {
      renderRoute(route);
    }
  }
  window.show = show; // preserved global entry point from the original inline script

  window.addEventListener('hashchange', function () {
    renderRoute(getRouteFromHash());
  });

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-route]');
    if (!target) return;
    e.preventDefault();
    show(target.getAttribute('data-route'));
  });

  /* ---------------------------------------------------------
     MOBILE NAV
  --------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---------------------------------------------------------
     GALLERY DATA + RENDER + FILTER
  --------------------------------------------------------- */
  var GALLERY_ITEMS = [
    { title: 'Morning Light Portrait', category: 'portrait', tag: 'Oil on canvas · 16×20"', price: '$480', gradient: ['#d9c2a3', '#b5384a33'] },
    { title: 'Quiet Hands', category: 'portrait', tag: 'Gouache · 12×16"', price: '$310', gradient: ['#e4dbc6', '#c99a3d44'] },
    { title: 'Grandmother\'s Border', category: 'textile', tag: 'Embroidery on linen · 18×18"', price: '$560', gradient: ['#c99a3d33', '#2e686333'] },
    { title: 'Woven Horizon', category: 'textile', tag: 'Appliqué & thread · 20×24"', price: '$620', gradient: ['#2e686333', '#b5384a22'] },
    { title: 'Field Study No.3', category: 'print', tag: 'Giclée print, ed. of 50 · 11×14"', price: '$85', gradient: ['#21201d1a', '#c99a3d44'] },
    { title: 'Thread & Ash', category: 'textile', tag: 'Hand-dyed thread on canvas · 24×24"', price: '$710', gradient: ['#b5384a33', '#21201d22'] },
    { title: 'Late Summer Portrait', category: 'portrait', tag: 'Oil on canvas · 20×24"', price: '$540', gradient: ['#d9c2a3', '#2e686322'] },
    { title: 'Origin Line', category: 'print', tag: 'Giclée print, ed. of 30 · 16×20"', price: '$120', gradient: ['#c99a3d22', '#b5384a33'] },
    { title: 'The Long Stitch', category: 'textile', tag: 'Embroidery on raw canvas · 30×30"', price: '$890', gradient: ['#2e686344', '#c99a3d33'] }
  ];

  var galleryGrid = document.getElementById('galleryGrid');
  var filterBar = document.querySelector('.filter-bar');

  function galleryCardMarkup(item) {
    return (
      '<article class="gallery-card" data-category="' + item.category + '">' +
        '<div class="gallery-thumb" style="background:linear-gradient(135deg,' + item.gradient[0] + ',' + item.gradient[1] + ')"></div>' +
        '<div class="gallery-card-body">' +
          '<h3>' + item.title + '</h3>' +
          '<span class="gallery-tag">' + item.tag + '</span>' +
          '<div class="gallery-price">' + item.price + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = GALLERY_ITEMS.map(galleryCardMarkup).join('');
  }

  function applyFilter(filter) {
    if (!galleryGrid) return;
    var cards = galleryGrid.querySelectorAll('.gallery-card');
    cards.forEach(function (card) {
      var match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.hidden = !match;
    });
  }

  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  }

  renderGallery();

  /* ---------------------------------------------------------
     CONTACT FORM
  --------------------------------------------------------- */
 var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('#cf-name');
      var email = contactForm.querySelector('#cf-email');
      var message = contactForm.querySelector('#cf-message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formStatus.textContent = 'Please fill in your name, email, and a short message.';
        formStatus.classList.add('is-error');
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        formStatus.textContent = 'That email address doesn\'t look right — mind checking it?';
        formStatus.classList.add('is-error');
        return;
      }

      formStatus.classList.remove('is-error');
      formStatus.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] + ' — we\'ll reply within two business days.';

      if (typeof window.trackEvent === 'function') {
        window.trackEvent('contact_form_submit', { medium: contactForm.querySelector('#cf-medium').value });
      }

      contactForm.reset();
    });
  }

/*
  var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');

if (contactForm) {

  /* =======================================================================
     FIELD-LEVEL ENGAGEMENT TRACKING (new)
     Attaches focus/blur listeners to every field in the form. Tracks how
     long a visitor spends in each field and whether they left it filled in
     or empty. Sends directly via alloy("sendEvent") — no dependency on any
     data-layer helper function.
     ======================================================================= */
  /*
  window._fieldFocusTs = window._fieldFocusTs || {};

  var trackableFields = contactForm.querySelectorAll('input[name], select[name], textarea[name]');

  trackableFields.forEach(function (field) {
    field.addEventListener('focus', function (e) {
      window._fieldFocusTs[e.target.name] = Date.now();
    });

    field.addEventListener('blur', function (e) {
      var fieldName = e.target.name; // "name" | "email" | "medium" | "message"
      var startTs = window._fieldFocusTs[fieldName] || Date.now();
      var timeSpent = Date.now() - startTs;
      var value = e.target.value;
      var isEmpty = !value || value.trim() === '';

      // Only fieldName + completionStatus + timing are sent — never the
      // actual typed value (name, email, or message text never leave the
      // browser in this payload).
      if (typeof window.alloy === 'function') {
        window.alloy('sendEvent', {
          xdm: {
            eventType: 'web.formFilledOut',
            _accenture_partner: {
              formId: 'contactForm',
              fieldName: fieldName,
              timeOnFieldMs: timeSpent,
              completionStatus: isEmpty ? 'abandoned' : 'completed'
            }
          }
        });
      }
    });
  });

  /* =======================================================================
     EXISTING SUBMIT HANDLER (unchanged logic, tracking call added at the
     success point only — validation/error paths are untouched)
     ======================================================================= */
  /*
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = contactForm.querySelector('#cf-name');
    var email = contactForm.querySelector('#cf-email');
    var message = contactForm.querySelector('#cf-message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      formStatus.textContent = 'Please fill in your name, email, and a short message.';
      formStatus.classList.add('is-error');
      return;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      formStatus.textContent = 'That email address doesn\'t look right — mind checking it?';
      formStatus.classList.add('is-error');
      return;
    }

    formStatus.classList.remove('is-error');
    formStatus.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] + ' — we\'ll reply within two business days.';

    // Existing call — left as-is
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('contact_form_submit', { medium: contactForm.querySelector('#cf-medium').value });
    }

    // New — fires the XDM form-completion event directly via alloy
    if (typeof window.alloy === 'function') {
      window.alloy('sendEvent', {
        xdm: {
          eventType: 'web.formSubmission',
          _accenture_partner: {
            formId: 'contactForm',
            completionStatus: 'completed'
          }
        }
      });
    }

    contactForm.reset();
  });
}

*/



  
  /* ---------------------------------------------------------
     STITCH-LINE REVEAL (signature motif)
  --------------------------------------------------------- */
  var stitchObserver = null;

  function observeStitchPaths() {
    var paths = document.querySelectorAll('.view:not([hidden]) .stitch-path, .site-footer .stitch-path, .hero .stitch-path');

    if (!('IntersectionObserver' in window)) {
      paths.forEach(function (p) { p.classList.add('is-drawn'); });
      return;
    }

    if (stitchObserver) stitchObserver.disconnect();

    stitchObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
        }
      });
    }, { threshold: 0.3 });

    paths.forEach(function (p) { stitchObserver.observe(p); });
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  renderRoute(getRouteFromHash());
})();
