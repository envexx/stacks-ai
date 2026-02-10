'use client';

import React, { CSSProperties } from 'react';

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
}: RippleProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;

        return (
          <div
            key={i}
            className="absolute animate-ripple rounded-full bg-[#FF6D29]"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderWidth: '1px',
                borderColor: `rgba(255, 109, 41, ${opacity})`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
};
