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

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform sampler2D u_backdrop;
uniform vec2 u_resolution;
uniform vec2 u_documentSize;
uniform float u_pixelRatio;
uniform vec4 u_rect;
uniform float u_radius;
uniform float u_bevel;
uniform float u_strength;
uniform float u_chromatic;
uniform vec4 u_tint;
varying vec2 v_uv;

float roundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

void main() {
  vec2 localPx = gl_FragCoord.xy;
  vec2 cssTop = vec2(localPx.x, u_resolution.y - localPx.y) / u_pixelRatio;
  vec2 docPx = u_rect.xy + cssTop;
  vec2 baseUv = vec2(docPx.x / u_documentSize.x, 1.0 - docPx.y / u_documentSize.y);

  vec2 p = (v_uv - 0.5) * 2.0;
  vec2 halfSize = vec2(0.5);
  float dist = roundedBox(p * 0.5, halfSize * 0.5, min(u_radius / min(u_resolution.x, u_resolution.y), 0.24));
  float edge = 1.0 - smoothstep(-u_bevel, 0.0, dist);

  // A shallow convex lens bends the whole surface; the bevel adds stronger edge curvature.
  vec2 radialNormal = normalize(p + vec2(0.0001));
  vec2 bevelNormal = normalize(vec2(
    sign(p.x) * max(abs(p.x) - (1.0 - 2.0 * u_radius / u_resolution.x), 0.0),
    sign(p.y) * max(abs(p.y) - (1.0 - 2.0 * u_radius / u_resolution.y), 0.0)
  ) + radialNormal * 0.0001);
  vec2 normal = mix(radialNormal * 0.28, bevelNormal, edge * 0.82);
  float lens = 0.28 + edge * 0.95;
  vec2 offset = normal * (u_strength * lens) / u_documentSize;

  vec4 refracted;
  if (u_chromatic > 0.5) {
    float ca = 0.65 / u_documentSize.x;
    vec4 red = texture2D(u_backdrop, baseUv + offset + vec2(ca, 0.0));
    vec4 green = texture2D(u_backdrop, baseUv + offset);
    vec4 blue = texture2D(u_backdrop, baseUv + offset - vec2(ca, 0.0));
    refracted = vec4(red.r, green.g, blue.b, 1.0);
  } else {
    refracted = texture2D(u_backdrop, baseUv + offset);
  }

  float rim = smoothstep(-u_bevel * 0.22, 0.0, dist);
  vec3 color = mix(refracted.rgb, u_tint.rgb, u_tint.a);
  color += vec3(0.10, 0.13, 0.18) * edge * 0.10;
  color += vec3(1.0) * rim * 0.035;
  gl_FragColor = vec4(color, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
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

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const tint = tintColor.match(/[\d.]+/g)?.map(Number) ?? [255,255,255,0.07];
    const tintRgba = tint.length >= 4
      ? [tint[0] > 1 ? tint[0] / 255 : tint[0], tint[1] > 1 ? tint[1] / 255 : tint[1], tint[2] > 1 ? tint[2] / 255 : tint[2], tint[3]]
      : [1,1,1,0.07];

    let captureTimer: number | undefined;
    let capturing = false;
    let disposed = false;

    const draw = async () => {
      if (capturing || disposed || !root.isConnected) return;
      capturing = true;
      try {
        const body = document.body;
        const docWidth = Math.max(body.scrollWidth, document.documentElement.clientWidth);
        const docHeight = Math.max(body.scrollHeight, document.documentElement.clientHeight);
        const snapshot = await toCanvas(body, {
          width: docWidth,
          height: docHeight,
          pixelRatio: 1,
          backgroundColor: '#111111',
          cacheBust: true,
          filter: (node) => !(node instanceof HTMLElement && node.hasAttribute('data-liquid-glass')),
        });
        if (disposed) return;

        const rect = root.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        gl.viewport(0, 0, width, height);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot);

        gl.uniform2f(uniform('u_resolution'), width, height);
        gl.uniform2f(uniform('u_documentSize'), docWidth, docHeight);
        gl.uniform1f(uniform('u_pixelRatio'), dpr);
        gl.uniform4f(uniform('u_rect'), rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
        gl.uniform1f(uniform('u_radius'), Math.min(borderRadius, rect.width / 2, rect.height / 2));
        gl.uniform1f(uniform('u_bevel'), Math.max(1, bevelWidth) / Math.max(1, Math.min(width, height)));
        gl.uniform1f(uniform('u_strength'), refractionStrength);
        gl.uniform1f(uniform('u_chromatic'), chromaticAberration ? 1 : 0);
        gl.uniform4f(uniform('u_tint'), tintRgba[0], tintRgba[1], tintRgba[2], tintRgba[3]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        setWebglReady(true);
      } catch {
        setWebglReady(false);
      } finally {
        capturing = false;
      }
    };

    const scheduleCapture = () => {
      if (captureTimer) window.clearTimeout(captureTimer);
      captureTimer = window.setTimeout(draw, 180);
    };

    const observer = new ResizeObserver(scheduleCapture);
    observer.observe(root);
    window.addEventListener('scroll', scheduleCapture, { passive: true });
    window.addEventListener('resize', scheduleCapture, { passive: true });
    scheduleCapture();

    return () => {
      disposed = true;
      if (captureTimer) window.clearTimeout(captureTimer);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleCapture);
      window.removeEventListener('resize', scheduleCapture);
      if (texture) gl.deleteTexture(texture);
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
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius, background: tintColor, ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{
          borderRadius,
          opacity: webglReady ? 1 : 0,
          transition: 'opacity 180ms ease',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          borderRadius,
          background: 'linear-gradient(145deg, rgba(255,255,255,.16), transparent 28%, transparent 72%, rgba(255,255,255,.055))',
          border: '1px solid rgba(255,255,255,.28)',
          boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,.42), inset 0 -2px 5px rgba(0,0,0,.18), 0 18px 38px -10px rgba(0,0,0,.3)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
