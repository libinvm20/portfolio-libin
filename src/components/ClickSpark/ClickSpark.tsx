'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export interface ClickSparkProps {
  children?: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

type Particle = HTMLSpanElement;

export default function ClickSpark({
  children,
  sparkColor = '#a5b4ff',
  sparkSize = 10,
  sparkRadius = 28,
  sparkCount = 9,
  duration = 460,
  className = '',
  style
}: ClickSparkProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < sparkCount; i += 1) {
        const angle = (360 / sparkCount) * i + Math.random() * 12 - 6;
        const particle: Particle = document.createElement('span');
        particle.style.cssText = [
          'position:absolute',
          `left:${x - 1}px`,
          `top:${y - sparkSize / 2}px`,
          `width:2px`,
          `height:${sparkSize}px`,
          'border-radius:2px',
          `background:${sparkColor}`,
          `box-shadow:0 0 6px ${sparkColor}`,
          `transform-origin:center ${sparkSize / 2}px`,
          'pointer-events:none',
          'will-change:transform,opacity'
        ].join(';');
        overlay.appendChild(particle);
        const animation = particle.animate(
          [
            {
              transform: `rotate(${angle}deg) translateY(0)`,
              opacity: 1
            },
            {
              transform: `rotate(${angle}deg) translateY(-${sparkRadius + Math.random() * 10}px)`,
              opacity: 0
            }
          ],
          { duration, easing: 'cubic-bezier(0.1, 0.7, 0.2, 1)', fill: 'none' }
        );
        animation.onfinish = () => particle.remove();
      }
    };

    const onClick = (event: PointerEvent) => {
      // Touch taps land on pointerdown too, so a scroll flick would spray
      // sparks across the page — press feedback on touch lives in CSS.
      if (event.pointerType === 'touch') return;
      spawn(event.clientX, event.clientY);
    };

    window.addEventListener('pointerdown', onClick, { passive: true });
    return () => window.removeEventListener('pointerdown', onClick);
  }, [sparkColor, sparkRadius, sparkCount, sparkSize, duration]);

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[60] overflow-hidden ${className}`}
        style={style}
      />
    </>
  );
}
