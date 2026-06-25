/* common-ui.js — واجهة موحدة لموقع قسم ذوي الإعاقة */
(function () {
  'use strict';

  function initBackTop() {
    var btn = document.querySelector('.mk-backtop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 320);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initMobileNav() {
    var toggle = document.querySelector('.mk-mobile-toggle');
    var nav = document.querySelector('.mk-unified-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) nav.classList.remove('open');
    });
  }

  function initActiveLink() {
    var links = document.querySelectorAll('.mk-nav-links a');
    var current = location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href && href === current) a.classList.add('mk-active');
    });
  }

  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
  }

  function initTabs() {
    var buttons = document.querySelectorAll('[data-tab]');
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(function (s) { s.style.display = 'none'; });
        var active = document.getElementById(target);
        if (active) active.style.display = 'block';
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
    var firstContent = document.querySelector('.tab-content');
    if (firstContent) firstContent.style.display = 'block';
    var firstBtn = document.querySelector('[data-tab]');
    if (firstBtn) firstBtn.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBackTop();
    initMobileNav();
    initActiveLink();
    initFadeIn();
    initTabs();
  });
})();
