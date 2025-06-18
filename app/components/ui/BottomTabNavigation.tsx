'use client';

import React from 'react';
import { Clock, Calendar, Plus } from 'lucide-react';

interface BottomTabNavigationProps {
  activeTab: 'today' | 'weekly';
  onTabChange: (tabId: string) => void;
  onAddTask: () => void;
}

export function BottomTabNavigation({ activeTab, onTabChange, onAddTask }: BottomTabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E8EB] z-40">
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center justify-between w-full max-w-md">
          
          {/* My Tasks タブ */}
          <button
            onClick={() => onTabChange('today')}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-4 transition-colors ${
              activeTab === 'today' 
                ? 'text-[#0D80F2]' 
                : 'text-[#4A739C] hover:text-[#0D141C]'
            }`}
          >
            <Clock className="w-6 h-6 mb-1" />
            <span className="font-['Lexend'] font-medium text-[12px] leading-[15px]">
              My Tasks
            </span>
          </button>

          {/* タスク追加ボタン */}
          <button
            onClick={onAddTask}
            className="flex items-center justify-center w-12 h-12 bg-[#0D80F2] rounded-full text-white hover:bg-[#0B6BC7] transition-colors mx-4"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Weekly View タブ */}
          <button
            onClick={() => onTabChange('weekly')}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-4 transition-colors ${
              activeTab === 'weekly' 
                ? 'text-[#0D80F2]' 
                : 'text-[#4A739C] hover:text-[#0D141C]'
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="font-['Lexend'] font-medium text-[12px] leading-[15px]">
              Weekly View
            </span>
          </button>

        </div>
      </div>
    </div>
  );
} 