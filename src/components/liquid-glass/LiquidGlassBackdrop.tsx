'use client';

import { useEffect, useRef } from 'react';

export function LiquidGlassBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#09090b'); bg.addColorStop(.52, '#171717'); bg.addColorStop(1, '#09090b');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const glow1 = ctx.createRadialGradient(w*.18,h*.22,0,w*.18,h*.22,w*.58);
      glow1.addColorStop(0,'rgba(249,88,22,.98)'); glow1.addColorStop(.3,'rgba(180,55,18,.42)'); glow1.addColorStop(1,'transparent');
      ctx.fillStyle=glow1; ctx.fillRect(0,0,w,h);
      const glow2 = ctx.createRadialGradient(w*.82,h*.68,0,w*.82,h*.68,w*.62);
      glow2.addColorStop(0,'rgba(37,99,235,.95)'); glow2.addColorStop(.34,'rgba(30,64,175,.38)'); glow2.addColorStop(1,'transparent');
      ctx.fillStyle=glow2; ctx.fillRect(0,0,w,h);
      const glow3=ctx.createRadialGradient(w*.52,h*.48,0,w*.52,h*.48,w*.48);
      glow3.addColorStop(0,'rgba(255,255,255,.12)'); glow3.addColorStop(1,'transparent');
      ctx.fillStyle=glow3; ctx.fillRect(0,0,w,h);
      ctx.save(); ctx.translate(w*.08,h*.14);
      const orb=ctx.createLinearGradient(0,0,260,260);
      orb.addColorStop(0,'rgba(255,210,170,.7)'); orb.addColorStop(.55,'rgba(244,63,94,.3)'); orb.addColorStop(1,'transparent');
      ctx.fillStyle=orb; ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(128,128,128,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(w*.91,h*.38);
      const orb2=ctx.createLinearGradient(-150,-150,150,150);
      orb2.addColorStop(0,'rgba(165,243,252,.55)'); orb2.addColorStop(.6,'rgba(59,130,246,.35)'); orb2.addColorStop(1,'transparent');
      ctx.fillStyle=orb2; ctx.strokeStyle='rgba(224,242,254,.3)';
      ctx.beginPath(); ctx.arc(0,0,160,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(w*.38,h*.92); ctx.rotate(-.21);
      const streak=ctx.createLinearGradient(-w*.2,0,w*.2,0);
      streak.addColorStop(0,'transparent'); streak.addColorStop(.5,'rgba(255,255,255,.15)'); streak.addColorStop(1,'transparent');
      ctx.fillStyle=streak; ctx.strokeStyle='rgba(255,255,255,.2)';
      ctx.beginPath(); ctx.ellipse(0,0,w*.21,28,0,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
    };
    paint();
    const observer = new ResizeObserver(paint); observer.observe(document.documentElement);
    window.addEventListener('resize', paint, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('resize', paint); };
  }, []);
  return <canvas ref={ref} data-liquid-glass-backdrop="true" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
