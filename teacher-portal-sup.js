// ===== teachers-portal.js — نظام الإشراف التربوي =====

// ----- Block 0 -----

// ===================================================
// إعدادات Supabase
// ===================================================
var SB_URL = "https://pyrxwqgapwjwhiskowhk.supabase.co";
var SB_KEY = "sb_publishable_bfe-B4f-Rag1SR0-PoIb9w_nMfA1Ere";

var PROGRAM_INFO = {
  dumaj:  { label: 'الدمج الفكري', dataPath: 'dumaj',  badge: 'dumaj'  },
  yaseer: { label: 'يسير',          dataPath: 'yaseer', badge: 'yaseer' },
};

// ===================================================
// قاعدة بيانات المعلمين (موحّدة للبرنامجين)
// ===================================================

// ===================================================
// المواد والمستويات (موحّدة مع بوابة الطلاب)
// ===================================================
var CORE_SUBJECTS = [
  { key:'arabic',  name:'اللغة العربية (لغتي)', icon:'📖' },
  { key:'math',    name:'الرياضيات',             icon:'🔢' },
  { key:'islamic', name:'التربية الإسلامية',     icon:'🕌' },
  { key:'science', name:'العلوم',                icon:'🔬' },
  { key:'life',    name:'المهارات الحياتية',     icon:'🌱' },
];

var IEP_LEVELS = [
  { value:'excellent', label:'متفوق',          color:'#059669', bg:'#d1fae5' },
  { value:'advanced',  label:'متقدم',           color:'#2563eb', bg:'#dbeafe' },
  { value:'capable',   label:'متمكن',           color:'#d97706', bg:'#fef3c7' },
  { value:'failed',    label:'غير مجتاز',       color:'#dc2626', bg:'#fee2e2' },
  { value:'none',      label:'— لم يُقيَّم —', color:'#9ca3af', bg:'#f3f4f6' },
];

var PERF_SUBJECTS = [
  { key:'arabic',  name:'اللغة العربية (لغتي)', icon:'📖', skills:['القراءة الجهرية','الكتابة والإملاء','الفهم والاستيعاب','التعبير الشفوي','القواعد النحوية'] },
  { key:'math',    name:'الرياضيات',             icon:'🔢', skills:['العمليات الحسابية الأساسية','الأعداد والتسلسل','الأشكال الهندسية','القياس والوحدات','حل المسائل'] },
  { key:'islamic', name:'التربية الإسلامية',     icon:'🕌', skills:['الحفظ والتلاوة','العقيدة والأركان','الفقه والعبادات','السيرة والأخلاق','التطبيق العملي'] },
  { key:'science', name:'العلوم',                icon:'🔬', skills:['الفهم والاستيعاب','التجارب العلمية','حفظ المعلومات','التطبيق والاستنتاج','المفاهيم البيئية'] },
  { key:'life',    name:'المهارات الحياتية',     icon:'🌱', skills:['العناية الشخصية','التواصل الاجتماعي','المهارات العملية','الاستقلالية','التنظيم وإدارة الوقت'] },
];

var PERF_LEVELS = [
  { value:'mastered',   label:'متقن',       color:'#059669', bg:'#d1fae5' },
  { value:'developing', label:'في التطور',  color:'#2563eb', bg:'#dbeafe' },
  { value:'emerging',   label:'بدايات',     color:'#d97706', bg:'#fef3c7' },
  { value:'not_yet',    label:'لم يصل بعد', color:'#dc2626', bg:'#fee2e2' },
  { value:'na',         label:'غير مقيَّم', color:'#9ca3af', bg:'#f3f4f6' },
];

// ===================================================
// أدوات مساعدة عامة + Supabase
// ===================================================
function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  const t = document.getElementById('success-toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2600);
}

function toHijriLike(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { year:'numeric', month:'long', day:'numeric' });
  } catch(e) { return dateStr; }
}

async function sbGetJSON(path) {
  try {
    const res = await fetch(`${SB_URL}/storage/v1/object/public/${path}?t=${Date.now()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch(e) { return null; }
}

async function sbSetJSON(path, data) {
  try {
    const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
    const res = await fetch(`${SB_URL}/storage/v1/object/${path}`, {
      method:'POST',
      headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','x-upsert':'true'},
      body: blob
    });
    return res.ok;
  } catch(e) { console.error('sbSetJSON error:', e); return false; }
}

async function sbUploadFile(path, file) {
  try {
    const res = await fetch(`${SB_URL}/storage/v1/object/${path}`, {
      method:'POST',
      headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type': file.type || 'application/octet-stream','x-upsert':'true'},
      body: file
    });
    return res.ok;
  } catch(e) { console.error('sbUploadFile error:', e); return false; }
}

async function loadStudentData(program, pin) {
  const data = await sbGetJSON(`reports/${program}/data/student-${pin}.json`);
  return data || {};
}

async function saveStudentData(program, pin, patch) {
  const existing = await loadStudentData(program, pin);
  const merged = Object.assign({}, existing, patch);
  const ok = await sbSetJSON(`reports/${program}/data/student-${pin}.json`, merged);
  return ok ? merged : null;
}


var TEACHERS_HASH = {
  "e2bd7f4d1f3ba7780007be08232567ba2fc18d47d3fc27c7e095af4db2eb804f": {
    "name": "محمد أحمد السهيمي",
    "role": "معلم تربية خاصة — الدمج الفكري",
    "program": "dumaj",
    "avatar": "س"
  },
  "525f5a1194081d0a8f1dde67042d60dbe6946500b509ff6853b8376ea6834d6b": {
    "name": "زين العابدين القرني",
    "role": "معلم تربية خاصة — الدمج الفكري",
    "program": "dumaj",
    "avatar": "ز"
  },
  "2346607f3833af82865122bff17fda445dd6585c7067b5383827ed0a2973f9c2": {
    "name": "علي سعيد الغامدي",
    "role": "معلم تربية خاصة — الدمج الفكري",
    "program": "dumaj",
    "avatar": "غ"
  },
  "56f43c41ed6fdc3237bb720df28a264253fbbb8d06659eab67f72e4bb3f93820": {
    "name": "علي محمد المالكي",
    "role": "معلم تربية خاصة — الدمج الفكري",
    "program": "dumaj",
    "avatar": "م"
  },
  "4ec1177a37ed9b36ecc47addf8f1f0365da1b32e3282e74850cee30c11f89d55": {
    "name": "حسن علي العلياني",
    "role": "معلم تربية خاصة — الدمج الفكري",
    "program": "dumaj",
    "avatar": "ع"
  },
  "5240da1809a1b2151cfdc3e74edce55a083494b8dc3c813aefc133fa0e83776a": {
    "name": "حسين منصور الكبيشي",
    "role": "معلم تربية خاصة — يسير",
    "program": "yaseer",
    "avatar": "ك"
  }
};

function _hashCred(u, p) {
  // SHA-256 بسيط باستخدام SubtleCrypto
  var msg = u + ':' + p;
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
    .then(function(buf) {
      return Array.from(new Uint8Array(buf))
        .map(function(b){ return b.toString(16).padStart(2,'0'); })
        .join('');
    });
}

function doLogin() {
  var username = (document.getElementById('username-input') ? document.getElementById('username-input').value : '').trim().toLowerCase();
  var pin      = (document.getElementById('pin-input') ? document.getElementById('pin-input').value : '').trim();
  var errEl    = document.getElementById('login-error');

  if (!username || !pin) {
    if (errEl) { errEl.textContent = 'أدخل اسم المستخدم والرمز السري'; errEl.classList.add('show'); }
    return;
  }

  _hashCred(username, pin).then(function(hash) {
    var t = TEACHERS_HASH[hash];
    if (!t) {
      if (errEl) {
        errEl.textContent = 'اسم المستخدم أو الرمز غير صحيح';
        errEl.classList.add('show');
        setTimeout(function() { errEl.classList.remove('show'); }, 2500);
        var pi = document.getElementById('pin-input');
        var ui = document.getElementById('username-input');
        if (pi) { pi.classList.add('error'); setTimeout(function(){pi.classList.remove('error');},500); }
        if (ui) { ui.classList.add('error'); setTimeout(function(){ui.classList.remove('error');},500); }
      }
      return;
    }
    currentTeacher = Object.assign({ username: username, pin: pin, isSupervisor: false }, t);
    openPortal();
  });
}

// ----- Block 1 -----

// ===================================================
// الحالة العامة
// ===================================================
var currentTeacher = null;
var ASSIGNMENTS = { dumaj:{}, yaseer:{} };
var currentDetail = null;
var STUDENT_CONFIGS = { dumaj:null, yaseer:null };

// ===================================================
// تسجيل الدخول / الخروج
// ===================================================

function doLogout() {
  currentTeacher = null;
  currentDetail = null;
  document.getElementById('teacher-portal').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('username-input').value = '';
  document.getElementById('pin-input').value = '';
}

async function openPortal() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('teacher-portal').style.display = 'block';
  window.scrollTo(0,0);

  document.getElementById('t-avatar').textContent = currentTeacher.avatar;
  document.getElementById('t-name').textContent = currentTeacher.name;
  document.getElementById('t-role').textContent = '🎓 ' + currentTeacher.role;

  if (currentTeacher.isSupervisor) {
    document.getElementById('assign-tab-btn').style.display = 'flex';
    document.getElementById('assign-head-title').textContent =
      `📋 إسناد طلاب برنامج ${PROGRAM_INFO[currentTeacher.program].label} للمعلمين`;
  } else {
    document.getElementById('assign-tab-btn').style.display = 'none';
  }

  await loadAssignments();
  await renderMyStudents();
  if (currentTeacher.isSupervisor) { await renderAssignTable(); loadAnnouncementSettingsTP(); }
  loadMeetingInvite();
  if(window.loadTeacherAnnouncements) window.loadTeacherAnnouncements();
}

// ===================================================
// تحميل الإسنادات وتهيئة الإعدادات
// ===================================================
async function loadAssignments() {
  const data = await sbGetJSON('reports/teacher-assignments.json');
  ASSIGNMENTS = data || {};
  if (!ASSIGNMENTS.dumaj)  ASSIGNMENTS.dumaj  = {};
  if (!ASSIGNMENTS.yaseer) ASSIGNMENTS.yaseer = {};
}

async function saveAssignments() {
  return sbSetJSON('reports/teacher-assignments.json', ASSIGNMENTS);
}

async function loadStudentConfig(program) {
  if (STUDENT_CONFIGS[program]) return STUDENT_CONFIGS[program];
  const cfg = await sbGetJSON(`reports/admin-${program}-config.json`);
  const list = (cfg && Array.isArray(cfg.students)) ? cfg.students : [];
  STUDENT_CONFIGS[program] = list;
  return list;
}

// ===================================================
// طلابي
// ===================================================
async function getMyStudents() {
  const result = [];
  for (const program of ['dumaj','yaseer']) {
    const list = await loadStudentConfig(program);
    list.forEach(s => {
      if (ASSIGNMENTS[program][s.pin] === currentTeacher.username) {
        result.push(Object.assign({}, s, { program }));
      }
    });
  }
  return result;
}

async function renderMyStudents() {
  const grid = document.getElementById('students-grid');
  grid.innerHTML = '<div class="empty-state"><div class="es-icon">⏳</div><div class="es-title">جارٍ تحميل قائمة طلابك...</div></div>';

  const students = await getMyStudents();
  document.getElementById('t-count').textContent = `👥 ${students.length} طالب مسند`;

  const q = (document.getElementById('student-search').value || '').trim().toLowerCase();
  const filtered = students.filter(s =>
    !q || (s.name||'').toLowerCase().includes(q) || (s.pin||'').includes(q)
  );

  if (students.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">👥</div>
        <div class="es-title">لا يوجد طلاب مسندون إليك حالياً</div>
        <div class="es-sub">سيقوم مشرف البرنامج بإسناد الطلاب لك من تبويب «إسناد الطلاب»</div>
      </div>`;
    return;
  }
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="es-icon">🔍</div><div class="es-title">لا توجد نتائج مطابقة</div></div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => `
    <div class="stu-card" onclick="openStudentDetail('${s.program}','${s.pin}')">
      <div class="stu-card-avatar">${escHtml((s.name||'?').trim().charAt(0))}</div>
      <div>
        <div class="stu-card-name">${escHtml(s.name||'')}</div>
        <div class="stu-card-meta">
          <span class="prog-badge ${s.program}">${PROGRAM_INFO[s.program].label}</span>
          <span>🏫 ${escHtml(s.grade||'—')}</span>
        </div>
      </div>
    </div>`).join('');
}

// ===================================================
// التنقل بين التبويبات
// ===================================================
function openMainTab(name, btn) {
  document.querySelectorAll('#main-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('main-tab-students').classList.toggle('active', name === 'students');
  document.getElementById('main-tab-schedule').classList.toggle('active', name === 'schedule');
  document.getElementById('main-tab-curriculum').classList.toggle('active', name === 'curriculum');
  document.getElementById('main-tab-assign').classList.toggle('active', name === 'assign');
  if (name === 'schedule') renderMySchedule();
  if (name === 'curriculum') renderCurriculumTab();
}

function openDetailTab(name, btn) {
  document.querySelectorAll('#detail-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#student-detail .tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('detail-tab-' + name).classList.add('active');
}

// ===================================================
// فتح/إغلاق ملف الطالب
// ===================================================
async function openStudentDetail(program, pin) {
  const cfgList  = await loadStudentConfig(program);
  const cfgEntry = cfgList.find(s => s.pin === pin) || {};
  const data     = await loadStudentData(program, pin);

  currentDetail = { program, pin, info: Object.assign({}, cfgEntry, data), data };

  document.getElementById('sd-head').innerHTML = `
    <div class="sd-avatar">${escHtml((currentDetail.info.name||'?').charAt(0))}</div>
    <div>
      <div class="sd-name">${escHtml(currentDetail.info.name || '')}</div>
      <div class="sd-meta">
        <span class="prog-badge ${program}">${PROGRAM_INFO[program].label}</span>
        &nbsp; 🏫 ${escHtml(currentDetail.info.grade || '—')} &nbsp;|&nbsp; الرمز: ${escHtml(pin)}
      </div>
    </div>`;

  document.getElementById('main-tabs').style.display = 'none';
  document.getElementById('main-tab-students').classList.remove('active');
  document.getElementById('main-tab-assign').classList.remove('active');
  document.getElementById('student-detail').style.display = 'block';

  document.querySelectorAll('#detail-tabs .tab-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  document.querySelectorAll('#student-detail .tab-pane').forEach((p,i) => p.classList.toggle('active', i===0));

  renderIEPEval();
  renderPerformanceEditor();
  renderStrengthsEditor();
  renderFilesTab();
  renderReinforceTab();
}

function closeStudentDetail() {
  currentDetail = null;
  document.getElementById('student-detail').style.display = 'none';
  document.getElementById('main-tabs').style.display = 'flex';
  const firstBtn = document.querySelector('#main-tabs .tab-btn');
  openMainTab('students', firstBtn);
  renderMyStudents();
}


// ----- Block 2 -----

// ===================================================
// تقييم الأهداف التربوية (IEP)
// ===================================================
function renderIEPEval() {
  const container = document.getElementById('iep-eval-content');
  const iep = currentDetail.data.iep || {};

  const allSubjects = [
    ...CORE_SUBJECTS.map(cs => ({ key: cs.key, info: cs, data: iep[cs.key] })),
    ...Object.entries(iep._custom || {}).map(([k,d]) => ({ key:k, info:{name:d.name, icon:d.icon}, data:d }))
  ].filter(s => s.data && Array.isArray(s.data.goals) && s.data.goals.length > 0);

  if (allSubjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🎯</div>
        <div class="es-title">لا توجد أهداف مُحددة لهذا الطالب بعد</div>
        <div class="es-sub">يقوم مشرف البرنامج بإضافة أهداف الخطة الفردية من لوحة التحكم، وعند توفرها يمكنك تقييمها هنا</div>
      </div>`;
    return;
  }

  let html = `<div style="margin-bottom:14px;font-size:.84rem;color:var(--muted);">قيّم مستوى تحقّق كل هدف من أهداف الخطة الفردية بناءً على ملاحظتك للطالب، ثم اضغط «حفظ التقييم».</div>`;

  allSubjects.forEach(sub => {
    html += `<div class="iep-subject-block">
      <div class="iep-subject-head"><span>${escHtml(sub.info.icon || '📚')}</span><span>${escHtml(sub.info.name)}</span></div>`;
    sub.data.goals.forEach((g, i) => {
      const lv = IEP_LEVELS.find(l => l.value === (g.level || 'none')) || IEP_LEVELS[4];
      html += `
      <div class="iep-goal-row">
        <div class="iep-goal-num">${i+1}</div>
        <div class="iep-goal-text">${escHtml(g.text || '')}</div>
        <select class="iep-level-select" data-iep="${sub.key}:${i}"
          style="color:${lv.color};background:${lv.bg};border-color:${lv.color}55;"
          onchange="iepLevelChanged(this)">
          ${IEP_LEVELS.map(l => `<option value="${l.value}" ${(g.level||'none')===l.value?'selected':''}>${l.label}</option>`).join('')}
        </select>
      </div>`;
    });
    html += `</div>`;
  });

  const lastEval = iep._lastEval;
  if (lastEval) {
    html += `<div style="font-size:.78rem;color:var(--ink-faint);margin-top:6px;">آخر تقييم: ${escHtml(toHijriLike(lastEval.date))} — بواسطة ${escHtml(lastEval.teacher)}</div>`;
  }

  container.innerHTML = html;
}

function iepLevelChanged(sel) {
  const lv = IEP_LEVELS.find(l => l.value === sel.value) || IEP_LEVELS[4];
  sel.style.color = lv.color;
  sel.style.background = lv.bg;
  sel.style.borderColor = lv.color + '55';
}

async function saveIEPEval() {
  const iep = currentDetail.data.iep || {};
  document.querySelectorAll('#iep-eval-content [data-iep]').forEach(sel => {
    const [subKey, idx] = sel.getAttribute('data-iep').split(':');
    const isCore = CORE_SUBJECTS.some(c => c.key === subKey);
    const subData = isCore ? iep[subKey] : (iep._custom && iep._custom[subKey]);
    if (subData && subData.goals && subData.goals[idx]) {
      subData.goals[idx].level = sel.value;
    }
  });
  iep._lastEval = { date: new Date().toISOString(), teacher: currentTeacher.name };

  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { iep });
  if (saved) {
    currentDetail.data = saved;
    showToast('✅ تم حفظ تقييم الأهداف');
    renderIEPEval();
  } else {
    showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
  }
}


// ----- Block 3 -----

// ===================================================
// قياس مستوى الأداء الحالي
// ===================================================
function renderPerformanceEditor() {
  const container = document.getElementById('performance-content');
  const saved = currentDetail.data.performance || {};

  let html = `<div class="perf-legend">`;
  PERF_LEVELS.forEach(l => {
    html += `<span style="background:${l.bg};color:${l.color};padding:3px 10px;border-radius:7px;font-size:.74rem;font-weight:700;">${l.label}</span>`;
  });
  html += `</div>`;
  html += `<div style="font-size:.84rem;color:var(--muted);margin-bottom:14px;">حدّد مستوى أداء الطالب الحالي في كل مهارة، مع إمكانية إضافة ملاحظة، ثم اضغط «حفظ التقييم».</div>`;

  PERF_SUBJECTS.forEach(subj => {
    const subjData = saved[subj.key] || {};
    html += `<div class="perf-subject-block">
      <div class="perf-subject-head"><span>${subj.icon}</span><span>${escHtml(subj.name)}</span></div>
      <div style="overflow-x:auto;">
      <table class="perf-skills-table">
        <thead><tr><th style="width:38%;">المهارة</th><th style="width:24%;text-align:center;">مستوى الأداء</th><th>ملاحظات</th></tr></thead>
        <tbody>`;
    subj.skills.forEach((skill, si) => {
      const skillData = subjData[si] || {};
      const level = skillData.level || 'na';
      const note = skillData.note || '';
      const lv = PERF_LEVELS.find(l => l.value === level) || PERF_LEVELS[4];
      html += `<tr>
        <td style="font-weight:700;">${escHtml(skill)}</td>
        <td style="text-align:center;">
          <select class="perf-level-select" data-subj="${subj.key}" data-si="${si}"
            style="color:${lv.color};background:${lv.bg};border-color:${lv.color}55;"
            onchange="perfLevelChanged(this)">
            ${PERF_LEVELS.map(l => `<option value="${l.value}" ${level===l.value?'selected':''}>${l.label}</option>`).join('')}
          </select>
        </td>
        <td><input type="text" class="perf-notes-input" data-subj="${subj.key}" data-si="${si}" value="${escHtml(note)}" placeholder="ملاحظة اختيارية..."></td>
      </tr>`;
    });
    html += `</tbody></table></div></div>`;
  });

  const meta = currentDetail.data.performanceMeta;
  if (meta) {
    html += `<div style="font-size:.78rem;color:var(--ink-faint);">آخر تحديث: ${escHtml(toHijriLike(meta.date))} — بواسطة ${escHtml(meta.teacher)}</div>`;
  }

  container.innerHTML = html;
}

function perfLevelChanged(sel) {
  const lv = PERF_LEVELS.find(l => l.value === sel.value) || PERF_LEVELS[4];
  sel.style.color = lv.color;
  sel.style.background = lv.bg;
  sel.style.borderColor = lv.color + '55';
}

async function saveTeacherPerformance() {
  const performance = {};
  PERF_SUBJECTS.forEach(subj => {
    performance[subj.key] = {};
    subj.skills.forEach((_, si) => {
      const sel  = document.querySelector(`.perf-level-select[data-subj="${subj.key}"][data-si="${si}"]`);
      const note = document.querySelector(`.perf-notes-input[data-subj="${subj.key}"][data-si="${si}"]`);
      performance[subj.key][si] = { level: sel ? sel.value : 'na', note: note ? note.value.trim() : '' };
    });
  });
  const performanceMeta = { date: new Date().toISOString(), teacher: currentTeacher.name };

  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { performance, performanceMeta });
  if (saved) {
    currentDetail.data = saved;
    showToast('✅ تم حفظ قياس مستوى الأداء');
    renderPerformanceEditor();
  } else {
    showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
  }
}


// ----- Block 4 -----

// ===================================================
// جوانب القوة والاحتياج
// ===================================================
var SW_DEFAULT_SUBJECTS = ['arabic', 'math'];

function renderStrengthsEditor() {
  const container = document.getElementById('strengths-content');
  if (!currentDetail.data.strengths) currentDetail.data.strengths = {};
  const saved = currentDetail.data.strengths;

  if (!Array.isArray(saved._activeSubjects) || saved._activeSubjects.length === 0) {
    saved._activeSubjects = SW_DEFAULT_SUBJECTS.slice();
  }
  const active = saved._activeSubjects;

  let html = `<div style="font-size:.82rem;color:var(--muted);margin-bottom:16px;padding:10px 14px;background:var(--surface2);border-radius:10px;border-right:3px solid var(--gold);">
    📝 أضف أو احذف جوانب القوة والاحتياج. تظهر مادتا اللغة العربية والرياضيات افتراضياً، ويمكنك إضافة مواد أخرى من القائمة أدناه. يُحفظ التحديث عند الضغط على «حفظ».
  </div>`;

  active.forEach(subjKey => {
    const subj = PERF_SUBJECTS.find(s => s.key === subjKey);
    if (!subj) return;
    if (!saved[subjKey]) saved[subjKey] = { strengths: [], needs: [] };
    const strengths = saved[subjKey].strengths || [];
    const needs     = saved[subjKey].needs || [];

    html += `<div class="sw-block">
      <div class="sw-subject-head" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span><span>${subj.icon}</span> ${escHtml(subj.name)}</span>
        <button class="sw-del-btn" style="background:rgba(220,38,38,.08);color:#dc2626;border-radius:6px;width:24px;height:24px;" onclick="removeSwSubject('${subj.key}')" title="إزالة هذه المادة من القائمة">✕</button>
      </div>
      <div class="sw-body">
        <div>
          <div class="sw-side-title sw-strength-title">✅ جوانب القوة</div>
          <div class="sw-item-list" id="sw-strengths-${subj.key}">
            ${strengths.map((item, idx) => `
              <div class="sw-item">
                <div class="sw-item-dot-green"></div>
                <span style="flex:1;">${escHtml(item)}</span>
                <button class="sw-del-btn" onclick="delSwItem('${subj.key}','strength',${idx})">✕</button>
              </div>`).join('')}
          </div>
          <div class="sw-add-input">
            <input type="text" id="sw-s-input-${subj.key}" placeholder="أضف جانب قوة..." onkeydown="if(event.key==='Enter'){event.preventDefault();addSwItem('${subj.key}','strength');}">
            <button class="sw-add-btn" onclick="addSwItem('${subj.key}','strength')">+ إضافة</button>
          </div>
        </div>
        <div>
          <div class="sw-side-title sw-need-title">🎯 جوانب الاحتياج</div>
          <div class="sw-item-list" id="sw-needs-${subj.key}">
            ${needs.map((item, idx) => `
              <div class="sw-item">
                <div class="sw-item-dot-orange"></div>
                <span style="flex:1;">${escHtml(item)}</span>
                <button class="sw-del-btn" onclick="delSwItem('${subj.key}','need',${idx})">✕</button>
              </div>`).join('')}
          </div>
          <div class="sw-add-input">
            <input type="text" id="sw-n-input-${subj.key}" placeholder="أضف جانب احتياج..." onkeydown="if(event.key==='Enter'){event.preventDefault();addSwItem('${subj.key}','need');}">
            <button class="sw-add-btn need" onclick="addSwItem('${subj.key}','need')">+ إضافة</button>
          </div>
        </div>
      </div>
    </div>`;
  });

  // إضافة مادة جديدة
  const remaining = PERF_SUBJECTS.filter(s => !active.includes(s.key));
  if (remaining.length) {
    html += `<div class="sw-add-input" style="margin-top:6px;">
      <select id="sw-add-subject-select" class="assign-select" style="flex:1;">
        ${remaining.map(s => `<option value="${s.key}">${s.icon} ${escHtml(s.name)}</option>`).join('')}
      </select>
      <button class="btn-sm btn-sm-outline" onclick="addSwSubject()">+ إضافة مادة</button>
    </div>`;
  }

  const meta = currentDetail.data.strengthsMeta;
  if (meta) {
    html += `<div style="font-size:.78rem;color:var(--ink-faint);margin-top:10px;">آخر تحديث: ${escHtml(toHijriLike(meta.date))} — بواسطة ${escHtml(meta.teacher)}</div>`;
  }

  container.innerHTML = html;
}

function addSwSubject() {
  const sel = document.getElementById('sw-add-subject-select');
  if (!sel || !sel.value) return;
  const key = sel.value;
  const saved = currentDetail.data.strengths;
  if (!saved._activeSubjects.includes(key)) saved._activeSubjects.push(key);
  if (!saved[key]) saved[key] = { strengths: [], needs: [] };
  renderStrengthsEditor();
}

function removeSwSubject(subjKey) {
  if (!confirm('سيتم إخفاء هذه المادة من قائمة القوة والاحتياج (تبقى بياناتها المحفوظة سابقاً). متابعة؟')) return;
  const saved = currentDetail.data.strengths;
  saved._activeSubjects = saved._activeSubjects.filter(k => k !== subjKey);
  if (saved._activeSubjects.length === 0) saved._activeSubjects = SW_DEFAULT_SUBJECTS.slice();
  renderStrengthsEditor();
}

function addSwItem(subjKey, type) {
  const inputId = type === 'strength' ? `sw-s-input-${subjKey}` : `sw-n-input-${subjKey}`;
  const input = document.getElementById(inputId);
  const text = (input?.value || '').trim();
  if (!text) return;
  if (!currentDetail.data.strengths[subjKey]) currentDetail.data.strengths[subjKey] = { strengths: [], needs: [] };
  const arr = type === 'strength' ? currentDetail.data.strengths[subjKey].strengths : currentDetail.data.strengths[subjKey].needs;
  arr.push(text);
  renderStrengthsEditor();
}

function delSwItem(subjKey, type, idx) {
  const sw = currentDetail.data.strengths[subjKey];
  if (!sw) return;
  const arr = type === 'strength' ? sw.strengths : sw.needs;
  arr.splice(idx, 1);
  renderStrengthsEditor();
}

async function saveTeacherStrengths() {
  const strengthsMeta = { date: new Date().toISOString(), teacher: currentTeacher.name };
  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, {
    strengths: currentDetail.data.strengths || {},
    strengthsMeta
  });
  if (saved) {
    currentDetail.data = saved;
    showToast('✅ تم حفظ جوانب القوة والاحتياج');
    renderStrengthsEditor();
  } else {
    showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
  }
}


// ----- Block 5 -----

// ===================================================
// الخطة الفردية والتقارير (رفع وعرض)
// ===================================================
function fileExtFromName(name) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name || '');
  return m ? m[1] : 'pdf';
}

async function checkFileExists(url) {
  try { const r = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { method: 'HEAD' }); return r.ok; }
  catch(e) { return false; }
}

async function renderFilesTab() {
  const program = currentDetail.program;
  const pin = currentDetail.pin;
  const base = `${SB_URL}/storage/v1/object/public/reports/${program}/`;

  // ===== الخطة الفردية =====
  const planEl = document.getElementById('plan-current');
  planEl.innerHTML = `<div style="color:var(--muted);font-size:.85rem;">⏳ جارٍ التحقق من وجود خطة محفوظة...</div>`;
  let planFound = null;
  for (const ext of ['pdf','PDF','docx','doc']) {
    const url = `${base}plan-${pin}.${ext}`;
    if (await checkFileExists(url)) { planFound = url; break; }
  }
  planEl.innerHTML = planFound
    ? `<div class="file-row">
         <div class="file-left">
           <div class="file-icon">📋</div>
           <div><div class="file-name">الخطة الفردية الحالية</div><div class="file-type">مرفوعة لملف الطالب</div></div>
         </div>
         <a href="${planFound}" target="_blank" class="btn-sm btn-sm-outline">👁️ عرض</a>
       </div>`
    : `<div style="color:var(--muted);font-size:.85rem;">لا توجد خطة فردية مرفوعة لهذا الطالب حالياً.</div>`;

  // ===== التقارير =====
  const reportsEl = document.getElementById('reports-current');
  const reports = currentDetail.data.reports || [];
  if (reports.length === 0) {
    reportsEl.innerHTML = `<div style="color:var(--muted);font-size:.85rem;margin-bottom:8px;">لا توجد تقارير مُضافة من المعلم بعد.</div>`;
  } else {
    reportsEl.innerHTML = reports.map((r, idx) => `
      <div class="file-row">
        <div class="file-left">
          <div class="file-icon">${escHtml(r.icon || '📄')}</div>
          <div>
            <div class="file-name">${escHtml(r.title || 'تقرير')}</div>
            <div class="file-type">📅 ${escHtml(r.date || '')}${r.teacher ? ' — ✍️ ' + escHtml(r.teacher) : ''}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <a href="${base}${encodeURIComponent(r.fileKey)}.${r.ext || 'pdf'}" target="_blank" class="btn-sm btn-sm-outline">👁️ عرض</a>
          <button class="btn-sm btn-sm-danger" onclick="removeReport(${idx})">🗑️ حذف</button>
        </div>
      </div>`).join('');
  }
}

async function uploadPlanFile(input) {
  const file = input.files[0];
  if (!file) return;
  const ext = fileExtFromName(file.name);
  const path = `reports/${currentDetail.program}/plan-${currentDetail.pin}.${ext}`;
  showToast('⏳ جارٍ رفع الخطة الفردية...');
  const ok = await sbUploadFile(path, file);
  input.value = '';
  if (ok) { showToast('✅ تم رفع الخطة الفردية بنجاح'); renderFilesTab(); }
  else showToast('⚠️ تعذر رفع الملف، تحقق من الاتصال');
}

async function uploadReportFile(input) {
  const file = input.files[0];
  if (!file) return;
  const titleInput = document.getElementById('report-title-input');
  const title = (titleInput.value || '').trim() || 'تقرير من المعلم';
  const ext = fileExtFromName(file.name);
  const fileKey = `teacherfile-${currentDetail.pin}-${Date.now()}`;
  const path = `reports/${currentDetail.program}/${fileKey}.${ext}`;

  showToast('⏳ جارٍ رفع التقرير...');
  const ok = await sbUploadFile(path, file);
  input.value = '';
  if (!ok) { showToast('⚠️ تعذر رفع الملف، تحقق من الاتصال'); return; }

  const reports = currentDetail.data.reports || [];
  reports.push({
    title, icon: '📄', tag: 'من المعلم', tagClass: 'tag-purple',
    date: toHijriLike(new Date()), fileKey, ext, teacher: currentTeacher.name
  });

  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { reports });
  if (saved) {
    currentDetail.data = saved;
    titleInput.value = '';
    showToast('✅ تم إضافة التقرير لملف الطالب');
    renderFilesTab();
  } else {
    showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
  }
}

async function removeReport(idx) {
  if (!confirm('هل تريد حذف هذا التقرير من ملف الطالب؟')) return;
  const reports = currentDetail.data.reports || [];
  reports.splice(idx, 1);
  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { reports });
  if (saved) {
    currentDetail.data = saved;
    showToast('🗑️ تم حذف التقرير');
    renderFilesTab();
  } else {
    showToast('⚠️ تعذر الحذف، تحقق من الاتصال');
  }
}


// ----- Block 6 -----

// ===================================================
// لوحة التعزيز — شهادات الشكر والتقدير
// ===================================================
function updateCertPreview() {
  if (!currentDetail) return;
  const title = (document.getElementById('cert-title-input').value || '').trim();
  const msg   = (document.getElementById('cert-message-input').value || '').trim();

  document.getElementById('cert-student-name').textContent = currentDetail.info.name || '—';
  document.getElementById('cert-message-preview').textContent =
    msg || (title || 'تقديراً وتشجيعاً له على تميّزه واجتهاده.');
  document.getElementById('cert-date-preview').textContent = '📅 ' + toHijriLike(new Date());
  document.getElementById('cert-teacher-preview').textContent = '✍️ ' + currentTeacher.name;
}

function renderReinforceTab() {
  document.getElementById('cert-title-input').value = '';
  document.getElementById('cert-message-input').value = '';
  updateCertPreview();

  const history = (currentDetail.data.reinforcements || []).slice().reverse();
  const histEl = document.getElementById('reinforce-history');

  if (history.length === 0) {
    histEl.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🏆</div>
        <div class="es-title">لا توجد شهادات مُرسلة بعد</div>
        <div class="es-sub">عند إرسال شهادة شكر ستظهر هنا وفي ملف الطالب</div>
      </div>`;
    return;
  }

  histEl.innerHTML = history.map(item => `
    <div class="reinforce-item">
      <div class="reinforce-icon">🏆</div>
      <div style="flex:1;">
        <div class="reinforce-title">${escHtml(item.title)}</div>
        <div class="reinforce-meta">📅 ${escHtml(item.dateLabel)} — ✍️ ${escHtml(item.teacher)}</div>
        ${item.message ? `<div class="reinforce-msg">${escHtml(item.message)}</div>` : ''}
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        <button class="btn-sm btn-sm-outline" onclick="printCertificate('${item.id}')">🖨️ طباعة</button>
        <button class="btn-sm btn-sm-danger" onclick="deleteCertificate('${item.id}')">🗑️ حذف</button>
      </div>
    </div>`).join('');
}

async function deleteCertificate(id) {
  if (!confirm('هل تريد حذف هذه الشهادة من ملف الطالب؟ لا يمكن التراجع عن هذا الإجراء.')) return;
  const reinforcements = (currentDetail.data.reinforcements || []).filter(r => r.id !== id);
  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { reinforcements });
  if (saved) {
    currentDetail.data = saved;
    showToast('🗑️ تم حذف الشهادة');
    renderReinforceTab();
  } else {
    showToast('⚠️ تعذر الحذف، تحقق من الاتصال');
  }
}

async function sendCertificate() {
  const title = (document.getElementById('cert-title-input').value || '').trim();
  if (!title) { showToast('⚠️ يرجى كتابة سبب التكريم أولاً'); return; }
  const message = (document.getElementById('cert-message-input').value || '').trim();

  const item = {
    id: 'cert_' + Date.now(),
    title, message,
    teacher: currentTeacher.name,
    date: new Date().toISOString(),
    dateLabel: toHijriLike(new Date())
  };

  const reinforcements = currentDetail.data.reinforcements || [];
  reinforcements.push(item);

  const saved = await saveStudentData(currentDetail.program, currentDetail.pin, { reinforcements });
  if (saved) {
    currentDetail.data = saved;
    showToast('🏆 تم إرسال الشهادة لملف الطالب');
    renderReinforceTab();
  } else {
    showToast('⚠️ تعذر الإرسال، تحقق من الاتصال');
  }
}

function printCertificate(id) {
  const item = (currentDetail.data.reinforcements || []).find(r => r.id === id);
  if (!item) return;
  const studentName = currentDetail.info.name || '';

  const win = window.open('', '_blank');
  if (!win) { showToast('⚠️ يرجى السماح بالنوافذ المنبثقة للطباعة'); return; }

  win.document.write(`
<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<title>شهادة شكر — ${escHtml(studentName)}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;900&family=Cairo:wght@400;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{font-family:'Cairo',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#F7F5FC;}
  .cert{width:740px;max-width:92vw;border:10px solid #6B4C9A;border-radius:22px;padding:50px 44px;text-align:center;background:#fff;position:relative;}
  .cert::after{content:'';position:absolute;inset:14px;border:2px dashed #B79EE0;border-radius:14px;pointer-events:none;}
  .emoji{font-size:2.6rem;margin-bottom:6px;}
  h1{font-family:'Tajawal',sans-serif;font-size:2.1rem;color:#2E2148;margin:0 0 6px;}
  .sub{color:#6E5F82;font-size:.92rem;margin-bottom:26px;}
  .lead{font-size:.95rem;color:#6E5F82;}
  .name{font-family:'Tajawal',sans-serif;font-size:1.7rem;font-weight:900;color:#6B4C9A;margin:14px 0 18px;}
  .reason{font-size:1.05rem;color:#221335;margin-bottom:10px;font-weight:800;}
  .msg{font-size:.95rem;color:#221335;line-height:2;margin-bottom:28px;}
  .footer{display:flex;justify-content:space-between;margin-top:36px;font-size:.84rem;color:#6E5F82;border-top:1px solid #EAE1F7;padding-top:14px;}
  @media print{ body{background:#fff;} .cert{border-color:#6B4C9A;box-shadow:none;} }
</style></head><body>
  <div class="cert">
    <div class="emoji">🏆</div>
    <h1>شهادة شكر وتقدير</h1>
    <div class="sub">مدرسة مكة المكرمة المتوسطة — قسم ذوي الإعاقة</div>
    <div class="lead">تُمنح هذه الشهادة للطالب/ـة</div>
    <div class="name">${escHtml(studentName)}</div>
    <div class="reason">${escHtml(item.title)}</div>
    ${item.message ? `<div class="msg">${escHtml(item.message)}</div>` : ''}
    <div class="footer">
      <span>📅 ${escHtml(item.dateLabel)}</span>
      <span>✍️ ${escHtml(item.teacher)}</span>
    </div>
  </div>
  <scr'+'ipt>window.onload = () => setTimeout(() => window.print(), 350);<\/scr'+'ipt>
</body></html>`);
  win.document.close();
}

// ===================================================
// إسناد الطلاب للمعلمين (المشرف فقط)
// ===================================================
async function renderAssignTable() {
  const program = currentTeacher.program;
  const list = await loadStudentConfig(program);

  const q = (document.getElementById('assign-search').value || '').trim().toLowerCase();
  const filtered = list.filter(s => !q || (s.name||'').toLowerCase().includes(q) || (s.pin||'').includes(q));

  const teacherOptions = Object.entries(TEACHERS)
    .filter(([uname, t]) => t.program === program && (!t.isSupervisor || uname === currentTeacher.username))
    .map(([uname, t]) => ({ uname, name: t.name }));

  const tbody = document.getElementById('assign-tbody');

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:30px;">لا يوجد طلاب مسجّلون في هذا البرنامج</td></tr>`;
    return;
  }
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:30px;">لا توجد نتائج مطابقة</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const current = ASSIGNMENTS[program][s.pin] || '';
    const options = `<option value="">— غير مُسند —</option>` +
      teacherOptions.map(t => `<option value="${t.uname}" ${current===t.uname?'selected':''}>${escHtml(t.name)}</option>`).join('');
    return `<tr>
      <td style="font-weight:700;">${escHtml(s.name || '')}</td>
      <td>${escHtml(s.pin || '')}</td>
      <td>${escHtml(s.grade || '—')}</td>
      <td><select class="assign-select" onchange="assignTeacher('${s.pin}', this.value)">${options}</select></td>
      <td>${current ? '<span class="assign-status assigned">✅ مُسند</span>' : '<span class="assign-status unassigned">— غير مُسند —</span>'}</td>
    </tr>`;
  }).join('');
}

async function assignTeacher(pin, uname) {
  const program = currentTeacher.program;
  if (uname) ASSIGNMENTS[program][pin] = uname;
  else delete ASSIGNMENTS[program][pin];

  const ok = await saveAssignments();
  if (ok) { showToast('✅ تم تحديث إسناد الطالب'); renderAssignTable(); }
  else showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
}


// ----- Block 7 -----

// ===================================================
// جدول المعلم الأسبوعي (المعتمد من مشرف البرنامج)
// ===================================================
var SCHEDULE_KEY_MAP = {
  'm.suhayymi': { program:'dumaj',  key:'suhaimy'   },
  'z.qarni':    { program:'dumaj',  key:'alqarni'   },
  'a.ghamdi':   { program:'dumaj',  key:'alghamdi'  },
  'a.malki':    { program:'dumaj',  key:'almalki'   },
  'h.ulyani':   { program:'dumaj',  key:'alyani'    },
  'a.zahrani':  { program:'dumaj',  key:'alzahrani' },
  'h.kubaishi': { program:'yaseer', key:'husain'    },
  'saad.z':     { program:'yaseer', key:'saad'      },
};

// ===================================================
// ملف الإنجاز (مضمَّن من ملفات إنجاز المعلمين)
// ===================================================
var PORTFOLIO_MAP = {
  'm.suhayymi': { file:'teachers-dumaj.html',  name:'محمد أحمد السهيمي'   },
  'z.qarni':    { file:'teachers-dumaj.html',  name:'زين العابدين سعد القرني' },
  'a.ghamdi':   { file:'teachers-dumaj.html',  name:'علي سعيد الغامدي'    },
  'a.malki':    { file:'teachers-dumaj.html',  name:'علي محمد المالكي'    },
  'h.ulyani':   { file:'teachers-dumaj.html',  name:'حسن علي العلياني'    },
  'a.zahrani':  { file:'teachers-dumaj.html',  name:'علي محمد الزهراني'   },
  'h.kubaishi': { file:'teachers-yaseer.html', name:'حسين منصور الكبيشي'  },
  'saad.z':     { file:'teachers-yaseer.html', name:'سعد سالم الزهراني'   },
};

function openPortfolioFull() {
  const map = PORTFOLIO_MAP[currentTeacher.username];
  if (!map) { showToast('⚠️ لا يوجد ملف إنجاز مرتبط بهذا الحساب'); return; }
  const url = `${map.file}?t=${encodeURIComponent(map.name)}&p=${encodeURIComponent(currentTeacher.pin)}`;
  window.open(url, '_blank');
}

var SCHED_DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];

var DUMAJ_SCHED_PERIODS = [
  { num:1, label:'الأولى',  time:'7:30–8:15'   },
  { num:2, label:'الثانية', time:'8:15–9:00'   },
  { num:3, label:'الثالثة', time:'9:00–9:45'   },
  { num:4, label:'الرابعة', time:'10:05–10:50' },
  { num:5, label:'الخامسة', time:'10:50–11:35' },
  { num:6, label:'السادسة', time:'11:35–12:20' },
  { num:7, label:'السابعة', time:'12:20–13:05' },
];
var DUMAJ_SCHED_GRADES = ['أول متوسط','ثاني متوسط','ثالث متوسط'];
var DUMAJ_CELL_LABELS = { lesson:'📚', break_sup:'☕ فسحة', end_sup:'🏫 نهاية الدوام' };

var YASEER_SCHED_PERIODS = [
  { num:1, label:'الأولى',  time:'7:00–7:45'   },
  { num:2, label:'الثانية', time:'7:45–8:30'   },
  { num:3, label:'الثالثة', time:'8:30–9:15'   },
  { num:4, label:'الرابعة', time:'9:35–10:20'  },
  { num:5, label:'الخامسة', time:'10:20–11:05' },
];

var lastScheduleHTML = '';

async function fetchTimetableData(key) {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/teacher_portfolios?teacher_key=eq.${encodeURIComponent(key)}&select=data`, {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows?.length > 0 && rows[0].data) return rows[0].data;
    }
  } catch(e) {}
  return null;
}

async function renderMySchedule() {
  const container = document.getElementById('schedule-content');
  container.innerHTML = `<div class="empty-state"><div class="es-icon">⏳</div><div class="es-title">جارٍ تحميل الجدول...</div></div>`;

  const map = SCHEDULE_KEY_MAP[currentTeacher.username];
  if (!map) {
    container.innerHTML = `<div class="empty-state"><div class="es-icon">📅</div><div class="es-title">لا تتوفر بيانات جدول لهذا الحساب</div></div>`;
    return;
  }

  if (map.program === 'dumaj') {
    const grids = {};
    for (const grade of DUMAJ_SCHED_GRADES) {
      grids[grade] = await fetchTimetableData('dumaj_timetable_' + grade);
    }
    renderDumajMySchedule(grids, map.key, container);
  } else {
    const grid = await fetchTimetableData('yaseer_timetable_main');
    renderYaseerMySchedule(grid, map.key, container);
  }
}

function renderDumajMySchedule(grids, myKey, container) {
  let hasAny = false;
  let html = `<table class="my-sched-table"><thead><tr><th>الحصة</th>${SCHED_DAYS.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>`;
  DUMAJ_SCHED_PERIODS.forEach(p => {
    html += `<tr><td class="my-sched-period-col">${p.label}<br><span style="font-weight:400;">${p.time}</span></td>`;
    SCHED_DAYS.forEach(day => {
      let found = null, foundGrade = null;
      DUMAJ_SCHED_GRADES.forEach(grade => {
        const grid = grids[grade];
        const cell = grid?.[day]?.[p.num];
        if (cell && cell.teacher === myKey && cell.type && cell.type !== 'empty') { found = cell; foundGrade = grade; }
      });
      if (found) {
        hasAny = true;
        const typeLabel = found.type === 'lesson' ? (found.subject || 'حصة') : (DUMAJ_CELL_LABELS[found.type] || found.subject || '');
        html += `<td><div class="my-sched-cell-fill"><div class="my-sched-subj">${escHtml(typeLabel)}</div>${found.type==='lesson' ? `<div class="my-sched-grade">${escHtml(foundGrade)}</div>` : ''}</div></td>`;
      } else {
        html += `<td class="my-sched-cell-empty">—</td>`;
      }
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;

  if (!hasAny) {
    html = `<div class="empty-state"><div class="es-icon">📅</div><div class="es-title">لم يتم تحديد حصص لك في الجدول حتى الآن</div><div class="es-sub">يقوم مشرف البرنامج باعتماد الجدول من لوحة التحكم الخاصة به</div></div>` + html;
  }
  lastScheduleHTML = html;
  container.innerHTML = html;
}

function renderYaseerMySchedule(grid, myKey, container) {
  let hasAny = false;
  let html = `<table class="my-sched-table"><thead><tr><th>الحصة</th>${SCHED_DAYS.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>`;
  YASEER_SCHED_PERIODS.forEach(p => {
    html += `<tr><td class="my-sched-period-col">${p.label}<br><span style="font-weight:400;">${p.time}</span></td>`;
    SCHED_DAYS.forEach(day => {
      const cell = grid?.[day]?.[p.num];
      if (cell && cell.teacher === myKey && cell.students && cell.students.length) {
        hasAny = true;
        const items = cell.students.map(s => `<div class="my-sched-subj">${escHtml(s.name)}</div><div class="my-sched-grade">${escHtml(s.subject)}</div>`).join('<hr style="border:none;border-top:1px dashed var(--border);margin:4px 0;">');
        html += `<td><div class="my-sched-cell-fill">${items}</div></td>`;
      } else {
        html += `<td class="my-sched-cell-empty">—</td>`;
      }
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;

  if (!hasAny) {
    html = `<div class="empty-state"><div class="es-icon">📅</div><div class="es-title">لم يتم تحديد حصص لك في الجدول حتى الآن</div><div class="es-sub">يقوم مشرف البرنامج باعتماد الجدول من لوحة التحكم الخاصة به</div></div>` + html;
  }
  lastScheduleHTML = html;
  container.innerHTML = html;
}

function printMySchedule() {
  const win = window.open('', '_blank');
  if (!win) { showToast('⚠️ يرجى السماح بالنوافذ المنبثقة للطباعة'); return; }
  win.document.write(`
<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<title>جدولي الأسبوعي — ${escHtml(currentTeacher.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;900&family=Cairo:wght@400;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{font-family:'Cairo',sans-serif;padding:24px;direction:rtl;}
  h1{font-family:'Tajawal',sans-serif;color:#2E2148;}
  .my-sched-table{ width:100%; border-collapse:collapse; font-size:.85rem; }
  .my-sched-table th{ background:#EAE1F7; color:#6B4C9A; padding:9px 8px; text-align:center; font-weight:800; border:1px solid #DCD2EE; }
  .my-sched-table td{ padding:8px; border:1px solid #DCD2EE; text-align:center; }
  .my-sched-period-col{ background:#FBFAFE; font-weight:800; color:#6B4C9A; }
  .my-sched-cell-fill{ background:#EAE1F7; border-radius:8px; padding:6px; }
  .my-sched-subj{ font-weight:800; color:#3F2E63; }
  .my-sched-grade{ font-size:.78rem; color:#6E5F82; margin-top:2px; }
  .my-sched-cell-empty{ color:#c9c2da; }
  .empty-state{ text-align:center; padding:30px; color:#9ca3af; }
</style></head><body>
  <h1>📅 جدولي الأسبوعي — ${escHtml(currentTeacher.name)}</h1>
  <div style="color:#6E5F82;margin-bottom:14px;">${escHtml(currentTeacher.role)} — الفصل الدراسي الثاني 1447هـ</div>
  ${lastScheduleHTML}
  <scr'+'ipt>window.onload=()=>setTimeout(()=>window.print(),350);<\/scr'+'ipt>
</body></html>`);
  win.document.close();
}

// ===================================================
// بانر استدعاء الاجتماع (من مشرف الإدارة العامة)
// ===================================================
async function loadMeetingInvite() {
  const list = await sbGetJSON(`reports/${currentTeacher.program}/meeting-invites.json`);
  renderMeetingsLog(Array.isArray(list) ? list : []);
}

function renderMeetingsLog(list) {
  const el = document.getElementById('meetings-log');
  if (!list || list.length === 0) {
    el.style.display = 'none';
    el.innerHTML = '';
    return;
  }

  el.style.display = 'block';
  el.innerHTML = `<div class="meetings-log-head">📹 سجل استدعاءات الاجتماع (${list.length})</div>` +
    list.map(invite => {
      let dtLabel = invite.datetime;
      try {
        dtLabel = new Date(invite.datetime).toLocaleDateString('ar-SA', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
      } catch(e) {}
      return `
    <div class="meeting-banner-inner">
      <div class="meeting-banner-icon">📹</div>
      <div style="flex:1;">
        <div class="meeting-banner-title">استدعاء اجتماع: ${escHtml(invite.subject || '')}</div>
        <div class="meeting-banner-meta">📅 ${escHtml(dtLabel)}${invite.notes ? ' — ' + escHtml(invite.notes) : ''}${invite.supervisorName ? ' — من: ' + escHtml(invite.supervisorName) : ''}</div>
      </div>
      <a href="${invite.link}" target="_blank" class="btn-sm btn-sm-gold">🔗 الانضمام للاجتماع</a>
      <button class="meeting-banner-close" onclick="deleteMeetingInviteShared('${invite.id}')">🗑️ حذف</button>
    </div>`;
    }).join('');
}

async function deleteMeetingInviteShared(id) {
  if (!confirm('هل تم الاطلاع على هذا الاستدعاء؟ سيتم حذفه من السجل لجميع المعلمين.')) return;
  const list = await sbGetJSON(`reports/${currentTeacher.program}/meeting-invites.json`);
  const filtered = (Array.isArray(list) ? list : []).filter(m => String(m.id) !== String(id));
  const ok = await sbSetJSON(`reports/${currentTeacher.program}/meeting-invites.json`, filtered);
  if (ok) { showToast('🗑️ تم حذف الاستدعاء'); renderMeetingsLog(filtered); }
  else showToast('⚠️ تعذر الحذف، تحقق من الاتصال');
}

// ===================================================
// شريط الإشعارات العام (للمعلمين المشرفين)
// ===================================================
async function loadAnnouncementSettingsTP() {
  const data = await sbGetJSON('reports/site-announcement.json');
  if (data) {
    document.getElementById('tp-announce-enabled').checked = !!data.enabled;
    document.getElementById('tp-announce-message').value = data.message || '';
    document.getElementById('tp-announce-link').value = data.link || '';
  }
}

async function saveAnnouncementTP() {
  const enabled = document.getElementById('tp-announce-enabled').checked;
  const message = document.getElementById('tp-announce-message').value.trim();
  const link = document.getElementById('tp-announce-link').value.trim();
  if (enabled && !message) { showToast('⚠️ يرجى كتابة نص الإشعار قبل التفعيل'); return; }
  const payload = { enabled, message, link, updatedAt: new Date().toISOString(), updatedBy: currentTeacher.name };
  const ok = await sbSetJSON('reports/site-announcement.json', payload);
  showToast(ok ? '✅ تم حفظ ونشر الإشعار' : '⚠️ تعذر الحفظ، تحقق من الاتصال');
}


// ----- Block 8 -----

// ===================================================
// توزيع المنهج الفصلي
// ===================================================
var CURRICULUM_WEEKS = 16;

function emptyCurriculumWeeks() {
  return Array.from({ length: CURRICULUM_WEEKS }, () => ({ topic: '', notes: '' }));
}

function defaultCurriculum() {
  return {
    activeSubjects: ['arabic', 'math'],
    subjects: {
      arabic: { name: 'لغتي (اللغة العربية)', weeks: emptyCurriculumWeeks() },
      math:   { name: 'الرياضيات',            weeks: emptyCurriculumWeeks() },
    },
    meta: null
  };
}

var myCurriculum = null;

function curriculumPath() {
  return `curriculum/${currentTeacher.program}/${currentTeacher.username}.json`;
}

async function renderCurriculumTab() {
  const container = document.getElementById('curriculum-content');
  container.innerHTML = `<div class="empty-state"><div class="es-icon">⏳</div><div class="es-title">جارٍ التحميل...</div></div>`;

  if (!myCurriculum) {
    const data = await sbGetJSON(`reports/${curriculumPath()}`);
    myCurriculum = data || defaultCurriculum();
  }
  if (!Array.isArray(myCurriculum.activeSubjects) || myCurriculum.activeSubjects.length === 0) {
    myCurriculum.activeSubjects = ['arabic', 'math'];
  }
  myCurriculum.activeSubjects.forEach(key => {
    if (!myCurriculum.subjects[key]) {
      myCurriculum.subjects[key] = { name: key, weeks: emptyCurriculumWeeks() };
    }
  });

  let html = `<div style="font-size:.84rem;color:var(--muted);margin-bottom:16px;padding:10px 14px;background:var(--surface2);border-radius:10px;border-right:3px solid var(--gold);">
    📝 وزّع محتوى المنهج على أسابيع الفصل الدراسي. يمكن لطاقم الإدارة (مشرف الإدارة العامة، مدير المدرسة، رئيس قسم ذوي الإعاقة) الاطلاع على هذا التوزيع بعد حفظه.
  </div>`;

  myCurriculum.activeSubjects.forEach(key => {
    const subj = myCurriculum.subjects[key];
    html += `<div class="s-card">
      <div class="s-card-head" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
        <span>📘 ${escHtml(subj.name)}</span>
        <button class="btn-sm btn-sm-danger" onclick="removeCurriculumSubject('${key}')">🗑️ إزالة المادة</button>
      </div>
      <div class="s-card-body" style="padding:0;overflow-x:auto;">
        <table class="curr-table">
          <thead><tr><th style="width:90px;">الأسبوع</th><th>الموضوع / الدرس</th><th>ملاحظات</th></tr></thead>
          <tbody>
            ${subj.weeks.map((w, i) => `
              <tr>
                <td class="curr-week-num">الأسبوع ${i+1}</td>
                <td><input type="text" class="curr-input" data-subj="${key}" data-week="${i}" data-field="topic" value="${escHtml(w.topic || '')}" placeholder="موضوع/درس هذا الأسبوع..."></td>
                <td><input type="text" class="curr-input" data-subj="${key}" data-week="${i}" data-field="notes" value="${escHtml(w.notes || '')}" placeholder="ملاحظات..."></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  });

  html += `<div class="upload-row">
    <input type="text" id="new-curr-subject" placeholder="اسم مادة جديدة (مثال: العلوم)">
    <button class="btn-sm btn-sm-outline" onclick="addCurriculumSubject()">+ إضافة مادة</button>
  </div>`;

  if (myCurriculum.meta) {
    html += `<div style="font-size:.78rem;color:var(--ink-faint);margin-top:10px;">آخر حفظ: ${escHtml(toHijriLike(myCurriculum.meta.date))} — بواسطة ${escHtml(myCurriculum.meta.teacher)}</div>`;
  }

  container.innerHTML = html;
}

function collectCurriculumInputs() {
  document.querySelectorAll('.curr-input').forEach(inp => {
    const subj  = inp.dataset.subj;
    const week  = +inp.dataset.week;
    const field = inp.dataset.field;
    if (myCurriculum.subjects[subj] && myCurriculum.subjects[subj].weeks[week]) {
      myCurriculum.subjects[subj].weeks[week][field] = inp.value;
    }
  });
}

function addCurriculumSubject() {
  const input = document.getElementById('new-curr-subject');
  const name = (input.value || '').trim();
  if (!name) return;
  collectCurriculumInputs();
  const key = 'custom_' + Date.now();
  myCurriculum.subjects[key] = { name, weeks: emptyCurriculumWeeks() };
  myCurriculum.activeSubjects.push(key);
  input.value = '';
  renderCurriculumTab();
}

function removeCurriculumSubject(key) {
  if (!confirm('سيتم حذف توزيع هذه المادة بالكامل. متابعة؟')) return;
  collectCurriculumInputs();
  myCurriculum.activeSubjects = myCurriculum.activeSubjects.filter(k => k !== key);
  delete myCurriculum.subjects[key];
  if (myCurriculum.activeSubjects.length === 0) myCurriculum.activeSubjects = ['arabic','math'];
  renderCurriculumTab();
}

async function saveCurriculum() {
  collectCurriculumInputs();
  myCurriculum.meta = { date: new Date().toISOString(), teacher: currentTeacher.name };
  const ok = await sbSetJSON(`reports/${curriculumPath()}`, myCurriculum);
  if (ok) { showToast('✅ تم حفظ توزيع المنهج'); renderCurriculumTab(); }
  else showToast('⚠️ تعذر الحفظ، تحقق من الاتصال');
}

function printCurriculum() {
  collectCurriculumInputs();
  const win = window.open('', '_blank');
  if (!win) { showToast('⚠️ يرجى السماح بالنوافذ المنبثقة للطباعة'); return; }

  const subjectsHtml = myCurriculum.activeSubjects.map(key => {
    const subj = myCurriculum.subjects[key];
    return `
      <h2>📘 ${escHtml(subj.name)}</h2>
      <table>
        <thead><tr><th style="width:90px;">الأسبوع</th><th>الموضوع / الدرس</th><th>ملاحظات</th></tr></thead>
        <tbody>
          ${subj.weeks.map((w,i) => `<tr><td class="wk">الأسبوع ${i+1}</td><td>${escHtml(w.topic||'')}</td><td>${escHtml(w.notes||'')}</td></tr>`).join('')}
        </tbody>
      </table>`;
  }).join('');

  win.document.write(`
<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<title>توزيع المنهج — ${escHtml(currentTeacher.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;900&family=Cairo:wght@400;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{font-family:'Cairo',sans-serif;padding:24px;direction:rtl;color:#221335;}
  h1{font-family:'Tajawal',sans-serif;color:#2E2148;font-size:1.5rem;margin-bottom:4px;}
  .sub{color:#6E5F82;margin-bottom:18px;font-size:.9rem;}
  h2{font-family:'Tajawal',sans-serif;color:#6B4C9A;font-size:1.05rem;margin:22px 0 8px;}
  table{ width:100%; border-collapse:collapse; font-size:.85rem; margin-bottom:10px; }
  th{ background:#EAE1F7; color:#6B4C9A; padding:8px 10px; text-align:right; font-weight:800; border:1px solid #DCD2EE; }
  td{ padding:7px 10px; border:1px solid #DCD2EE; }
  .wk{ font-weight:800; color:#6B4C9A; white-space:nowrap; }
  @media print{ @page{ size:A4; margin:14mm; } }
</style></head><body>
  <h1>📘 توزيع المنهج الفصلي</h1>
  <div class="sub">${escHtml(currentTeacher.name)} — ${escHtml(currentTeacher.role)} — الفصل الدراسي الثاني 1447هـ</div>
  ${subjectsHtml}
  <scr'+'ipt>window.onload=()=>setTimeout(()=>window.print(),350);<\/scr'+'ipt>
</body></html>`);
  win.document.close();
}


// ----- Block 9 — التهيئة (مؤجلة حتى يُنقر التبويب) -----
function _initTPListeners() {
  var pinInput = document.getElementById('pin-input');
  var userInput = document.getElementById('username-input');
  var certTitle = document.getElementById('cert-title-input');
  var certMsg = document.getElementById('cert-message-input');
  if (pinInput) pinInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doLogin();
  });
  if (userInput) userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { var p=document.getElementById('pin-input'); if(p) p.focus(); }
  });
  if (certTitle) certTitle.addEventListener('input', updateCertPreview);
  if (certMsg) certMsg.addEventListener('input', updateCertPreview);
}



// ===== تهيئة لوحة الإشراف (تُستدعى من admin pages) =====
var _supReady = false;
function initSupPanel(program, username, uname, urole) {
  if (_supReady) return; _supReady = true;
  _initTPListeners();
  currentTeacher = {
    username: username, name: uname, pin: '0000',
    role: urole, program: program,
    avatar: uname.charAt(0), isSupervisor: true
  };
  var l = document.getElementById('login-screen');
  var p = document.getElementById('teacher-portal');
  if (l) l.style.display = 'none';
  if (p) p.style.display = 'block';
  var av = document.getElementById('t-avatar');
  var nm = document.getElementById('t-name');
  var rl = document.getElementById('t-role');
  if (av) av.textContent = currentTeacher.avatar;
  if (nm) nm.textContent = currentTeacher.name;
  if (rl) rl.textContent = '🎓 ' + currentTeacher.role;
  var ab = document.getElementById('assign-tab-btn');
  if (ab) ab.style.display = 'flex';
  var at = document.getElementById('assign-head-title');
  if (at) at.textContent = '📋 إسناد طلاب البرنامج للمعلمين';
  loadAssignments().then(function() {
    renderMyStudents();
    renderAssignTable();
  });
  loadMeetingInvite();
  if (window.loadTeacherAnnouncements) loadTeacherAnnouncements();
}
