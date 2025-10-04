/* ===== api.js ===== */
(function(global){
  // ★GAS WebアプリURL（あなたの新URLに更新）
  const API_URL = "https://script.google.com/macros/s/AKfycbxoQU_HzEuDiCUuKaeznE6PJ6j5_WjNnevx9jfU137QPR9fqxUrFCa6l32pdUTACIA/exec";

  async function postJSON(body){
    const res = await fetch(API_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return res.json().catch(()=> ({}));
  }

  // localStorageの状態を収集
  function collectState(profile){
    const uid = localStorage.getItem('appUID') || '';
    const p   = JSON.parse(localStorage.getItem('profile') || '{}');
    const kyc = JSON.parse(localStorage.getItem('kyc') || '{}');
    const sub = JSON.parse(localStorage.getItem('sub') || '{}');
    const credit = Number(localStorage.getItem('credit') || '0');

    return {
      uid,
      lineUserId:   profile?.userId || '',
      displayName:  profile?.displayName || '',
      pictureUrl:   profile?.pictureUrl || '',
      statusMessage:profile?.statusMessage || '',
      profile: p, kyc, sub, credit
    };
  }

  // ログイン直後に呼ぶ
  async function syncOnLogin(profile){
    try{
      const payload = collectState(profile);
      if(!payload.uid) return;
      await postJSON({ type:'upsert_user', payload });
    }catch(e){ console.warn('syncOnLogin failed', e); }
  }

  // 任意タイミングで最新同期（プロフ保存／KYC変更／決済後など）
  async function syncNow(){
    try{
      const payload = collectState(null);
      if(!payload.uid) return;
      await postJSON({ type:'upsert_user', payload });
    }catch(e){ console.warn('syncNow failed', e); }
  }

  // イベントログ（決済など）
  async function logEvent(type, detail){
    try{
      const uid = localStorage.getItem('appUID') || '';
      await postJSON({ type:'log_event', payload:{ uid, type, detail, ts:Date.now() } });
    }catch(e){ console.warn('logEvent failed', e); }
  }

  // 公開
  global.SYNC = { API_URL, syncOnLogin, syncNow, logEvent };
})(window);
