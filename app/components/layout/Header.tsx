'use client';

import React from 'react';
import { Search, Bell, CheckSquare } from 'lucide-react';

interface HeaderProps {
  activeNav?: 'my-tasks' | 'inbox' | 'projects';
}

export function Header({ activeNav = 'my-tasks' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-[#E5E8EB] px-10 py-3 h-16">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto">
        {/* ロゴセクション */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <CheckSquare className="w-4 h-4 text-[#0D141C]" />
          <h1 className="font-['Lexend'] font-bold text-lg leading-[23px] text-[#0D141C]">
            TaskMaster
          </h1>
        </div>

        {/* プライマリナビゲーション */}
        <nav className="flex items-center gap-9 ml-16">
          <button
            className={`font-['Lexend'] font-medium text-sm leading-[21px] cursor-pointer transition-colors duration-200 ease-out ${
              activeNav === 'my-tasks'
                ? 'text-[#0D141C] font-bold'
                : 'text-[#0D141C] hover:text-[#0D80F2]'
            }`}
          >
            My Tasks
          </button>
          <button
            className={`font-['Lexend'] font-medium text-sm leading-[21px] cursor-pointer transition-colors duration-200 ease-out ${
              activeNav === 'inbox'
                ? 'text-[#0D141C] font-bold'
                : 'text-[#0D141C] hover:text-[#0D80F2]'
            }`}
          >
            Inbox
          </button>
          <button
            className={`font-['Lexend'] font-medium text-sm leading-[21px] cursor-pointer transition-colors duration-200 ease-out ${
              activeNav === 'projects'
                ? 'text-[#0D141C] font-bold'
                : 'text-[#0D141C] hover:text-[#0D80F2]'
            }`}
          >
            Projects
          </button>
        </nav>

        {/* セカンダリアクション・プロフィールエリア */}
        <div className="flex items-center gap-8 flex-shrink-0">
          {/* 検索コンポーネント */}
          <div className="flex bg-[#E8EDF5] rounded-lg overflow-hidden w-[280px]">
            <div className="bg-[#E8EDF5] rounded-l-lg pl-4 flex items-center h-10">
              <Search className="w-6 h-6 text-[#4A739C]" />
            </div>
            <div className="bg-[#E8EDF5] rounded-r-lg py-2 pr-4 pl-2 flex items-center flex-1">
              <input
                type="text"
                placeholder="Search"
                className="font-['Lexend'] font-normal text-base leading-6 text-[#4A739C] bg-transparent border-none outline-none w-full placeholder:text-[#4A739C]"
              />
            </div>
          </div>

          {/* 通知ボタン */}
          <button className="bg-[#E8EDF5] rounded-lg h-10 px-[10px] flex items-center gap-2 cursor-pointer hover:bg-[#CFDBE8] transition-colors duration-200">
            <Bell className="w-6 h-6 text-[#0D141C]" />
          </button>

          {/* プロフィールアバター */}
          <div className="w-10 h-10 rounded-[20px] bg-gradient-to-br from-[#0D80F2] to-[#4A739C] cursor-pointer flex items-center justify-center">
            <span className="text-white font-['Lexend'] font-bold text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );
} 