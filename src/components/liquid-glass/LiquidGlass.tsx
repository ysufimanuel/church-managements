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
  const [normalMap, setNormalMap] = useState('');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.ceil(width), height: Math.ceil(height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Build a smooth normal map for the rounded, convex glass rim.
  useEffect(() => {
    const { width, height } = size;
    if (!width || !height) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;

    const pixels = context.createImageData(width, height);
    const radius = Math.max(1, Math.min(borderRadius, width / 2, height / 2));
    const bevel = Math.max(1, Math.min(bevelWidth, radius));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = x + 0.5 - width / 2;
        const py = y + 0.5 - height / 2;
        const qx = Math.abs(px) - (width / 2 - radius);
        const qy = Math.abs(py) - (height / 2 - radius);
        const ox = Math.max(qx, 0);
        const oy = Math.max(qy, 0);
        const distance = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;

        let nx = 0;
        let ny = 0;
        if (distance < 0 && distance > -bevel) {
          const t = (distance + bevel) / bevel;
          const amount = Math.sin((t * Math.PI) / 2);
          const length = Math.hypot(ox, oy);
          if (length > 0.001) {
            nx = Math.sign(px) * (ox / length) * amount;
            ny = Math.sign(py) * (oy / length) * amount;
          } else if (qx > qy) {
            nx = Math.sign(px) * amount;
          } else {
            ny = Math.sign(py) * amount;
          }
        }

        const index = (y * width + x) * 4;
        pixels.data[index] = Math.round(128 + nx * 127);
        pixels.data[index + 1] = Math.round(128 + ny * 127);
        pixels.data[index + 2] = 128;
        pixels.data[index + 3] = 255;
      }
    }

    context.putImageData(pixels, 0, 0);
    setNormalMap(canvas.toDataURL('image/png'));
  }, [size, bevelWidth, borderRadius]);

  const filterId = `liquid-glass-${uid}`;
  const useRefraction = refractionStrength > 0 && Boolean(normalMap);
  const filterStyle = useRefraction
    ? `url(#${filterId}) blur(.35px) saturate(155%) contrast(1.035)`
    : 'blur(14px) saturate(145%)';

  return (
    <div
      ref={ref}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius, background: tintColor, ...style }}
      {...props}
    >
      {useRefraction && (
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute"
          width="1"
          height="1"
          style={{ left: -2, top: -2, overflow: 'visible' }}
        >
          <defs>
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              primitiveUnits="userSpaceOnUse"
              x={-size.width * 0.25}
              y={-size.height * 0.25}
              width={size.width * 1.5}
              height={size.height * 1.5}
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={normalMap}
                x="0"
                y="0"
                width={size.width}
                height={size.height}
                preserveAspectRatio="none"
                result="rimNormals"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="rimNormals"
                scale={refractionStrength}
                xChannelSelector="R"
                yChannelSelector="G"
                result="bentBackdrop"
              />
              {chromaticAberration ? (
                <feColorMatrix
                  in="bentBackdrop"
                  type="saturate"
                  values="1.2"
                />
              ) : (
                <feGaussianBlur in="bentBackdrop" stdDeviation="0.08" />
              )}
            </filter>
          </defs>
        </svg>
      )}

      {/* Both standard and WebKit properties must use the same refraction filter. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          backdropFilter: filterStyle,
          WebkitBackdropFilter: filterStyle,
        }}
      />

      {/* A restrained convex rim highlight, independent from the refraction pass. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          border: '1px solid rgba(255,255,255,.27)',
          background:
            'linear-gradient(145deg, rgba(255,255,255,.17), transparent 25%, transparent 74%, rgba(255,255,255,.06))',
          boxShadow:
            'inset 0 1.5px 2px rgba(255,255,255,.48), inset 0 -2px 5px rgba(0,0,0,.18), 0 18px 38px -10px rgba(0,0,0,.3)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
