'use client';

import { useEffect, useId, useRef } from 'react';
import type { GlassParams, GlassPresetName } from '@/lib/liquid-glass/types';
import { PRESETS } from './presets';
import { glassRenderer } from './renderer';

export function useLiquidGlass(preset: GlassPresetName = 'liquid', radius = 28, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const params: GlassParams = { ...PRESETS[preset], radius };

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    glassRenderer.register(id, element, params);
    return () => glassRenderer.unregister(id);
  }, [id, enabled]);

  useEffect(() => {
    if (enabled) glassRenderer.update(id, params);
  }, [id, preset, radius, enabled]);

  return ref;
}
