'use client';

import { useEffect, useState } from 'react';
import { LiquidGlass } from '@/components/liquid-glass/LiquidGlass';
import { LiquidGlassButton } from '@/components/liquid-glass/LiquidGlassButton';
import { LiquidGlassDock } from '@/components/liquid-glass/LiquidGlassDock';
import { LiquidGlassHeroCard } from '@/components/liquid-glass/LiquidGlassHeroCard';
import { glassRenderer } from '@/components/liquid-glass/renderer';

const BACKDROPS = [
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1600&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&q=80',
  'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&q=80',
];

const PRESETS = [
  { name: 'Clear', bend: 0.045, chromatic: 0.004, highlight: 0.7, tint: 0.08 },
  { name: 'Liquid', bend: 0.08, chromatic: 0.008, highlight: 1.1, tint: 0.12 },
  { name: 'Frosted', bend: 0.02, chromatic: 0.002, highlight: 0.5, tint: 0.3 },
  { name: 'Prism', bend: 0.12, chromatic: 0.014, highlight: 1.4, tint: 0.05 },
];

export default function LiquidGlassLabPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bend, setBend] = useState(0.06);
  const [chromatic, setChromatic] = useState(0.006);
  const [highlight, setHighlight] = useState(0.9);
  const [tint, setTint] = useState(0.12);
  const [presetIndex, setPresetIndex] = useState(0);

  useEffect(() => {
    glassRenderer.setBackdropGallery(BACKDROPS);
    return () => {
      glassRenderer.clearBackdropGallery();
      glassRenderer.setBackdrop();
    };
  }, []);

  useEffect(() => {
    glassRenderer.setGlobalParams({ bend, chromatic, highlight, tint });
  }, [bend, chromatic, highlight, tint]);

  const applyPreset = () => {
    const next = (presetIndex + 1) % PRESETS.length;
    const preset = PRESETS[next];
    setPresetIndex(next);
    setBend(preset.bend);
    setChromatic(preset.chromatic);
    setHighlight(preset.highlight);
    setTint(preset.tint);
  };

  return <div className="relative min-h-[180vh] overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
    <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-40 pt-24">
      <LiquidGlassHeroCard badge="Experimental Optical UI" title="Reusable Liquid Glass Engine" description="One shared WebGL renderer, one backdrop texture, and multiple independent glass surfaces." actions={<>
        <LiquidGlassButton tintColor="rgba(234,67,25,.55)" glintColor="rgba(255,220,180,.65)" onClick={() => document.getElementById('components')?.scrollIntoView({behavior:'smooth'})}>Explore components</LiquidGlassButton>
        <LiquidGlassButton onClick={() => document.getElementById('controls')?.scrollIntoView({behavior:'smooth'})}>Tune the glass</LiquidGlassButton>
      </>} />
      <section id="components" className="mt-16 w-full max-w-4xl">
        <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-300">Component preview</p><h2 className="mt-2 text-2xl font-semibold">Shared renderer surfaces</h2></div>
        <LiquidGlass className="p-6 sm:p-8" radius={28} preset="prism">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-orange-200">Church overview</p><h3 className="mt-1 text-2xl font-semibold">Welcome back</h3><p className="mt-2 text-sm text-white/70">Your community, thoughtfully connected.</p></div><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">Sunday · 09:00</span></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">{['Members','Attendance','Giving'].map((label,i)=><div key={label} className="rounded-2xl border border-white/15 bg-white/[.07] p-4"><p className="text-sm text-white/65">{label}</p><p className="mt-3 text-2xl font-semibold">{['1,248','386','Rp 8.4jt'][i]}</p><p className="mt-1 text-xs text-emerald-200">+{['8.2%','4.1%','12.6%'][i]} this month</p></div>)}</div>
        </LiquidGlass>
      </section>
      <section id="controls" className="mt-8 w-full max-w-4xl">
        <LiquidGlass className="p-6 sm:p-8" radius={28} preset="liquid">
          <h2 className="text-lg font-semibold">Live optical controls</h2><p className="mt-1 text-sm text-white/75">These controls update the shared WebGL shader uniforms in real time.</p>
          <label className="mt-5 block text-sm text-white/80"><span className="flex justify-between"><span>Bend</span><span className="tabular-nums">{bend.toFixed(3)}</span></span><input aria-label="Bend" type="range" min="0" max="0.15" step="0.005" value={bend} onChange={e=>setBend(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
          <label className="mt-4 block text-sm text-white/80"><span className="flex justify-between"><span>Chromatic</span><span className="tabular-nums">{chromatic.toFixed(3)}</span></span><input aria-label="Chromatic" type="range" min="0" max="0.015" step="0.001" value={chromatic} onChange={e=>setChromatic(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
          <label className="mt-4 block text-sm text-white/80"><span className="flex justify-between"><span>Highlight</span><span className="tabular-nums">{highlight.toFixed(1)}</span></span><input aria-label="Highlight" type="range" min="0" max="2" step="0.1" value={highlight} onChange={e=>setHighlight(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
          <label className="mt-4 block text-sm text-white/80"><span className="flex justify-between"><span>Blur Tint</span><span className="tabular-nums">{tint.toFixed(2)}</span></span><input aria-label="Blur Tint" type="range" min="0" max="0.4" step="0.02" value={tint} onChange={e=>setTint(Number(e.target.value))} className="mt-2 w-full accent-orange-500" /></label>
          <button type="button" onClick={applyPreset} className="mt-5 w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-bold text-white">Next Preset: {PRESETS[presetIndex].name}</button>
        </LiquidGlass>
      </section>
      <section className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">{Array.from({length:6},(_,i)=><LiquidGlass key={i} preset="clear" radius={20} className="p-6 font-mono text-sm text-white/70"><div className="text-xs font-bold uppercase tracking-wider text-orange-400">Reusable surface #{i+1}</div><p className="mt-2">All surfaces share the same renderer and backdrop texture.</p></LiquidGlass>)}</section>
    </main>
    <LiquidGlassDock activeId={activeTab} onSelect={setActiveTab} items={[{id:'overview',label:'Overview'},{id:'components',label:'Components'},{id:'controls',label:'Controls'},{id:'lab',label:'Lab'}]} />
  </div>;
}
