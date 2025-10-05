// api.js —— 丸ごと貼り替え（GASへの送信を安定化）
(function(){
  // 既存があれば再利用（重複定義エラー回避）
  window.APP = window.APP || {};

  // ▼ 必ずあなたの「新しいWebアプリURL」に更新（今回これ）
  APP.API     = "https://script.google.com/macros/s/AKfycbz6_13624N9r9R4FR0T0LnS1OB3mZ3uTTr1XV0o5AmU3yWHl7JLSwn3Guh7fHyPgK35/exec";
  // ▼ LIFF ID（必要なら入れ替え可）
  APP.LIFF_ID = APP.LIFF_ID || "2008178197-ELrxabO9";

  // ------- 内部ユーティリティ -------
  const jget = (k) => JSON.parse(localStorage.getItem(k) || "null");
  const sget = (k) => localStorage.getItem(k);

  function _uid(){ return sget('uid') || ''; }

  function _mergeProfile(){
    const p = jget('profile') || {};
    const name = (p.name ?? sget('prof.name') ?? '').toString().trim();
    const age  = (p.age  ?? sget('prof.age')  ?? '').toString().trim();
    const area = (p.area ?? sget('prof.area') ?? '').toString().trim();
    return {
      name, age, area,
      hobby:   p.hobby   ?? sget('prof.hobby')   ?? '',
      like:    p.like    ?? sget('prof.like')    ?? '',
      usually: p.usually ?? sget('prof.usually') ?? '',
      job:     p.job     ?? sget('prof.job')     ?? '',
      school:  p.school  ?? sget('prof.school')  ?? '',
      free:    p.free    ?? sget('prof.free')    ?? ''
    };
  }

  function _mergeKyc(){
    const k = jget('kyc') || {};
    const verified = (k.verified !== undefined) ? k.verified : (sget('kyc.verified') === 'true');
    const gender   = (k.gender   !== undefined) ? k.gender   : (sget('kyc.gender')  || '');
    return { verified, gender };
  }

  function _sub(){ return jget('sub') || {}; }

  // ▼ プリフライト回避してGASへ投げる（レスポンスは読まない）
  async function postGAS(payload){
    try{
      await fetch(APP.API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' }, // ← preflight回避
        body: JSON.stringify(payload)
      });
    }catch(e){
      console.warn('[postGAS]', e);
    }
  }

  // ------- 公開API（apply.html / mypage.html から呼び出し） -------
  window.SYNC = {
    // ログイン直後などでユーザーをUpsert
    syncOnLogin: async (liffProfile)=>{
      try{
        if(liffProfile && liffProfile.userId){ localStorage.setItem('uid', liffProfile.userId); }
        await postGAS({
          type:'upsert_user',
          payload:{
            uid: _uid(),
            profile: _mergeProfile(),
            credit: Number(sget('credit')||0),
            kyc: _mergeKyc(),
            sub: _sub()
          }
        });
      }catch(e){ console.warn(e); }
    },

    // 任意のユーザー更新
    upsertUser: async (data)=>{
      await postGAS({ type:'upsert_user', payload:data });
    },

    // ★ 申込み確定 → スプレッドシート Applications に1行追加
    syncOnApply: async (dataFromPage)=>{
      const applyInput = jget('apply.input') || {}; // {members, area, age, self, friends}
      const pay        = dataFromPage?.pay || {};
      await postGAS({
        type:'apply',
        payload:{
          uid: _uid(),
          ts: new Date().toISOString(),
          input: applyInput,
          profile: _mergeProfile(),
          kyc: _mergeKyc(),
          sub: _sub(),
          pay,
          creditAfter: Number(sget('credit')||0)
        }
      });
    },

    // 任意ログ
    logEvent: async (name, data)=>{
      await postGAS({ type:'log', payload:{ uid:_uid(), name, data, ts:Date.now() } });
    }
  };
})();
