'use client';

import React from 'react';
import { ProgressBar } from './ProgressBar';

interface WeeklyDataItem {
  day: string;
  taskCount: number;
  completionRate: number;
}

interface WeeklyTasksSectionProps {
  weeklyData: WeeklyDataItem[];
}

export function WeeklyTasksSection({ weeklyData }: WeeklyTasksSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E8EB] overflow-hidden">
      {/* セクションヘッダー */}
      <div className="py-4 px-6 border-b border-[#E5E8EB]">
        <h3 className="font-['Lexend'] font-bold text-[22px] leading-[28px] text-[#0D141C]">
          Tasks by Day
        </h3>
      </div>

      {/* 週間データリスト */}
      <div className="divide-y divide-[#E5E8EB]">
        {weeklyData.map((dayData, index) => (
          <div key={index} className="flex items-center justify-between py-3 px-6">
            {/* 曜日名 */}
            <div className="flex items-center min-w-[100px]">
              <span className="font-['Lexend'] font-medium text-[16px] leading-[24px] text-[#0D141C]">
                {dayData.day}
              </span>
            </div>

            {/* タスク数 */}
            <div className="flex items-center min-w-[80px]">
              <span className="font-['Lexend'] font-normal text-[14px] leading-[21px] text-[#4A739C]">
                {dayData.taskCount === 0 ? '0 tasks' : 
                 dayData.taskCount === 1 ? '1 task' : 
                 `${dayData.taskCount} tasks`}
              </span>
            </div>

            {/* プログレスバー */}
            <div className="flex items-center min-w-[88px]">
              <ProgressBar
                percentage={dayData.completionRate}
                showText={false}
                className="w-[88px] h-1"
              />
            </div>

            {/* 完了率 */}
            <div className="flex items-center min-w-[40px] justify-end">
              <span className="font-['Lexend'] font-medium text-[14px] leading-[21px] text-[#0D141C]">
                {dayData.completionRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// デフォルトの週間データ
export const defaultWeeklyData: WeeklyDataItem[] = [
  { day: 'Monday', taskCount: 3, completionRate: 20 },
  { day: 'Tuesday', taskCount: 2, completionRate: 50 },
  { day: 'Wednesday', taskCount: 4, completionRate: 75 },
  { day: 'Thursday', taskCount: 1, completionRate: 100 },
  { day: 'Friday', taskCount: 3, completionRate: 33 },
  { day: 'Saturday', taskCount: 2, completionRate: 0 },
  { day: 'Sunday', taskCount: 1, completionRate: 100 },
]; 