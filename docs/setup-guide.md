# タスク管理アプリ - セットアップガイド

## 🚀 完成状況

✅ **フロントエンド実装完了**
- Phase 3: UIコンポーネント（Button, Modal, ProgressBar）
- Phase 3: レイアウトコンポーネント（Header, Navigation）  
- Phase 3: タスク関連コンポーネント（TaskCard, KanbanColumn, TaskAddModal）
- Phase 4: メインページ（今日のタスク + カンバンボード + 週間ビュー）

✅ **バックエンド実装完了**
- Phase 1: プロジェクト基盤（型定義、ユーティリティ関数）
- Phase 2: Server Actions（全CRUD操作）

## 📋 セットアップ手順

### 1. 依存関係のインストール
```bash
pnpm install
```

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. プロジェクト設定画面から以下を取得：
   - Project URL
   - Anon Key

### 3. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. データベーステーブルの作成

1. Supabase Dashboard → SQL Editor
2. `docs/database-setup.sql` の内容をコピー&ペースト
3. 実行してテーブルとサンプルデータを作成

### 5. アプリケーションの起動

```bash
pnpm dev
```

## 🎯 実装済み機能

### ✅ Phase 1-2: バックエンド基盤
- [x] Supabaseクライアント設定
- [x] 型定義（Task, UI関連）
- [x] ユーティリティ関数（日付処理、進捗計算、カテゴリ管理）
- [x] Server Actions（CRUD操作完備）

### ✅ Phase 3: UIコンポーネント
- [x] Button（プライマリ、セカンダリ、危険ボタン）
- [x] Modal（ESCキー、オーバーレイクリックで閉じる）
- [x] ProgressBar（アニメーション付き）
- [x] Header（検索、通知、プロフィール）
- [x] Navigation（Today/Weekly切り替え）
- [x] TaskCard（ステータス更新、削除機能）
- [x] KanbanColumn（3列カンバンレイアウト）
- [x] TaskAddModal（フォーム、カテゴリ選択、日付選択）

### ✅ Phase 4: メイン機能
- [x] 今日のタスク表示
- [x] カンバンボード（To Do, In Progress, Done）
- [x] 週間ビュー
- [x] 進捗バー表示
- [x] タスク作成・更新・削除
- [x] ナビゲーション（タブ切り替え）

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: `#0D80F2` (ブルー)
- **セカンダリ**: `#E8EDF5` (ライトグレー)  
- **テキスト**: `#0D141C` (ダークグレー)
- **サブテキスト**: `#4A739C` (ミディアムブルー)
- **背景**: `#F7FAFC` (ライトグレー)
- **進捗バー**: `#CFDBE8` (グレー) / `#0D80F2` (ブルー)

### フォント
- **Lexend**: メイン UI フォント（Google Fonts）

### UI原則
- 8px border-radius
- アニメーション付きトランジション
- レスポンシブ対応
- アクセシビリティ考慮

## 📁 ファイル構成

```
app/
├── components/
│   ├── ui/              # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/          # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   └── tasks/           # タスク関連コンポーネント
│       ├── TaskCard.tsx
│       ├── KanbanColumn.tsx
│       └── TaskAddModal.tsx
├── lib/
│   ├── actions/         # Server Actions
│   │   └── task-actions.ts
│   ├── supabase.ts      # Supabaseクライアント
│   ├── types.ts         # 型定義
│   └── utils.ts         # ユーティリティ関数
├── globals.css          # グローバルスタイル
└── page.tsx            # メインページ

public/icons/            # SVGアイコン（Figmaからエクスポート）
docs/
├── database-setup.sql   # データベース作成スクリプト
└── setup-guide.md      # このファイル
```

## 🚀 これで完成！

すべてのPhase 3・4の実装が完了しました。Figmaデザインに忠実に、現代的で使いやすいタスク管理アプリが完成しています。

### 主な特徴
- 📋 直感的なカンバンボード
- 📊 リアルタイム進捗表示
- 📅 日付ベースのタスク管理
- 🎨 モダンなUI/UX
- ⚡ 高速なNext.js + Supabase
- 📱 レスポンシブ対応

アプリケーションを起動して、タスク管理を始めましょう！ 