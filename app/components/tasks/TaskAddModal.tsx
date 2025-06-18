'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TaskAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    name: string;
    category: string;
    dueDate: Date | null;
  }) => void;
}

export function TaskAddModal({ isOpen, onClose, onSubmit }: TaskAddModalProps) {
  // 今日の日付を初期値として設定
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');

  // モーダルが開かれるたびに今日の日付にリセット
  useEffect(() => {
    if (isOpen) {
      const newToday = new Date();
      setSelectedDate(newToday);
      setCurrentYear(newToday.getFullYear());
      setCurrentMonth(newToday.getMonth());
      setTaskName('');
      setSelectedCategory('work');
    }
  }, [isOpen]);

  // 日本語の月名配列
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  // 前の月へ移動
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 次の月へ移動
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 選択された日付が現在表示中の月にあるかチェック
  const isSelectedDateInCurrentMonth = () => {
    return selectedDate.getFullYear() === currentYear && 
           selectedDate.getMonth() === currentMonth;
  };

  // カレンダーの日付配列を生成
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // 前月の日付を埋める
    for (let i = 0; i < firstDayWeekday; i++) {
      calendarDays.push(null);
    }

    // 当月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    onSubmit({
      name: taskName,
      category: selectedCategory,
      dueDate: selectedDate, // 常に選択された日付を送信
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[900px] max-h-[90vh] bg-[#F7FAFC] rounded-lg overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-6 border-b border-[#E5E8EB] flex-shrink-0">
          <h2 className="font-['Lexend'] font-bold text-[24px] leading-[30px] text-[#0D141C]">
            タスクを追加
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 text-[#4A739C] hover:text-[#0D141C] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* メインコンテンツ - スクロール可能 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* タスク名入力 */}
            <div className="space-y-3">
              <label className="font-['Lexend'] font-medium text-[16px] leading-[24px] text-[#0D141C] block">
                タスク名
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="タスク名を入力してください"
                className="w-full px-4 py-3 border border-[#CFDBE8] rounded-lg font-['Lexend'] font-normal text-[14px] leading-[21px] text-[#0D141C] placeholder:text-[#4A739C] focus:border-[#0D80F2] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* カテゴリ選択 */}
            <div className="space-y-3">
              <label className="font-['Lexend'] font-medium text-[16px] leading-[24px] text-[#0D141C] block">
                カテゴリ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#CFDBE8] rounded-lg font-['Lexend'] font-normal text-[14px] leading-[21px] text-[#0D141C] focus:border-[#0D80F2] focus:outline-none transition-colors bg-white"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>

            {/* カレンダー */}
            <div className="space-y-3">
              <label className="font-['Lexend'] font-medium text-[16px] leading-[24px] text-[#0D141C] block">
                期限日
              </label>
              
              <div className="bg-white border border-[#CFDBE8] rounded-lg p-4">
                {/* カレンダーヘッダー */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="w-8 h-8 flex items-center justify-center text-[#4A739C] hover:text-[#0D80F2] hover:bg-[#F7FAFC] rounded transition-all duration-200"
                  >
                    ←
                  </button>
                  
                  <h3 className="font-['Lexend'] font-bold text-[16px] leading-[20px] text-[#0D141C]">
                    {currentYear}年{monthNames[currentMonth]}
                  </h3>
                  
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="w-8 h-8 flex items-center justify-center text-[#4A739C] hover:text-[#0D80F2] hover:bg-[#F7FAFC] rounded transition-all duration-200"
                  >
                    →
                  </button>
                </div>

                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div
                      key={index}
                      className="w-10 h-8 flex items-center justify-center font-['Lexend'] font-medium text-[12px] leading-[18px] text-[#4A739C]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日付グリッド */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="w-10 h-8" />;
                    }

                    const dayDate = new Date(currentYear, currentMonth, day);
                    const isSelected = isSelectedDateInCurrentMonth() && 
                                     selectedDate.getDate() === day;
                    const isToday = dayDate.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(dayDate)}
                        className={`
                          w-10 h-8 flex items-center justify-center rounded font-['Lexend'] font-normal text-[12px] leading-[18px] transition-all duration-200
                          ${isSelected 
                            ? 'bg-[#0D80F2] text-white' 
                            : isToday
                              ? 'bg-[#E8EDF5] text-[#0D80F2] font-medium'
                              : 'text-[#0D141C] hover:bg-[#F7FAFC]'
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* フッター - 固定位置 */}
          <div className="p-6 border-t border-[#E5E8EB] flex justify-end gap-4 flex-shrink-0 bg-[#F7FAFC]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#CFDBE8] rounded-lg font-['Lexend'] font-medium text-[14px] leading-[21px] text-[#4A739C] hover:text-[#0D141C] hover:border-[#4A739C] transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!taskName.trim()}
              className="px-6 py-3 bg-[#0D80F2] text-white rounded-lg font-['Lexend'] font-medium text-[14px] leading-[21px] hover:bg-[#0B6BC7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 