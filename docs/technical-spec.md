# タスク管理アプリ - 技術仕様書

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15.3.3
- **言語**: TypeScript
- **スタイリング**: TailwindCSS v4
- **状態管理**: React useState
- **アイコン**: React Icons
- **日付処理**: date-fns
- **HTTP クライアント**: Supabase JavaScript SDK

### バックエンド・インフラ
- **データベース**: Supabase (PostgreSQL)
- **認証**: なし（シンプルな個人利用）
- **デプロイ**: Vercel
- **環境**: 開発・本番共に無料枠

## データベース設計

### テーブル設計

#### tasks テーブル
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

-- インデックス
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
```

### データ型定義

```typescript
type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskCategory = 'study' | 'club' | 'other';

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  due_date: string | null; // ISO date string
  created_at: string;
  updated_at: string;
}

interface TaskInput {
  title: string;
  category: TaskCategory;
  due_date?: string | null;
}
```

## バックエンド設計

### Server Actions（app/lib/actions/task-actions.ts）

```typescript
'use server'

import { supabase } from '@/lib/supabase'
import { TaskInput, Task, TaskStatus } from '@/lib/types'
import { revalidatePath } from 'next/cache'

// 今日のタスク取得
export async function getTodayTasks(): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .or(`due_date.is.null,due_date.lte.${today}`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// 週間タスク取得
export async function getWeeklyTasks(): Promise<Task[]> {
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .gte('due_date', startOfWeek.toISOString().split('T')[0])
    .lte('due_date', endOfWeek.toISOString().split('T')[0])
    .order('due_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

// タスク作成
export async function createTask(taskInput: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskInput])
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/weekly')
  return data
}

// タスクステータス更新
export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/weekly')
}

// タスク削除
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/weekly')
}
```

## コンポーネント設計

### ディレクトリ構造
```
app/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ProgressBar.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskAddModal.tsx
│   │   └── TaskList.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navigation.tsx
├── lib/
│   ├── actions/
│   │   └── task-actions.ts   // Server Actions (バックエンド処理)
│   ├── supabase.ts           // Supabase client設定
│   ├── types.ts              // 型定義
│   └── utils.ts              // ユーティリティ関数
├── page.tsx (今日のタスク)
├── weekly/
│   └── page.tsx (週間ビュー)
└── globals.css
```

### 主要コンポーネント仕様

#### TaskCard.tsx
```typescript
import { updateTaskStatus, deleteTask } from '@/lib/actions/task-actions'

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  // Server Actionsを直接使用
  const handleStatusChange = async (status: TaskStatus) => {
    await updateTaskStatus(task.id, status)
  }
  
  const handleDelete = async () => {
    await deleteTask(task.id)
  }
  
  // タスク表示とアクション
}
```

#### KanbanColumn.tsx
```typescript
interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export default function KanbanColumn({ title, status, tasks }: KanbanColumnProps) {
  // カンバン列の表示（TaskCardがServer Actionsを処理）
}
```

#### TaskAddModal.tsx
```typescript
import { createTask } from '@/lib/actions/task-actions'

interface TaskAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskAddModal({ isOpen, onClose }: TaskAddModalProps) {
  // Server Actionを使用したフォーム送信
  const handleSubmit = async (formData: FormData) => {
    const taskInput: TaskInput = {
      title: formData.get('title') as string,
      category: formData.get('category') as TaskCategory,
      due_date: formData.get('due_date') as string || null,
    }
    
    await createTask(taskInput)
    onClose()
  }
  
  // フォーム表示
}
```

## 状態管理設計

### アプリケーション状態
```typescript
// app/page.tsx
interface AppState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

// カスタムフック例
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD操作関数
  const addTask = async (taskInput: TaskInput) => { /* ... */ };
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => { /* ... */ };
  const deleteTask = async (taskId: string) => { /* ... */ };

  return { tasks, loading, error, addTask, updateTaskStatus, deleteTask };
}
```

## 環境設定

### 環境変数
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase設定
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 開発計画

### Phase 1: 基本機能（3時間）
1. プロジェクトセットアップ・Supabase接続
2. データベース設計・テーブル作成
3. タスク一覧表示・カンバンレイアウト
4. タスク追加・削除機能

### Phase 2: 拡張機能（2時間）
1. タスク完了・ステータス変更
2. 期限管理・アラート表示
3. 進捗バー実装
4. 週間ビュー（時間があれば）

### 時間配分
- セットアップ: 30分
- DB・API: 45分
- UI実装: 2時間
- 機能実装: 1時間30分
- テスト・調整: 15分

## パフォーマンス考慮事項

### 最適化ポイント
- タスク数制限（50件）により、ページネーション不要
- リアルタイム更新は実装しない（シンプル化）
- 画像・ファイル添付機能なし
- ISR（Incremental Static Regeneration）は使用しない

### Lighthouse目標
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+ 