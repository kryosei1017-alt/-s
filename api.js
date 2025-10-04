/* ===== api.js ===== */
(function(global){
  // ★ あなたのGAS WebアプリのURL（そのままでOK。差し替える場合はここだけ変えればOK）
  const API_URL = "https://script.google.com/macros/s/AKfycbzvAK9-fg02CJAmAO73XyuaN3HjF0k0bDncAxtWdn2MVOhTub1T9hT8bSs9XG0_4qxC/exec";

  async function postJSON(body){
    const res = await fetch(API_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return res.json().catch(()=> ({}));
  }

  // localStorage から現在の状態を集める
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

  // ログイン直後に1回呼ぶ用
  async function syncOnLogin(profile){
    try{
      const payload = collectState(profile);
      if(!payload.uid) return;
      await postJSON({ type:'upsert_user', payload });
    }catch(e){ console.warn('syncOnLogin failed', e); }
  }

  // いつでも最新を送る用（プロフィール保存後やKYC変更後など）
  async function syncNow(){
    try{
      const payload = collectState(null);
      if(!payload.uid) return;
      await postJSON({ type:'upsert_user', payload });
    }catch(e){ console.warn('syncNow failed', e); }
  }

  // イベント（決済など）を履歴シートに追記
  async function logEvent(type, detail){
    try{
      const uid = localStorage.getItem('appUID') || '';
      await postJSON({ type:'log_event', payload:{ uid, type, detail, ts:Date.now() } });
    }catch(e){ console.warn('logEvent failed', e); }
  }

  // グローバル公開
  global.SYNC = { API_URL, syncOnLogin, syncNow, logEvent };
})(window);
