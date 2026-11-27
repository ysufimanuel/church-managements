import type { GlassPresetName, GlassParams } from '@/lib/liquid-glass/types';

export const PRESETS: Record<GlassPresetName, Omit<GlassParams, 'radius'>> = {
  clear: { bend: 0.045, chromatic: 0.004, highlight: 0.7, tint: 0.08 },
  liquid: { bend: 0.08, chromatic: 0.008, highlight: 1.1, tint: 0.12 },
  frosted: { bend: 0.02, chromatic: 0.002, highlight: 0.5, tint: 0.3 },
  prism: { bend: 0.12, chromatic: 0.014, highlight: 1.4, tint: 0.05 },
};
