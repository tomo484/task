'use client';

import React from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onTaskAction?: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskAction }: TaskListProps) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {/* タスクリストヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-['Lexend'] font-medium text-base leading-6 text-[#0D141C]">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} today
        </span>
      </div>

      {/* タスクカード一覧 */}
      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-['Lexend'] font-normal text-base text-[#4A739C]">
              No tasks for today
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskAction={onTaskAction}
            />
          ))
        )}
      </div>
    </div>
  );
} 