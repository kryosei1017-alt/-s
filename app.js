/* ===== My Page state ===== */
const KYC_STATE = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
};

const els = {
  viewNickname: document.getElementById('viewNickname'),
  verifiedBadge: document.getElementById('verifiedBadge'),
  kycStateText: document.getElementById('kycStateText'),
  kycStatusPill: document.getElementById('kycStatusPill'),
  btnStartKyc: document.getElementById('btnStartKyc'),
  btnRetakeKyc: document.getElementById('btnRetakeKyc'),
  inputNickname: document.getElementById('inputNickname'),
  inputAge: document.getElementById('inputAge'),
  inputHobbies: document.getElementById('inputHobbies'),
  profileForm: document.getElementById('profileForm'),
  btnClearProfile: document.getElementById('btnClearProfile'),
  avatar: document.getElementById('avatar'),
};

const storage = {
  getProfile() { try { return JSON.parse(localStorage.getItem('profile') || '{}'); } catch { return {}; } },
  setProfile(p) { localStorage.setItem('profile', JSON.stringify(p)); },
  getKyc() { return localStorage.getItem('kycState') || KYC_STATE.UNVERIFIED; },
  setKyc(state) { localStorage.setItem('kycState', state); },
};

function initMyPage() {
  if (!els.profileForm) return; // 他ページ読み込み時は何もしない

  // プロフィール読込
  const p = storage.getProfile();
  els.inputNickname.value = p.nickname || '';
  els.inputAge.value = p.age || '';
  els.inputHobbies.value = p.hobbies || '';
  els.viewNickname.textContent = p.nickname || 'ニックネーム未設定';

  // LINEのアイコン取得（あれば）
  if (window.liff && typeof liff.getProfile === 'function') {
    liff.getProfile().then(pr => {
      if (pr?.pictureUrl) {
        els.avatar.src = pr.pictureUrl;
      } else {
        // 画像URLなしなら非表示（alt文字が出ないように）
        els.avatar.style.display = 'none';
      }
    }).catch(() => { els.avatar.style.display = 'none'; });
  } else {
    els.avatar.style.display = 'none';
  }

  // KYC状態反映
  applyKycUI(storage.getKyc());

  // イベント
  els.profileForm.addEventListener('submit', onSaveProfile);
  els.btnClearProfile.addEventListener('click', onResetProfile);
  els.btnStartKyc.addEventListener('click', onStartKyc);
  els.btnRetakeKyc.addEventListener('click', onRetakeKyc);
}

function onSaveProfile(e) {
  e.preventDefault();
  const next = {
    nickname: els.inputNickname.value.trim(),
    age: els.inputAge.value.trim(),
    hobbies: els.inputHobbies.value.trim(),
  };
  storage.setProfile(next);
  els.viewNickname.textContent = next.nickname || 'ニックネーム未設定';
  toast('プロフィールを保存しました');
}

function onResetProfile() {
  els.inputNickname.value = '';
  els.inputAge.value = '';
  els.inputHobbies.value = '';
  storage.setProfile({});
  els.viewNickname.textContent = 'ニックネーム未設定';
  toast('プロフィールをリセットしました');
}

function onStartKyc() {
  storage.setKyc(KYC_STATE.PENDING);
  applyKycUI(KYC_STATE.PENDING);
  toast('本人確認を開始しました（デモ）');
  // デモ：3秒後に確認済みに
  setTimeout(() => {
    storage.setKyc(KYC_STATE.VERIFIED);
    applyKycUI(KYC_STATE.VERIFIED);
    toast('本人確認が完了しました（デモ）');
  }, 3000);
}

function onRetakeKyc() {
  storage.setKyc(KYC_STATE.PENDING);
  applyKycUI(KYC_STATE.PENDING);
  toast('再撮影フローへ（デモ）');
}

function applyKycUI(state) {
  let text = '本人確認：';
  els.btnRetakeKyc.hidden = !(state === KYC_STATE.PENDING || state === KYC_STATE.VERIFIED);

  if (state === KYC_STATE.UNVERIFIED) {
    els.kycStatusPill.className = 'pill pill-gray';
    els.kycStatusPill.textContent = '未確認';
    els.kycStateText.textContent = text + '未確認';
    els.verifiedBadge.hidden = true;
    els.btnStartKyc.hidden = false;
  } else if (state === KYC_STATE.PENDING) {
    els.kycStatusPill.className = 'pill pill-blue';
    els.kycStatusPill.textContent = '審査中';
    els.kycStateText.textContent = text + '審査中';
    els.verifiedBadge.hidden = true;
    els.btnStartKyc.hidden = true;
  } else {
    els.kycStatusPill.className = 'pill pill-green';
    els.kycStatusPill.textContent = '本人確認済み';
    els.kycStateText.textContent = text + '本人確認済み';
    els.verifiedBadge.hidden = false;
    els.btnStartKyc.hidden = true;
  }
}

/* シンプルなトースト */
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;opacity:0;transition:opacity .2s';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(()=> t.style.opacity = '0', 1600);
}

document.addEventListener('DOMContentLoaded', initMyPage);
