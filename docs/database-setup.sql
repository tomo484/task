-- タスク管理アプリ用のテーブル作成スクリプト
-- このSQLをSupabase SQL Editorで実行してください

-- tasksテーブル作成
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('study', 'club', 'other')),
  status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックス作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- updated_at自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atを自動更新するトリガー
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- サンプルデータの挿入（オプション）
INSERT INTO tasks (title, category, status, due_date) VALUES
('プレゼンテーション資料作成', 'study', 'todo', CURRENT_DATE),
('チームミーティング準備', 'study', 'in_progress', CURRENT_DATE + INTERVAL '1 day'),
('プロジェクト提案書レビュー', 'study', 'todo', CURRENT_DATE + INTERVAL '2 days'),
('クライアント対応', 'other', 'done', CURRENT_DATE - INTERVAL '1 day'),
('スプリント計画', 'study', 'todo', CURRENT_DATE + INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- テーブル確認
SELECT 'テーブル作成完了' AS status;
SELECT COUNT(*) AS task_count FROM tasks; 