'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { toCanvas } from 'html-to-image';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  bevelWidth?: number;
  refractionStrength?: number;
  borderRadius?: number;
  tintColor?: string;
  chromaticAberration?: boolean;
};

const vertexShader = \`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}\`;

const fragmentShader = \`
precision highp float;
uniform sampler2D u_backdrop;
uniform vec2 u_resolution;
uniform vec2 u_viewport;
uniform float u_pixelRatio;
uniform float u_radius;
uniform float u_bevel;
uniform float u_strength;
uniform float u_chromatic;
uniform vec4 u_tint;
uniform vec2 u_pointer;

float roundedBoxDistance(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

void main() {
  vec2 sizeCss = u_resolution / u_pixelRatio;
  vec2 localPx = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_pixelRatio;
  vec2 centered = localPx - sizeCss * 0.5;
  vec2 halfSize = sizeCss * 0.5;
  float radius = min(u_radius, min(halfSize.x, halfSize.y));
  float distanceToEdge = roundedBoxDistance(centered, halfSize, radius);
  if (distanceToEdge > 0.0) discard;

  vec2 screenPx = gl_FragCoord.xy / u_pixelRatio;
  screenPx.y = u_viewport.y - screenPx.y;
  vec2 baseUv = vec2(screenPx.x / u_viewport.x, screenPx.y / u_viewport.y);

  vec2 radial = centered / max(halfSize, vec2(1.0));
  float radialLength = length(radial);
  float rimFactor = smoothstep(0.28, 0.98, radialLength);
  vec2 radialDirection = normalize(centered + vec2(0.0001));
  float curvature = 0.18 + rimFactor * 0.82;
  vec2 displacementPx = -radialDirection * (u_strength * curvature);

  vec2 q = abs(centered) - halfSize + radius;
  vec2 outsideCorner = max(q, 0.0);
  vec2 edgeNormal;
  if (length(outsideCorner) > 0.001) {
    edgeNormal = sign(centered) * normalize(outsideCorner);
  } else if (q.x > q.y) {
    edgeNormal = vec2(sign(centered.x), 0.0);
  } else {
    edgeNormal = vec2(0.0, sign(centered.y));
  }
  displacementPx += edgeNormal * (u_bevel * 0.10 * rimFactor);

  float pointerGlow = 0.0;
  if (u_pointer.x >= 0.0) {
    vec2 pointerDelta = (localPx - u_pointer) / max(sizeCss, vec2(1.0));
    vec2 glowCoord = pointerDelta * vec2(1.1, 1.8);
    pointerGlow = exp(-dot(glowCoord, glowCoord) * 18.0);
  }

  vec2 sampleUv = baseUv + displacementPx / u_viewport;
  vec4 refracted;
  if (u_chromatic > 0.5) {
    float ca = (0.35 + rimFactor * 0.55) / u_viewport.x;
    float red = texture2D(u_backdrop, sampleUv + vec2(ca, 0.0)).r;
    float green = texture2D(u_backdrop, sampleUv).g;
    float blue = texture2D(u_backdrop, sampleUv - vec2(ca, 0.0)).b;
    refracted = vec4(red, green, blue, 1.0);
  } else {
    refracted = texture2D(u_backdrop, sampleUv);
  }

  float insideDistance = max(0.0, -distanceToEdge);
  float rimLight = 1.0 - smoothstep(0.0, max(2.0, u_bevel * 0.22), insideDistance);
  float upperSweep = exp(-pow((localPx.y / max(sizeCss.y, 1.0)) * 3.2, 2.0))
                   * exp(-pow((localPx.x / max(sizeCss.x, 1.0) - 0.22) * 2.4, 2.0));
  float lowerReflection = exp(-pow((localPx.y / max(sizeCss.y, 1.0) - 0.96) * 18.0, 2.0));

  vec3 color = mix(refracted.rgb, u_tint.rgb, u_tint.a);
  color += vec3(1.0) * rimLight * 0.22;
  color += vec3(1.0) * upperSweep * 0.12;
  color += vec3(0.78, 0.88, 1.0) * lowerReflection * 0.045;
  color += vec3(1.0) * pointerGlow * 0.09;
  gl_FragColor = vec4(color, 1.0);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('LiquidGlass shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LiquidGlass program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, 'u_backdrop'), 0);

    const getUniform = (name: string) => gl.getUniformLocation(program, name);
    const tint = tintColor.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255, 0.07];
    const tintRgba = tint.length >= 4
      ? [tint[0] > 1 ? tint[0] / 255 : tint[0], tint[1] > 1 ? tint[1] / 255 : tint[1], tint[2] > 1 ? tint[2] / 255 : tint[2], tint[3]]
      : [1, 1, 1, 0.07];

    let captureTimer: number | undefined;
    let capturing = false;
    let disposed = false;
    let pointer = { x: -1, y: -1 };

    const draw = async () => {
      if (capturing || disposed || !root.isConnected) return;
      capturing = true;
      try {
        const backdrop = document.querySelector<HTMLElement>('[data-liquid-glass-backdrop="true"]');
        if (!backdrop) throw new Error('Missing dedicated liquid glass backdrop');

        // The source is fixed to the viewport; capture and sample in the same coordinate space.
        const viewportWidth = Math.max(1, window.innerWidth);
        const viewportHeight = Math.max(1, window.innerHeight);
        const snapshot = await toCanvas(backdrop, {
          width: viewportWidth,
          height: viewportHeight,
          pixelRatio: 1,
          backgroundColor: '#09090b',
          cacheBust: true,
        });
        if (disposed) return;

        const rect = root.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = \`\${rect.width}px\`;
        canvas.style.height = \`\${rect.height}px\`;
        gl.viewport(0, 0, width, height);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot);

        gl.uniform2f(getUniform('u_resolution'), width, height);
        gl.uniform2f(getUniform('u_viewport'), viewportWidth, viewportHeight);
        gl.uniform1f(getUniform('u_pixelRatio'), dpr);
        gl.uniform1f(getUniform('u_radius'), Math.min(borderRadius, rect.width / 2, rect.height / 2));
        gl.uniform1f(getUniform('u_bevel'), Math.max(1, bevelWidth));
        gl.uniform1f(getUniform('u_strength'), refractionStrength);
        gl.uniform1f(getUniform('u_chromatic'), chromaticAberration ? 1 : 0);
        gl.uniform4f(getUniform('u_tint'), tintRgba[0], tintRgba[1], tintRgba[2], tintRgba[3]);
        gl.uniform2f(getUniform('u_pointer'), pointer.x, pointer.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        setWebglReady(true);
      } catch (error) {
        console.error('LiquidGlass backdrop capture failed:', error);
        setWebglReady(false);
      } finally {
        capturing = false;
      }
    };

    const scheduleCapture = () => {
      if (captureTimer) window.clearTimeout(captureTimer);
      captureTimer = window.setTimeout(draw, 120);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      scheduleCapture();
    };
    const onPointerLeave = () => {
      pointer = { x: -1, y: -1 };
      scheduleCapture();
    };

    const observer = new ResizeObserver(scheduleCapture);
    observer.observe(root);
    window.addEventListener('scroll', scheduleCapture, { passive: true });
    window.addEventListener('resize', scheduleCapture, { passive: true });
    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave, { passive: true });
    scheduleCapture();

    return () => {
      disposed = true;
      if (captureTimer) window.clearTimeout(captureTimer);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleCapture);
      window.removeEventListener('resize', scheduleCapture);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [borderRadius, bevelWidth, refractionStrength, chromaticAberration, tintColor]);

  return (
    <div
      ref={rootRef}
      data-liquid-glass={uid}
      className={\`relative isolate overflow-hidden \${className}\`}
      style={{ borderRadius, background: tintColor, ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{ borderRadius, opacity: webglReady ? 1 : 0, transition: 'opacity 180ms ease' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          borderRadius,
          background: 'radial-gradient(ellipse 82% 30% at 18% 0%, rgba(255,255,255,.26), transparent 72%), linear-gradient(145deg, rgba(255,255,255,.20), transparent 27%, transparent 66%, rgba(255,255,255,.11))',
          border: '1px solid rgba(255,255,255,.42)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,.65), inset 0 -3px 9px rgba(0,0,0,.20), 0 18px 38px -10px rgba(0,0,0,.28)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
