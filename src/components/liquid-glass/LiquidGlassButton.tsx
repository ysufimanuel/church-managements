'use client';

import { useRef, useState, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tintColor?: string;
  glintColor?: string;
  refractionStrength?: number;
}

export function LiquidGlassButton({
  children,
  className = '',
  tintColor = 'rgba(255, 255, 255, 0.08)',
  glintColor = 'rgba(255, 255, 255, 0.45)',
  refractionStrength = 34,
  type = 'button',
  ...props
}: LiquidGlassButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50, active: false });

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    setCursor({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursor(previous => ({ ...previous, active: false }))}
      className={`group relative inline-flex cursor-pointer items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      <LiquidGlass borderRadius={999} bevelWidth={20} refractionStrength={refractionStrength} tintColor={tintColor} className="w-full">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300" style={{ opacity: cursor.active ? 1 : 0, background: `radial-gradient(circle 90px at ${cursor.x}% ${cursor.y}%, ${glintColor}, transparent 75%)`, mixBlendMode: 'overlay' }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full p-[1.5px] transition-opacity duration-300" style={{ opacity: cursor.active ? 0.9 : 0, background: `radial-gradient(circle 70px at ${cursor.x}% ${cursor.y}%, rgba(255,255,255,.65), transparent 70%)`, maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' }} />
        <span className="relative z-10 flex items-center justify-center gap-2 px-7 py-3.5 font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">{children}</span>
      </LiquidGlass>
    </button>
  );
}
