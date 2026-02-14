(function () {
  const $ = (id) => document.getElementById(id);

  // عناصر أساسية
  const rowsEl = $("rows");
  if (!rowsEl) return; // إذا ما فيه جدول، وقف

  // عناصر (قد تكون غير موجودة)
  const qEl = $("q");
  const bldEl = $("bld");
  const gradeEl = $("grade");
  const onlyEl = $("only");
  const resetEl = $("reset");
  const exportEl = $("export");

  const statClasses = $("statClasses");
  const statYaseer = $("statYaseer");
  const statPending = $("statPending");
  const statTotal = $("statTotal");
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // اقرأ البيانات
  const DATA = Array.isArray(window.DASHBOARD_DATA) ? window.DASHBOARD_DATA : [];

  function normalize(s) {
    return (s ?? "").toString().trim().toLowerCase();
  }

  function statusChip(item) {
    const y = Number(item.yaseer || 0);
    const p = Number(item.pending || 0);
    if (y > 0) return `<span class="chip ok">✅ يوجد يسير</span>`;
    if (p > 0) return `<span class="chip warn">⏳ بانتظار</span>`;
    return `<span class="chip">—</span>`;
  }

  function rowClass(item) {
    return Number(item.yaseer || 0) > 0 ? "has-yaseer" : "no-yaseer";
  }

  function render(list) {
    rowsEl.innerHTML = list
      .map(
        (item) => `
      <tr class="${rowClass(item)}">
        <td class="num">${item.classroom ?? ""}</td>
        <td>${item.building ?? ""}</td>
        <td>${item.grade ?? ""}</td>
        <td class="num">${Number(item.yaseer || 0)}</td>
        <td class="num">${Number(item.pending || 0)}</td>
        <td class="num">${Number(item.total || 0)}</td>
        <td>${statusChip(item)}</td>
      </tr>`
      )
      .join("");

    // إحصائيات (لو موجودة)
    if (statClasses) statClasses.textContent = list.length;
    if (statYaseer) statYaseer.textContent = list.reduce((a, x) => a + Number(x.yaseer || 0), 0);
    if (statPending) statPending.textContent = list.reduce((a, x) => a + Number(x.pending || 0), 0);
    if (statTotal) statTotal.textContent = list.reduce((a, x) => a + Number(x.total || 0), 0);
  }

  function applyFilters() {
    let list = DATA.slice();

    const q = qEl ? normalize(qEl.value) : "";
    const b = bldEl ? bldEl.value : "";
    const g = gradeEl ? gradeEl.value : "";
    const only = onlyEl ? onlyEl.value : "all";

    if (b) list = list.filter((x) => x.building === b);
    if (g) list = list.filter((x) => x.grade === g);

    if (only === "has") list = list.filter((x) => Number(x.yaseer || 0) > 0);
    if (only === "none") list = list.filter((x) => Number(x.yaseer || 0) === 0);

    if (q) {
      list = list.filter((x) => normalize(`${x.classroom} ${x.building} ${x.grade}`).includes(q));
    }

    render(list);
  }

  function reset() {
    if (qEl) qEl.value = "";
    if (bldEl) bldEl.value = "";
    if (gradeEl) gradeEl.value = "";
    if (onlyEl) onlyEl.value = "all";
    applyFilters();
  }

  function exportCSV() {
    const header = ["الفصل","المبنى","الصف","طلاب يسير","بانتظار التشخيص","إجمالي الفصل"];
    const lines = [
      header.join(","),
      ...DATA.map(x => [
        x.classroom, x.building, x.grade,
        Number(x.yaseer||0), Number(x.pending||0), Number(x.total||0)
      ].map(v => `"${String(v ?? "").replaceAll('"','""')}"`).join(","))
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yaseer-dashboard.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // اربط الأحداث لو العناصر موجودة
  if (qEl) qEl.addEventListener("input", applyFilters);
  if (bldEl) bldEl.addEventListener("input", applyFilters);
  if (gradeEl) gradeEl.addEventListener("input", applyFilters);
  if (onlyEl) onlyEl.addEventListener("input", applyFilters);
  if (resetEl) resetEl.addEventListener("click", reset);
  if (exportEl) exportEl.addEventListener("click", exportCSV);

  // تشغيل أولي
  applyFilters();
})();
