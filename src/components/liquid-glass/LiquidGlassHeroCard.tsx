'use client';

import type { ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';

interface LiquidGlassHeroCardProps {
  badge?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}

export function LiquidGlassHeroCard({ badge, title, description, actions, className = '' }: LiquidGlassHeroCardProps) {
  return (
    <LiquidGlass
      borderRadius={36}
      bevelWidth={38}
      refractionStrength={52}
      tintColor="rgba(255, 255, 255, 0.04)"
      chromaticAberration
      className={`w-full max-w-2xl ${className}`}
    >
      <div className="flex flex-col items-start p-8 sm:p-11">
        {badge && <span className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wide text-white/90">{badge}</span>}
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] sm:text-lg">{description}</p>
        {actions && <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div>}
      </div>
    </LiquidGlass>
  );
}
