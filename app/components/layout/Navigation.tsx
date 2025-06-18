'use client';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'today' | 'weekly';
  onTabChange: (tab: 'today' | 'weekly') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="flex items-center border-b border-[#CFDBE8] px-4">
      <div className="flex">
        <button
          onClick={() => onTabChange('today')}
          className={cn(
            "flex items-center gap-1 px-4 py-4 font-bold text-sm font-lexend border-b-3 transition-colors",
            activeTab === 'today' 
              ? "text-[#0D141C] border-[#0D141C]" 
              : "text-[#4A739C] border-transparent hover:text-[#0D141C]"
          )}
        >
          <Image 
            src="/icons/today.svg" 
            alt="Today" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          Today
        </button>
        
        <button
          onClick={() => onTabChange('weekly')}
          className={cn(
            "flex items-center gap-1 px-4 py-4 font-bold text-sm font-lexend border-b-3 transition-colors",
            activeTab === 'weekly' 
              ? "text-[#0D141C] border-[#0D141C]" 
              : "text-[#4A739C] border-transparent hover:text-[#0D141C]"
          )}
        >
          <Image 
            src="/icons/weekly.svg" 
            alt="Weekly View" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          Weekly View
        </button>
      </div>
    </div>
  );
} 