'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Briefcase, MoreHorizontal, ChevronRight, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onTaskAction?: (taskId: string, action?: 'next_status' | 'delete') => void;
}

const getCategoryIcon = (category: Task['category']) => {
  switch (category) {
    case 'study':
      return <BookOpen className="w-6 h-6 text-[#0D141C]" />;
    case 'club':
      return <Users className="w-6 h-6 text-[#0D141C]" />;
    case 'other':
      return <Briefcase className="w-6 h-6 text-[#0D141C]" />;
    default:
      return <BookOpen className="w-6 h-6 text-[#0D141C]" />;
  }
};

const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  return `Due: ${date.getMonth() + 1}/${date.getDate()}`;
};

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

const getNextStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'Move to In Progress';
    case 'in_progress':
      return 'Mark as Done';
    case 'done':
      return 'Move to To Do';
    default:
      return 'Update Status';
  }
};

export function TaskCard({ task, onTaskAction }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusChange = () => {
    onTaskAction?.(task.id, 'next_status');
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onTaskAction?.(task.id, 'delete');
      setShowMenu(false);
    }
  };

  const getDueDateColor = () => {
    if (!task.due_date) return 'text-[#4A739C]';
    
    const today = new Date();
    const dueDate = new Date(task.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-500'; // 期限切れ
    if (diffDays === 0) return 'text-red-500'; // 今日
    if (diffDays === 1) return 'text-orange-500'; // 明日
    return 'text-[#4A739C]'; // それ以降
  };

  return (
    <div className="bg-[#F7FAFC] flex justify-between items-center gap-4 py-2 px-4 rounded-lg min-h-16 transition-all duration-200 ease-out hover:bg-[#E8EDF5] hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(13,20,28,0.1)] relative">
      {/* タスクアイコンセクション */}
      <div className="bg-[#E8EDF5] rounded-lg w-12 h-12 flex justify-center items-center flex-shrink-0">
        {getCategoryIcon(task.category)}
      </div>

      {/* タスク情報セクション */}
      <div className="flex flex-col justify-center flex-1 min-w-0 gap-[2px]">
        <h3 className="font-['Lexend'] font-medium text-base leading-6 text-[#0D141C] mb-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
          {task.title}
        </h3>
        <p className={`font-['Lexend'] font-normal text-sm leading-[21px] ${getDueDateColor()}`}>
          {task.due_date ? formatDueDate(task.due_date) : 'No due date'}
        </p>
      </div>

      {/* タスクアクションセクション */}
      <div className="flex justify-center items-center w-6 flex-shrink-0 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-6 h-6 text-[#0D141C] cursor-pointer transition-colors duration-200 ease-out hover:text-[#0D80F2]"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>

        {/* ドロップダウンメニュー */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E8EB] rounded-lg shadow-lg z-10 min-w-[200px]">
            <div className="py-1">
              {/* ステータス変更 */}
              <button
                onClick={handleStatusChange}
                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[#F7FAFC] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#0D80F2]" />
                <span className="font-['Lexend'] font-normal text-[14px] text-[#0D141C]">
                  {getNextStatusLabel(task.status)}
                </span>
              </button>
              
              {/* 区切り線 */}
              <div className="border-t border-[#E5E8EB] my-1"></div>
              
              {/* 削除 */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[#FEF2F2] transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="font-['Lexend'] font-normal text-[14px] text-red-500">
                  Delete Task
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* メニューが開いている時の背景クリック検知 */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-[5]" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
} 