'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProgressSection } from '@/components/ui/ProgressSection';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { TaskList } from '@/components/tasks/TaskList';
import { BottomTabNavigation } from '@/components/ui/BottomTabNavigation';
import { TaskAddModal } from '@/components/tasks/TaskAddModal';
import { WeeklyTasksSection } from '@/components/ui/WeeklyTasksSection';
import { Task, TaskInput, TaskStatus } from '@/lib/types';
import { getAllTasksSorted, getWeeklyTasks, createTask, updateTaskStatus, deleteTask } from '@/lib/actions/task-actions';
import { calculateProgress, calculateWeeklyData } from '@/lib/utils';

export default function HomePage() {
  // 状態管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');
  const [activeTaskTab, setActiveTaskTab] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タスクデータの取得
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'today') {
        const fetchedTasks = await getAllTasksSorted(); // 全タスクを今日優先でソート
        setTasks(fetchedTasks);
      } else {
        const fetchedWeeklyTasks = await getWeeklyTasks();
        setWeeklyTasks(fetchedWeeklyTasks);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // プログレス計算
  const progressPercentage = calculateProgress(activeTab === 'today' ? tasks : weeklyTasks);
  
  // 週間データ計算
  const weeklyData = calculateWeeklyData(weeklyTasks);

  // タスクアクション処理（ステータス変更・削除）
  const handleTaskAction = async (taskId: string, action?: 'next_status' | 'delete') => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (action === 'delete') {
        await deleteTask(taskId);
      } else if (action === 'next_status') {
        // ステータスを次の段階に進める
        const statusFlow: { [key in TaskStatus]: TaskStatus } = {
          'todo': 'in_progress',
          'in_progress': 'done',
          'done': 'todo' // 完了から再びToDoに戻す
        };
        const nextStatus = statusFlow[task.status];
        await updateTaskStatus(taskId, nextStatus);
      }

      // タスクリストを再取得
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // タブ変更処理
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'today' | 'weekly');
  };

  // タスクタブ変更処理
  const handleTaskTabChange = (tabId: string) => {
    setActiveTaskTab(tabId as 'todo' | 'in_progress' | 'done');
  };

  // タスク追加処理
  const handleTaskSubmit = async (taskData: {
    name: string;
    category: string;
    dueDate: Date | null;
  }) => {
    try {
      setLoading(true);
      
      // カテゴリのマッピング
      const categoryMap: { [key: string]: 'study' | 'club' | 'other' } = {
        'work': 'study',
        'personal': 'other',
        'health': 'other',
        'education': 'study',
        'shopping': 'other'
      };

      const taskInput: TaskInput = {
        title: taskData.name,
        category: categoryMap[taskData.category] || 'other',
        status: 'todo', // 新しいタスクはデフォルトでTo Do
        due_date: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null,
      };

      // データベースにタスクを作成
      await createTask(taskInput);
      
      // タスクリストを再取得
      await fetchTasks();
      
      console.log('Task created successfully:', taskInput);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  // ステータス別タスクのフィルタリング
  const filteredTasks = tasks.filter(task => task.status === activeTaskTab);

  // エラー状態の表示
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Lexend'] font-medium text-lg text-red-500 mb-4">
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchTasks();
            }}
            className="px-4 py-2 bg-[#0D80F2] text-white rounded-lg font-['Lexend'] font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAFC]">
      {/* グローバルヘッダー */}
      <Header activeNav="my-tasks" />

      {/* メインコンテンツエリア */}
      <main className="flex-1 min-h-[calc(100vh-64px)] pb-16">
        <div className="py-5 px-40 bg-[#F7FAFC]">
          <div className="max-w-[960px] mx-auto flex flex-col gap-6">
            
            {/* ページヘッダー */}
            <PageHeader
              title={activeTab === 'today' ? "My Tasks" : "Weekly View"}
              subtitle={activeTab === 'today' ? "Manage all your tasks" : "This week's progress"}
            />

            {/* プログレス表示セクション */}
            <ProgressSection
              label={activeTab === 'today' ? "Overall Progress" : "Weekly Progress"}
              percentage={progressPercentage}
            />

            {/* My Tasks View のコンテンツ */}
            {activeTab === 'today' && (
              <>
                {/* タブナビゲーション */}
                <TabNavigation
                  activeTab={activeTaskTab}
                  onTabChange={handleTaskTabChange}
                  tabs={[
                    { id: 'todo', label: 'To Do', icon: '📋' },
                    { id: 'in_progress', label: 'In Progress', icon: '⏳' },
                    { id: 'done', label: 'Done', icon: '✅' }
                  ]}
                />

                {/* タスクリスト */}
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D80F2]"></div>
                  </div>
                ) : (
                  <TaskList
                    tasks={filteredTasks}
                    onTaskAction={handleTaskAction}
                  />
                )}
              </>
            )}

            {/* Weekly View のコンテンツ */}
            {activeTab === 'weekly' && (
              <>
                {/* Tasks Completed セクション（カード形式） */}
                <div className="flex flex-wrap gap-4 py-4 px-4">
                  <div className="bg-[#E8EDF5] rounded-lg flex flex-col gap-2 py-6 px-6 w-full">
                    <div className="flex flex-col w-full">
                      <span className="font-['Lexend'] font-medium text-[16px] leading-[24px] text-[#0D141C]">
                        Tasks Completed
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <span className="font-['Lexend'] font-bold text-[24px] leading-[30px] text-[#0D141C]">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tasks by Day セクション */}
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D80F2]"></div>
                  </div>
                ) : (
                  <WeeklyTasksSection weeklyData={weeklyData} />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* 下部タブナビゲーション */}
      <BottomTabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddTask={() => setIsAddModalOpen(true)}
      />

      {/* タスク追加モーダル */}
      <TaskAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
}
