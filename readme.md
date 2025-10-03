# LIFF Minimal（UIあり完成版 v2）

- このフォルダを **Netlify → Deploys → Upload a deploy** にドラッグ＆ドロップで公開。
- 変更点：
  - 申込み：人数（2:2/3:3）、エリア、希望年齢層、自己評価スコアを追加
  - 同意：`terms.html`（利用規約）を参照できるボタンを追加
  - ホーム：距離 +3km ボタンを削除

## 本番設定（埋め込み）
```js
const APP = {
  LIFF_ID: "2008178197-ELrxabO9",
  API: "https://script.google.com/macros/s/AKfycbzvAK9-fg02CJAmAO73XyuaN3HjF0k0bDncAxtWdn2MVOhTub1T9hT8bSs9XG0_4qxC/exec"
};