import type { ReactNode } from 'react';
// タスクの状態定義
export type TaskStatus = 'todo' | 'in_progress' | 'done';

// タスクのカテゴリ定義
export type TaskCategory = 'study' | 'club' | 'other';

// タスクの基本インターフェース
export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  due_date: string | null; // ISO date string
  created_at: string;
  updated_at: string;
}

// タスク作成時の入力データ
export interface TaskInput {
  title: string;
  category: TaskCategory;
  status?: TaskStatus; // デフォルトは'todo'
  due_date?: string | null;
}

// アプリケーションの状態管理用インターフェース
export interface AppState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

// UI関連の型定義
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export interface ProgressBarProps {
  percentage: number;
  showText?: boolean;
  className?: string;
} 