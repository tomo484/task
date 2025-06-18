# タスク管理アプリ - 開発計画To-doリスト

## 全体概要
- **総開発時間**: 5時間
- **技術スタック**: Next.js + TypeScript + TailwindCSS + Supabase
- **目標**: 学生向けシンプルタスク管理アプリ

---

## Phase 1: プロジェクトセットアップ（30分）

### 1.1 環境構築 (15分)
- [ ] Supabaseアカウント作成・プロジェクト作成
- [ ] Supabaseの環境変数取得（URL、ANON_KEY）
- [ ] `.env.local`ファイル作成・環境変数設定
- [ ] 必要なパッケージインストール
  - [ ] `pnpm add @supabase/supabase-js`
  - [ ] `pnpm add date-fns`
  - [ ] `pnpm add react-icons`

### 1.2 基本設定 (15分)
- [ ] `lib/supabase.ts`ファイル作成・Supabaseクライアント設定
- [ ] `lib/types.ts`ファイル作成・型定義
- [ ] `lib/utils.ts`ファイル作成・ユーティリティ関数
- [ ] 既存の`app/page.tsx`を一旦クリア
- [ ] TailwindCSSの基本設定確認

---

## Phase 2: データベース設計・テーブル作成（30分）

### 2.1 Supabase Database設定 (15分)
- [ ] Supabase Dashboardにアクセス
- [ ] Database > SQL Editorで新しいクエリ作成
- [ ] `tasks`テーブル作成SQLを実行
  ```sql
  CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('study', 'club', 'other')),
    status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
  ```
- [ ] インデックス作成SQL実行
- [ ] RLS（Row Level Security）設定を無効化（個人利用のため）

### 2.2 Server Actions作成 (15分)
- [ ] `lib/actions/`ディレクトリ作成
- [ ] `lib/actions/task-actions.ts`ファイル作成
- [ ] `getTodayTasks()`関数実装
- [ ] `getWeeklyTasks()`関数実装
- [ ] `createTask()`関数実装
- [ ] `updateTaskStatus()`関数実装
- [ ] `deleteTask()`関数実装

---

## Phase 3: 基本UI実装（2時間）

### 3.1 共通UIコンポーネント作成 (30分)
- [ ] `components/ui/`ディレクトリ作成
- [ ] `components/ui/Button.tsx`作成
  - [ ] プライマリ・セカンダリ・危険ボタンのバリエーション
  - [ ] サイズバリエーション（sm, md, lg）
- [ ] `components/ui/Modal.tsx`作成
  - [ ] 基本モーダル構造
  - [ ] オーバーレイクリックで閉じる機能
  - [ ] ESCキーで閉じる機能
- [ ] `components/ui/ProgressBar.tsx`作成
  - [ ] パーセンテージ表示
  - [ ] アニメーション付きプログレスバー

### 3.2 レイアウトコンポーネント作成 (30分)
- [ ] `components/layout/`ディレクトリ作成
- [ ] `components/layout/Header.tsx`作成
  - [ ] アプリタイトル表示
  - [ ] "Add Task"ボタン配置
  - [ ] 進捗バー表示エリア
- [ ] `components/layout/Navigation.tsx`作成
  - [ ] "Today"・"Weekly View"タブ
  - [ ] アクティブタブのハイライト

### 3.3 タスク関連コンポーネント作成 (60分)
- [ ] `components/tasks/`ディレクトリ作成
- [ ] `components/tasks/TaskCard.tsx`作成 (20分)
  - [ ] タスクタイトル表示
  - [ ] カテゴリアイコン・色分け表示
  - [ ] 期限表示（今日=赤、明日=オレンジ、それ以降=グレー）
  - [ ] 完了・削除ボタン
  - [ ] Server Actions統合
- [ ] `components/tasks/KanbanColumn.tsx`作成 (20分)
  - [ ] 列タイトル（To Do, In Progress, Done）
  - [ ] TaskCardの一覧表示
  - [ ] 空状態の表示
- [ ] `components/tasks/TaskAddModal.tsx`作成 (20分)
  - [ ] タスク名入力フィールド
  - [ ] カテゴリ選択（ラジオボタン）
  - [ ] 期限日付選択
  - [ ] キャンセル・追加ボタン
  - [ ] フォーム送信・Server Actions統合

---

## Phase 4: メイン機能実装（1時間30分）

### 4.1 今日のタスク画面実装 (45分)
- [ ] `app/page.tsx`の実装
- [ ] `getTodayTasks()`でのデータ取得
- [ ] カンバンレイアウトの実装
- [ ] タスクのステータス別表示
- [ ] 進捗計算・プログレスバー表示
- [ ] タスク追加モーダルの統合
- [ ] Server Actionsとの連携確認

### 4.2 週間ビュー画面実装 (30分)
- [ ] `app/weekly/`ディレクトリ作成
- [ ] `app/weekly/page.tsx`の実装
- [ ] `getWeeklyTasks()`でのデータ取得
- [ ] 週間カレンダー表示
- [ ] 週間進捗表示
- [ ] タスク一覧表示

### 4.3 ナビゲーション・画面遷移実装 (15分)
- [ ] タブ切り替え機能実装
- [ ] アクティブページのハイライト
- [ ] モーダル開閉の状態管理

---

## Phase 5: 期限管理・アラート機能（30分）

### 5.1 期限アラート実装 (15分)
- [ ] 期限チェック関数作成
- [ ] 今日期限のタスクを赤色表示
- [ ] 明日期限のタスクをオレンジ色表示
- [ ] 期限切れタスクの特別表示

### 5.2 進捗可視化改善 (15分)
- [ ] 今日の完了率計算
- [ ] 週間完了率計算
- [ ] カテゴリ別進捗表示
- [ ] アニメーション効果追加

---

## Phase 6: スタイリング・UX改善（45分）

### 6.1 デザインシステム統一 (20分)
- [ ] カラーパレット適用
  - [ ] プライマリ: #3B82F6 (青)
  - [ ] セカンダリ: #10B981 (緑)
  - [ ] 警告: #F59E0B (オレンジ)
  - [ ] エラー: #EF4444 (赤)
- [ ] タイポグラフィ統一
- [ ] スペーシング統一
- [ ] ボーダー・影の統一

### 6.2 インタラクション改善 (15分)
- [ ] ホバー効果追加
- [ ] フォーカス状態のスタイリング
- [ ] ローディング状態表示
- [ ] トランジション効果追加

### 6.3 レスポンシブ対応 (10分)
- [ ] デスクトップ（1024px以上）の調整
- [ ] タブレット（768px以上）の調整
- [ ] モーダルのレスポンシブ対応

---

## Phase 7: テスト・デバッグ・最終調整（15分）

### 7.1 機能テスト (10分)
- [ ] タスク作成機能テスト
- [ ] タスク完了機能テスト
- [ ] タスク削除機能テスト
- [ ] ステータス変更機能テスト
- [ ] 画面遷移テスト
- [ ] モーダル開閉テスト

### 7.2 最終調整 (5分)
- [ ] エラーハンドリング確認
- [ ] ローディング状態確認
- [ ] データベース接続確認
- [ ] パフォーマンス確認
- [ ] 見た目の最終チェック

---

## 開発進捗管理

### 時間管理
- [ ] Phase 1完了 (30分経過)
- [ ] Phase 2完了 (1時間経過)
- [ ] Phase 3完了 (3時間経過)
- [ ] Phase 4完了 (4時間30分経過)
- [ ] Phase 5完了 (5時間経過)
- [ ] Phase 6完了 (予備時間)
- [ ] Phase 7完了 (最終確認)

### 優先度調整
**時間が不足した場合の優先順位：**
1. Phase 1-4（必須機能）
2. Phase 5（期限管理）
3. Phase 6（スタイリング）
4. Phase 7（テスト・調整）

**余裕がある場合の追加機能：**
- [ ] タスク編集機能
- [ ] 詳細なフィルタリング
- [ ] ダークモード
- [ ] アニメーション強化

---

## 完了基準

### 最小機能要件（MVP）
- [x] タスクの作成・表示・削除
- [x] カンバン形式でのステータス管理
- [x] 期限管理・アラート
- [x] 今日・週間ビューの切り替え
- [x] 進捗表示

### 成功指標
- [ ] 5時間以内での完成
- [ ] 基本機能の動作確認
- [ ] UI/UXの満足度
- [ ] Supabaseとの正常な連携
- [ ] エラーのない動作 