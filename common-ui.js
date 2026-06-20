/* ============================================================
   واجهة موحدة لموقع قسم ذوي الإعاقة - إضافات غير مدمرة
   ============================================================ */
:root{
  --mk-primary:#3F2E63;
  --mk-primary-2:#6B4C9A;
  --mk-accent:#D7A24A;
  --mk-bg:#F7F5FC;
  --mk-card:#FFFFFF;
  --mk-border:#DCD2EE;
  --mk-text:#221335;
  --mk-muted:#6E5F82;
  --mk-shadow:0 14px 38px rgba(63,46,99,.14);
  --mk-radius:18px;
}
html{scroll-behavior:smooth;}
body{padding-bottom:74px;}
.mk-unified-nav{position:sticky;top:0;z-index:9999;background:rgba(255,255,255,.92);border-bottom:1px solid var(--mk-border);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 8px 24px rgba(63,46,99,.08);font-family:'Cairo','Tajawal',Arial,sans-serif;direction:rtl;}
.mk-nav-inner{max-width:1180px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;}
.mk-nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--mk-text);font-weight:900;white-space:nowrap;}
.mk-nav-brand img{width:38px;height:38px;object-fit:contain;border-radius:10px;background:#fff;box-shadow:0 6px 16px rgba(63,46,99,.12);}
.mk-nav-brand small{display:block;color:var(--mk-muted);font-size:.68rem;font-weight:700;margin-top:1px;}
.mk-nav-links{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end;}
.mk-nav-links a{display:inline-flex;align-items:center;gap:5px;padding:8px 11px;border-radius:999px;color:var(--mk-primary);text-decoration:none;font-size:.82rem;font-weight:800;border:1px solid transparent;transition:.18s ease;background:transparent;}
.mk-nav-links a:hover{background:#F2ECFA;border-color:var(--mk-border);transform:translateY(-1px);}
.mk-nav-links a.mk-active{background:linear-gradient(135deg,var(--mk-primary),var(--mk-primary-2));color:#fff;box-shadow:0 8px 18px rgba(63,46,99,.20);}
.mk-mobile-toggle{display:none;border:1px solid var(--mk-border);background:#fff;color:var(--mk-primary);border-radius:12px;padding:8px 10px;font-weight:900;cursor:pointer;}
.mk-backtop{position:fixed;left:18px;bottom:18px;z-index:9998;width:48px;height:48px;border-radius:999px;border:0;background:linear-gradient(135deg,var(--mk-primary),var(--mk-primary-2));color:#fff;font-weight:900;font-size:1.05rem;box-shadow:0 12px 28px rgba(63,46,99,.26);cursor:pointer;opacity:0;pointer-events:none;transform:translateY(10px);transition:.2s ease;}
.mk-backtop.show{opacity:1;pointer-events:auto;transform:translateY(0);}
.mk-quick-files{position:fixed;right:18px;bottom:18px;z-index:9997;display:flex;flex-direction:column;gap:8px;}
.mk-quick-files a{display:flex;align-items:center;gap:7px;padding:10px 14px;border-radius:999px;text-decoration:none;color:#fff;background:linear-gradient(135deg,#8B6ABF,#6B4C9A);box-shadow:0 10px 24px rgba(63,46,99,.24);font-weight:900;font-size:.82rem;}
.mk-quick-files a:nth-child(2){background:linear-gradient(135deg,#D7A24A,#B98222);}
.mk-quick-files a:nth-child(3){background:linear-gradient(135deg,#129E7C,#0F766E);}
.mk-system-note{border:1px solid var(--mk-border);background:linear-gradient(135deg,#fff,#FBFAFE);border-radius:var(--mk-radius);padding:14px 16px;box-shadow:var(--mk-shadow);color:var(--mk-text);}
@media(max-width:860px){
  body{padding-bottom:96px;}
  .mk-nav-inner{align-items:flex-start;}
  .mk-mobile-toggle{display:inline-flex;align-items:center;gap:6px;}
  .mk-nav-links{display:none;width:100%;padding-top:10px;}
  .mk-unified-nav.open .mk-nav-inner{flex-wrap:wrap;}
  .mk-unified-nav.open .mk-nav-links{display:flex;justify-content:stretch;}
  .mk-nav-links a{flex:1 1 145px;justify-content:center;background:#F8F5FC;border-color:var(--mk-border);}
  .mk-quick-files{right:10px;bottom:10px;left:70px;flex-direction:row;overflow:auto;}
  .mk-quick-files a{white-space:nowrap;font-size:.76rem;padding:9px 11px;}
  .mk-backtop{left:10px;bottom:10px;width:44px;height:44px;}
}
@media print{.mk-unified-nav,.mk-backtop,.mk-quick-files{display:none!important;}body{padding-bottom:0!important;}}
