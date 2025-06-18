import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// カテゴリカラー取得
export function getCategoryColor(category: string) {
  switch (category) {
    case 'study':
      return 'bg-blue-500';
    case 'club':
      return 'bg-green-500';
    case 'other':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}

// カテゴリアイコン取得
export function getCategoryIcon(category: string) {
  switch (category) {
    case 'study':
      return '📚';
    case 'club':
      return '⚽';
    case 'other':
      return '📝';
    default:
      return '📋';
  }
}

// タスク進捗計算
export function calculateProgress(tasks: Task[]) {
  if (!tasks || tasks.length === 0) return 0;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const percentage = Math.round((doneCount / tasks.length) * 100);
  return percentage;
}

// タスクをステータスごとにグループ化
export function groupTasksByStatus(tasks: Task[]) {
  return tasks.reduce(
    (acc, task) => {
      (acc[task.status] = acc[task.status] || []).push(task);
      return acc;
    },
    { todo: [], in_progress: [], done: [] } as Record<string, Task[]>
  );
}

// 週の開始日（月曜日）を取得
export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の開始とする
  return new Date(d.setDate(diff));
}

// 日付に日数を追加
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 曜日名を取得（英語）
export function getDayName(dayIndex: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayIndex];
}

// 週間データ計算関数
export function calculateWeeklyData(tasks: Task[]) {
  const weekData = [];
  const startOfWeek = getStartOfWeek(); // 今週の月曜日
  
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startOfWeek, i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // その日のタスクを取得
    const dayTasks = tasks.filter(task => task.due_date === dateString);
    
    // 完了したタスクを計算
    const completedTasks = dayTasks.filter(task => task.status === 'done');
    const completionRate = dayTasks.length > 0 
      ? Math.round((completedTasks.length / dayTasks.length) * 100) 
      : 0;
    
    weekData.push({
      day: getDayName(i),
      taskCount: dayTasks.length,
      completionRate: completionRate
    });
  }
  
  return weekData;
}
