'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start flex-wrap gap-3 p-4">
      <div className="flex flex-col gap-3 w-72">
        <h1 className="font-['Lexend'] font-bold text-[32px] leading-10 text-[#0D141C]">
          {title}
        </h1>
        <p className="font-['Lexend'] font-normal text-sm leading-[21px] text-[#4A739C]">
          {subtitle}
        </p>
      </div>
    </div>
  );
} 