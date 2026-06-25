/* ============================================================
   ann-system.js — نظام الإشعارات (شريط ticker)
   يُحمَّل في جميع صفحات الموقع
   ============================================================ */
(function () {
  'use strict';

  var SB_URL = 'https://pyrxwqgapwjwhiskowhk.supabase.co';
  var STORAGE_KEY = 'ann_closed';

  var icons  = { default: '📢', news: '📰', alert: '🔔', important: '⚠️' };
  var labels = { default: 'إشعار', news: 'أخبار', alert: 'تنبيه', important: 'مهم' };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatExpiry(expiresAt) {
    var diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return 'ينتهي قريباً';
    var days = Math.floor(diff / 86400000);
    var hrs  = Math.floor((diff % 86400000) / 3600000);
    return days > 0 ? ('⏱ ' + days + ' يوم') : hrs > 0 ? ('⏱ ' + hrs + ' ساعة') : '⏱ ينتهي قريباً';
  }

  function startScroll(bar, txt) {
    var pos = bar.offsetWidth;
    var paused = false;
    txt.addEventListener('mouseenter', function () { paused = true; });
    txt.addEventListener('mouseleave', function () { paused = false; });
    txt.addEventListener('touchstart', function () { paused = !paused; }, { passive: true });
    function tick() {
      if (!paused) {
        pos -= 1.0;
        var textW  = txt.offsetWidth;
        var trackW = bar.offsetWidth;
        if (Math.abs(pos) > textW + trackW) pos = trackW;
        txt.style.transform = 'translateX(' + pos + 'px)';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function loadAnnouncement() {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      var bar = document.getElementById('ann-ticker-bar');
      if (!bar) return;

      var res = await fetch(SB_URL + '/storage/v1/object/public/reports/site-announcement.json?t=' + Date.now());
      if (!res.ok) return;
      var d = await res.json();
      if (!d || !d.enabled || !d.message) return;
      if (d.expiresAt && new Date(d.expiresAt) < new Date()) return;

      var t = d.type || 'default';
      var biEl = document.getElementById('ann-b-icon');
      var blEl = document.getElementById('ann-b-lbl');
      if (biEl) biEl.textContent = icons[t]  || '📢';
      if (blEl) blEl.textContent = labels[t] || 'إشعار';

      var link = d.link
        ? ' <a style="color:#3F2E63;text-decoration:none;background:rgba(0,0,0,.1);padding:2px 10px;border-radius:8px;font-size:.76rem;" href="' + esc(d.link) + '" target="_blank" rel="noopener">← المزيد</a>'
        : '';
      var txt = document.getElementById('ann-scroll-txt');
      if (txt) txt.innerHTML = esc(d.message) + link;

      if (d.expiresAt) {
        var expEl = document.getElementById('ann-exp-col');
        if (expEl) expEl.textContent = formatExpiry(d.expiresAt);
      }

      bar.style.display = 'block';
      if (txt) startScroll(bar, txt);

    } catch (e) { /* صامت */ }
  }

  /* ── إغلاق الشريط ── */
  window.annClose = function () {
    var bar = document.getElementById('ann-ticker-bar');
    if (bar) bar.style.display = 'none';
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  };

  /* ── تشغيل بعد تحميل DOM ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnnouncement);
  } else {
    loadAnnouncement();
  }

})();
