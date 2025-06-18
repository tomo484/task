'use server'

import { supabase } from '../supabase'
import { TaskInput, Task, TaskStatus } from '../types'
import { revalidatePath } from 'next/cache'

// 今日のタスク取得
export async function getTodayTasks(): Promise<Task[]> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`due_date.is.null,due_date.lte.${today}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('今日のタスク取得エラー:', error)
      throw new Error(error.message)
    }
    
    return data || []
  } catch (error) {
    console.error('getTodayTasks エラー:', error)
    throw error
  }
}

// 週間タスク取得
export async function getWeeklyTasks(): Promise<Task[]> {
  try {
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

    if (error) {
      console.error('週間タスク取得エラー:', error)
      throw new Error(error.message)
    }
    
    return data || []
  } catch (error) {
    console.error('getWeeklyTasks エラー:', error)
    throw error
  }
}

// 全タスク取得（今日優先ソート）
export async function getAllTasksSorted(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('全タスク取得エラー:', error)
      throw new Error(error.message)
    }
    
    // ソート処理
    const sortedTasks = (data || []).sort((a, b) => {
      const today = new Date().toISOString().split('T')[0];
      
      // 今日のタスクを最優先
      if (a.due_date === today && b.due_date !== today) return -1;
      if (b.due_date === today && a.due_date !== today) return 1;
      
      // 期限なしタスクは最後
      if (!a.due_date && b.due_date) return 1;
      if (!b.due_date && a.due_date) return -1;
      if (!a.due_date && !b.due_date) return 0;
      
      // 今日からの日数差で昇順ソート
      const dayDiffA = Math.abs(new Date(a.due_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24);
      const dayDiffB = Math.abs(new Date(b.due_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24);
      
      return dayDiffA - dayDiffB;
    });
    
    return sortedTasks;
  } catch (error) {
    console.error('getAllTasksSorted エラー:', error)
    throw error
  }
}

// タスク作成
export async function createTask(taskInput: TaskInput): Promise<Task> {
  try {
    // デフォルトステータスを'todo'に設定
    const taskWithDefaults = {
      ...taskInput,
      status: taskInput.status || 'todo' as TaskStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskWithDefaults])
      .select()
      .single()

    if (error) {
      console.error('タスク作成エラー:', error)
      throw new Error(error.message)
    }
    
    // ページキャッシュを無効化
    revalidatePath('/')
    revalidatePath('/weekly')
    
    return data
  } catch (error) {
    console.error('createTask エラー:', error)
    throw error
  }
}

// タスクステータス更新
export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', taskId)

    if (error) {
      console.error('タスクステータス更新エラー:', error)
      throw new Error(error.message)
    }
    
    // ページキャッシュを無効化
    revalidatePath('/')
    revalidatePath('/weekly')
  } catch (error) {
    console.error('updateTaskStatus エラー:', error)
    throw error
  }
}

// タスク削除
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('タスク削除エラー:', error)
      throw new Error(error.message)
    }
    
    // ページキャッシュを無効化
    revalidatePath('/')
    revalidatePath('/weekly')
  } catch (error) {
    console.error('deleteTask エラー:', error)
    throw error
  }
}

// タスク編集（今後の拡張用）
export async function updateTask(taskId: string, taskInput: Partial<TaskInput>): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        ...taskInput,
        updated_at: new Date().toISOString() 
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('タスク更新エラー:', error)
      throw new Error(error.message)
    }
    
    // ページキャッシュを無効化
    revalidatePath('/')
    revalidatePath('/weekly')
    
    return data
  } catch (error) {
    console.error('updateTask エラー:', error)
    throw error
  }
}

// データベース接続テスト
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)

    if (error) {
      console.error('データベース接続テストエラー:', error)
      return false
    }
    
    console.log('データベース接続成功')
    return true
  } catch (error) {
    console.error('testDatabaseConnection エラー:', error)
    return false
  }
} 