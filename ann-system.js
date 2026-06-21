// ===================================================
// ann-system.js — نظام الإشعارات الموحّد v3
// ===================================================
(function(w) {
  var SB  = "https://pyrxwqgapwjwhiskowhk.supabase.co";
  var KEY = "sb_publishable_bfe-B4f-Rag1SR0-PoIb9w_nMfA1Ere";

  // مسارات التخزين
  var PATHS = {
    log:       "reports/announcements.json",       // السجل الرئيسي (كل الإشعارات)
    site:      "reports/site-announcement.json",    // الصفحة الرئيسية
    teachers:  "reports/teachers-ann.json",         // المعلمون
    principal: "reports/principal-ann.json",        // المدير
    dumaj_sup: "reports/dumaj-supervisor-ann.json", // مشرف الدمج
    yaseer_sup:"reports/yaseer-supervisor-ann.json",// مشرف يسير
    students:  "reports/students-ann.json"          // الطلاب (مستقبلاً)
  };

  // ===== Supabase helpers =====
  function sbGet(p) {
    return fetch(SB + "/storage/v1/object/public/" + p + "?t=" + Date.now())
      .then(function(r) { return r.ok ? r.json() : null; })
      .catch(function() { return null; });
  }
  function sbSet(p, d) {
    return fetch(SB + "/storage/v1/object/" + p, {
      method: "POST",
      headers: {
        apikey: KEY, Authorization: "Bearer " + KEY,
        "Content-Type": "application/json", "x-upsert": "true"
      },
      body: new Blob([JSON.stringify(d)], { type: "application/json" })
    }).then(function(r) { return r.ok; }).catch(function() { return false; });
  }
  function gv(id) { var e = document.getElementById(id); return e ? (e.value || "") : ""; }
  function gcb(id) { var e = document.getElementById(id); return e ? e.checked : true; }
  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ===== الحصول على المسارات حسب الوجهة =====
  function getTargetPaths(target, prog) {
    var paths = [];
    switch(target) {
      case "site":       paths = [PATHS.site]; break;
      case "teachers":
        // فلترة حسب البرنامج
        if(prog === "dumaj")   paths = [PATHS.teachers]; // سيتم فلترة في العرض
        else if(prog === "yaseer") paths = [PATHS.teachers];
        else paths = [PATHS.teachers]; // both
        break;
      case "principal":  paths = [PATHS.principal]; break;
      case "dumaj_sup":  paths = [PATHS.dumaj_sup]; break;
      case "yaseer_sup": paths = [PATHS.yaseer_sup]; break;
      case "site_teachers": paths = [PATHS.site, PATHS.teachers]; break;
      case "site_teachers_students": paths = [PATHS.site, PATHS.teachers, PATHS.students]; break;
      case "teachers_site": paths = [PATHS.teachers, PATHS.site]; break;
      case "all_admin":  paths = [PATHS.principal, PATHS.dumaj_sup, PATHS.yaseer_sup]; break;
      default:           paths = [PATHS.teachers]; break;
    }
    return paths;
  }

  // ===== إرسال إشعار =====
  w.annSend = function(sender, roleTargets) {
    var msg    = gv("ann-msg-g").trim();
    var link   = gv("ann-link-g").trim();
    var type   = gv("ann-type-g")    || "default";
    var target = gv("ann-target-g")  || "teachers";
    var prog   = gv("ann-prog-g")    || "both";
    var dur    = parseInt(gv("ann-dur-g") || "0");
    var en     = gcb("ann-en-g");
    var resEl  = document.getElementById("ann-res");

    if (!msg) {
      if (resEl) { resEl.style.color = "#dc2626"; resEl.textContent = "⚠️ اكتب نص الإشعار أولاً"; }
      return;
    }

    var exp  = dur > 0 ? new Date(Date.now() + dur * 86400000).toISOString() : null;
    var item = {
      id: Date.now(),
      enabled: en,
      message: msg, link: link, type: type,
      target: target, program: prog,
      expiresAt: exp,
      sentAt: new Date().toISOString(),
      sentBy: sender || "إدارة"
    };

    // 1. أضف للسجل الرئيسي
    sbGet(PATHS.log).then(function(all) {
      if (!Array.isArray(all)) all = [];
      all.unshift(item);
      return sbSet(PATHS.log, all);
    }).then(function() {
      // 2. أرسل للمسارات المحددة
      var paths = getTargetPaths(target, prog);
      var promises = paths.map(function(p) {
        // للصفحة الرئيسية نرسل object مباشر
        if (p === PATHS.site) {
          return sbSet(p, {
            enabled: en, message: msg, link: link, type: type,
            expiresAt: exp, sentAt: item.sentAt, sentBy: item.sentBy
          });
        }
        // للبقية نضيف للمصفوفة
        return sbGet(p).then(function(arr) {
          if (!Array.isArray(arr)) arr = [];
          arr.unshift(item);
          return sbSet(p, arr);
        });
      });
      return Promise.all(promises);
    }).then(function(results) {
      var ok = results && results.some(function(r) { return r; });
      if (resEl) {
        resEl.style.color = ok ? "#16a34a" : "#dc2626";
        var labels = {
          site: "الصفحة الرئيسية", teachers: "بوابة المعلمين",
          principal: "لوحة المدير", dumaj_sup: "مشرف الدمج",
          yaseer_sup: "مشرف يسير", site_teachers: "الرئيسية والمعلمين",
          site_teachers_students: "الرئيسية والمعلمين والطلاب",
          all_admin: "جميع المشرفين"
        };
        resEl.textContent = ok
          ? ("✅ تم الإرسال إلى " + (labels[target] || target))
          : "⚠️ تعذر الإرسال، تحقق من الاتصال";
      }
      if (ok) {
        var m = document.getElementById("ann-msg-g");
        if (m) m.value = "";
        setTimeout(function() { if (resEl) resEl.textContent = ""; }, 4000);
        if (w.annLoadLog) w.annLoadLog();
      }
    });
  };

  // ===== تعطيل إشعار الصفحة الرئيسية =====
  w.annDisable = function() {
    if (!confirm("تعطيل إشعار الصفحة الرئيسية فوراً؟")) return;
    sbGet(PATHS.site).then(function(d) {
      d = d || {};
      d.enabled = false;
      d.disabledAt = new Date().toISOString();
      return sbSet(PATHS.site, d);
    }).then(function(ok) {
      var r = document.getElementById("ann-res");
      if (r) { r.style.color = ok ? "#16a34a" : "#dc2626"; r.textContent = ok ? "✅ تم التعطيل" : "⚠️ تعذر"; }
    });
  };

  // ===== سجل الإشعارات العام (للمشرفين الإداريين) =====
  w.annLoadLog = function(canDelete) {
    var sec = document.getElementById("ann-log-section");
    var lst = document.getElementById("ann-log-items");
    if (!sec || !lst) return;
    sec.style.display = "block";
    sbGet(PATHS.log).then(function(all) {
      if (!Array.isArray(all) || !all.length) {
        lst.innerHTML = '<div class="ann-log-empty">لا توجد إشعارات مرسلة بعد</div>';
        return;
      }
      var icons  = { default: "📢", news: "📰", alert: "🔔", important: "⚠️" };
      var labels = {
        site: "الصفحة الرئيسية", teachers: "المعلمون",
        principal: "مدير المدرسة", dumaj_sup: "مشرف الدمج",
        yaseer_sup: "مشرف يسير", site_teachers: "الرئيسية + المعلمين",
        site_teachers_students: "الرئيسية + المعلمين + الطلاب",
        all_admin: "جميع المشرفين", both: "الكل"
      };
      lst.innerHTML = all.map(function(a) {
        var dt = "";
        try { dt = new Date(a.sentAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch(e) {}
        var st = a.enabled ? (a.expiresAt && new Date(a.expiresAt) < new Date() ? "⏰ منتهي" : "🟢 نشط") : "🔴 معطّل";
        var delBtn = canDelete
          ? '<button class="ann-log-del" onclick="annDelLog(' + a.id + ')">🗑️ حذف</button>'
          : "";
        return '<div class="ann-log-item">' + delBtn +
          '<div class="ann-log-msg">' + (icons[a.type] || "📢") + " " + esc(a.message) + "</div>" +
          '<div class="ann-log-meta">📅 ' + dt + " | 👤 " + esc(a.sentBy) + " | 🎯 " +
            (labels[a.target] || a.target) + " | " + st + "</div>" +
          "</div>";
      }).join("");
    });
  };

  // ===== حذف من السجل (مشرف يسير فقط — ويطبق على الجميع) =====
  w.annDelLog = function(id) {
    if (!confirm("حذف هذا الإشعار من السجل لجميع المشرفين؟")) return;
    sbGet(PATHS.log).then(function(all) {
      if (!Array.isArray(all)) return;
      return sbSet(PATHS.log, all.filter(function(a) { return String(a.id) !== String(id); }));
    }).then(function() { if (w.annLoadLog) w.annLoadLog(true); });
  };

  // ===== عرض إشعار خاص بالمدير =====
  w.loadPrincipalAnnouncements = function() {
    sbGet(PATHS.principal).then(function(all) {
      if (!Array.isArray(all)) return;
      var now = new Date();
      var rel = all.filter(function(a) {
        return a.enabled && a.message && !(a.expiresAt && new Date(a.expiresAt) < now);
      });
      if (!rel.length) return;
      var icons = { default: "📢", news: "📰", alert: "🔔", important: "⚠️" };
      var html = rel.map(function(a) {
        var dt = "";
        try { dt = new Date(a.sentAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); } catch(e) {}
        return '<div class="t-ann-box">' +
          '<div class="t-ann-icon">' + (icons[a.type] || "📢") + "</div>" +
          '<div class="t-ann-body">' +
            '<div class="t-ann-msg">' + esc(a.message) + "</div>" +
            '<div class="t-ann-meta">📅 ' + dt + (a.sentBy ? " — من: " + esc(a.sentBy) : "") + "</div>" +
            (a.link ? '<a class="t-ann-link" href="' + a.link + '" target="_blank">← المزيد</a>' : "") +
          "</div></div>";
      }).join("");
      // أضف الإشعارات في أعلى الصفحة
      var container = document.getElementById("principal-ann-container");
      if (container) { container.style.display = "block"; container.innerHTML = html; }
    });
  };

  // ===== عرض إشعار مشرف الدمج =====
  w.loadDumajSupAnnouncements = function() {
    sbGet(PATHS.dumaj_sup).then(function(all) {
      _renderSupAnn(all, "dumaj-sup-ann-container");
    });
  };

  // ===== عرض إشعار مشرف يسير =====
  w.loadYaseerSupAnnouncements = function() {
    sbGet(PATHS.yaseer_sup).then(function(all) {
      _renderSupAnn(all, "yaseer-sup-ann-container");
    });
  };

  function _renderSupAnn(all, containerId) {
    if (!Array.isArray(all)) return;
    var now = new Date();
    var rel = all.filter(function(a) {
      return a.enabled && a.message && !(a.expiresAt && new Date(a.expiresAt) < now);
    });
    if (!rel.length) return;
    var icons = { default: "📢", news: "📰", alert: "🔔", important: "⚠️" };
    var html = rel.map(function(a) {
      var dt = "";
      try { dt = new Date(a.sentAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); } catch(e) {}
      return '<div class="t-ann-box">' +
        '<div class="t-ann-icon">' + (icons[a.type] || "📢") + "</div>" +
        '<div class="t-ann-body">' +
          '<div class="t-ann-msg">' + esc(a.message) + "</div>" +
          '<div class="t-ann-meta">📅 ' + dt + (a.sentBy ? " — من: " + esc(a.sentBy) : "") + "</div>" +
          (a.link ? '<a class="t-ann-link" href="' + a.link + '" target="_blank">← المزيد</a>' : "") +
        "</div></div>";
    }).join("");
    var container = document.getElementById(containerId);
    if (container) { container.style.display = "block"; container.innerHTML = html; }
  }

  // ===== عرض إشعارات المعلمين =====
  w.loadTeacherAnnouncements = function() {
    var prog = w.currentTeacher && w.currentTeacher.program;
    sbGet(PATHS.teachers).then(function(all) {
      if (!Array.isArray(all)) return;
      var now = new Date();
      var rel = all.filter(function(a) {
        if (!a.enabled || !a.message) return false;
        if (a.expiresAt && new Date(a.expiresAt) < now) return false;
        if (prog && a.program && a.program !== "both" && a.program !== prog) return false;
        return true;
      });
      if (!rel.length) return;
      var icons = { default: "📢", news: "📰", alert: "🔔", important: "⚠️" };
      var html = rel.map(function(a) {
        var dt = "";
        try { dt = new Date(a.sentAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); } catch(e) {}
        return '<div class="t-ann-box">' +
          '<div class="t-ann-icon">' + (icons[a.type] || "📢") + "</div>" +
          '<div class="t-ann-body">' +
            '<div class="t-ann-msg">' + esc(a.message) + "</div>" +
            '<div class="t-ann-meta">📅 ' + dt + (a.sentBy ? " — من: " + esc(a.sentBy) : "") + "</div>" +
            (a.link ? '<a class="t-ann-link" href="' + a.link + '" target="_blank">← المزيد</a>' : "") +
          "</div></div>";
      }).join("");
      var el = document.getElementById("meetings-log");
      if (el) {
        el.style.display = "block";
        el.innerHTML = '<div class="meetings-log-head">📢 إشعارات (' + rel.length + ")</div>" + html + (el.innerHTML || "");
      }
    });
  };

  // ===== سجل إشعارات المشرفين الإداريين =====
  w.annLoadSupLog = function(canDelete) {
    var sec = document.getElementById("ann-log-section");
    var lst = document.getElementById("ann-log-items");
    if (!sec || !lst) return;
    sec.style.display = "block";
    sbGet(PATHS.log).then(function(all) {
      if (!Array.isArray(all) || !all.length) {
        lst.innerHTML = '<div class="ann-log-empty">لا توجد إشعارات في السجل</div>';
        return;
      }
      var icons  = { default: "📢", news: "📰", alert: "🔔", important: "⚠️" };
      var labels = {
        site: "الصفحة الرئيسية", teachers: "المعلمون",
        principal: "مدير المدرسة", dumaj_sup: "مشرف الدمج",
        yaseer_sup: "مشرف يسير", site_teachers: "الرئيسية + المعلمين",
        site_teachers_students: "الرئيسية + المعلمين + الطلاب",
        all_admin: "جميع المشرفين"
      };
      lst.innerHTML = all.map(function(a) {
        var dt = "";
        try { dt = new Date(a.sentAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch(e) {}
        var st = a.enabled ? (a.expiresAt && new Date(a.expiresAt) < new Date() ? "⏰ منتهي" : "🟢 نشط") : "🔴 معطّل";
        var delBtn = canDelete
          ? '<button class="ann-log-del" onclick="annSupDelLog(' + a.id + ')">🗑️ حذف</button>'
          : "";
        return '<div class="ann-log-item">' + delBtn +
          '<div class="ann-log-msg">' + (icons[a.type] || "📢") + " " + esc(a.message) + "</div>" +
          '<div class="ann-log-meta">📅 ' + dt + " | 👤 " + esc(a.sentBy) + " | 🎯 " +
            (labels[a.target] || a.target) + " | " + st + "</div>" +
          "</div>";
      }).join("");
    });
  };

  // حذف من سجل المشرفين (مشرف يسير فقط يملك الصلاحية — يحذف من السجل الموحّد)
  w.annSupDelLog = function(id) {
    if (!confirm("حذف هذا الإشعار من سجل جميع المشرفين؟")) return;
    sbGet(PATHS.log).then(function(all) {
      if (!Array.isArray(all)) return null;
      return sbSet(PATHS.log, all.filter(function(a) { return String(a.id) !== String(id); }));
    }).then(function() {
      if (w.annLoadSupLog) w.annLoadSupLog(true);
    });
  };

})(window);
