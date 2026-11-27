'use client';

import { useState, type ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';

export interface DockItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface LiquidGlassDockProps {
  items: DockItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function LiquidGlassDock({ items, activeId, onSelect, className = '' }: LiquidGlassDockProps) {
  const [internalActive, setInternalActive] = useState(items[0]?.id ?? '');
  const currentActive = activeId ?? internalActive;

  const handleSelect = (id: string) => {
    setInternalActive(id);
    onSelect?.(id);
  };

  return (
    <nav aria-label="Floating Liquid Glass Navigation" className={`fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 ${className}`}>
      <LiquidGlass borderRadius={999} bevelWidth={22} refractionStrength={42} tintColor="rgba(18, 18, 22, 0.25)" chromaticAberration>
        <ul className="flex items-center gap-1.5 overflow-x-auto px-2.5 py-2">
          {items.map(item => {
            const isActive = item.id === currentActive;
            return <li key={item.id} className="shrink-0">
              <button type="button" aria-current={isActive ? 'page' : undefined} onClick={() => handleSelect(item.id)} className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isActive ? 'bg-white/25 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>;
          })}
        </ul>
      </LiquidGlass>
    </nav>
  );
}
