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
      setSize({ width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Encode a rounded, convex edge profile as an RGB normal map for SVG displacement.
  useEffect(() => {
    const { width, height } = size;
    if (!width || !height) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = ctx.createImageData(width, height);
    const radius = Math.max(1, Math.min(borderRadius, width / 2, height / 2));
    const bevel = Math.max(1, Math.min(bevelWidth, radius));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = x + 0.5 - width / 2;
        const py = y + 0.5 - height / 2;
        const qx = Math.abs(px) - (width / 2 - radius);
        const qy = Math.abs(py) - (height / 2 - radius);
        const outsideX = Math.max(qx, 0);
        const outsideY = Math.max(qy, 0);
        const distance = Math.hypot(outsideX, outsideY) + Math.min(Math.max(qx, qy), 0) - radius;

        let nx = 0;
        let ny = 0;
        if (distance < 0 && distance > -bevel) {
          const t = (distance + bevel) / bevel;
          const strength = Math.sin((t * Math.PI) / 2);
          const length = Math.hypot(outsideX, outsideY);
          if (length > 0.001) {
            nx = (Math.sign(px) * outsideX / length) * strength;
            ny = (Math.sign(py) * outsideY / length) * strength;
          } else if (qx > qy) {
            nx = Math.sign(px) * strength;
          } else {
            ny = Math.sign(py) * strength;
          }
        }

        const index = (y * width + x) * 4;
        image.data[index] = Math.round(128 + nx * 127);
        image.data[index + 1] = Math.round(128 + ny * 127);
        image.data[index + 2] = 128;
        image.data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    setMap(canvas.toDataURL('image/png'));
  }, [size, bevelWidth, borderRadius]);

  const filterId = `lg-${uid}`;
  const canRefact = refractionStrength > 0 && Boolean(map);

  return (
    <div
      ref={ref}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius, background: tintColor, ...style }}
      {...props}
    >
      {canRefact && (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <defs>
            <filter
              id={filterId}
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map}
                x="0"
                y="0"
                width={size.width}
                height={size.height}
                preserveAspectRatio="none"
                result="edgeNormals"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.018"
                numOctaves="2"
                seed="8"
                result="liquidNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="liquidNoise"
                scale="2.5"
                xChannelSelector="R"
                yChannelSelector="G"
                result="fluidSurface"
              />
              <feDisplacementMap
                in="fluidSurface"
                in2="edgeNormals"
                scale={refractionStrength}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refractedSurface"
              />
              {chromaticAberration ? (
                <>
                  <feColorMatrix
                    in="refractedSurface"
                    type="saturate"
                    values="1.18"
                    result="richGlass"
                  />
                  <feComponentTransfer in="richGlass">
                    <feFuncR type="gamma" amplitude="1.04" exponent="0.96" offset="0" />
                    <feFuncG type="gamma" amplitude="1" exponent="1" offset="0" />
                    <feFuncB type="gamma" amplitude="1.06" exponent="1.04" offset="0" />
                  </feComponentTransfer>
                </>
              ) : (
                <feGaussianBlur in="refractedSurface" stdDeviation="0.12" />
              )}
            </filter>
          </defs>
        </svg>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          backdropFilter: canRefact
            ? `url(#${filterId}) blur(.25px) saturate(155%) contrast(1.04)`
            : 'blur(14px) saturate(145%)',
          WebkitBackdropFilter: 'blur(14px) saturate(145%)',
        }}
      />

      {/* Convex rim: the highlight is separate from the actual displacement layer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          background:
            'linear-gradient(145deg, rgba(255,255,255,.20), transparent 24%, transparent 72%, rgba(255,255,255,.07))',
          boxShadow:
            'inset 0 1.5px 2px rgba(255,255,255,.55), inset 0 -2px 5px rgba(0,0,0,.22), 0 18px 38px -10px rgba(0,0,0,.35)',
          border: '1px solid rgba(255,255,255,.3)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
