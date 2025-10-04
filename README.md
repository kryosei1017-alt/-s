# LIFF Minimal 完成版 v3.1（KYC・年齢注意つき）

## 使い方
1. この4ファイルを同じフォルダに保存  
   - index.html / apply.html / mypage.html / terms.html
2. Netlify → Deploys → Upload a deploy にフォルダをZIP圧縮してアップロード（またはドラッグでフォルダ丸ごとデプロイ対応の場合はそのまま）。
3. LIFFのエンドポイントURLにデプロイ先のURLを設定。

## 本番設定（埋め込み）
```js
const APP = {
  LIFF_ID: "2008178197-ELrxabO9",
  API: "https://script.google.com/macros/s/AKfycbzvAK9-fg02CJAmAO73XyuaN3HjF0k0bDncAxtWdn2MVOhTub1T9hT8bSs9XG0_4qxC/exec"
};
