:root{
  /* ✅ Official palette: Navy + MOE green */
  --bg0:#071322;
  --bg1:#0b1f35;

  --card:rgba(255,255,255,.08);
  --card2:rgba(255,255,255,.06);
  --stroke:rgba(255,255,255,.14);

  --text:#EAF0FF;
  --muted:rgba(234,240,255,.72);
  --muted2:rgba(234,240,255,.55);

  /* ✅ Primary (MOE green feel) */
  --primary:#0ea37f;
  --primary2:#0d8f6f;

  /* ✅ Background orbs */
  --accentA: rgba(14,163,127,.28);
  --accentB: rgba(14,163,127,.14);

  --good:#2EE59D;
  --shadow: 0 18px 50px rgba(0,0,0,.35);
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family:"Tajawal",system-ui,-apple-system,Segoe UI,Arial,sans-serif;
  color:var(--text);
  background:
    radial-gradient(1200px 700px at 20% 20%, var(--accentA), transparent 60%),
    radial-gradient(1000px 600px at 80% 25%, var(--accentB), transparent 60%),
    linear-gradient(180deg, var(--bg0), var(--bg1));
  overflow-x:hidden;
}

/* ===== ✅ شريط الأخبار العاجلة (تنسيق متوافق مع تصميمك) ===== */
.news-ticker-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0;
  overflow: hidden;
  direction: rtl;
  z-index: 40;
}

.ticker-label {
  background: var(--primary); /* يستخدم لون الوزارة الأخضر */
  color: white;
  padding: 12px 24px;
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
  z-index: 2;
  position: relative;
  box-shadow: 10px 0 20px rgba(0,0,0,0.2);
}

.ticker-label::after {
  content: "";
  position: absolute;
  left: -14px;
  top: 0;
  border-width: 22px 0 22px 14px;
  border-style: solid;
  border-color: transparent transparent transparent var(--primary);
}

.ticker-content {
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  padding-right: 20px;
}

.ticker-content marquee {
  margin-top: 4px;
}

/* ========================================================== */

.container{
  width:min(1100px, 92vw);
  margin-inline:auto;
}

.bg-orb{
  position:fixed;
  inset:auto;
  width:520px; height:520px;
  border-radius:50%;
  filter: blur(60px);
  opacity:.45;
  pointer-events:none;
  z-index:-1;
}
.orb1{ top:-180px; right:-140px; background:rgba(14,163,127,.30); }
.orb2{ bottom:-220px; left:-180px; background:rgba(14,163,127,.22); }

/* Topbar */
.topbar{
  position:sticky;
  top:0;
  z-index:50;
  background:rgba(7,19,34,.55);
  backdrop-filter: blur(14px);
  border-bottom:1px solid rgba(255,255,255,.08);
}

.topbar-inner{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 0;
  gap:14px;
  padding-left:110px;
}

.moe-logo{
  position:absolute;
  left:28px;
  top:50%;
  transform:translateY(-50%);
  display:flex;
  align-items:center;
  z-index:5;
  opacity:.9;
  text-decoration:none;
}
.moe-logo img{
  height:52px;
  filter: brightness(0) invert(1) drop-shadow(0 6px 14px rgba(0,0,0,.35));
  transition:.25s ease;
}
.moe-logo:hover img{
  transform: scale(1.05);
  opacity:1;
}

@media (max-width: 768px){
  .topbar-inner{ padding-left:72px; }
  .moe-logo{ left:14px; }
  .moe-logo img{ height:40px; }
}

.brand{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:280px;
}
.brand-logo{
  width:48px; height:48px;
  border-radius:14px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  display:grid;
  place-items:center;
  overflow:hidden;
}
.brand-logo img{
  width:100%;
  height:100%;
  object-fit:contain;
  background:#fff;
}
.brand-title{ font-weight:800; letter-spacing:.2px; }
.brand-sub{ color:var(--muted2); font-weight:500; font-size:.92rem; }

.nav{
  display:flex;
  gap:8px;
  align-items:center;
}
.nav-link{
  color:var(--muted);
  text-decoration:none;
  padding:10px 12px;
  border-radius:12px;
  border:1px solid transparent;
  transition:.2s;
}
.nav-link:hover{
  color:var(--text);
  background:rgba(255,255,255,.06);
  border-color:rgba(255,255,255,.10);
}

/* Hero */
.hero{ padding:34px 0 22px; }
.hero-inner{
  display:grid;
  grid-template-columns: 1.12fr .88fr;
  gap:22px;
  align-items:start;
}
.badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-radius:999px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  color:var(--muted);
  width:max-content;
  margin-bottom:14px;
}
.hero h1{
  margin:0 0 10px;
  font-size:2.35rem;
  line-height:1.2;
  letter-spacing:.2px;
}
.hero-desc{
  margin:0 0 18px;
  color:var(--muted);
  line-height:1.9;
  font-size:1.05rem;
}
.hero-actions{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:18px;
}

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  padding:12px 16px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.06);
  color:var(--text);
  text-decoration:none;
  font-weight:700;
  transition:.2s;
  box-shadow: 0 8px 22px rgba(0,0,0,.18);
}
.btn:hover{
  transform: translateY(-1px);
  background:rgba(255,255,255,.09);
}

.btn.primary{
  border-color:rgba(14,163,127,.45);
  background: linear-gradient(135deg, rgba(14,163,127,.95), rgba(13,143,111,.92));
}
.btn.primary:hover{ filter:brightness(1.03); }

.btn.ghost{ background:rgba(255,255,255,.04); }
.btn.small{ padding:10px 14px; border-radius:12px; font-weight:800; }

.stats{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:10px;
}
.stat{
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius:16px;
  padding:12px 12px;
}
.stat-num{
  font-weight:900;
  font-size:1.4rem;
  letter-spacing:.3px;
}
.stat-label{
  color:var(--muted2);
  font-weight:600;
  margin-top:2px;
  font-size:.95rem;
}

/* Glass Card */
.glass-card{
  background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.14);
  border-radius:22px;
  padding:16px;
  box-shadow: var(--shadow);
}
.glass-title{
  font-weight:900;
  margin-bottom:10px;
  letter-spacing:.2px;
}
.quick-grid{ display:grid; gap:10px; }
.quick{
  display:flex;
  align-items:center;
  gap:12px;
  text-decoration:none;
  color:var(--text);
  padding:12px;
  border-radius:16px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  transition:.2s;
}
.quick:hover{
  transform: translateY(-1px);
  background:rgba(255,255,255,.07);
  border-color:rgba(255,255,255,.14);
}
.ic{
  width:40px; height:40px;
  border-radius:14px;
  display:grid;
  place-items:center;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  font-size:1.2rem;
}
.quick b{ display:block; font-weight:900; }
.quick small{ display:block; color:var(--muted2); margin-top:2px; }
.arr{
  margin-inline-start:auto;
  color:rgba(234,240,255,.55);
  font-size:1.2rem;
}

/* Sections */
.section{ padding:30px 0; }
.section-head{ margin-bottom:14px; }
.section-head h2{
  margin:0 0 6px;
  font-size:1.55rem;
  letter-spacing:.2px;
}
.section-head p{
  margin:0;
  color:var(--muted);
  line-height:1.8;
}

/* Cards */
.cards{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:14px;
}
.card{
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius:20px;
  padding:16px;
  box-shadow: 0 10px 26px rgba(0,0,0,.20);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  gap:14px;
  min-height:168px;
}
.card-top{
  display:flex;
  gap:12px;
  align-items:flex-start;
}
.card-ic{
  width:44px; height:44px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:rgba(14,163,127,.14);
  border:1px solid rgba(14,163,127,.24);
  font-size:1.25rem;
}
.card h3{ margin:0 0 6px; font-weight:900; }
.card p{ margin:0; color:var(--muted); line-height:1.85; }

/* Downloads */
.download-list{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:12px;
}
.download{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  border-radius:18px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  text-decoration:none;
  color:var(--text);
  transition:.2s;
}
.download:hover{
  transform: translateY(-1px);
  background:rgba(255,255,255,.07);
  border-color:rgba(255,255,255,.14);
}
.dl-ic{
  width:44px; height:44px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:rgba(46,229,157,.12);
  border:1px solid rgba(46,229,157,.22);
  font-size:1.2rem;
}
.dl-text b{ display:block; font-weight:900; }
.dl-text small{ display:block; color:var(--muted2); margin-top:2px; }
.dl-go{
  margin-inline-start:auto;
  padding:10px 14px;
  border-radius:14px;
  font-weight:900;
  background:linear-gradient(135deg, rgba(14,163,127,.85), rgba(46,229,157,.55));
  border:1px solid rgba(255,255,255,.12);
}

/* Footer */
.note{
  margin-top:14px;
  padding:12px 14px;
  border-radius:16px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.10);
  color:var(--muted);
  line-height:1.9;
}
.footer-card{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  padding:16px;
  border-radius:20px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
}
.footer-card h3{ margin:0 0 6px; font-weight:900; }
.footer-card p{ margin:0; color:var(--muted); line-height:1.9; }

.copyright{
  margin-top:14px;
  color:rgba(234,240,255,.45);
  font-weight:600;
  text-align:center;
}

/* Responsive */
@media (max-width: 980px){
  .hero-inner{ grid-template-columns:1fr; }
  .cards{ grid-template-columns:1fr; }
  .download-list{ grid-template-columns:1fr; }
  .nav{ display:none; }
  .brand{ min-width:unset; }
  .hero h1{ font-size:2rem; }
}

.card.mission-card{
  background: rgba(255,255,255,.06) !important;
}

.card.mission-card::before,
.card.mission-card::after{
  background: none !important;
  content: none !important;
  opacity: 0 !important;
}

#about{
  background: linear-gradient(135deg, #070B14, #0A1226) !important;
}
