
// Optional JS: save profile locally (no backend). No swipe; tabs are normal links.
(function(){
  const form = document.querySelector('#profile-form');
  if(form){
    const fields = ['nickname','age','hobby'];
    // Load
    fields.forEach(k=>{
      const el = form.querySelector(`[name="${k}"]`);
      if(!el) return;
      const v = localStorage.getItem('profile.'+k);
      if(v!==null) el.value = v;
    });
    // Save
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      Object.entries(data).forEach(([k,v])=> localStorage.setItem('profile.'+k, v));
      alert('保存しました');
    });
    // Reset clears storage
    form.addEventListener('reset', ()=>{
      ['nickname','age','hobby'].forEach(k=> localStorage.removeItem('profile.'+k));
    });
  }
})();
