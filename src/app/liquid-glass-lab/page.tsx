'use client';

import { useState } from 'react';
import { LiquidGlass } from '@/components/liquid-glass/LiquidGlass';
import { LiquidGlassButton } from '@/components/liquid-glass/LiquidGlassButton';
import { LiquidGlassDock } from '@/components/liquid-glass/LiquidGlassDock';
import { LiquidGlassHeroCard } from '@/components/liquid-glass/LiquidGlassHeroCard';
import { LiquidGlassBackdrop } from '@/components/liquid-glass/LiquidGlassBackdrop';

export default function LiquidGlassLabPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refraction, setRefraction] = useState(50);
  const [bevel, setBevel] = useState(36);
  return <div className="relative min-h-[180vh] overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
    <LiquidGlassBackdrop />
    <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-40 pt-24">
      <LiquidGlassHeroCard badge="Experimental Optical UI" title="Real 3D Refraction Glass" description="Scroll the page or move your pointer over the button to inspect the glass edge, refraction, and cursor-following highlight." actions={<>
        <LiquidGlassButton tintColor="rgba(234,67,25,.55)" glintColor="rgba(255,220,180,.65)" onClick={() => document.getElementById('components')?.scrollIntoView({behavior:'smooth'})}>Explore components</LiquidGlassButton>
        <LiquidGlassButton onClick={() => document.getElementById('controls')?.scrollIntoView({behavior:'smooth'})}>Tune the glass</LiquidGlassButton>
      </>} />
      <section id="components" className="mt-16 w-full max-w-4xl">
        <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-300">Component preview</p><h2 className="mt-2 text-2xl font-semibold">A surface with depth</h2></div>
        <LiquidGlass className="p-6 sm:p-8" borderRadius={28} bevelWidth={bevel} refractionStrength={refraction} chromaticAberration>
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-orange-200">Church overview</p><h3 className="mt-1 text-2xl font-semibold">Welcome back</h3><p className="mt-2 text-sm text-white/70">Your community, thoughtfully connected.</p></div><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">Sunday · 09:00</span></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">{['Members','Attendance','Giving'].map((label,i)=><div key={label} className="rounded-2xl border border-white/15 bg-white/[.07] p-4"><p className="text-sm text-white/65">{label}</p><p className="mt-3 text-2xl font-semibold">{['1,248','386','Rp 8.4jt'][i]}</p><p className="mt-1 text-xs text-emerald-200">+{['8.2%','4.1%','12.6%'][i]} this month</p></div>)}</div>
        </LiquidGlass>
      </section>
      <section id="controls" className="mt-8 w-full max-w-4xl">
        <LiquidGlass className="p-6 sm:p-8" borderRadius={28} bevelWidth={bevel} refractionStrength={refraction} chromaticAberration>
          <h2 className="text-lg font-semibold">Live optical controls</h2><p className="mt-1 text-sm text-white/75">Adjust the edge profile and refraction to compare the effect.</p>
          <label className="mt-6 block text-sm text-white/80"><span className="flex justify-between"><span>Refraction strength</span><span className="tabular-nums">{refraction}</span></span><input aria-label="Refraction strength" type="range" min="0" max="90" value={refraction} onChange={e=>setRefraction(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
          <label className="mt-5 block text-sm text-white/80"><span className="flex justify-between"><span>Bevel width</span><span className="tabular-nums">{bevel}px</span></span><input aria-label="Bevel width" type="range" min="8" max="64" value={bevel} onChange={e=>setBevel(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
        </LiquidGlass>
      </section>
      <section className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">{Array.from({length:6},(_,i)=><div key={i} className="rounded-2xl border border-white/15 bg-white/5 p-6 font-mono text-sm text-white/70"><div className="text-xs font-bold uppercase tracking-wider text-orange-400">Background layer #{i+1}</div><p className="mt-2">Scroll this reference content beneath the floating dock to inspect contrast and edge distortion.</p></div>)}</section>
    </main>
    <LiquidGlassDock activeId={activeTab} onSelect={setActiveTab} items={[{id:'overview',label:'Overview'},{id:'components',label:'Components'},{id:'controls',label:'Controls'},{id:'lab',label:'Lab'}]} />
  </div>;
}
