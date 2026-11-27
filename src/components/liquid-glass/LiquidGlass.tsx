'use client';

import React from 'react';
import type { GlassPresetName } from '@/lib/liquid-glass/types';
import { useLiquidGlass } from './useLiquidGlass';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  preset?: GlassPresetName;
  radius?: number;
  borderRadius?: number;
  bevelWidth?: number;
  refractionStrength?: number;
  tintColor?: string;
  chromaticAberration?: boolean;
  track?: boolean;
};

export function LiquidGlass({
  children,
  className = '',
  preset = 'liquid',
  radius,
  borderRadius,
  bevelWidth: _bevelWidth,
  refractionStrength: _refractionStrength,
  tintColor: _tintColor,
  chromaticAberration: _chromaticAberration,
  track: _track,
  style,
  ...props
}: Props) {
  const glassRadius = radius ?? borderRadius ?? 24;
  const ref = useLiquidGlass(preset, glassRadius);

  return (
    <div
      ref={ref}
      data-liquid-glass
      className={`relative isolate ${className}`}
      style={{
        ...style,
        position: 'relative',
        zIndex: 10,
        borderRadius: glassRadius,
        background: 'transparent',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
