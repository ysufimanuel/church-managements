export type GlassPresetName = 'clear' | 'liquid' | 'frosted' | 'prism';

export interface GlassParams {
  bend: number;
  chromatic: number;
  highlight: number;
  tint: number;
  radius: number;
}

export interface GlassRect {
  id: string;
  element: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  params: GlassParams;
}
