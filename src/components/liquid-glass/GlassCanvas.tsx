'use client';

import { useEffect, useRef } from 'react';
import { glassRenderer } from './renderer';

interface GlassCanvasProps {
  backdrop?: string;
  className?: string;
}

export default function GlassCanvas({ backdrop, className = '' }: GlassCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    glassRenderer.init(ref.current, backdrop);
    return () => glassRenderer.dispose();
  }, []);
  useEffect(() => {
    glassRenderer.setBackdrop(backdrop);
  }, [backdrop]);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        className={className}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}
      />
      <style jsx global>{`
        .no-webgl [data-liquid-glass] {
          background: rgba(255,255,255,.12) !important;
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.25);
        }
      `}</style>
    </>
  );
}
