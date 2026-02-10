'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
}

export function TypingAnimation({
  children,
  className,
  duration = 200,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, children]);

  return (
    <h1
      className={cn(
        'font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm',
        className,
      )}
    >
      {displayedText ? displayedText : children}
    </h1>
  );
}
