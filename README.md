
# tabs-unified Drop-in Kit (no-swipe)

**目的**: ホーム / 申込み / マイページ の「下部タブのデザインを完全統一」し、
フォームのはみ出しも防いだ **差し替え用一式** です。

## ファイル構成
- `index.html` … ホーム
- `apply.html` … 申込み
- `mypage.html` … マイページ（KYCボタン + プロフィール）
- `styles.css` … 共通スタイル（下部タブ含む）
- `app.js` …（任意）プロフィールのローカル保存、JS最小限。横スワイプ無し。

## 使い方（全取り換え）
1. 既存プロジェクトの公開ルート（`index.html` が置いてある階層）に、
   この4ファイルを**そのまま置き換え**ます。
2. すべてのページの末尾には **同一のタブHTML** を入れてあります。
   遷移先は `index.html` / `apply.html` / `mypage.html` の3つです。
3. **現在のページ**だけ該当タブに `aria-current="page"` を付与しています。
   他ページに移動する際も各HTMLが同じ構造のため、見た目は完全に統一されます。

## GitHub Pagesにデプロイ
- `Settings > Pages > Build and deployment` で Source を **"Deploy from a branch"**、
  Branch を **`main` / `/ (root)`** に設定。
- 反映まで数分かかることがあります。

## カスタマイズ
- プライマリカラー：`styles.css` の `--primary`
- 背景色：`--bg`、カード角丸：`--radius`
- タブの選択状態は CSS の `.tabbar__item[aria-current="page"]` で制御

## 既知の注意
- iOS のタブ被り対策で、`main` に `padding-bottom` を付与しています。
- 既存の独自フッターがある場合は、HTMLごと削除してください（競合回避）。
