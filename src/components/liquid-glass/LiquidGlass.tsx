'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  bevelWidth?: number;
  refractionStrength?: number;
  borderRadius?: number;
  tintColor?: string;
  chromaticAberration?: boolean;
};

export function LiquidGlass({
  children,
  className = '',
  bevelWidth = 28,
  refractionStrength = 36,
  borderRadius = 24,
  tintColor = 'rgba(255,255,255,.07)',
  chromaticAberration = false,
  style,
  ...props
}: Props) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [map, setMap] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { width, height } = size;
    if (!width || !height) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    const r = Math.min(borderRadius, width / 2, height / 2);
    const bevel = Math.max(1, Math.min(bevelWidth, r));
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const px = x + .5 - width / 2, py = y + .5 - height / 2;
      const qx = Math.abs(px) - (width / 2 - r), qy = Math.abs(py) - (height / 2 - r);
      const dist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
      let nx = 0, ny = 0;
      if (dist < 0 && dist > -bevel) {
        const curve = Math.cos(((dist + bevel) / bevel) * Math.PI / 2);
        const gx = qx > 0 || qy > 0 ? Math.sign(px) * Math.max(qx, 0) / (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) || 1) : (qx > qy ? Math.sign(px) : 0);
        const gy = qx > 0 || qy > 0 ? Math.sign(py) * Math.max(qy, 0) / (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) || 1) : (qx > qy ? 0 : Math.sign(py));
        nx = -gx * curve; ny = -gy * curve;
      }
      const i = (y * width + x) * 4;
      image.data[i] = Math.round(128 + nx * 127);
      image.data[i + 1] = Math.round(128 + ny * 127);
      image.data[i + 2] = 128; image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    setMap(canvas.toDataURL('image/png'));
  }, [size, bevelWidth, borderRadius]);

  const filterId = `lg-${uid}`;
  return <div ref={ref} className={`relative isolate overflow-hidden ${className}`} style={{ borderRadius, background: tintColor, ...style }} {...props}>
    {map && <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0"><defs><filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
      <feImage href={map} x="0" y="0" width={size.width} height={size.height} result="normals" />
      <feDisplacementMap in="SourceGraphic" in2="normals" scale={refractionStrength} xChannelSelector="R" yChannelSelector="G" result="glass" />
      {chromaticAberration && <feColorMatrix in="glass" type="saturate" values="1.15" />}
    </filter></defs></svg>}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius, backdropFilter: map ? `url(#${filterId}) blur(.35px) saturate(145%)` : 'blur(14px) saturate(145%)', WebkitBackdropFilter: 'blur(14px) saturate(145%)' }} />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius, border: '1px solid rgba(255,255,255,.3)', boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,.55), inset 0 -2px 5px rgba(0,0,0,.22), 0 18px 38px -10px rgba(0,0,0,.35)' }} />
    <div className="relative z-10">{children}</div>
  </div>;
}
