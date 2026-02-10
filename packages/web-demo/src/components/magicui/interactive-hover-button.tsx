'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function InteractiveHoverButton({
  children,
  className,
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-4 font-medium transition-all duration-300',
        'bg-[#FF6D29] text-white hover:bg-[#FF8C4A]',
        'shadow-xl shadow-[#FF6D29]/30 hover:shadow-2xl hover:shadow-[#FF6D29]/40',
        'hover:scale-105 active:scale-95',
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#FF6D29] via-[#FF8C4A] to-[#FF6D29] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
      </div>
    </button>
  );
}
