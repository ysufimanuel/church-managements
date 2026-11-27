'use client';

import { useState } from 'react';
import { LiquidGlass } from '@/components/liquid-glass/LiquidGlass';

export default function LiquidGlassLabPage() {
  const [refraction, setRefraction] = useState(38);
  const [bevel, setBevel] = useState(30);
  return <main className="relative min-h-screen overflow-hidden bg-[#10131c] px-5 py-12 text-white sm:px-8">
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 18% 20%, rgba(234,88,12,.45), transparent 35%), radial-gradient(circle at 82% 70%, rgba(59,130,246,.38), transparent 38%), repeating-linear-gradient(135deg,rgba(255,255,255,.045) 0 1px,transparent 1px 32px)' }} />
    <div className="relative mx-auto max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[.22em] text-orange-300">GetChurchly · UI Lab</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">A clearer way to care for your church.</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">Liquid Glass component sandbox. Tune the edge and refraction before applying the treatment to the production dashboard.</p>
      <LiquidGlass className="mt-10 max-w-3xl p-6 sm:p-10" borderRadius={30} bevelWidth={bevel} refractionStrength={refraction} chromaticAberration>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm text-orange-200">Church overview</p><h2 className="mt-1 text-2xl font-semibold">Welcome back</h2><p className="mt-2 text-sm text-white/70">Your community, thoughtfully connected.</p></div>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">Sunday · 09:00</span>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {['Members','Attendance','Giving'].map((label, i) => <div key={label} className="rounded-2xl border border-white/15 bg-white/[.07] p-4"><p className="text-sm text-white/65">{label}</p><p className="mt-3 text-2xl font-semibold">{['1,248','386','Rp 8.4jt'][i]}</p><p className="mt-1 text-xs text-emerald-200">+{['8.2%','4.1%','12.6%'][i]} this month</p></div>)}
        </div>
      </LiquidGlass>
      <section className="mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/[.04] p-6">
        <h2 className="text-lg font-semibold">Optical controls</h2>
        <label className="mt-5 block text-sm text-white/75">Refraction strength <span className="float-right tabular-nums">{refraction}</span><input aria-label="Refraction strength" className="mt-3 w-full accent-orange-400" type="range" min="0" max="90" value={refraction} onChange={e => setRefraction(Number(e.target.value))} /></label>
        <label className="mt-5 block text-sm text-white/75">Bevel width <span className="float-right tabular-nums">{bevel}px</span><input aria-label="Bevel width" className="mt-3 w-full accent-orange-400" type="range" min="8" max="64" value={bevel} onChange={e => setBevel(Number(e.target.value))} /></label>
      </section>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">{Array.from({length:4},(_,i)=><div key={i} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><p className="text-xs font-semibold uppercase tracking-widest text-orange-200">Background layer 0{i+1}</p><p className="mt-3 text-sm leading-6 text-white/65">Scroll content beneath the glass to inspect the edge treatment and contrast.</p></div>)}</div>
    </div>
  </main>;
}
