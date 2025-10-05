/* ===== api.js (front) ===== */
const SYNC = (() => {
  // あなたの /exec URL
  const API_URL = 'https://script.google.com/macros/s/AKfycbz6_13624N9r9R4FR0T0LnS1OB3mZ3uTTr1XV0o5AmU3yWHl7JLSwn3Guh7fHyPgK35/exec';

  // CORS プリフライト回避のため text/plain を使用
  async function post(type, payload){
    try{
      const r = await fetch(API_URL, {
        method:'POST',
        headers:{ 'Content-Type':'text/plain;charset=utf-8' },
        body: JSON.stringify({type, payload})
      });
      const txt = await r.text();
      let json; try{ json = JSON.parse(txt); } catch { json = {ok:false, parseError:txt}; }
      if(!r.ok || json.ok === false) console.error('API NG', r.status, json);
      return json;
    }catch(e){
      console.error('API ERR', e);
      return {ok:false, error:String(e)};
    }
  }

  async function syncOnLogin(profile){
    const uid = localStorage.getItem('appUID') || '';
    const payload = {
      uid,
      lineUserId: profile?.userId || '',
      displayName: profile?.displayName || '',
      pictureUrl: profile?.pictureUrl || '',
      statusMessage: profile?.statusMessage || '',
      credit: Number(localStorage.getItem('credit')||'0'),
      profile: JSON.parse(localStorage.getItem('profile')||'{}'),
      kyc:     JSON.parse(localStorage.getItem('kyc')||'{}'),
      sub:     JSON.parse(localStorage.getItem('sub')||'{}'),
    };
    return await post('upsert_user', payload);
  }

  async function logEvent(type, detail){
    const uid = localStorage.getItem('appUID') || '';
    return await post('log_event', {uid, type, detail});
  }

  async function syncNow(){
    let pf=null;
    if(window.liff && liff.getProfile){
      try{ pf = await liff.getProfile(); }catch(_){}
    }
    return await syncOnLogin(pf);
  }

  return { API_URL, post, syncOnLogin, syncNow, logEvent };
})();
