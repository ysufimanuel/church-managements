import { FRAG, VERT } from './shader';
import type { GlassParams, GlassRect } from '@/lib/liquid-glass/types';

const MAX_GLASS = 16;

class GlassRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private backdropCanvas: HTMLCanvasElement | null = null;
  private rects = new Map<string, GlassRect>();
  private observers = new Map<string, ResizeObserver>();
  private raf = 0;
  private started = false;
  private mouse = { x: 0.5, y: 0.5 };
  private time = 0;
  private fallback = false;
  private galleryTimer: number | null = null;

  init(canvas: HTMLCanvasElement, backdrop?: string) {
    if (this.canvas === canvas && this.gl) {
      this.setBackdrop(backdrop);
      this.invalidate();
      return;
    }
    this.dispose();
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) {
      this.fallback = true;
      document.documentElement.classList.add('no-webgl');
      return;
    }
    this.gl = gl;
    this.setupProgram();
    this.createTexture();
    this.setBackdrop(backdrop);
    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true, capture: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.started = true;
    this.rects.forEach((rect, id) => this.observeRect(id, rect.element));
    this.invalidate();
  }

  private compile(type: number, source: string) {
    const gl = this.gl!;
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Unable to create WebGL shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  private setupProgram() {
    const gl = this.gl!;
    const vertex = this.compile(gl.VERTEX_SHADER, VERT);
    const fragment = this.compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program) throw new Error('Unable to create WebGL program');
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WebGL link failed');
    this.program = program;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  private createTexture() {
    const gl = this.gl!;
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(this.program!, 'uTex'), 0);
  }

  private makeFallbackBackdrop() {
    const source = document.createElement('canvas');
    source.width = 1600;
    source.height = 1000;
    const ctx = source.getContext('2d');
    if (!ctx) return source;
    const gradient = ctx.createLinearGradient(0, 0, 1600, 1000);
    gradient.addColorStop(0, '#111827');
    gradient.addColorStop(0.48, '#25212b');
    gradient.addColorStop(1, '#09090b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1600, 1000);
    const glow = ctx.createRadialGradient(300, 220, 0, 300, 220, 620);
    glow.addColorStop(0, 'rgba(249, 115, 22, .72)');
    glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1600, 1000);
    const blue = ctx.createRadialGradient(1300, 720, 0, 1300, 720, 620);
    blue.addColorStop(0, 'rgba(59, 130, 246, .72)');
    blue.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = blue;
    ctx.fillRect(0, 0, 1600, 1000);
    return source;
  }

  setBackdropGallery(urls: string[]) {
    this.clearBackdropGallery();
    if (!urls.length) return;
    let index = 0;
    this.setBackdrop(urls[index]);
    this.galleryTimer = window.setInterval(() => {
      index = (index + 1) % urls.length;
      this.setBackdrop(urls[index]);
    }, 2000);
  }

  clearBackdropGallery() {
    if (this.galleryTimer !== null) window.clearInterval(this.galleryTimer);
    this.galleryTimer = null;
  }

  setBackdrop(url?: string) {
    if (!this.gl || !this.texture) return;
    const upload = (source: TexImageSource) => {
      const gl = this.gl!;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      this.backdropCanvas = source instanceof HTMLCanvasElement ? source : null;
      this.invalidate();
    };
    if (!url) {
      upload(this.makeFallbackBackdrop());
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => upload(image);
    image.onerror = () => {
      console.warn('Liquid Glass backdrop failed to load; using generated fallback texture.');
      upload(this.makeFallbackBackdrop());
    };
    image.src = url;
  }

  register(id: string, element: HTMLElement, params: GlassParams) {
    this.rects.set(id, { id, element, x: 0, y: 0, w: 0, h: 0, radius: params.radius, params });
    this.observeRect(id, element);
    this.syncRect(id);
  }

  update(id: string, params: GlassParams) {
    const rect = this.rects.get(id);
    if (!rect) return;
    rect.params = params;
    rect.radius = params.radius;
    this.syncRect(id);
  }

  unregister(id: string) {
    this.observers.get(id)?.disconnect();
    this.observers.delete(id);
    this.rects.delete(id);
    this.invalidate();
  }

  private observeRect(id: string, element: HTMLElement) {
    this.observers.get(id)?.disconnect();
    const observer = new ResizeObserver(() => this.syncRect(id));
    observer.observe(element);
    this.observers.set(id, observer);
  }

  private syncRect(id: string) {
    const rect = this.rects.get(id);
    if (!rect || !rect.element.isConnected) return;
    const box = rect.element.getBoundingClientRect();
    rect.x = box.left;
    rect.y = box.top;
    rect.w = box.width;
    rect.h = box.height;
    this.invalidate();
  }

  private syncAll() {
    this.rects.forEach((rect, id) => this.syncRect(id));
  }

  private resize = () => {
    if (!this.canvas || !this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(window.innerWidth * dpr));
    const height = Math.max(1, Math.round(window.innerHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
    this.syncAll();
  };

  private onResize = () => this.resize();
  private onScroll = () => this.syncAll();
  private onPointerMove = (event: PointerEvent) => {
    this.mouse = { x: event.clientX / window.innerWidth, y: 1 - event.clientY / window.innerHeight };
    this.syncAll();
  };

  private invalidate() {
    if (!this.gl || !this.program || this.raf) return;
    this.raf = requestAnimationFrame((timestamp) => {
      this.raf = 0;
      this.render(timestamp * 0.001);
    });
  }

  private render(time: number) {
    const gl = this.gl;
    const program = this.program;
    const canvas = this.canvas;
    if (!gl || !program || !canvas || !this.texture) return;
    this.time = time;
    const visible = Array.from(this.rects.values()).filter((r) => r.w > 0 && r.h > 0 && r.x < window.innerWidth && r.y < window.innerHeight && r.x + r.w > 0 && r.y + r.h > 0).slice(0, MAX_GLASS);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rects = new Float32Array(MAX_GLASS * 4);
    const radius = new Float32Array(MAX_GLASS);
    const bend = new Float32Array(MAX_GLASS);
    const ca = new Float32Array(MAX_GLASS);
    const hi = new Float32Array(MAX_GLASS);
    const tint = new Float32Array(MAX_GLASS);
    visible.forEach((r, i) => {
      rects.set([r.x * dpr, r.y * dpr, r.w * dpr, r.h * dpr], i * 4);
      radius[i] = r.radius * dpr;
      bend[i] = r.params.bend;
      ca[i] = r.params.chromatic;
      hi[i] = r.params.highlight;
      tint[i] = r.params.tint;
    });

    gl.useProgram(program);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1i(uniform('uTex'), 0);
    gl.uniform2f(uniform('uRes'), canvas.width, canvas.height);
    gl.uniform1f(uniform('uTime'), time);
    gl.uniform2f(uniform('uMouse'), this.mouse.x, this.mouse.y);
    gl.uniform4fv(uniform('uRects[0]'), rects);
    gl.uniform1fv(uniform('uRadius[0]'), radius);
    gl.uniform1fv(uniform('uBend[0]'), bend);
    gl.uniform1fv(uniform('uCA[0]'), ca);
    gl.uniform1fv(uniform('uHi[0]'), hi);
    gl.uniform1fv(uniform('uTint[0]'), tint);
    gl.uniform1i(uniform('uCount'), visible.length);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    this.clearBackdropGallery();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.started) {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('scroll', this.onScroll, true);
      window.removeEventListener('pointermove', this.onPointerMove);
    }
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.gl?.deleteTexture(this.texture);
    this.gl?.deleteProgram(this.program);
    this.texture = null;
    this.program = null;
    this.gl = null;
    this.canvas = null;
    this.started = false;
  }
}

export const glassRenderer = new GlassRenderer();
