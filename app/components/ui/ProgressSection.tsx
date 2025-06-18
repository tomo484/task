'use client';

import React from 'react';

interface ProgressSectionProps {
  label: string;
  percentage: number;
}

export function ProgressSection({ label, percentage }: ProgressSectionProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* プログレスヘッダー */}
      <div className="flex justify-between items-center gap-6">
        <span className="font-['Lexend'] font-medium text-base leading-6 text-[#0D141C]">
          {label}
        </span>
        <span className="font-['Lexend'] font-normal text-sm leading-[21px] text-[#0D141C] h-6">
          {percentage}%
        </span>
      </div>

      {/* プログレスバー */}
      <div className="bg-[#CFDBE8] rounded border-radius-[4px] w-[557px] h-2 overflow-hidden">
        <div 
          className="bg-[#0D80F2] rounded border-radius-[4px] h-2 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 