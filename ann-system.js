/* ann-system.js — نظام شريط الإشعارات */
(function () {
  'use strict';
  var SB_URL = 'https://pyrxwqgapwjwhiskowhk.supabase.co';
  var CLOSED_KEY = 'ann_closed';

  var icons  = { default:'📢', news:'📰', alert:'🔔', important:'⚠️' };
  var labels = { default:'إشعار', news:'أخبار', alert:'تنبيه', important:'مهم' };

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function startScroll(bar, txt) {
    var pos = bar.offsetWidth, paused = false;
    txt.addEventListener('mouseenter', function(){ paused=true; });
    txt.addEventListener('mouseleave', function(){ paused=false; });
    txt.addEventListener('touchstart',  function(){ paused=!paused; }, {passive:true});
    function tick(){
      if(!paused){
        pos -= 1.0;
        if(Math.abs(pos) > txt.offsetWidth + bar.offsetWidth) pos = bar.offsetWidth;
        txt.style.transform = 'translateX('+pos+'px)';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function load() {
    try {
      if(sessionStorage.getItem(CLOSED_KEY)) return;
      var bar = document.getElementById('ann-ticker-bar');
      if(!bar) return;
      var res = await fetch(SB_URL+'/storage/v1/object/public/reports/site-announcement.json?t='+Date.now());
      if(!res.ok) return;
      var d = await res.json();
      if(!d||!d.enabled||!d.message) return;
      if(d.expiresAt && new Date(d.expiresAt)<new Date()) return;
      var t = d.type||'default';
      var bi=document.getElementById('ann-b-icon'), bl=document.getElementById('ann-b-lbl');
      if(bi) bi.textContent = icons[t]||'📢';
      if(bl) bl.textContent = labels[t]||'إشعار';
      var lnk = d.link ? ' <a style="color:#3F2E63;background:rgba(0,0,0,.1);padding:2px 10px;border-radius:8px;font-size:.76rem;text-decoration:none;" href="'+esc(d.link)+'" target="_blank" rel="noopener">← المزيد</a>' : '';
      var txt=document.getElementById('ann-scroll-txt');
      if(txt) txt.innerHTML = esc(d.message)+lnk;
      if(d.expiresAt){
        var diff=new Date(d.expiresAt)-new Date(), days=Math.floor(diff/86400000), hrs=Math.floor((diff%86400000)/3600000);
        var expEl=document.getElementById('ann-exp-col');
        if(expEl) expEl.textContent = days>0?('⏱ '+days+' يوم'):hrs>0?('⏱ '+hrs+' ساعة'):'⏱ ينتهي قريباً';
      }
      bar.style.display='block';
      if(txt) startScroll(bar,txt);
    } catch(e){}
  }

  window.annClose = function(){
    var bar=document.getElementById('ann-ticker-bar');
    if(bar) bar.style.display='none';
    try{ sessionStorage.setItem(CLOSED_KEY,'1'); }catch(e){}
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load);
  else load();
})();
