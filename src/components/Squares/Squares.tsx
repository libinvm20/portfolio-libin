'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getTier } from '../perf/LoopManager';

export interface SquaresProps {
  squareSize?: number;
  borderColor?: string;
  hoverFillColor?: string;
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  pulseColor?: string;
  className?: string;
}

const DEPTH: Record<NonNullable<SquaresProps['direction']>, (col: number, row: number) => number> = {
  diagonal: (col, row) => (col + row) / 2,
  up: (_col, row) => row,
  down: (_col, row) => 1 - row,
  right: (col) => col,
  left: (col) => 1 - col
};

/** Animated pulsing grid backdrop (React Bits "Squares") with pointer-proximity fill. */
export default function Squares({
  squareSize = 34,
  borderColor = 'rgba(158, 170, 210, 0.10)',
  hoverFillColor = 'rgba(124, 108, 255, 0.10)',
  direction = 'diagonal',
  speed = 0.9,
  pulseColor = 'rgba(124, 108, 255, 0.16)',
  className = ''
}: SquaresProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState(-1);

  // Phones get fewer, larger cells (less paint area, far fewer nodes) and a
  // static grid — hundreds of independently animated boxes are not free.
  const cellSize = size.width > 0 && size.width < 640 ? Math.max(squareSize, 56) : squareSize;
  const pulse = getTier() === 'high';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const observer = new ResizeObserver(() => {
      setSize({ width: container.offsetWidth, height: container.offsetHeight });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    // Pointer-proximity fill is a hover affordance — pointless (and jittery
    // during scroll) on touch, so it is only wired up for a fine pointer.
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);
      setHovered(y * Math.max(1, Math.ceil((size.width + cellSize) / cellSize)) + x >= 0 ? y * Math.ceil((size.width + cellSize) / cellSize) + x : -1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [size.width, size.height, cellSize]);

  const squares = useMemo(() => {
    if (size.width === 0 || size.height === 0) return [];
    const cols = Math.ceil(size.width / cellSize) + 1;
    const rows = Math.ceil(size.height / cellSize) + 1;
    const depth = DEPTH[direction] ?? DEPTH.diagonal;
    const cells: { key: number; col: number; row: number; delay: number; left: number; top: number }[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        cells.push({
          key: row * cols + col,
          col,
          row,
          delay: depth(col, row) / Math.max(0.05, speed),
          left: col * cellSize,
          top: row * cellSize
        });
      }
    }
    return cells;
  }, [size, cellSize, direction, speed]);

  return (
    <div ref={containerRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <style>{`@keyframes squares-pulse { 0%, 100% { background-color: transparent } 50% { background-color: ${pulseColor} } }`}</style>
      {squares.map((cell) => (
        <div
          key={cell.key}
          className="absolute"
          style={{
            left: cell.left,
            top: cell.top,
            width: cellSize,
            height: cellSize,
            borderTop: `1px solid ${borderColor}`,
            borderLeft: `1px solid ${borderColor}`,
            animation: pulse ? 'squares-pulse 3.4s ease-in-out infinite' : undefined,
            animationDelay: pulse ? `-${cell.delay}s` : undefined,
            backgroundColor: cell.key === hovered ? hoverFillColor : 'transparent'
          }}
        />
      ))}
    </div>
  );
}
