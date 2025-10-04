// =====================
// LIFF 初期化（共通）
// =====================
const LIFF_ID = "REPLACE_WITH_YOUR_LIFF_ID"; // ← あなたのLIFF IDに置換

async function initLiff(){
  try{
    if(!LIFF_ID || LIFF_ID.startsWith("REPLACE_")) {
      console.warn("LIFF_ID を設定してください");
      return;
    }
    await liff.init({ liffId: LIFF_ID });
    // ログインしてなければログイン（必要なら有効化）
    // if(!liff.isLoggedIn()) liff.login();
  }catch(e){
    console.error("LIFF init error:", e);
  }
}
initLiff();

// =====================
// 画面別の動き（最小限）
// =====================
document.addEventListener("DOMContentLoaded", ()=>{
  // --- マイページ：プロフィール保存（ローカル）
  const profileForm = document.querySelector("#profile-form");
  if(profileForm){
    const fields = ["nickname","age","hobby"];
    // Load
    fields.forEach(k=>{
      const el = profileForm.querySelector(`[name="${k}"]`);
      const v = localStorage.getItem("profile."+k);
      if(el && v!==null) el.value = v;
    });
    // Save
    profileForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(profileForm).entries());
      Object.entries(data).forEach(([k,v])=> localStorage.setItem("profile."+k, v));
      alert("保存しました");
    });
    // Reset
    profileForm.addEventListener("reset", ()=>{
      ["nickname","age","hobby"].forEach(k=> localStorage.removeItem("profile."+k));
    });

    // KYC ボタン（ダミー：必要に応じて実装を接続）
    const kycBtn = document.getElementById("start-kyc");
    if(kycBtn){
      kycBtn.addEventListener("click", ()=>{
        // 例：liff.openWindow({ url: "https://example.com/kyc", external: true });
        alert("本人確認フローを起動（実装に接続してください）");
      });
    }
  }

  // --- 申込み：送信ハンドラ（ダミー）
  const applyForm = document.querySelector("#apply-form");
  if(applyForm){
    applyForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(applyForm).entries());
      console.log("apply payload:", payload);
      // 決済や抽選APIに接続する場所
      alert("申込みを受け付けました。決済・抽選処理を接続してください。");
      applyForm.reset();
    });
  }
});
