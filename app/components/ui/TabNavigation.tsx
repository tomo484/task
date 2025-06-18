'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: TabItem[];
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
  return (
    <div className="flex flex-col pb-3">
      <div className="border-b border-[#CFDBE8] px-4">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col justify-center items-center py-4 pb-[13px] border-b-[3px] cursor-pointer transition-all duration-200 ease-out
                ${activeTab === tab.id 
                  ? 'border-b-[#0D80F2] text-[#0D141C]' 
                  : 'border-b-[#E5E8EB] text-[#4A739C] hover:text-[#0D141C]'
                }
              `}
            >
              <div className="mb-1">
                {tab.icon}
              </div>
              <span className="font-['Lexend'] font-bold text-sm leading-[21px]">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// デフォルトタブ設定
export const defaultTabs: TabItem[] = [
  {
    id: 'today',
    label: 'Today',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'weekly',
    label: 'Weekly View',
    icon: <Calendar className="w-5 h-5" />
  }
]; 