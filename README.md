# 麻雀 点棒・記録ツール

雀卓の横にPCを置き、モニターに繋いで対局中の点数をリアルタイムで可視化するデジタル点棒・記録管理アプリです。

## 技術スタック

- **Framework**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting 想定の SPA

## 開発

```bash
npm install
npm run dev
```

## ビルド・Firebase デプロイ

### 1. ビルドする

```bash
npm run build
```

`dist/` フォルダに本番用ファイルが出力されます。

### 2. Firebase の準備（初回のみ）

1. **Firebase CLI を入れる**
   ```bash
   npm install -g firebase-tools
   ```
   または `npx firebase-tools` で都度実行しても可。

2. **ログイン**
   ```bash
   firebase login
   ```
   ブラウザで Google アカウント認証します。別アカウントに切り替える場合は `firebase logout` のあと再度 `firebase login` を実行してください。

3. **プロジェクトを紐づける**
   - 既存プロジェクトを使う場合:
     ```bash
     firebase use <プロジェクトID>
     ```
   - 新規プロジェクトを作る場合: [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成後、上記で `firebase use <プロジェクトID>` を実行。

### 3. デプロイする

```bash
firebase deploy
```

Hosting の URL（例: `https://<プロジェクトID>.web.app`）が表示されます。

### ビルドとデプロイをまとめて実行

```bash
npm run deploy
```

## 機能

- **4人分のプレイヤー領域**（東家・南家・西家・北家）  
  画面上は左上から時計回りに東家→南家→西家→北家の順で固定表示。名前入力・親は背景色で強調。
- **持ち点**  
  タップで直接編集可能。リーチ・あがりで自動計算。
- **リーチ**  
  1,000点減・供託+1。その局ではリーチボタン無効。
- **あがり**  
  点数テーブルから選択（ツモ時は「500 ALL」「1300-2600」などの実際の点数移動表記＋主な役・符翻、ロン時は和了点＋役・符翻）。  
  - **ツモ**: 和了者以外はそれぞれ「あがり点 + 本場数×100」を和了者に支払い。  
  - **ロン**: 放銃者のみ「あがり点 + 本場数×300」＋供託を和了者に支払い。
- **流局**  
  テンパイ者を選択し、ノーテン罰符（計3,000点）を自動分配。流局時は供託はそのまま（次にあがりが出たときに和了者が回収）。
- **戻る(Undo)**  
  点数・名前・局・本場・供託・リーチ・あがり・流局・終了を1手前に戻す。
- **終了**  
  最終順位・スコアを表示。
- **リセット**  
  全データを初期状態（25,000点・プレイヤー名リセット）に戻す。
- **永続化**  
  localStorage でブラウザを閉じてもデータを保持。
- **スリープ防止**  
  Screen Wake Lock API で対局中の画面消灯を防止。
