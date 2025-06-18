'use client';

import React from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '@/lib/types';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: 'todo' | 'in_progress' | 'done';
  tasks: Task[];
}

export function KanbanColumn({ tasks }: KanbanColumnProps) {

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 bg-[#F7FAFC] rounded-lg p-4 min-h-[400px]">
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-12 h-12 bg-[#E8EDF5] rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-[#4A739C]" />
              </div>
              <p className="text-sm text-[#4A739C] font-lexend">No tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 