'use client';

import React, { useEffect, useId, useRef } from 'react';

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
uniform vec2 u_viewport;
uniform vec2 u_rectOrigin;
uniform float u_pixelRatio;
uniform float u_radius;
uniform float u_bevel;
uniform float u_strength;
uniform float u_chromatic;
uniform vec4 u_tint;
uniform vec2 u_pointer;
varying vec2 v_uv;

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  vec2 sizeCss = u_resolution / u_pixelRatio;
  vec2 localPx = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_pixelRatio;
  vec2 centered = localPx - sizeCss * 0.5;
  vec2 halfSize = sizeCss * 0.5;
  float radius = min(u_radius, min(halfSize.x, halfSize.y));
  float d = sdRoundRect(centered, halfSize, radius);
  if (d > 0.0) discard;

  // Gradient of the rounded-rectangle SDF gives a stable surface normal.
  float eps = 1.0;
  vec2 grad = vec2(
    sdRoundRect(centered + vec2(eps, 0.0), halfSize, radius) - sdRoundRect(centered - vec2(eps, 0.0), halfSize, radius),
    sdRoundRect(centered + vec2(0.0, eps), halfSize, radius) - sdRoundRect(centered - vec2(0.0, eps), halfSize, radius)
  ) / (2.0 * eps);
  float edge = smoothstep(-u_bevel, 0.0, d);
  float bevelProfile = sin(edge * 1.5707963);
  vec3 normal = normalize(vec3(-grad * bevelProfile * 1.25, 1.0));
  vec3 incident = vec3(0.0, 0.0, -1.0);
  vec3 refractedRay = refract(incident, normal, 0.76);
  vec2 displacement = refractedRay.xy * u_strength * (0.25 + edge * 0.95);

  vec2 screenPx = localPx + u_rectOrigin;
  vec2 baseUv = vec2(screenPx.x / u_viewport.x, 1.0 - screenPx.y / u_viewport.y);
  vec2 sampleUv = baseUv + vec2(displacement.x, -displacement.y) / u_viewport;
  vec4 refracted;
  if (u_chromatic > 0.5) {
    float ca = (0.25 + edge * 0.8) / u_viewport.x;
    refracted = vec4(
      texture2D(u_backdrop, sampleUv + vec2(ca, 0.0)).r,
      texture2D(u_backdrop, sampleUv).g,
      texture2D(u_backdrop, sampleUv - vec2(ca, 0.0)).b,
      1.0
    );
  } else {
    refracted = texture2D(u_backdrop, sampleUv);
  }

  float rim = 1.0 - smoothstep(0.0, max(1.5, u_bevel * 0.16), -d);
  float facing = max(dot(normal, normalize(vec3(-0.35, 0.55, 1.0))), 0.0);
  float specular = pow(facing, 20.0) * edge;
  float pointerGlow = 0.0;
  if (u_pointer.x >= 0.0) {
    vec2 pd = (localPx - u_pointer) / max(sizeCss, vec2(1.0));
    pointerGlow = exp(-dot(pd * vec2(1.1, 1.8), pd * vec2(1.1, 1.8)) * 18.0);
  }
  vec3 color = mix(refracted.rgb, u_tint.rgb, u_tint.a);
  color += vec3(1.0) * rim * 0.12;
  color += vec3(1.0) * specular * 0.24;
  color += vec3(1.0) * pointerGlow * 0.08;
  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
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
  children, className = '', bevelWidth = 28, refractionStrength = 36,
  borderRadius = 24, tintColor = 'rgba(255,255,255,.07)',
  chromaticAberration = false, style, ...props
}: Props) {
  const uid = useId().replace(/:/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const backdrop = document.querySelector<HTMLCanvasElement>('[data-liquid-glass-backdrop="true"]');
    if (!root || !canvas || !backdrop) {
      console.error('LiquidGlass requires a dedicated canvas backdrop.');
      return;
    }
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LiquidGlass program link failed:', gl.getProgramInfoLog(program)); return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1i(u('u_backdrop'), 0);
    const rgba = tintColor.match(/[\\d.]+/g)?.map(Number) ?? [255,255,255,.07];
    const tint = rgba.length >= 4 ? [rgba[0] > 1 ? rgba[0]/255 : rgba[0], rgba[1] > 1 ? rgba[1]/255 : rgba[1], rgba[2] > 1 ? rgba[2]/255 : rgba[2], rgba[3]] : [1,1,1,.07];
    let pointer = { x: -1, y: -1 };
    let raf = 0;
    let disposed = false;
    const draw = () => {
      raf = 0;
      if (disposed || !root.isConnected) return;
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backdrop);
      gl.uniform2f(u('u_resolution'), w, h);
      gl.uniform2f(u('u_viewport'), window.innerWidth, window.innerHeight);
      gl.uniform2f(u('u_rectOrigin'), rect.left, rect.top);
      gl.uniform1f(u('u_pixelRatio'), dpr);
      gl.uniform1f(u('u_radius'), borderRadius);
      gl.uniform1f(u('u_bevel'), bevelWidth);
      gl.uniform1f(u('u_strength'), refractionStrength);
      gl.uniform1f(u('u_chromatic'), chromaticAberration ? 1 : 0);
      gl.uniform4f(u('u_tint'), tint[0], tint[1], tint[2], tint[3]);
      gl.uniform2f(u('u_pointer'), pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      schedule();
    };
    const onPointerLeave = () => { pointer = { x: -1, y: -1 }; schedule(); };
    const resize = new ResizeObserver(schedule); resize.observe(root); resize.observe(backdrop);
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule, { passive: true });
    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave, { passive: true });
    schedule();
    return () => {
      disposed = true; if (raf) cancelAnimationFrame(raf); resize.disconnect();
      window.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule);
      root.removeEventListener('pointermove', onPointerMove); root.removeEventListener('pointerleave', onPointerLeave);
      gl.deleteTexture(texture); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buffer);
    };
  }, [borderRadius, bevelWidth, refractionStrength, chromaticAberration, tintColor]);

  return <div ref={rootRef} data-liquid-glass={uid} className={`relative isolate overflow-hidden ${className}`} style={{ borderRadius, background: tintColor, ...style }} {...props}>
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full" style={{ borderRadius }} />
    {/* Independent optical reflection layer: rim, specular sweep and lower bounce. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" style={{
      borderRadius,
      background: 'radial-gradient(ellipse 72% 22% at 18% 0%, rgba(255,255,255,.34), transparent 76%), radial-gradient(ellipse 58% 16% at 82% 100%, rgba(180,220,255,.16), transparent 78%), linear-gradient(155deg, rgba(255,255,255,.20), transparent 24%, transparent 72%, rgba(255,255,255,.08))',
      border: '1px solid rgba(255,255,255,.46)',
      boxShadow: 'inset 0 1.5px 3px rgba(255,255,255,.72), inset 0 -2px 7px rgba(0,0,0,.24), inset 1px 0 3px rgba(255,255,255,.24), inset -1px 0 3px rgba(255,255,255,.18), 0 18px 38px -10px rgba(0,0,0,.28)',
    }} />
    <div className="relative z-10">{children}</div>
  </div>;
}
